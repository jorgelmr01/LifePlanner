// Copiloto AI opcional (V1 del roadmap, ADR-003): chat con la API key del propio
// usuario, directo desde el navegador. Lee un resumen de los datos locales y
// aconseja; nunca modifica datos (el usuario decide y registra).

import type Anthropic from '@anthropic-ai/sdk'
import { db } from '../db/db'
import type { ConfigAI } from '../db/types'
import { diasDesde } from './dates'
import { estadoPorArea, nivelDeXp } from './xp'
import { esperadasPorSemana } from './suggestions'
import { DIA_MS, inicioDia } from './dates'

export interface MensajeChat {
  rol: 'usuario' | 'copiloto'
  texto: string
}

export const MODELO_DEFAULT: Record<ConfigAI['proveedor'], string> = {
  anthropic: 'claude-opus-4-8',
  openai: 'gpt-4o-mini',
}

/** Resumen compacto del estado de vida del usuario para dar contexto al modelo */
export async function construirContexto(): Promise<string> {
  const [ajustes, areas, ritmos, logs, personas, inters, metas, entradas] = await Promise.all([
    db.ajustes.get('main'),
    db.areas.orderBy('orden').toArray(),
    db.ritmos.where('estado').equals('activo').toArray(),
    db.ritmoLogs.where('fecha').aboveOrEqual(inicioDia() - 6 * DIA_MS).toArray(),
    db.personas.where('estado').equals('activa').toArray(),
    db.interacciones.toArray(),
    db.metas.where('estado').equals('activa').toArray(),
    db.entries.orderBy('fecha').reverse().limit(5).toArray(),
  ])
  const visibles = areas.filter((a) => a.visible)
  const estados = await estadoPorArea(visibles.map((a) => a.id))

  const lineas: string[] = []
  lineas.push(`Usuario: ${ajustes?.nombre ?? 'Aventurero'}`)
  lineas.push('\nÁreas de vida (atributos del personaje):')
  for (const a of visibles) {
    const e = estados.get(a.id)
    lineas.push(
      `- ${a.nombre}: nivel ${e ? nivelDeXp(e.xpTotal) : 1}, atención ${e?.atencion ?? 'baja'} (${e?.xp14d ?? 0} XP en 14 días)`,
    )
  }
  lineas.push('\nRitmos (hábitos) y su semana:')
  for (const r of ritmos) {
    const hechas = logs.filter((l) => l.ritmoId === r.id).length
    lineas.push(`- ${r.nombre}: ${hechas}/${esperadasPorSemana(r)} esta semana`)
  }
  lineas.push('\nPersonas y último contacto:')
  const ultimaPor = new Map<string, number>()
  for (const i of inters) ultimaPor.set(i.personaId, Math.max(ultimaPor.get(i.personaId) ?? 0, i.fecha))
  for (const p of personas) {
    const u = ultimaPor.get(p.id)
    lineas.push(
      `- ${p.nombre} (quiere contacto cada ${p.frecuenciaDias} días): ${u ? `hace ${diasDesde(u)} días` : 'sin registro'}`,
    )
  }
  if (metas.length) {
    lineas.push('\nMetas activas:')
    for (const m of metas) {
      lineas.push(`- ${m.titulo}: ${m.progreso}%${m.proximoPaso ? `, próximo paso: ${m.proximoPaso}` : ''}${m.porque ? ` (porqué: ${m.porque})` : ''}`)
    }
  }
  const publicas = entradas.filter((e) => e.privacidad === 'normal' && e.contenido)
  if (publicas.length) {
    lineas.push('\nÚltimas entradas del journal:')
    for (const e of publicas) {
      lineas.push(`- ${e.contenido.slice(0, 160)}`)
    }
  }
  return lineas.join('\n')
}

const SYSTEM_PROMPT = `Eres el copiloto de Life Copilot, una app donde el usuario lleva su vida como un personaje de RPG: sus áreas de vida son atributos con nivel, sus hábitos son ritmos que dan XP, sus metas las define él.

Tu papel: ayudarle a re-balancearse. Detecta con sus datos dónde se está quedando atrás y propone la acción más pequeña posible para reactivar esa área. Sé cálido, directo y breve (2-4 oraciones por respuesta salvo que pida más). Nunca juzgues ni generes culpa: los niveles nunca bajan y no existe el concepto de fallo. No inventes datos que no estén en el contexto. Tú propones; el usuario decide y registra en la app. Responde en español.`

/** Envía la conversación al proveedor configurado y devuelve la respuesta.
 *  onDelta (opcional) recibe el texto incremental para streaming en la UI. */
export async function preguntarCopiloto(
  config: ConfigAI,
  historial: MensajeChat[],
  onDelta?: (texto: string) => void,
): Promise<string> {
  const contexto = await construirContexto()
  const system = `${SYSTEM_PROMPT}\n\n=== DATOS ACTUALES DEL USUARIO ===\n${contexto}`

  if (config.proveedor === 'anthropic') {
    // import dinámico: el SDK solo se descarga si el usuario activa el copiloto
    const { default: AnthropicSDK } = await import('@anthropic-ai/sdk')
    const client = new AnthropicSDK({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true, // la key es del propio usuario y vive solo en su dispositivo
    })
    const stream = client.messages.stream({
      model: config.modelo || MODELO_DEFAULT.anthropic,
      max_tokens: 4096,
      system,
      messages: historial.map((m) => ({
        role: m.rol === 'usuario' ? ('user' as const) : ('assistant' as const),
        content: m.texto,
      })),
    })
    if (onDelta) stream.on('text', onDelta)
    const final = await stream.finalMessage()
    if (final.stop_reason === 'refusal') {
      return 'No puedo ayudar con eso. ¿Hablamos de tu balance de vida?'
    }
    return final.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
  }

  // OpenAI (sin streaming; respuesta corta)
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelo || MODELO_DEFAULT.openai,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system },
        ...historial.map((m) => ({
          role: m.rol === 'usuario' ? 'user' : 'assistant',
          content: m.texto,
        })),
      ],
    }),
  })
  if (!resp.ok) {
    const cuerpo = await resp.text().catch(() => '')
    throw new Error(`OpenAI ${resp.status}: ${cuerpo.slice(0, 200)}`)
  }
  const datos = await resp.json()
  return datos.choices?.[0]?.message?.content ?? '(sin respuesta)'
}
