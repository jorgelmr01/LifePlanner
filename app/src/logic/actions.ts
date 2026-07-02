// Acciones de escritura compartidas: mutan la BD, otorgan XP con feedback visual
// y evalúan logros nuevos tras cada acción significativa.

import { db, uid } from '../db/db'
import type { Area, Entry, Interaccion, Meta, Persona, Ritmo, RitmoLog } from '../db/types'
import { claveDia } from './dates'
import { otorgarXp, retirarXpDe, type FuenteXp } from './xp'
import { evaluarLogros } from './achievements'
import { toast } from '../components/ui'

async function conXp(fuente: FuenteXp, refId: string, areaIds: string[], aviso = true) {
  const xp = await otorgarXp(fuente, refId, areaIds)
  if (aviso) toast(`+${xp} XP ✨`)
  // los logros se evalúan después para que el toast del XP salga primero
  evaluarLogros().catch(() => {})
}

/* ---------- Ritmos ---------- */

export async function marcarRitmoHoy(ritmo: Ritmo): Promise<void> {
  const dia = claveDia()
  const existente = await db.ritmoLogs.where('[ritmoId+dia]').equals([ritmo.id, dia]).first()
  if (existente) return
  const log: RitmoLog = { id: uid(), ritmoId: ritmo.id, fecha: Date.now(), dia }
  await db.ritmoLogs.add(log)
  await conXp('ritmo', ritmo.id, ritmo.areaIds)
  // si había sugerencia de consistencia pendiente para este ritmo, se marca hecha
  const sug = await db.sugerencias.where('refId').equals(ritmo.id).toArray()
  for (const s of sug) if (s.estado === 'pendiente') await db.sugerencias.update(s.id, { estado: 'hecha' })
}

export async function desmarcarRitmoHoy(ritmoId: string): Promise<void> {
  const dia = claveDia()
  const existente = await db.ritmoLogs.where('[ritmoId+dia]').equals([ritmoId, dia]).first()
  if (!existente) return
  await db.ritmoLogs.delete(existente.id)
  // retira el XP otorgado hoy por este ritmo
  const eventos = await db.xpEvents.where('dia').equals(dia).toArray()
  for (const ev of eventos) {
    if (ev.fuente === 'ritmo' && ev.refId === ritmoId) await db.xpEvents.delete(ev.id)
  }
}

export async function actualizarRitmo(id: string, cambios: Partial<Ritmo>): Promise<void> {
  await db.ritmos.update(id, cambios)
}

export async function cambiarEstadoRitmo(ritmo: Ritmo, estado: Ritmo['estado']): Promise<void> {
  const anterior = ritmo.estado
  await db.ritmos.update(ritmo.id, { estado })
  const texto = { activo: 'reactivado', pausado: 'pausado', archivado: 'archivado' }[estado]
  toast(`Ritmo ${texto}`, {
    texto: 'Deshacer',
    fn: () => db.ritmos.update(ritmo.id, { estado: anterior }),
  })
}

/* ---------- Entradas ---------- */

export async function crearEntrada(datos: Omit<Entry, 'id'>): Promise<Entry> {
  const entrada: Entry = { ...datos, id: uid() }
  await db.entries.add(entrada)
  await conXp(datos.tipo === 'journal' ? 'entrada' : 'checkin', entrada.id, datos.areaIds)
  return entrada
}

export async function actualizarEntrada(id: string, cambios: Partial<Entry>): Promise<void> {
  await db.entries.update(id, cambios)
}

export async function borrarEntrada(entrada: Entry): Promise<void> {
  await db.entries.delete(entrada.id)
  await retirarXpDe(entrada.id)
  toast('Entrada eliminada', {
    texto: 'Deshacer',
    fn: async () => {
      await db.entries.add(entrada)
      await otorgarXp(entrada.tipo === 'journal' ? 'entrada' : 'checkin', entrada.id, entrada.areaIds)
    },
  })
}

/* ---------- Interacciones ---------- */

export async function registrarInteraccion(
  persona: Persona,
  datos: Omit<Interaccion, 'id' | 'personaId'>,
): Promise<void> {
  const inter: Interaccion = { ...datos, id: uid(), personaId: persona.id }
  await db.interacciones.add(inter)
  await conXp('interaccion', inter.id, persona.areaIds)
  const sug = await db.sugerencias.where('refId').equals(persona.id).toArray()
  for (const s of sug) if (s.estado === 'pendiente') await db.sugerencias.update(s.id, { estado: 'hecha' })
}

export async function archivarPersona(persona: Persona): Promise<void> {
  await db.personas.update(persona.id, { estado: 'archivada' })
  toast(`${persona.nombre} archivado`, {
    texto: 'Deshacer',
    fn: () => db.personas.update(persona.id, { estado: 'activa' }),
  })
}

/* ---------- Metas y milestones ---------- */

export async function crearMeta(datos: Omit<Meta, 'id' | 'creado' | 'actualizado'>): Promise<void> {
  const meta: Meta = { ...datos, id: uid(), creado: Date.now(), actualizado: Date.now() }
  await db.metas.add(meta)
}

export async function avanzarMeta(meta: Meta, cambios: Partial<Meta>): Promise<void> {
  await db.metas.update(meta.id, { ...cambios, actualizado: Date.now() })
  const progresoAntes = meta.progreso
  const progresoDespues = cambios.progreso ?? progresoAntes
  if (progresoDespues > progresoAntes || cambios.estado === 'completada') {
    await conXp('meta', meta.id, meta.areaIds)
  }
}

/** Marca/desmarca un milestone; completarlo da XP y actualiza el progreso sugerido */
export async function alternarMilestone(meta: Meta, milestoneId: string): Promise<void> {
  const milestones = (meta.milestones ?? []).map((m) =>
    m.id === milestoneId ? { ...m, hecho: !m.hecho } : m,
  )
  const objetivo = milestones.find((m) => m.id === milestoneId)
  const hechos = milestones.filter((m) => m.hecho).length
  // el progreso sigue a los milestones (redondeado a 5), sin bajar el manual
  const progreso = Math.max(
    meta.progreso * (objetivo?.hecho ? 1 : 0), // si desmarcó, permite bajar
    Math.round(((hechos / Math.max(1, milestones.length)) * 100) / 5) * 5,
  )
  await db.metas.update(meta.id, { milestones, progreso, actualizado: Date.now() })
  if (objetivo?.hecho) {
    await conXp('meta', `${meta.id}:${milestoneId}`, meta.areaIds)
  } else {
    await retirarXpDe(`${meta.id}:${milestoneId}`)
  }
}

export async function agregarMilestone(meta: Meta, titulo: string): Promise<void> {
  const milestones = [...(meta.milestones ?? []), { id: uid(), titulo: titulo.trim(), hecho: false }]
  await db.metas.update(meta.id, { milestones })
}

export async function borrarMilestone(meta: Meta, milestoneId: string): Promise<void> {
  const milestones = (meta.milestones ?? []).filter((m) => m.id !== milestoneId)
  await db.metas.update(meta.id, { milestones })
  await retirarXpDe(`${meta.id}:${milestoneId}`)
}

/* ---------- Áreas ---------- */

export async function actualizarArea(id: string, cambios: Partial<Area>): Promise<void> {
  await db.areas.update(id, cambios)
}
