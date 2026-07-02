import { beforeEach, describe, expect, it } from 'vitest'
import { db, uid } from '../src/db/db'
import { DIA_MS, claveDia, inicioDia } from '../src/logic/dates'
import {
  buscarRecuerdo,
  cargarDatosMisiones,
  evaluarMisiones,
  misionesDelDia,
  preguntaDelDia,
  proximoTitulo,
  rachaFlexible,
  tituloDeNivel,
} from '../src/logic/engagement'
import type { Entry } from '../src/db/types'

beforeEach(async () => {
  for (const t of db.tables) await t.clear()
})

const dia = (offset: number) => ({ dia: claveDia(inicioDia() - offset * DIA_MS) })

describe('rachaFlexible', () => {
  it('cuenta días consecutivos con actividad', () => {
    expect(rachaFlexible([dia(0), dia(1), dia(2)])).toBe(3)
  })
  it('un día de descanso NO rompe la racha', () => {
    // activo hoy, descanso ayer, activo antier y antes
    expect(rachaFlexible([dia(0), dia(2), dia(3)])).toBe(3)
  })
  it('dos días seguidos sin actividad SÍ la rompen', () => {
    expect(rachaFlexible([dia(0), dia(3), dia(4)])).toBe(1)
  })
  it('hoy sin actividad todavía no rompe (día en curso)', () => {
    expect(rachaFlexible([dia(1), dia(2)])).toBe(2)
  })
  it('sin actividad devuelve 0', () => {
    expect(rachaFlexible([])).toBe(0)
  })
})

describe('títulos', () => {
  it('mapea niveles a títulos crecientes', () => {
    expect(tituloDeNivel(1)).toBe('Novato')
    expect(tituloDeNivel(4)).toBe('Aprendiz')
    expect(tituloDeNivel(5)).toBe('Aventurero')
    expect(tituloDeNivel(12)).toBe('Veterano')
    expect(tituloDeNivel(99)).toBe('Mito')
  })
  it('proximoTitulo da algo que perseguir hasta el máximo', () => {
    expect(proximoTitulo(1)).toEqual({ titulo: 'Aprendiz', nivel: 3 })
    expect(proximoTitulo(20)?.titulo).toBe('Leyenda')
    expect(proximoTitulo(30)).toBeNull()
  })
})

describe('preguntaDelDia', () => {
  it('es estable dentro del día y rota entre días', () => {
    expect(preguntaDelDia('2026-07-02')).toBe(preguntaDelDia('2026-07-02'))
    const semana = [...Array(7)].map((_, i) => preguntaDelDia(`2026-07-0${i + 1}`))
    expect(new Set(semana).size).toBeGreaterThan(3) // varias preguntas distintas en la semana
  })
})

describe('buscarRecuerdo', () => {
  const entrada = (diasAtras: number, contenido = 'Un día memorable que quiero recordar'): Entry => ({
    id: uid(),
    fecha: Date.now() - diasAtras * DIA_MS,
    tipo: 'journal',
    contenido,
    areaIds: [],
    personaIds: [],
    tags: [],
    privacidad: 'normal',
  })

  it('prefiere entradas de hace ~un mes', () => {
    const r = buscarRecuerdo([entrada(2), entrada(30), entrada(200)])
    expect(Math.round((Date.now() - r!.fecha) / DIA_MS)).toBe(30)
  })
  it('ignora entradas privadas y recientes', () => {
    const privada = { ...entrada(30), privacidad: 'privada' as const }
    expect(buscarRecuerdo([privada, entrada(3)])).toBeNull()
  })
  it('sin nada viejo devuelve null (usuarios nuevos no ven la tarjeta)', () => {
    expect(buscarRecuerdo([entrada(1)])).toBeNull()
  })
})

describe('misionesDelDia', () => {
  it('elige 2 misiones deterministas y distintas por día', async () => {
    const datos = await cargarDatosMisiones()
    const a = misionesDelDia(datos, '2026-07-02')
    const b = misionesDelDia(datos, '2026-07-02')
    expect(a.map((m) => m.id)).toEqual(b.map((m) => m.id))
    expect(a).toHaveLength(2)
    expect(a[0].id).not.toBe(a[1].id)
  })

  it('rota entre días cuando hay más plantillas aplicables', async () => {
    // con áreas y personas hay 4+ plantillas candidatas
    await db.areas.bulkAdd([
      { id: 'a1', nombre: 'Salud', icono: '💪', color: '#22C55E', visible: true, orden: 0, prompts: [] },
      { id: 'a2', nombre: 'Fe', icono: '🙏', color: '#A855F7', visible: true, orden: 1, prompts: [] },
    ])
    await db.personas.add({
      id: 'p1', nombre: 'Carlos', circulo: 'cercano', loQueImporta: '', preguntarProxima: '',
      frecuenciaDias: 14, areaIds: [], estado: 'activa', silenciarSugerencias: false,
    })
    const datos = await cargarDatosMisiones()
    const ids = new Set<string>()
    for (let d = 1; d <= 9; d++) {
      for (const m of misionesDelDia(datos, `2026-07-0${d}`)) ids.add(m.id)
    }
    expect(ids.size).toBeGreaterThan(2) // no son siempre las mismas dos
  })

  it('detecta la misión de journal como hecha con una entrada de hoy', async () => {
    await db.entries.add({
      id: uid(),
      fecha: Date.now(),
      tipo: 'journal',
      contenido: 'hola',
      areaIds: [],
      personaIds: [],
      tags: [],
      privacidad: 'normal',
    })
    const datos = await cargarDatosMisiones()
    const libre = misionesDelDia(datos, '2026-07-02').find((m) => m.id === 'journal_libre')
    // si la rotación del día la incluye, debe estar hecha
    if (libre) expect(libre.hecha).toBe(true)
    // y construyéndola directo también
    const todas = [...Array(30)].flatMap((_, d) => misionesDelDia(datos, claveDia(Date.now() + d * DIA_MS)))
    const alguna = todas.find((m) => m.id === 'journal_libre')
    expect(alguna?.hecha).toBe(true)
  })
})

describe('evaluarMisiones', () => {
  it('paga una sola vez por misión y día', async () => {
    // completar la misión doble_checkin y journal_libre a la vez
    for (const tipo of ['checkin_manana', 'checkin_noche', 'journal'] as const) {
      await db.entries.add({
        id: uid(),
        fecha: Date.now(),
        tipo,
        contenido: 'x',
        areaIds: [],
        personaIds: [],
        tags: [],
        privacidad: 'normal',
      })
    }
    await db.interacciones.add({ id: uid(), personaId: 'p1', fecha: Date.now(), tipo: 'mensaje', nota: '' })
    await evaluarMisiones()
    const pagos1 = (await db.xpEvents.toArray()).filter((e) => e.fuente === 'mision')
    await evaluarMisiones()
    const pagos2 = (await db.xpEvents.toArray()).filter((e) => e.fuente === 'mision')
    expect(pagos2).toHaveLength(pagos1.length)
    expect(pagos1.length).toBeGreaterThan(0)
    expect(pagos1.every((e) => e.cantidad === 20)).toBe(true)
  })
})
