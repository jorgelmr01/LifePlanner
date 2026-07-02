import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Entry } from '../db/types'
import { claveDia, fechaCorta, horaCorta } from '../logic/dates'
import { crearEntrada } from '../logic/actions'
import { ChipsSelector, EscalaEmoji, Hoja, Vacio } from '../components/ui'
import { PROMPTS_JOURNAL } from '../db/seeds'

interface ItemTimeline {
  id: string
  fecha: number
  icono: string
  texto: string
  detalle?: string
  privada?: boolean
}

export function Journal() {
  const [formAbierto, setFormAbierto] = useState(false)
  const [filtroArea, setFiltroArea] = useState('')

  const entradas = useLiveQuery(() => db.entries.orderBy('fecha').reverse().toArray()) ?? []
  const logs = useLiveQuery(() => db.ritmoLogs.orderBy('fecha').reverse().limit(200).toArray()) ?? []
  const ritmos = useLiveQuery(() => db.ritmos.toArray()) ?? []
  const interacciones =
    useLiveQuery(() => db.interacciones.orderBy('fecha').reverse().limit(200).toArray()) ?? []
  const personas = useLiveQuery(() => db.personas.toArray()) ?? []
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []

  const ritmoPorId = new Map(ritmos.map((r) => [r.id, r]))
  const personaPorId = new Map(personas.map((p) => [p.id, p]))

  const items = useMemo(() => {
    const lista: ItemTimeline[] = []
    for (const e of entradas) {
      if (filtroArea && !e.areaIds.includes(filtroArea)) continue
      const icono = e.tipo === 'journal' ? '📝' : e.tipo === 'checkin_manana' ? '☀️' : '🌙'
      lista.push({
        id: `e${e.id}`,
        fecha: e.fecha,
        icono,
        texto:
          e.tipo === 'journal'
            ? e.contenido
            : `Check-in de ${e.tipo === 'checkin_manana' ? 'la mañana' : 'la noche'}`,
        detalle: e.tipo !== 'journal' ? e.contenido : undefined,
        privada: e.privacidad === 'privada',
      })
    }
    if (!filtroArea) {
      for (const l of logs) {
        const r = ritmoPorId.get(l.ritmoId)
        lista.push({
          id: `l${l.id}`,
          fecha: l.fecha,
          icono: r?.icono ?? '✓',
          texto: `✓ ${r?.nombre ?? 'Ritmo'}`,
        })
      }
      for (const i of interacciones) {
        const p = personaPorId.get(i.personaId)
        lista.push({
          id: `i${i.id}`,
          fecha: i.fecha,
          icono: '👤',
          texto: `Contacto con ${p?.nombre ?? 'alguien'}`,
          detalle: i.nota || undefined,
        })
      }
    }
    return lista.sort((a, b) => b.fecha - a.fecha)
  }, [entradas, logs, interacciones, filtroArea, ritmoPorId, personaPorId])

  // agrupar por día
  const grupos: { dia: string; etiqueta: string; items: ItemTimeline[] }[] = []
  for (const it of items) {
    const dia = claveDia(it.fecha)
    let g = grupos[grupos.length - 1]
    if (!g || g.dia !== dia) {
      const hoy = claveDia()
      const ayer = claveDia(Date.now() - 86400000)
      g = {
        dia,
        etiqueta: dia === hoy ? 'Hoy' : dia === ayer ? 'Ayer' : fechaCorta(it.fecha),
        items: [],
      }
      grupos.push(g)
    }
    g.items.push(it)
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <h1>Registro</h1>
        <button className="btn btn-primario btn-mini" onClick={() => setFormAbierto(true)}>
          + Entrada
        </button>
      </div>

      {areas.length > 0 && (
        <div className="chips" style={{ marginBottom: 16 }}>
          <button className={`chip ${!filtroArea ? 'activo' : ''}`} onClick={() => setFiltroArea('')}>
            Todo
          </button>
          {areas.map((a) => (
            <button
              key={a.id}
              className={`chip ${filtroArea === a.id ? 'activo' : ''}`}
              onClick={() => setFiltroArea(filtroArea === a.id ? '' : a.id)}
            >
              {a.icono} {a.nombre}
            </button>
          ))}
        </div>
      )}

      {grupos.length === 0 && (
        <Vacio icono="📖" texto="Tu historia empieza aquí. Escribe tu primera entrada." />
      )}

      {grupos.map((g) => (
        <div key={g.dia} className="seccion">
          <div className="seccion-titulo">{g.etiqueta}</div>
          {g.items.map((it) => (
            <div key={it.id} className="tarjeta fila" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18 }}>{it.icono}</span>
              <div className="crece">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {it.privada ? '🔒 Entrada privada' : it.texto}
                </div>
                {it.detalle && !it.privada && (
                  <div className="subtitulo" style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>
                    {it.detalle}
                  </div>
                )}
              </div>
              <span className="subtitulo">{horaCorta(it.fecha)}</span>
            </div>
          ))}
        </div>
      ))}

      <EntradaHoja abierta={formAbierto} onCerrar={() => setFormAbierto(false)} />
    </div>
  )
}

export function EntradaHoja({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const [contenido, setContenido] = useState('')
  const [mood, setMood] = useState<number>()
  const [areaIds, setAreaIds] = useState<string[]>([])
  const [personaIds, setPersonaIds] = useState<string[]>([])
  const [privada, setPrivada] = useState(false)

  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []

  const prompts = useMemo(() => {
    const deAreas = areas.filter((a) => areaIds.includes(a.id)).flatMap((a) => a.prompts)
    return (deAreas.length ? deAreas : PROMPTS_JOURNAL).slice(0, 3)
  }, [areas, areaIds])

  async function guardar() {
    if (!contenido.trim()) return
    const datos: Omit<Entry, 'id'> = {
      fecha: Date.now(),
      tipo: 'journal',
      contenido: contenido.trim(),
      mood,
      areaIds,
      personaIds,
      tags: [],
      privacidad: privada ? 'privada' : 'normal',
    }
    await crearEntrada(datos)
    setContenido('')
    setMood(undefined)
    setAreaIds([])
    setPersonaIds([])
    setPrivada(false)
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>📝 Nueva entrada</h2>
      <label>¿Qué quieres registrar?</label>
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder={prompts.join('  ·  ')}
        autoFocus
      />
      <label>¿Cómo te sientes? (opcional)</label>
      <EscalaEmoji valor={mood} onCambio={(v) => setMood(v === mood ? undefined : v)} />
      {areas.length > 0 && (
        <>
          <label>Áreas</label>
          <ChipsSelector
            items={areas}
            seleccion={areaIds}
            onCambio={setAreaIds}
            etiqueta={(a) => `${a.icono} ${a.nombre}`}
          />
        </>
      )}
      {personas.length > 0 && (
        <>
          <label>Personas mencionadas</label>
          <ChipsSelector
            items={personas}
            seleccion={personaIds}
            onCambio={setPersonaIds}
            etiqueta={(p) => `👤 ${p.nombre}`}
          />
        </>
      )}
      <label>Privacidad</label>
      <button
        type="button"
        className={`chip ${privada ? 'activo' : ''}`}
        onClick={() => setPrivada(!privada)}
      >
        🔒 Privada (oculta en el timeline)
      </button>
      <button
        className="btn btn-primario btn-bloque"
        style={{ marginTop: 20 }}
        disabled={!contenido.trim()}
        onClick={guardar}
      >
        Guardar entrada
      </button>
    </Hoja>
  )
}
