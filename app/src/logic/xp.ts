// Capa RPG: XP, niveles por área y balance de vida.
// Filosofía (DESIGN_DECISIONS.md): gamificación sin culpa — los niveles nunca bajan,
// no hay rachas punitivas; el "balance" solo señala dónde poner atención.

import { db, uid } from '../db/db'
import type { XpEvent } from '../db/types'
import { claveDia, DIA_MS, inicioDia } from './dates'

export const XP_VALORES = {
  entrada: 10,
  checkin: 5,
  ritmo: 15,
  interaccion: 15,
  meta: 25,
  sugerencia: 10,
  logro: 25,
  mision: 20,
} as const

export type FuenteXp = keyof typeof XP_VALORES

export interface ResultadoXp {
  total: number
  critico: boolean
}

// Probabilidad de golpe crítico (x2 XP): recompensa variable, el gancho más
// fuerte contra la monotonía. Desactivado fuera del navegador (tests deterministas).
const PROB_CRITICO = 0.1

/**
 * Registra XP para cero o más áreas (dividido en partes iguales).
 * ~10% de las veces es un golpe crítico que duplica el XP.
 * Si el personaje sube de nivel, emite el evento window 'levelup' con el nivel nuevo.
 */
export async function otorgarXp(
  fuente: FuenteXp,
  refId: string,
  areaIds: string[],
): Promise<ResultadoXp> {
  const critico =
    typeof window !== 'undefined' && fuente !== 'logro' && Math.random() < PROB_CRITICO
  const base = XP_VALORES[fuente] * (critico ? 2 : 1)
  const ahora = Date.now()
  const targets = areaIds.length ? areaIds : ['']
  const porArea = Math.max(1, Math.round(base / targets.length))
  const antes = await xpTotalPersonaje()
  const eventos: XpEvent[] = targets.map((areaId) => ({
    id: uid(),
    fecha: ahora,
    dia: claveDia(ahora),
    areaId,
    cantidad: porArea,
    fuente,
    refId,
  }))
  await db.xpEvents.bulkAdd(eventos)
  const despues = antes + porArea * targets.length
  if (nivelDeXp(despues) > nivelDeXp(antes) && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('levelup', { detail: { nivel: nivelDeXp(despues) } }))
  }
  return { total: porArea * targets.length, critico }
}

/** Elimina el XP generado por un objeto (al borrar una entrada, desmarcar un ritmo, etc.) */
export async function retirarXpDe(refId: string): Promise<void> {
  const eventos = await db.xpEvents.toArray()
  for (const ev of eventos) {
    if (ev.refId === refId) await db.xpEvents.delete(ev.id)
  }
}

/** Nivel a partir de XP acumulado: cada nivel cuesta 50·n² XP acumulado */
export function nivelDeXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1
}

export function xpParaNivel(nivel: number): number {
  return 50 * (nivel - 1) * (nivel - 1)
}

export interface ProgresoNivel {
  nivel: number
  xp: number
  xpNivelActual: number
  xpSiguienteNivel: number
  fraccion: number // 0-1 dentro del nivel actual
}

export function progresoNivel(xp: number): ProgresoNivel {
  const nivel = nivelDeXp(xp)
  const base = xpParaNivel(nivel)
  const siguiente = xpParaNivel(nivel + 1)
  return {
    nivel,
    xp,
    xpNivelActual: base,
    xpSiguienteNivel: siguiente,
    fraccion: siguiente > base ? (xp - base) / (siguiente - base) : 0,
  }
}

export interface EstadoArea {
  areaId: string
  xpTotal: number
  xp14d: number
  nivel: ProgresoNivel
  atencion: 'alta' | 'media' | 'baja'
}

/** XP total y de los últimos 14 días por área, con indicador de atención */
export async function estadoPorArea(areaIds: string[]): Promise<Map<string, EstadoArea>> {
  const eventos = await db.xpEvents.toArray()
  const corte = inicioDia() - 13 * DIA_MS
  const resultado = new Map<string, EstadoArea>()
  for (const id of areaIds) {
    resultado.set(id, {
      areaId: id,
      xpTotal: 0,
      xp14d: 0,
      nivel: progresoNivel(0),
      atencion: 'baja',
    })
  }
  for (const ev of eventos) {
    const e = resultado.get(ev.areaId)
    if (!e) continue
    e.xpTotal += ev.cantidad
    if (ev.fecha >= corte) e.xp14d += ev.cantidad
  }
  for (const e of resultado.values()) {
    e.nivel = progresoNivel(e.xpTotal)
    e.atencion = e.xp14d >= 60 ? 'alta' : e.xp14d >= 20 ? 'media' : 'baja'
  }
  return resultado
}

export async function xpTotalPersonaje(): Promise<number> {
  const eventos = await db.xpEvents.toArray()
  return eventos.reduce((s, e) => s + e.cantidad, 0)
}
