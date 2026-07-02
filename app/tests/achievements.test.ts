import { beforeEach, describe, expect, it } from 'vitest'
import { db, uid } from '../src/db/db'
import { claveDia } from '../src/logic/dates'
import { evaluarLogros } from '../src/logic/achievements'

beforeEach(async () => {
  for (const t of db.tables) await t.clear()
})

describe('evaluarLogros', () => {
  it('desbloquea "Primer paso" con el primer ritmo y otorga XP', async () => {
    await db.ritmoLogs.add({ id: uid(), ritmoId: 'r1', fecha: Date.now(), dia: claveDia() })
    await evaluarLogros()
    expect(await db.logros.get('primer_ritmo')).toBeTruthy()
    const xp = await db.xpEvents.toArray()
    expect(xp.some((e) => e.fuente === 'logro' && e.refId === 'primer_ritmo' && e.cantidad === 25)).toBe(true)
  })

  it('es idempotente: no re-otorga logros ya ganados', async () => {
    await db.ritmoLogs.add({ id: uid(), ritmoId: 'r1', fecha: Date.now(), dia: claveDia() })
    await evaluarLogros()
    await evaluarLogros()
    const xp = await db.xpEvents.toArray()
    expect(xp.filter((e) => e.refId === 'primer_ritmo')).toHaveLength(1)
  })

  it('no desbloquea logros sin cumplir la condición', async () => {
    await evaluarLogros()
    expect(await db.logros.count()).toBe(0)
  })

  it('desbloquea "Cronista" con 10 entradas de journal', async () => {
    for (let i = 0; i < 10; i++) {
      await db.entries.add({
        id: uid(),
        fecha: Date.now(),
        tipo: 'journal',
        contenido: `entrada ${i}`,
        areaIds: [],
        personaIds: [],
        tags: [],
        privacidad: 'normal',
      })
    }
    await evaluarLogros()
    expect(await db.logros.get('primera_entrada')).toBeTruthy()
    expect(await db.logros.get('escritor_10')).toBeTruthy()
  })
})
