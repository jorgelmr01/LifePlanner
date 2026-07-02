// Acciones de escritura compartidas: mutan la BD y otorgan XP con feedback visual.

import { db, uid } from '../db/db'
import type { Entry, Interaccion, Meta, Persona, Ritmo, RitmoLog } from '../db/types'
import { claveDia } from './dates'
import { otorgarXp, type FuenteXp } from './xp'
import { toast } from '../components/ui'

async function conXp(fuente: FuenteXp, refId: string, areaIds: string[], aviso = true) {
  const xp = await otorgarXp(fuente, refId, areaIds)
  if (aviso) toast(`+${xp} XP ✨`)
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

/* ---------- Entradas ---------- */

export async function crearEntrada(datos: Omit<Entry, 'id'>): Promise<Entry> {
  const entrada: Entry = { ...datos, id: uid() }
  await db.entries.add(entrada)
  await conXp(datos.tipo === 'journal' ? 'entrada' : 'checkin', entrada.id, datos.areaIds)
  return entrada
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

/* ---------- Metas ---------- */

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
