// Motor de retención a largo plazo. Diseñado contra los dos asesinos de estas apps:
// el tedio de llenar (las misiones se completan solas al vivir, no piden datos extra)
// y la gamificación que se agota al mes (contenido que rota a diario, racha sin culpa,
// recompensa variable y metas de largo horizonte).

import { db } from '../db/db'
import type { Area, Entry, Interaccion, Meta, Persona, Ritmo, RitmoLog, XpEvent } from '../db/types'
import { DIA_MS, claveDia, inicioDia } from './dates'
import { otorgarXp } from './xp'
import { toast } from '../components/ui'

/* ---------- PRNG determinista por día (mismo contenido todo el día, distinto mañana) ---------- */

export function semillaDe(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Devuelve un entero pseudo-aleatorio estable en [0, max) para una clave dada */
export function eleccionDelDia(clave: string, max: number, dia = claveDia()): number {
  if (max <= 0) return 0
  return semillaDe(`${dia}:${clave}`) % max
}

/* ---------- Racha flexible (sin culpa) ---------- */

/**
 * Días de constancia con regla amable: un día de descanso NO rompe la racha;
 * se rompe tras 2 días seguidos sin actividad. Hoy sin actividad tampoco la
 * rompe (todavía puedes actuar).
 */
export function rachaFlexible(xpEventos: Pick<XpEvent, 'dia'>[], hoy = inicioDia()): number {
  const activos = new Set(xpEventos.map((e) => e.dia))
  let racha = 0
  let huecos = 0
  for (let i = 0; i < 400; i++) {
    const dia = claveDia(hoy - i * DIA_MS)
    if (activos.has(dia)) {
      racha++
      huecos = 0
    } else {
      if (i === 0) continue // hoy aún está en curso
      huecos++
      if (huecos >= 2) break
    }
  }
  return racha
}

/* ---------- Títulos de nivel (los niveles tardan más; los títulos les dan sentido) ---------- */

const TITULOS: [number, string][] = [
  [30, 'Mito'],
  [25, 'Leyenda'],
  [20, 'Maestro'],
  [16, 'Héroe'],
  [12, 'Veterano'],
  [8, 'Explorador'],
  [5, 'Aventurero'],
  [3, 'Aprendiz'],
  [1, 'Novato'],
]

export function tituloDeNivel(nivel: number): string {
  for (const [min, titulo] of TITULOS) if (nivel >= min) return titulo
  return 'Novato'
}

/** El próximo título y a qué nivel se alcanza, para dar algo que perseguir */
export function proximoTitulo(nivel: number): { titulo: string; nivel: number } | null {
  const siguientes = [...TITULOS].reverse().filter(([min]) => min > nivel)
  if (!siguientes.length) return null
  const [min, titulo] = siguientes[0]
  return { titulo, nivel: min }
}

/* ---------- Pregunta del día (el journal deja de ser "¿qué pasó hoy?" en loop) ---------- */

const PREGUNTAS = [
  '¿Qué te hizo sonreír hoy?',
  '¿Qué harías hoy si no tuvieras miedo?',
  '¿A quién le debes un gracias que no has dado?',
  '¿Qué te está robando energía últimamente?',
  '¿Cuál fue tu mejor momento de la semana hasta ahora?',
  '¿Qué aprendiste hoy que no sabías ayer?',
  '¿Qué versión tuya de hace un año se sorprendería de tu vida hoy?',
  '¿Qué conversación estás evitando?',
  '¿Qué pequeña cosa buena pasó hoy que casi no notaste?',
  '¿Por qué lucharías aunque nadie te lo pidiera?',
  '¿Qué te gustaría recordar de este día dentro de un año?',
  '¿Qué hábito tuyo te está construyendo? ¿Cuál te está frenando?',
  '¿Con quién te reíste por última vez de verdad?',
  '¿Qué le dirías a tu yo de hace cinco años?',
  '¿Qué es algo que hoy diste por hecho y merece gratitud?',
  '¿Dónde estabas hace exactamente un mes? ¿Qué cambió?',
  '¿Qué te quita el sueño estos días?',
  '¿Cuál fue la decisión más pequeña de hoy con la consecuencia más grande?',
  '¿Qué área de tu vida pide atención a gritos y no se la das?',
  '¿Qué canción describe tu semana?',
  '¿Qué te enorgullece de ti que nunca dices en voz alta?',
  '¿Hoy actuaste según lo que te importa o según la inercia?',
  '¿Qué momento de hoy merece contarse a alguien?',
  '¿Qué esperas con ilusión esta semana?',
]

export function preguntaDelDia(dia = claveDia()): string {
  return PREGUNTAS[eleccionDelDia('pregunta', PREGUNTAS.length, dia)]
}

/* ---------- Recuerdos (el pago emocional de haber registrado) ---------- */

/** Una entrada de hace ~un mes (25-40 días) o, si no hay, la más antigua con >14 días */
export function buscarRecuerdo(entradas: Entry[], ahora = Date.now()): Entry | null {
  const candidatas = entradas.filter(
    (e) => e.tipo === 'journal' && e.privacidad === 'normal' && e.contenido.length > 20,
  )
  if (!candidatas.length) return null
  const enVentana = candidatas.filter((e) => {
    const dias = (ahora - e.fecha) / DIA_MS
    return dias >= 25 && dias <= 40
  })
  if (enVentana.length) {
    return enVentana[eleccionDelDia('recuerdo', enVentana.length)]
  }
  const viejas = candidatas.filter((e) => (ahora - e.fecha) / DIA_MS > 14)
  if (!viejas.length) return null
  return viejas[eleccionDelDia('recuerdo', viejas.length)]
}

/* ---------- Misiones bonus del día ----------
 * Dos retos que rotan a diario y se completan SOLOS con la actividad normal:
 * cero fricción de captura, +20 XP cada uno. La variedad viene de la rotación
 * y de que los objetivos salen de TUS datos (tu área descuidada, tu gente).
 */

export interface DatosMisiones {
  areas: Area[]
  ritmos: Ritmo[]
  logsHoy: RitmoLog[]
  personas: Persona[]
  interaccionesHoy: Interaccion[]
  entradasHoy: Entry[]
  metas: Meta[]
  xp14dPorArea: Map<string, number>
  milestoneHoy: boolean
}

export interface Mision {
  id: string
  icono: string
  texto: string
  hecha: boolean
}

interface PlantillaMision {
  id: string
  aplicable: (d: DatosMisiones) => boolean
  construir: (d: DatosMisiones) => { icono: string; texto: string; hecha: boolean }
}

const PLANTILLAS: PlantillaMision[] = [
  {
    id: 'ritmos_todos',
    aplicable: (d) => ritmosDeHoy(d).length >= 2,
    construir: (d) => {
      const hoy = ritmosDeHoy(d)
      const hechos = new Set(d.logsHoy.map((l) => l.ritmoId))
      return {
        icono: '💯',
        texto: `Completa tus ${hoy.length} misiones de hoy`,
        hecha: hoy.every((r) => hechos.has(r.id)),
      }
    },
  },
  {
    id: 'entrada_area',
    aplicable: (d) => d.areas.length >= 2,
    construir: (d) => {
      const rezagada = [...d.areas].sort(
        (a, b) => (d.xp14dPorArea.get(a.id) ?? 0) - (d.xp14dPorArea.get(b.id) ?? 0),
      )[0]
      return {
        icono: '✍️',
        texto: `Escribe una entrada sobre ${rezagada.icono} ${rezagada.nombre}`,
        hecha: d.entradasHoy.some((e) => e.tipo === 'journal' && e.areaIds.includes(rezagada.id)),
      }
    },
  },
  {
    id: 'contacto',
    aplicable: (d) => d.personas.length >= 1,
    construir: (d) => ({
      icono: '🤝',
      texto: 'Registra un contacto con alguien de tu gremio',
      hecha: d.interaccionesHoy.length > 0,
    }),
  },
  {
    id: 'doble_checkin',
    aplicable: () => true,
    construir: (d) => ({
      icono: '🌗',
      texto: 'Haz el check-in de la mañana y el de la noche',
      hecha:
        d.entradasHoy.some((e) => e.tipo === 'checkin_manana') &&
        d.entradasHoy.some((e) => e.tipo === 'checkin_noche'),
    }),
  },
  {
    id: 'milestone',
    aplicable: (d) =>
      d.metas.some((m) => m.estado === 'activa' && (m.milestones ?? []).some((x) => !x.hecho)),
    construir: (d) => ({
      icono: '🪜',
      texto: 'Completa un milestone de alguna meta',
      hecha: d.milestoneHoy,
    }),
  },
  {
    id: 'journal_libre',
    aplicable: () => true,
    construir: (d) => ({
      icono: '📖',
      texto: 'Escribe cualquier entrada en tu registro',
      hecha: d.entradasHoy.some((e) => e.tipo === 'journal'),
    }),
  },
]

function ritmosDeHoy(d: DatosMisiones): Ritmo[] {
  const diaSemana = new Date().getDay()
  return d.ritmos.filter(
    (r) =>
      r.estado === 'activo' &&
      (r.frecuencia === 'diario' ||
        (r.frecuencia === 'personalizado' && r.diasSemana.includes(diaSemana))),
  )
}

/** Las 2 misiones de hoy, elegidas de forma determinista entre las aplicables */
export function misionesDelDia(datos: DatosMisiones, dia = claveDia()): Mision[] {
  const aplicables = PLANTILLAS.filter((p) => p.aplicable(datos))
  if (!aplicables.length) return []
  const elegidas: PlantillaMision[] = []
  const primera = eleccionDelDia('mision1', aplicables.length, dia)
  elegidas.push(aplicables[primera])
  if (aplicables.length > 1) {
    const resto = aplicables.filter((_, i) => i !== primera)
    elegidas.push(resto[eleccionDelDia('mision2', resto.length, dia)])
  }
  return elegidas.map((p) => ({ id: p.id, ...p.construir(datos) }))
}

export async function cargarDatosMisiones(): Promise<DatosMisiones> {
  const hoy0 = inicioDia()
  const [areas, ritmos, logsHoy, personas, inters, entradasHoy, metas, xpRecientes, xpHoy] =
    await Promise.all([
      db.areas.toArray(),
      db.ritmos.toArray(),
      db.ritmoLogs.where('dia').equals(claveDia()).toArray(),
      db.personas.where('estado').equals('activa').toArray(),
      db.interacciones.where('fecha').aboveOrEqual(hoy0).toArray(),
      db.entries.where('fecha').aboveOrEqual(hoy0).toArray(),
      db.metas.toArray(),
      db.xpEvents.where('fecha').aboveOrEqual(hoy0 - 13 * DIA_MS).toArray(),
      db.xpEvents.where('dia').equals(claveDia()).toArray(),
    ])
  const xp14dPorArea = new Map<string, number>()
  for (const e of xpRecientes) {
    if (e.areaId) xp14dPorArea.set(e.areaId, (xp14dPorArea.get(e.areaId) ?? 0) + e.cantidad)
  }
  return {
    areas: areas.filter((a) => a.visible),
    ritmos,
    logsHoy,
    personas,
    interaccionesHoy: inters,
    entradasHoy,
    metas,
    xp14dPorArea,
    // un milestone completado hoy deja un evento fuente 'meta' con refId meta:milestone
    milestoneHoy: xpHoy.some((e) => e.fuente === 'meta' && e.refId.includes(':')),
  }
}

/**
 * Revisa las misiones de hoy y otorga el XP de las recién completadas.
 * Idempotente: cada misión paga una sola vez por día (refId mision:<dia>:<id>).
 */
export async function evaluarMisiones(): Promise<Mision[]> {
  const datos = await cargarDatosMisiones()
  const misiones = misionesDelDia(datos)
  const dia = claveDia()
  const pagadas = new Set(
    (await db.xpEvents.where('dia').equals(dia).toArray())
      .filter((e) => e.fuente === 'mision')
      .map((e) => e.refId),
  )
  for (const m of misiones) {
    const ref = `mision:${dia}:${m.id}`
    if (m.hecha && !pagadas.has(ref)) {
      const r = await otorgarXp('mision', ref, [])
      toast(`🎁 Misión bonus: ${m.texto} (+${r.total} XP)`)
    }
  }
  return misiones
}
