import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, uid } from '../db/db'
import type { Interaccion, Persona } from '../db/types'
import { diasDesde, fechaCorta, haceTexto } from '../logic/dates'
import { registrarInteraccion } from '../logic/actions'
import { EscalaEmoji, Hoja, Vacio } from '../components/ui'
import type { Nav } from '../App'

const FRECUENCIAS = [
  { dias: 7, texto: 'Cada semana' },
  { dias: 14, texto: 'Cada 2 semanas' },
  { dias: 30, texto: 'Cada mes' },
  { dias: 90, texto: 'Cada 3 meses' },
]

const CIRCULOS: { valor: Persona['circulo']; texto: string }[] = [
  { valor: 'cercano', texto: 'Cercano' },
  { valor: 'familia', texto: 'Familia' },
  { valor: 'trabajo', texto: 'Trabajo' },
  { valor: 'conocido', texto: 'Conocido' },
]

export function People({ nav }: { nav: Nav }) {
  const [agregarAbierto, setAgregarAbierto] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | Persona['circulo']>('todos')

  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []
  const interacciones = useLiveQuery(() => db.interacciones.toArray()) ?? []

  const ultimaPorPersona = new Map<string, number>()
  for (const i of interacciones) {
    ultimaPorPersona.set(i.personaId, Math.max(ultimaPorPersona.get(i.personaId) ?? 0, i.fecha))
  }

  const filtradas = personas.filter((p) => filtro === 'todos' || p.circulo === filtro)
  const conDias = filtradas.map((p) => {
    const ultima = ultimaPorPersona.get(p.id)
    const dias = ultima ? diasDesde(ultima) : null
    return { p, dias, atrasada: dias !== null && dias >= p.frecuenciaDias }
  })
  const atrasadas = conDias.filter((x) => x.atrasada).sort((a, b) => (b.dias ?? 0) - (a.dias ?? 0))
  const alDia = conDias.filter((x) => !x.atrasada).sort((a, b) => (a.dias ?? 999) - (b.dias ?? 999))

  const tarjeta = ({ p, dias, atrasada }: (typeof conDias)[number]) => (
    <div key={p.id} className="tarjeta tocable fila" onClick={() => nav.abrir({ t: 'persona', id: p.id })}>
      <span style={{ fontSize: 22 }}>👤</span>
      <div className="crece">
        <b>{p.nombre}</b>
        <div className="subtitulo">
          {dias === null ? 'Sin contactos registrados' : dias === 0 ? 'Contacto hoy' : `Hace ${dias} días`}
          {' · '}quieres cada {p.frecuenciaDias}d
        </div>
      </div>
      {atrasada && <span className="badge badge-baja">⚠️ {dias}d</span>}
    </div>
  )

  return (
    <div className="pantalla">
      <div className="encabezado">
        <h1>Personas</h1>
        <button className="btn btn-primario btn-mini" onClick={() => setAgregarAbierto(true)}>
          + Persona
        </button>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        <button className={`chip ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>
          Todos
        </button>
        {CIRCULOS.map((c) => (
          <button
            key={c.valor}
            className={`chip ${filtro === c.valor ? 'activo' : ''}`}
            onClick={() => setFiltro(c.valor)}
          >
            {c.texto}
          </button>
        ))}
      </div>

      {personas.length === 0 && (
        <Vacio icono="🤝" texto="Agrega a la gente con la que quieres mantener contacto." />
      )}

      {atrasadas.length > 0 && (
        <div className="seccion">
          <div className="seccion-titulo">Necesitan atención</div>
          {atrasadas.map(tarjeta)}
        </div>
      )}
      {alDia.length > 0 && (
        <div className="seccion">
          <div className="seccion-titulo">Al día</div>
          {alDia.map(tarjeta)}
        </div>
      )}

      <PersonaHoja abierta={agregarAbierto} onCerrar={() => setAgregarAbierto(false)} />
    </div>
  )
}

function PersonaHoja({
  abierta,
  onCerrar,
  existente,
}: {
  abierta: boolean
  onCerrar: () => void
  existente?: Persona
}) {
  const [nombre, setNombre] = useState(existente?.nombre ?? '')
  const [circulo, setCirculo] = useState<Persona['circulo']>(existente?.circulo ?? 'cercano')
  const [frecuencia, setFrecuencia] = useState(existente?.frecuenciaDias ?? 14)
  const [loQueImporta, setLoQueImporta] = useState(existente?.loQueImporta ?? '')
  const [cumple, setCumple] = useState(existente?.cumpleanos ?? '')

  async function guardar() {
    if (!nombre.trim()) return
    const base: Persona = {
      id: existente?.id ?? uid(),
      nombre: nombre.trim(),
      circulo,
      loQueImporta: loQueImporta.trim(),
      preguntarProxima: existente?.preguntarProxima ?? '',
      frecuenciaDias: frecuencia,
      cumpleanos: cumple || undefined,
      areaIds: existente?.areaIds ?? [],
      estado: 'activa',
      silenciarSugerencias: existente?.silenciarSugerencias ?? false,
    }
    await db.personas.put(base)
    if (!existente) setNombre('')
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>{existente ? 'Editar persona' : 'Nueva persona'}</h2>
      <label>Nombre</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <label>Círculo</label>
      <div className="chips">
        {CIRCULOS.map((c) => (
          <button
            key={c.valor}
            className={`chip ${circulo === c.valor ? 'activo' : ''}`}
            onClick={() => setCirculo(c.valor)}
          >
            {c.texto}
          </button>
        ))}
      </div>
      <label>¿Cada cuánto quieres contacto?</label>
      <div className="chips">
        {FRECUENCIAS.map((f) => (
          <button
            key={f.dias}
            className={`chip ${frecuencia === f.dias ? 'activo' : ''}`}
            onClick={() => setFrecuencia(f.dias)}
          >
            {f.texto}
          </button>
        ))}
      </div>
      <label>Lo que le importa (opcional)</label>
      <input
        value={loQueImporta}
        onChange={(e) => setLoQueImporta(e.target.value)}
        placeholder="Familia, startups, fútbol…"
      />
      <label>Cumpleaños (opcional)</label>
      <input
        type="text"
        value={cumple}
        onChange={(e) => setCumple(e.target.value)}
        placeholder="MM-DD, ej. 03-15"
        pattern="\d{2}-\d{2}"
      />
      <button
        className="btn btn-primario btn-bloque"
        style={{ marginTop: 20 }}
        disabled={!nombre.trim()}
        onClick={guardar}
      >
        Guardar
      </button>
    </Hoja>
  )
}

export function PersonDetail({ nav, id }: { nav: Nav; id: string }) {
  const [interAbierta, setInterAbierta] = useState(false)
  const [editAbierta, setEditAbierta] = useState(false)

  const persona = useLiveQuery(() => db.personas.get(id), [id])
  const historial =
    useLiveQuery(() => db.interacciones.where('personaId').equals(id).reverse().sortBy('fecha'), [id]) ?? []

  if (!persona) return null
  const ultima = historial.length ? historial[0].fecha : null

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>👤 {persona.nombre}</h1>
        <button className="link" onClick={() => setEditAbierta(true)}>
          Editar
        </button>
      </div>

      <div className="tarjeta">
        <div className="subtitulo">
          Círculo: {persona.circulo} · Contacto deseado: cada {persona.frecuenciaDias} días
        </div>
        <div style={{ marginTop: 6 }}>
          {ultima ? `Último contacto: ${haceTexto(ultima)}` : 'Sin contactos registrados aún'}
        </div>
        {persona.loQueImporta && (
          <div className="subtitulo" style={{ marginTop: 6 }}>
            Le importa: {persona.loQueImporta}
          </div>
        )}
        {persona.cumpleanos && (
          <div className="subtitulo" style={{ marginTop: 4 }}>
            🎂 Cumpleaños: {persona.cumpleanos}
          </div>
        )}
      </div>

      <button className="btn btn-primario btn-bloque" onClick={() => setInterAbierta(true)}>
        Registrar interacción
      </button>

      <div className="seccion" style={{ marginTop: 24 }}>
        <div className="seccion-titulo">Historial</div>
        {historial.length === 0 && <div className="subtitulo">Aquí aparecerán sus contactos.</div>}
        {historial.map((i) => (
          <div key={i.id} className="tarjeta">
            <div className="fila">
              <b className="crece">
                {
                  { llamada: '📞 Llamada', mensaje: '💬 Mensaje', en_persona: '☕ En persona', evento: '🎉 Evento', otro: 'Otro' }[
                    i.tipo
                  ]
                }
              </b>
              <span className="subtitulo">{fechaCorta(i.fecha)}</span>
            </div>
            {i.nota && (
              <div className="subtitulo" style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>
                {i.nota}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fila" style={{ marginTop: 8 }}>
        <button
          className="btn btn-fantasma btn-mini crece"
          onClick={() =>
            db.personas.update(id, { silenciarSugerencias: !persona.silenciarSugerencias })
          }
        >
          {persona.silenciarSugerencias ? '🔔 Reactivar sugerencias' : '🔕 Silenciar sugerencias'}
        </button>
        <button
          className="btn btn-peligro btn-mini"
          onClick={async () => {
            await db.personas.update(id, { estado: 'archivada' })
            nav.volver()
          }}
        >
          Archivar
        </button>
      </div>

      <InteraccionHoja
        abierta={interAbierta}
        persona={persona}
        onCerrar={() => setInterAbierta(false)}
      />
      {editAbierta && (
        <PersonaHoja abierta={editAbierta} existente={persona} onCerrar={() => setEditAbierta(false)} />
      )}
    </div>
  )
}

export function InteraccionHoja({
  abierta,
  persona,
  onCerrar,
}: {
  abierta: boolean
  persona: Persona
  onCerrar: () => void
}) {
  const [tipo, setTipo] = useState<Interaccion['tipo']>('mensaje')
  const [nota, setNota] = useState('')
  const [calidad, setCalidad] = useState<number>()

  const TIPOS: { valor: Interaccion['tipo']; texto: string }[] = [
    { valor: 'llamada', texto: '📞 Llamada' },
    { valor: 'mensaje', texto: '💬 Mensaje' },
    { valor: 'en_persona', texto: '☕ En persona' },
    { valor: 'evento', texto: '🎉 Evento' },
    { valor: 'otro', texto: 'Otro' },
  ]

  async function guardar() {
    await registrarInteraccion(persona, { fecha: Date.now(), tipo, nota: nota.trim(), calidad })
    setNota('')
    setCalidad(undefined)
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>Interacción con {persona.nombre}</h2>
      <label>Tipo</label>
      <div className="chips">
        {TIPOS.map((t) => (
          <button
            key={t.valor}
            className={`chip ${tipo === t.valor ? 'activo' : ''}`}
            onClick={() => setTipo(t.valor)}
          >
            {t.texto}
          </button>
        ))}
      </div>
      <label>¿De qué hablaron? (opcional)</label>
      <textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Notas del contacto…" />
      <label>¿Cómo fue?</label>
      <EscalaEmoji valor={calidad} onCambio={(v) => setCalidad(v === calidad ? undefined : v)} />
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 20 }} onClick={guardar}>
        Guardar
      </button>
    </Hoja>
  )
}
