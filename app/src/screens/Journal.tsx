import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Entry } from '../db/types'
import { claveDia, fechaCorta, horaCorta } from '../logic/dates'
import { actualizarEntrada, borrarEntrada, crearEntrada } from '../logic/actions'
import { ChipsSelector, EscalaEmoji, Hoja, Vacio, toast } from '../components/ui'
import { PROMPTS_JOURNAL } from '../db/seeds'

interface ItemTimeline {
  id: string
  fecha: number
  icono: string
  texto: string
  detalle?: string
  privada?: boolean
  entry?: Entry
}

export function Journal() {
  const [formAbierto, setFormAbierto] = useState(false)
  const [filtroArea, setFiltroArea] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [entrySel, setEntrySel] = useState<Entry | null>(null)

  const entradas = useLiveQuery(() => db.entries.orderBy('fecha').reverse().toArray()) ?? []
  const logs = useLiveQuery(() => db.ritmoLogs.orderBy('fecha').reverse().limit(200).toArray()) ?? []
  const ritmos = useLiveQuery(() => db.ritmos.toArray()) ?? []
  const interacciones =
    useLiveQuery(() => db.interacciones.orderBy('fecha').reverse().limit(200).toArray()) ?? []
  const personas = useLiveQuery(() => db.personas.toArray()) ?? []
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []

  const ritmoPorId = new Map(ritmos.map((r) => [r.id, r]))
  const personaPorId = new Map(personas.map((p) => [p.id, p]))
  const q = busqueda.trim().toLowerCase()

  const items = useMemo(() => {
    const lista: ItemTimeline[] = []
    for (const e of entradas) {
      if (filtroArea && !e.areaIds.includes(filtroArea)) continue
      if (q && !e.contenido.toLowerCase().includes(q)) continue
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
        entry: e,
      })
    }
    if (!filtroArea) {
      for (const l of logs) {
        const r = ritmoPorId.get(l.ritmoId)
        if (q && !(r?.nombre.toLowerCase().includes(q) ?? false)) continue
        lista.push({
          id: `l${l.id}`,
          fecha: l.fecha,
          icono: r?.icono ?? '✓',
          texto: `✓ ${r?.nombre ?? 'Ritmo'}`,
        })
      }
      for (const i of interacciones) {
        const p = personaPorId.get(i.personaId)
        const textoBusq = `${p?.nombre ?? ''} ${i.nota}`.toLowerCase()
        if (q && !textoBusq.includes(q)) continue
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
  }, [entradas, logs, interacciones, filtroArea, q, ritmoPorId, personaPorId])

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
        <div className="fila">
          <button
            style={{ fontSize: 20 }}
            aria-label="Buscar"
            onClick={() => {
              setBuscando(!buscando)
              setBusqueda('')
            }}
          >
            🔍
          </button>
          <button className="btn btn-primario btn-mini" onClick={() => setFormAbierto(true)}>
            + Entrada
          </button>
        </div>
      </div>

      {buscando && (
        <input
          style={{ marginBottom: 12 }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar en tu registro…"
          autoFocus
        />
      )}

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
        <Vacio
          icono="📖"
          texto={q ? `Nada encontrado para "${busqueda}".` : 'Tu historia empieza aquí. Escribe tu primera entrada.'}
        />
      )}

      {grupos.map((g) => (
        <div key={g.dia} className="seccion">
          <div className="seccion-titulo">{g.etiqueta}</div>
          {g.items.map((it) => (
            <div
              key={it.id}
              className={`tarjeta fila ${it.entry ? 'tocable' : ''}`}
              style={{ alignItems: 'flex-start' }}
              onClick={() => it.entry && setEntrySel(it.entry)}
            >
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
      {entrySel && (
        <EntradaHoja abierta={true} existente={entrySel} onCerrar={() => setEntrySel(null)} />
      )}
    </div>
  )
}

/* ---------- Dictado por voz (Web Speech API, donde funciona de verdad) ---------- */
interface Reconocedor {
  start(): void
  stop(): void
  abort?(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error?: string }) => void) | null
  continuous: boolean
  interimResults: boolean
  lang: string
}

function esIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS se reporta como Mac pero tiene pantalla táctil
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function crearReconocedor(): Reconocedor | null {
  // iOS/WebKit expone la API pero no funciona en PWA instalada: se queda
  // "grabando" para siempre y congela la hoja. Ahí el teclado nativo ya
  // trae dictado (🎤), así que ni ofrecemos el botón.
  if (esIOS()) return null
  const w = window as unknown as {
    SpeechRecognition?: new () => Reconocedor
    webkitSpeechRecognition?: new () => Reconocedor
  }
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (!Ctor) return null
  try {
    const r = new Ctor()
    r.continuous = true
    r.interimResults = false
    r.lang = 'es-MX'
    return r
  } catch {
    return null
  }
}

export function EntradaHoja({
  abierta,
  onCerrar,
  existente,
  promptInicial,
  tagsExtra,
}: {
  abierta: boolean
  onCerrar: () => void
  existente?: Entry
  promptInicial?: string
  tagsExtra?: string[]
}) {
  const [contenido, setContenido] = useState(existente?.contenido ?? '')
  const [mood, setMood] = useState<number | undefined>(existente?.mood)
  const [areaIds, setAreaIds] = useState<string[]>(existente?.areaIds ?? [])
  const [personaIds, setPersonaIds] = useState<string[]>(existente?.personaIds ?? [])
  const [privada, setPrivada] = useState(existente?.privacidad === 'privada')
  const [grabando, setGrabando] = useState(false)
  const recRef = useRef<Reconocedor | null>(null)
  const watchdogRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []
  const soportaVoz = useMemo(() => crearReconocedor() !== null, [])

  function apagarDictado() {
    clearTimeout(watchdogRef.current)
    const rec = recRef.current
    recRef.current = null
    try {
      rec?.abort ? rec.abort() : rec?.stop()
    } catch {
      /* ya estaba detenido */
    }
    setGrabando(false)
  }

  useEffect(() => () => apagarDictado(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const prompts = useMemo(() => {
    const deAreas = areas.filter((a) => areaIds.includes(a.id)).flatMap((a) => a.prompts)
    return (deAreas.length ? deAreas : PROMPTS_JOURNAL).slice(0, 3)
  }, [areas, areaIds])

  function alternarVoz() {
    if (grabando) {
      apagarDictado()
      return
    }
    const rec = crearReconocedor()
    if (!rec) return
    let recibioAlgo = false
    rec.onresult = (e) => {
      recibioAlgo = true
      clearTimeout(watchdogRef.current)
      let texto = ''
      for (let i = e.resultIndex; i < e.results.length; i++) texto += e.results[i][0].transcript
      if (texto) setContenido((c) => (c ? c + ' ' : '') + texto.trim())
    }
    rec.onend = () => {
      clearTimeout(watchdogRef.current)
      setGrabando(false)
    }
    rec.onerror = () => {
      apagarDictado()
      toast('No se pudo usar el dictado; usa el 🎤 del teclado')
    }
    try {
      rec.start()
    } catch {
      toast('El dictado no está disponible en este navegador')
      return
    }
    recRef.current = rec
    setGrabando(true)
    // blindaje: si en 8s no llegó nada, apagamos en vez de quedarnos "grabando"
    watchdogRef.current = setTimeout(() => {
      if (!recibioAlgo) {
        apagarDictado()
        toast('El dictado no respondió; usa el 🎤 del teclado')
      }
    }, 8000)
  }

  async function guardar() {
    if (!contenido.trim()) return
    if (existente) {
      await actualizarEntrada(existente.id, {
        contenido: contenido.trim(),
        mood,
        areaIds,
        personaIds,
        privacidad: privada ? 'privada' : 'normal',
      })
    } else {
      await crearEntrada({
        fecha: Date.now(),
        tipo: 'journal',
        contenido: contenido.trim(),
        mood,
        areaIds,
        personaIds,
        tags: tagsExtra ?? [],
        privacidad: privada ? 'privada' : 'normal',
      })
      setContenido('')
      setMood(undefined)
      setAreaIds([])
      setPersonaIds([])
      setPrivada(false)
    }
    recRef.current?.stop()
    onCerrar()
  }

  async function eliminar() {
    if (!existente) return
    await borrarEntrada(existente)
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>{existente ? '📝 Editar entrada' : '📝 Nueva entrada'}</h2>
      <label>{promptInicial ?? '¿Qué quieres registrar?'}</label>
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder={promptInicial ?? prompts.join('  ·  ')}
        autoFocus={!existente}
      />
      {soportaVoz && (
        <button
          type="button"
          className={`btn btn-fantasma btn-mini ${grabando ? 'grabando' : ''}`}
          style={{ marginTop: 8 }}
          onClick={alternarVoz}
        >
          {grabando ? '⏹ Detener dictado' : '🎤 Dictar por voz'}
        </button>
      )}
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
        {existente ? 'Guardar cambios' : 'Guardar entrada'}
      </button>
      {existente && (
        <button className="btn btn-peligro btn-bloque" style={{ marginTop: 8 }} onClick={eliminar}>
          Eliminar entrada
        </button>
      )}
    </Hoja>
  )
}
