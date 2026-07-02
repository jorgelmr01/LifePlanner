// Logros (insignias): refuerzan la capa RPG. Solo suman, nunca se pierden.
// Filosofía sin culpa: celebran hitos alcanzados; no hay logros por "no fallar".

import { db } from '../db/db'
import { DIA_MS, inicioDia } from './dates'
import { nivelDeXp, otorgarXp } from './xp'
import { estadoRacha } from './engagement'
import { toast } from '../components/ui'

export interface ContextoLogros {
  entradasJournal: number
  checkins: number
  ritmoLogs: number
  interacciones: number
  personasContactadas: number
  metasCompletadas: number
  milestonesHechos: number
  diasActivos7: number
  nivelPersonaje: number
  maxNivelArea: number
  areasConActividad14d: number
  areasVisibles: number
  racha: number
  misionesCompletadas: number
  diasActivosTotales: number
}

export interface DefLogro {
  id: string
  icono: string
  nombre: string
  descripcion: string
  check: (c: ContextoLogros) => boolean
}

export const LOGROS: DefLogro[] = [
  { id: 'primera_entrada', icono: '✍️', nombre: 'Primera página', descripcion: 'Escribe tu primera entrada', check: (c) => c.entradasJournal >= 1 },
  { id: 'escritor_10', icono: '📖', nombre: 'Cronista', descripcion: '10 entradas en tu registro', check: (c) => c.entradasJournal >= 10 },
  { id: 'escritor_50', icono: '📚', nombre: 'Biógrafo', descripcion: '50 entradas en tu registro', check: (c) => c.entradasJournal >= 50 },
  { id: 'primer_ritmo', icono: '✅', nombre: 'Primer paso', descripcion: 'Marca tu primer ritmo', check: (c) => c.ritmoLogs >= 1 },
  { id: 'constante_30', icono: '🔁', nombre: 'Constante', descripcion: '30 ritmos completados', check: (c) => c.ritmoLogs >= 30 },
  { id: 'constante_100', icono: '⚙️', nombre: 'Imparable', descripcion: '100 ritmos completados', check: (c) => c.ritmoLogs >= 100 },
  { id: 'semana_activa', icono: '🌟', nombre: 'Semana viva', descripcion: 'Actividad los 7 días de una semana', check: (c) => c.diasActivos7 >= 7 },
  { id: 'reconectador', icono: '🤝', nombre: 'Reconectador', descripcion: '5 contactos registrados', check: (c) => c.interacciones >= 5 },
  { id: 'gremio_activo', icono: '🏰', nombre: 'Gremio activo', descripcion: 'Contacto con 5 personas distintas', check: (c) => c.personasContactadas >= 5 },
  { id: 'checkin_7', icono: '🌅', nombre: 'Ritual diario', descripcion: '7 check-ins hechos', check: (c) => c.checkins >= 7 },
  { id: 'primera_meta', icono: '🏆', nombre: 'Quest completada', descripcion: 'Completa tu primera meta', check: (c) => c.metasCompletadas >= 1 },
  { id: 'milestone_5', icono: '🪜', nombre: 'Paso a paso', descripcion: '5 milestones completados', check: (c) => c.milestonesHechos >= 5 },
  { id: 'nivel_5', icono: '🧭', nombre: 'Aventurero Nv5', descripcion: 'Llega a nivel 5 de personaje', check: (c) => c.nivelPersonaje >= 5 },
  { id: 'nivel_10', icono: '🗡️', nombre: 'Veterano Nv10', descripcion: 'Llega a nivel 10 de personaje', check: (c) => c.nivelPersonaje >= 10 },
  { id: 'area_nv5', icono: '💎', nombre: 'Especialista', descripcion: 'Un área a nivel 5', check: (c) => c.maxNivelArea >= 5 },
  { id: 'equilibrista', icono: '⚖️', nombre: 'Equilibrista', descripcion: 'Todas tus áreas con actividad en 2 semanas', check: (c) => c.areasVisibles >= 3 && c.areasConActividad14d >= c.areasVisibles },
  // largo horizonte: siempre hay algo que perseguir después del primer mes
  { id: 'racha_7', icono: '🔥', nombre: 'En racha', descripcion: '7 días de constancia flexible', check: (c) => c.racha >= 7 },
  { id: 'racha_30', icono: '🌋', nombre: 'Fuego eterno', descripcion: '30 días de constancia flexible', check: (c) => c.racha >= 30 },
  { id: 'racha_100', icono: '☄️', nombre: 'Cometa', descripcion: '100 días de constancia flexible', check: (c) => c.racha >= 100 },
  { id: 'misiones_10', icono: '🎁', nombre: 'Cazarrecompensas', descripcion: '10 misiones bonus completadas', check: (c) => c.misionesCompletadas >= 10 },
  { id: 'misiones_50', icono: '🏹', nombre: 'Mercenario', descripcion: '50 misiones bonus completadas', check: (c) => c.misionesCompletadas >= 50 },
  { id: 'nivel_20', icono: '👑', nombre: 'Maestro Nv20', descripcion: 'Llega a nivel 20 de personaje', check: (c) => c.nivelPersonaje >= 20 },
  // días activos totales: nunca se pierden aunque la racha se rompa
  { id: 'dias_30', icono: '📆', nombre: 'Presente', descripcion: '30 días activos en total', check: (c) => c.diasActivosTotales >= 30 },
  { id: 'dias_150', icono: '🗿', nombre: 'Inquebrantable', descripcion: '150 días activos en total', check: (c) => c.diasActivosTotales >= 150 },
  { id: 'dias_365', icono: '🎊', nombre: 'Un año de vida', descripcion: '365 días activos en total', check: (c) => c.diasActivosTotales >= 365 },
]

async function construirContexto(): Promise<ContextoLogros> {
  const [entries, logs, inters, metas, xp, areas] = await Promise.all([
    db.entries.toArray(),
    db.ritmoLogs.toArray(),
    db.interacciones.toArray(),
    db.metas.toArray(),
    db.xpEvents.toArray(),
    db.areas.toArray(),
  ])
  const corte7 = inicioDia() - 6 * DIA_MS
  const corte14 = inicioDia() - 13 * DIA_MS
  const diasActivos = new Set(xp.filter((e) => e.fecha >= corte7).map((e) => e.dia))
  const xpPorArea = new Map<string, number>()
  const xp14PorArea = new Map<string, number>()
  for (const e of xp) {
    if (!e.areaId) continue
    xpPorArea.set(e.areaId, (xpPorArea.get(e.areaId) ?? 0) + e.cantidad)
    if (e.fecha >= corte14) xp14PorArea.set(e.areaId, (xp14PorArea.get(e.areaId) ?? 0) + e.cantidad)
  }
  const visibles = areas.filter((a) => a.visible)
  return {
    entradasJournal: entries.filter((e) => e.tipo === 'journal').length,
    checkins: entries.filter((e) => e.tipo !== 'journal').length,
    ritmoLogs: logs.length,
    interacciones: inters.length,
    personasContactadas: new Set(inters.map((i) => i.personaId)).size,
    metasCompletadas: metas.filter((m) => m.estado === 'completada').length,
    milestonesHechos: metas.reduce((s, m) => s + (m.milestones ?? []).filter((x) => x.hecho).length, 0),
    diasActivos7: diasActivos.size,
    nivelPersonaje: nivelDeXp(xp.reduce((s, e) => s + e.cantidad, 0)),
    maxNivelArea: Math.max(0, ...visibles.map((a) => nivelDeXp(xpPorArea.get(a.id) ?? 0))),
    areasConActividad14d: visibles.filter((a) => (xp14PorArea.get(a.id) ?? 0) > 0).length,
    areasVisibles: visibles.length,
    racha: estadoRacha(xp).racha,
    misionesCompletadas: xp.filter((e) => e.fuente === 'mision').length,
    diasActivosTotales: estadoRacha(xp).diasActivosTotales,
  }
}

/** Evalúa el catálogo y desbloquea los logros nuevos. Idempotente. */
export async function evaluarLogros(): Promise<void> {
  const ganados = new Set((await db.logros.toArray()).map((l) => l.id))
  const pendientes = LOGROS.filter((l) => !ganados.has(l.id))
  if (!pendientes.length) return
  const ctx = await construirContexto()
  for (const l of pendientes) {
    if (!l.check(ctx)) continue
    await db.logros.add({ id: l.id, fecha: Date.now() })
    await otorgarXp('logro', l.id, [])
    toast(`🏅 Logro: ${l.nombre} (+${25} XP)`)
  }
}
