import { beforeEach, describe, expect, it } from 'vitest'
import { db, uid } from '../src/db/db'
import { DIA_MS, claveDia } from '../src/logic/dates'
import { esperadasPorSemana, generarSugerencias, posponerSugerencia } from '../src/logic/suggestions'
import type { Persona, Ritmo } from '../src/db/types'

async function limpiar() {
  for (const t of db.tables) await t.clear()
}

function persona(sobre: Partial<Persona> = {}): Persona {
  return {
    id: uid(),
    nombre: 'Carlos',
    circulo: 'cercano',
    contextos: [],
    comoConocimos: '',
    loQueImporta: '',
    notas: '',
    datos: [],
    preguntarProxima: '',
    frecuenciaDias: 14,
    areaIds: [],
    estado: 'activa',
    silenciarSugerencias: false,
    ...sobre,
  }
}

function ritmo(sobre: Partial<Ritmo> = {}): Ritmo {
  return {
    id: uid(),
    nombre: 'Hora santa',
    icono: '⛪',
    proposito: '',
    frecuencia: 'semanal',
    diasSemana: [],
    vecesPorSemana: 1,
    areaIds: [],
    estado: 'activo',
    creado: Date.now() - 30 * DIA_MS,
    ...sobre,
  }
}

beforeEach(limpiar)

describe('esperadasPorSemana', () => {
  it('mapea frecuencias a ocurrencias semanales', () => {
    expect(esperadasPorSemana(ritmo({ frecuencia: 'diario' }))).toBe(7)
    expect(esperadasPorSemana(ritmo({ frecuencia: 'semanal', vecesPorSemana: 3 }))).toBe(3)
    expect(esperadasPorSemana(ritmo({ frecuencia: 'personalizado', diasSemana: [1, 3] }))).toBe(2)
  })
})

describe('regla de reconexión', () => {
  it('sugiere cuando el contacto está vencido', async () => {
    const p = persona()
    await db.personas.add(p)
    await db.interacciones.add({
      id: uid(),
      personaId: p.id,
      fecha: Date.now() - 45 * DIA_MS,
      tipo: 'llamada',
      nota: '',
    })
    await generarSugerencias()
    const sug = await db.sugerencias.toArray()
    expect(sug.some((s) => s.tipo === 'reconexion' && s.mensaje.includes('Carlos') && s.mensaje.includes('45'))).toBe(true)
  })

  it('no sugiere sin historial, silenciada, o al día', async () => {
    const sinHistorial = persona({ nombre: 'Ana' })
    const silenciada = persona({ nombre: 'Luis', silenciarSugerencias: true })
    const alDia = persona({ nombre: 'Mamá' })
    await db.personas.bulkAdd([sinHistorial, silenciada, alDia])
    await db.interacciones.bulkAdd([
      { id: uid(), personaId: silenciada.id, fecha: Date.now() - 60 * DIA_MS, tipo: 'llamada', nota: '' },
      { id: uid(), personaId: alDia.id, fecha: Date.now() - 2 * DIA_MS, tipo: 'mensaje', nota: '' },
    ])
    await generarSugerencias()
    expect(await db.sugerencias.where('tipo').equals('reconexion').count()).toBe(0)
  })

  it('es idempotente: no duplica la sugerencia pendiente', async () => {
    const p = persona()
    await db.personas.add(p)
    await db.interacciones.add({ id: uid(), personaId: p.id, fecha: Date.now() - 45 * DIA_MS, tipo: 'llamada', nota: '' })
    await generarSugerencias()
    await generarSugerencias()
    expect(await db.sugerencias.where('tipo').equals('reconexion').count()).toBe(1)
  })
})

describe('regla de consistencia', () => {
  it('sugiere cuando el ritmo va bajo esta semana', async () => {
    await db.ritmos.add(ritmo())
    await generarSugerencias()
    const sug = await db.sugerencias.toArray()
    expect(sug.some((s) => s.tipo === 'consistencia' && s.mensaje.includes('hora santa'))).toBe(true)
  })

  it('no sugiere si va al día o es recién creado', async () => {
    const alDia = ritmo({ nombre: 'Agua', frecuencia: 'diario' })
    const nuevo = ritmo({ nombre: 'Nuevo', creado: Date.now() })
    await db.ritmos.bulkAdd([alDia, nuevo])
    // 4/7 esta semana ≥ 50%
    for (let i = 0; i < 4; i++) {
      const f = Date.now() - i * DIA_MS
      await db.ritmoLogs.add({ id: uid(), ritmoId: alDia.id, fecha: f, dia: claveDia(f) })
    }
    await generarSugerencias()
    expect(await db.sugerencias.where('tipo').equals('consistencia').count()).toBe(0)
  })
})

describe('regla de balance', () => {
  it('señala el área rezagada frente a una activa', async () => {
    await db.areas.bulkAdd([
      { id: 'a1', nombre: 'Salud', icono: '💪', color: '#22C55E', visible: true, orden: 0, prompts: [] },
      { id: 'a2', nombre: 'Fe', icono: '🙏', color: '#A855F7', visible: true, orden: 1, prompts: [] },
    ])
    const f = Date.now() - 2 * DIA_MS
    for (let i = 0; i < 4; i++) {
      await db.xpEvents.add({ id: uid(), fecha: f, dia: claveDia(f), areaId: 'a1', cantidad: 15, fuente: 'ritmo', refId: 'x' })
    }
    await generarSugerencias()
    const sug = await db.sugerencias.toArray()
    const balance = sug.find((s) => s.tipo === 'balance')
    expect(balance?.refId).toBe('a2')
    expect(balance?.mensaje).toContain('Fe')
  })
})

describe('posponer', () => {
  it('una sugerencia pospuesta vencida vuelve a pendiente', async () => {
    const p = persona()
    await db.personas.add(p)
    await db.interacciones.add({ id: uid(), personaId: p.id, fecha: Date.now() - 45 * DIA_MS, tipo: 'llamada', nota: '' })
    await generarSugerencias()
    const s = (await db.sugerencias.toArray())[0]
    await posponerSugerencia(s.id, 7)
    expect((await db.sugerencias.get(s.id))!.estado).toBe('pospuesta')
    // simular que venció el plazo
    await db.sugerencias.update(s.id, { posponerHasta: Date.now() - 1 })
    await generarSugerencias()
    expect((await db.sugerencias.get(s.id))!.estado).toBe('pendiente')
  })
})
