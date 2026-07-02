import { beforeEach, describe, expect, it } from 'vitest'
import { db, uid } from '../src/db/db'
import { DIA_MS } from '../src/logic/dates'
import {
  abandonarConAprendizaje,
  diasRestantes,
  estadoPlan,
  progresoEsperado,
  reformularObjetivo,
  replantearFecha,
} from '../src/logic/goals'
import type { Meta } from '../src/db/types'

beforeEach(async () => {
  for (const t of db.tables) await t.clear()
})

function meta(sobre: Partial<Meta> = {}): Meta {
  return {
    id: uid(),
    titulo: 'Correr 10K',
    icono: '🎯',
    porque: '',
    metrica: '',
    progreso: 0,
    proximoPaso: '',
    milestones: [],
    replanteos: [],
    areaIds: [],
    estado: 'activa',
    creado: Date.now() - 10 * DIA_MS,
    actualizado: Date.now(),
    ...sobre,
  }
}

describe('progresoEsperado', () => {
  it('a mitad del plazo pide ~50%', () => {
    const m = meta({ creado: Date.now() - 10 * DIA_MS, fechaLimite: Date.now() + 10 * DIA_MS })
    expect(progresoEsperado(m)).toBe(50)
  })
  it('sin fecha devuelve null; pasado el plazo se acota a 100', () => {
    expect(progresoEsperado(meta())).toBeNull()
    const vencida = meta({ fechaLimite: Date.now() - DIA_MS })
    expect(progresoEsperado(vencida)).toBe(100)
  })
})

describe('estadoPlan', () => {
  const aMitad = { creado: Date.now() - 10 * DIA_MS, fechaLimite: Date.now() + 10 * DIA_MS }
  it('clasifica adelante / al día / atrasada con tolerancia de 15', () => {
    expect(estadoPlan(meta({ ...aMitad, progreso: 70 }))).toBe('adelante')
    expect(estadoPlan(meta({ ...aMitad, progreso: 45 }))).toBe('al_dia')
    expect(estadoPlan(meta({ ...aMitad, progreso: 20 }))).toBe('atrasada')
  })
  it('vencida solo si la fecha pasó, está activa y no llegó a 100', () => {
    expect(estadoPlan(meta({ fechaLimite: Date.now() - DIA_MS, progreso: 60 }))).toBe('vencida')
    expect(estadoPlan(meta({ fechaLimite: Date.now() - DIA_MS, progreso: 100 }))).not.toBe('vencida')
    expect(
      estadoPlan(meta({ fechaLimite: Date.now() - DIA_MS, progreso: 60, estado: 'pausada' })),
    ).not.toBe('vencida')
  })
  it('sin fecha nunca presiona', () => {
    expect(estadoPlan(meta({ progreso: 0 }))).toBe('sin_fecha')
  })
  it('diasRestantes redondea hacia arriba', () => {
    expect(diasRestantes(meta({ fechaLimite: Date.now() + 2.5 * DIA_MS }))).toBe(3)
  })
})

describe('evaluación final', () => {
  it('replantearFecha mueve la fecha y registra el aprendizaje', async () => {
    const m = meta({ fechaLimite: Date.now() - DIA_MS })
    await db.metas.add(m)
    const nueva = Date.now() + 30 * DIA_MS
    await replantearFecha(m, nueva, 'Subestimé el entrenamiento')
    const tras = (await db.metas.get(m.id))!
    expect(tras.fechaLimite).toBe(nueva)
    expect(tras.replanteos).toHaveLength(1)
    expect(tras.replanteos[0].tipo).toBe('fecha')
    expect(tras.replanteos[0].nota).toBe('Subestimé el entrenamiento')
    expect(estadoPlan(tras)).not.toBe('vencida')
  })

  it('reformularObjetivo cambia el objetivo y guarda el porqué', async () => {
    const m = meta()
    await db.metas.add(m)
    await reformularObjetivo(m, { titulo: 'Correr 5K disfrutándolo', metrica: '3 carreras de 5K' }, 'El 10K era ego')
    const tras = (await db.metas.get(m.id))!
    expect(tras.titulo).toBe('Correr 5K disfrutándolo')
    expect(tras.replanteos[0].tipo).toBe('objetivo')
  })

  it('abandonarConAprendizaje cierra guardando la lección', async () => {
    const m = meta()
    await db.metas.add(m)
    await abandonarConAprendizaje(m, 'Mi prioridad real este año es otra')
    const tras = (await db.metas.get(m.id))!
    expect(tras.estado).toBe('abandonada')
    expect(tras.notaAbandono).toBe('Mi prioridad real este año es otra')
  })
})

describe('reglas de sugerencias de metas', () => {
  it('meta vencida genera sugerencia de evaluación', async () => {
    await db.metas.add(meta({ fechaLimite: Date.now() - DIA_MS, progreso: 40 }))
    const { generarSugerencias } = await import('../src/logic/suggestions')
    await generarSugerencias()
    const sug = await db.sugerencias.toArray()
    expect(sug.some((s) => s.tipo === 'meta' && s.refId.endsWith(':vencida') && s.mensaje.includes('40%'))).toBe(true)
  })

  it('meta atrasada contra el plan genera aviso con el % esperado', async () => {
    await db.metas.add(
      meta({ creado: Date.now() - 10 * DIA_MS, fechaLimite: Date.now() + 10 * DIA_MS, progreso: 10 }),
    )
    const { generarSugerencias } = await import('../src/logic/suggestions')
    await generarSugerencias()
    const sug = await db.sugerencias.toArray()
    const aviso = sug.find((s) => s.refId.endsWith(':plan'))
    expect(aviso?.mensaje).toContain('50%')
  })
})
