// Motor de sugerencias por reglas — PRODUCT_SPEC.md §6.
// Detecta dónde te estás quedando atrás y propone re-balancearte.
// Sin AI: reglas deterministas sobre datos locales.

import { db, uid } from '../db/db'
import type { Ritmo, Sugerencia, SugerenciaTipo } from '../db/types'
import { DIA_MS, claveDia, diasDesde, diasHastaCumple, inicioDia } from './dates'

const REINTENTO_DESCARTADA_MS = 7 * DIA_MS

/** Ocurrencias esperadas de un ritmo en los últimos 7 días */
export function esperadasPorSemana(r: Ritmo): number {
  if (r.frecuencia === 'diario') return 7
  if (r.frecuencia === 'semanal') return Math.max(1, r.vecesPorSemana)
  return Math.max(1, r.diasSemana.length)
}

async function existeReciente(tipo: SugerenciaTipo, refId: string): Promise<boolean> {
  const previas = await db.sugerencias.where('refId').equals(refId).toArray()
  const ahora = Date.now()
  return previas.some((s) => {
    if (s.tipo !== tipo) return false
    if (s.estado === 'pendiente') return true
    if (s.estado === 'pospuesta') return (s.posponerHasta ?? 0) > ahora
    if (s.estado === 'descartada') return ahora - s.creada < REINTENTO_DESCARTADA_MS
    // hechas: no repetir el mismo día
    return claveDia(s.creada) === claveDia(ahora)
  })
}

async function crear(tipo: SugerenciaTipo, refId: string, mensaje: string, razon: string) {
  if (await existeReciente(tipo, refId)) return
  const s: Sugerencia = {
    id: uid(),
    tipo,
    mensaje,
    razon,
    refId,
    estado: 'pendiente',
    creada: Date.now(),
  }
  await db.sugerencias.add(s)
}

/** Reactiva sugerencias pospuestas cuyo plazo venció */
async function reactivarPospuestas() {
  const ahora = Date.now()
  const pospuestas = await db.sugerencias.where('estado').equals('pospuesta').toArray()
  for (const s of pospuestas) {
    if ((s.posponerHasta ?? 0) <= ahora) {
      await db.sugerencias.update(s.id, { estado: 'pendiente' })
    }
  }
}

/** Regla 1 — Reconexión: personas con contacto vencido según su frecuencia deseada */
async function reglaReconexion() {
  const personas = await db.personas.where('estado').equals('activa').toArray()
  for (const p of personas) {
    if (p.silenciarSugerencias) continue
    const ultima = await db.interacciones.where('personaId').equals(p.id).sortBy('fecha')
    const ultimaFecha = ultima.length ? ultima[ultima.length - 1].fecha : null
    if (ultimaFecha === null) continue // sin historial aún, no regañar
    const dias = diasDesde(ultimaFecha)
    if (dias >= p.frecuenciaDias) {
      await crear(
        'reconexion',
        p.id,
        `No has platicado con ${p.nombre} en ${dias} días. Mándale un mensaje para ponerse al día.`,
        `Querías contacto cada ${p.frecuenciaDias} días.`,
      )
    }
  }
}

/** Regla 2 — Consistencia: ritmos por debajo de la mitad de lo esperado esta semana */
async function reglaConsistencia() {
  const ritmos = await db.ritmos.where('estado').equals('activo').toArray()
  const corte = inicioDia() - 6 * DIA_MS
  for (const r of ritmos) {
    if (Date.now() - r.creado < 3 * DIA_MS) continue // recién creado, dar chance
    const logs = await db.ritmoLogs.where('ritmoId').equals(r.id).toArray()
    const hechas = logs.filter((l) => l.fecha >= corte).length
    const esperadas = esperadasPorSemana(r)
    if (hechas < esperadas / 2) {
      const mensaje =
        esperadas === 1
          ? `¿Por qué no vas a ${r.nombre.toLowerCase()} esta semana?`
          : `Llevas ${hechas}/${esperadas} de "${r.nombre}" esta semana. ¿Le dedicas un momento hoy?`
      await crear('consistencia', r.id, mensaje, 'Este ritmo se está quedando atrás esta semana.')
    }
  }
}

/** Regla 3 — Balance: el área con menos actividad reciente mientras otras van bien */
async function reglaBalance() {
  const areas = (await db.areas.toArray()).filter((a) => a.visible)
  if (areas.length < 2) return
  const corte = inicioDia() - 13 * DIA_MS
  const eventos = await db.xpEvents.where('fecha').aboveOrEqual(corte).toArray()
  const porArea = new Map<string, number>(areas.map((a) => [a.id, 0]))
  for (const ev of eventos) {
    if (porArea.has(ev.areaId)) porArea.set(ev.areaId, (porArea.get(ev.areaId) ?? 0) + ev.cantidad)
  }
  const valores = [...porArea.entries()].sort((a, b) => a[1] - b[1])
  const [minId, minXp] = valores[0]
  const maxXp = valores[valores.length - 1][1]
  // solo sugerir si hay desbalance real: el área top tiene actividad y la mínima casi nada
  if (maxXp >= 40 && minXp < maxXp * 0.25) {
    const area = areas.find((a) => a.id === minId)!
    await crear(
      'balance',
      minId,
      `Tu área ${area.icono} ${area.nombre} se está quedando atrás. Una entrada o un ritmo pequeño la reactivan.`,
      'Casi no ha tenido actividad en 2 semanas comparada con tus otras áreas.',
    )
  }
}

/** Regla 4 — Cumpleaños en los próximos 3 días */
async function reglaCumpleanos() {
  const personas = await db.personas.where('estado').equals('activa').toArray()
  for (const p of personas) {
    const dias = diasHastaCumple(p.cumpleanos)
    if (dias !== null && dias <= 3) {
      const cuando = dias === 0 ? '¡hoy!' : dias === 1 ? 'mañana' : `en ${dias} días`
      await crear('cumpleanos', p.id, `El cumpleaños de ${p.nombre} es ${cuando} 🎂`, 'Fecha guardada en su perfil.')
    }
  }
}

/** Regla 5 — Metas estancadas: activas sin avance en 14 días */
async function reglaMetas() {
  const metas = await db.metas.where('estado').equals('activa').toArray()
  for (const m of metas) {
    if (diasDesde(m.actualizado) >= 14) {
      const paso = m.proximoPaso ? ` Tu próximo paso: "${m.proximoPaso}".` : ''
      await crear(
        'meta',
        m.id,
        `Tu meta ${m.icono} "${m.titulo}" lleva 2 semanas sin avance.${paso}`,
        'Sin progreso registrado en 14 días.',
      )
    }
  }
}

/** Corre todas las reglas. Idempotente: se puede llamar en cada apertura de la app. */
export async function generarSugerencias(): Promise<void> {
  await reactivarPospuestas()
  await reglaReconexion()
  await reglaConsistencia()
  await reglaBalance()
  await reglaCumpleanos()
  await reglaMetas()
}

export async function posponerSugerencia(id: string, dias: number) {
  await db.sugerencias.update(id, {
    estado: 'pospuesta',
    posponerHasta: Date.now() + dias * DIA_MS,
  })
}

export async function descartarSugerencia(id: string) {
  await db.sugerencias.update(id, { estado: 'descartada' })
}

export async function completarSugerencia(id: string) {
  await db.sugerencias.update(id, { estado: 'hecha' })
}
