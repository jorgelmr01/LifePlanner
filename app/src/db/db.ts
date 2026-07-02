import Dexie, { type EntityTable } from 'dexie'
import type {
  Area,
  Entry,
  Ritmo,
  RitmoLog,
  Meta,
  Persona,
  Interaccion,
  Sugerencia,
  XpEvent,
  Ajustes,
} from './types'

export const db = new Dexie('life-copilot') as Dexie & {
  areas: EntityTable<Area, 'id'>
  entries: EntityTable<Entry, 'id'>
  ritmos: EntityTable<Ritmo, 'id'>
  ritmoLogs: EntityTable<RitmoLog, 'id'>
  metas: EntityTable<Meta, 'id'>
  personas: EntityTable<Persona, 'id'>
  interacciones: EntityTable<Interaccion, 'id'>
  sugerencias: EntityTable<Sugerencia, 'id'>
  xpEvents: EntityTable<XpEvent, 'id'>
  ajustes: EntityTable<Ajustes, 'id'>
}

db.version(1).stores({
  areas: 'id, orden',
  entries: 'id, fecha, tipo',
  ritmos: 'id, estado',
  ritmoLogs: 'id, ritmoId, dia, fecha, [ritmoId+dia]',
  metas: 'id, estado',
  personas: 'id, estado',
  interacciones: 'id, personaId, fecha',
  sugerencias: 'id, estado, tipo, refId',
  xpEvents: 'id, dia, areaId, fecha',
  ajustes: 'id',
})

export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now())

/** Exporta todos los datos como JSON descargable */
export async function exportarJSON(): Promise<string> {
  const dump = {
    version: 1,
    exportado: new Date().toISOString(),
    areas: await db.areas.toArray(),
    entries: await db.entries.toArray(),
    ritmos: await db.ritmos.toArray(),
    ritmoLogs: await db.ritmoLogs.toArray(),
    metas: await db.metas.toArray(),
    personas: await db.personas.toArray(),
    interacciones: await db.interacciones.toArray(),
    sugerencias: await db.sugerencias.toArray(),
    xpEvents: await db.xpEvents.toArray(),
    ajustes: await db.ajustes.toArray(),
  }
  return JSON.stringify(dump, null, 2)
}

export async function importarJSON(json: string): Promise<void> {
  const dump = JSON.parse(json)
  await db.transaction('rw', db.tables, async () => {
    for (const tabla of [
      'areas',
      'entries',
      'ritmos',
      'ritmoLogs',
      'metas',
      'personas',
      'interacciones',
      'sugerencias',
      'xpEvents',
      'ajustes',
    ] as const) {
      if (Array.isArray(dump[tabla])) {
        await db.table(tabla).clear()
        await db.table(tabla).bulkPut(dump[tabla])
      }
    }
  })
}

export async function borrarTodo(): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) await t.clear()
  })
}
