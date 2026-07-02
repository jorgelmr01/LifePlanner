import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../src/db/db'
import { estadoPorArea, nivelDeXp, otorgarXp, progresoNivel, retirarXpDe, xpParaNivel } from '../src/logic/xp'

beforeEach(async () => {
  await db.xpEvents.clear()
})

describe('nivelDeXp / xpParaNivel', () => {
  it('nivel 1 con 0 XP y umbrales cuadráticos', () => {
    expect(nivelDeXp(0)).toBe(1)
    expect(nivelDeXp(49)).toBe(1)
    expect(nivelDeXp(50)).toBe(2) // 50·1²
    expect(nivelDeXp(199)).toBe(2)
    expect(nivelDeXp(200)).toBe(3) // 50·2²
    expect(xpParaNivel(3)).toBe(200)
  })
})

describe('progresoNivel', () => {
  it('calcula la fracción dentro del nivel', () => {
    const p = progresoNivel(125) // nivel 2: 50→200
    expect(p.nivel).toBe(2)
    expect(p.fraccion).toBeCloseTo((125 - 50) / 150)
  })
})

describe('otorgarXp', () => {
  it('divide el XP entre las áreas destino', async () => {
    await otorgarXp('ritmo', 'r1', ['a1', 'a2'])
    const eventos = await db.xpEvents.toArray()
    expect(eventos).toHaveLength(2)
    expect(eventos.every((e) => e.cantidad === 8)).toBe(true) // round(15/2)
  })

  it('sin áreas registra un evento global', async () => {
    await otorgarXp('checkin', 'c1', [])
    const eventos = await db.xpEvents.toArray()
    expect(eventos).toHaveLength(1)
    expect(eventos[0].areaId).toBe('')
    expect(eventos[0].cantidad).toBe(5)
  })
})

describe('retirarXpDe', () => {
  it('elimina solo los eventos del objeto dado', async () => {
    await otorgarXp('entrada', 'e1', ['a1'])
    await otorgarXp('entrada', 'e2', ['a1'])
    await retirarXpDe('e1')
    const eventos = await db.xpEvents.toArray()
    expect(eventos).toHaveLength(1)
    expect(eventos[0].refId).toBe('e2')
  })
})

describe('estadoPorArea', () => {
  it('clasifica la atención según el XP de 14 días', async () => {
    // a1: mucha actividad reciente; a2: nada
    for (let i = 0; i < 5; i++) await otorgarXp('ritmo', `r${i}`, ['a1'])
    const estados = await estadoPorArea(['a1', 'a2'])
    expect(estados.get('a1')!.atencion).toBe('alta') // 75 XP ≥ 60
    expect(estados.get('a2')!.atencion).toBe('baja')
    expect(estados.get('a1')!.nivel.nivel).toBe(2)
  })
})
