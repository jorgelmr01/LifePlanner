import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, uid } from '../db/db'
import type { Interaccion, Persona } from '../db/types'
import { diasDesde, diasHastaCumple, fechaCorta, haceTexto } from '../logic/dates'
import { archivarPersona, registrarInteraccion } from '../logic/actions'
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

export const CONTEXTOS_SUGERIDOS = [
  'Familia',
  'Universidad',
  'Trabajo',
  'Iglesia',
  'Infancia',
  'Vecinos',
  'Gym',
  'Viaje',
  'Amigos de amigos',
]

const CONFIANZA_TEXTO = ['', 'Conocido', 'Casual', 'Amigo', 'Cercano', 'Confidente']

function Corazones({ n, tam = 13 }: { n?: number; tam?: number }) {
  if (!n) return null
  return (
    <span style={{ fontSize: tam }} title={`Confianza: ${CONFIANZA_TEXTO[n]}`}>
      {'❤️'.repeat(n)}
      <span style={{ opacity: 0.25 }}>{'❤️'.repeat(5 - n)}</span>
    </span>
  )
}

export function People({ nav }: { nav: Nav }) {
  const [agregarAbierto, setAgregarAbierto] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | Persona['circulo']>('todos')
  const [busqueda, setBusqueda] = useState('')

  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []
  const interacciones = useLiveQuery(() => db.interacciones.toArray()) ?? []

  const ultimaPorPersona = new Map<string, number>()
  for (const i of interacciones) {
    ultimaPorPersona.set(i.personaId, Math.max(ultimaPorPersona.get(i.personaId) ?? 0, i.fecha))
  }

  const q = busqueda.trim().toLowerCase()
  const coincide = (p: Persona) =>
    !q ||
    [p.nombre, p.notas, p.loQueImporta, p.comoConocimos, ...(p.contextos ?? []),
      ...(p.datos ?? []).flatMap((d) => [d.etiqueta, d.valor])]
      .join(' ')
      .toLowerCase()
      .includes(q)

  const filtradas = personas.filter((p) => (filtro === 'todos' || p.circulo === filtro) && coincide(p))
  const conDias = filtradas.map((p) => {
    const ultima = ultimaPorPersona.get(p.id)
    const dias = ultima ? diasDesde(ultima) : null
    return { p, dias, atrasada: dias !== null && dias >= p.frecuenciaDias }
  })
  const atrasadas = conDias.filter((x) => x.atrasada).sort((a, b) => (b.dias ?? 0) - (a.dias ?? 0))
  const alDia = conDias.filter((x) => !x.atrasada).sort((a, b) => (a.dias ?? 999) - (b.dias ?? 999))

  const tarjeta = ({ p, dias, atrasada }: (typeof conDias)[number]) => {
    const cumple = diasHastaCumple(p.cumpleanos)
    return (
      <div key={p.id} className="tarjeta tocable fila" onClick={() => nav.abrir({ t: 'persona', id: p.id })}>
        <span style={{ fontSize: 22 }}>👤</span>
        <div className="crece">
          <div className="fila" style={{ gap: 8 }}>
            <b>{p.nombre}</b>
            <Corazones n={p.confianza} tam={10} />
          </div>
          <div className="subtitulo">
            {dias === null ? 'Sin contactos registrados' : dias === 0 ? 'Contacto hoy' : `Hace ${dias} días`}
            {(p.contextos ?? []).length > 0 && ` · ${p.contextos.slice(0, 2).join(', ')}`}
          </div>
        </div>
        {cumple !== null && cumple <= 30 && (
          <span className="badge badge-media">🎂 {cumple === 0 ? '¡hoy!' : `${cumple}d`}</span>
        )}
        {atrasada && <span className="badge badge-baja">⚠️ {dias}d</span>}
      </div>
    )
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <h1>Personas</h1>
        <button className="btn btn-primario btn-mini" onClick={() => setAgregarAbierto(true)}>
          + Persona
        </button>
      </div>

      <input
        style={{ marginBottom: 12 }}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar por nombre, contexto, notas…"
      />

      <div className="chips" style={{ marginBottom: 16 }}>
        <button className={`chip ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>
          Todos ({personas.length})
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
        <Vacio icono="🤝" texto="Tu memoria externa de relaciones: agrega a quien no quieres olvidar." />
      )}
      {personas.length > 0 && filtradas.length === 0 && (
        <Vacio icono="🔍" texto={`Nada encontrado para "${busqueda}".`} />
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

export function PersonaHoja({
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
  const [confianza, setConfianza] = useState<number | undefined>(existente?.confianza)
  const [contextos, setContextos] = useState<string[]>(existente?.contextos ?? [])
  const [contextoCustom, setContextoCustom] = useState('')
  const [frecuencia, setFrecuencia] = useState(existente?.frecuenciaDias ?? 14)
  const [comoConocimos, setComoConocimos] = useState(existente?.comoConocimos ?? '')
  const [loQueImporta, setLoQueImporta] = useState(existente?.loQueImporta ?? '')
  const [notas, setNotas] = useState(existente?.notas ?? '')
  const [cumple, setCumple] = useState(existente?.cumpleanos ?? '')

  const alternarContexto = (c: string) =>
    setContextos(contextos.includes(c) ? contextos.filter((x) => x !== c) : [...contextos, c])

  async function guardar() {
    if (!nombre.trim()) return
    const base: Persona = {
      id: existente?.id ?? uid(),
      nombre: nombre.trim(),
      circulo,
      confianza,
      contextos,
      comoConocimos: comoConocimos.trim(),
      loQueImporta: loQueImporta.trim(),
      notas: notas.trim(),
      datos: existente?.datos ?? [],
      preguntarProxima: existente?.preguntarProxima ?? '',
      frecuenciaDias: frecuencia,
      cumpleanos: cumple || undefined,
      areaIds: existente?.areaIds ?? [],
      estado: 'activa',
      silenciarSugerencias: existente?.silenciarSugerencias ?? false,
    }
    await db.personas.put(base)
    if (!existente) {
      setNombre('')
      setNotas('')
      setComoConocimos('')
      setContextos([])
      setConfianza(undefined)
    }
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>{existente ? 'Editar persona' : '👋 Nueva persona'}</h2>
      {!existente && (
        <p className="subtitulo">
          Captura lo esencial ahora; podrás completar su ficha cuando quieras.
        </p>
      )}
      <label>Nombre</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" autoFocus={!existente} />

      <label>¿De dónde? (contexto)</label>
      <div className="chips">
        {[...new Set([...CONTEXTOS_SUGERIDOS, ...contextos])].map((c) => (
          <button
            key={c}
            className={`chip ${contextos.includes(c) ? 'activo' : ''}`}
            onClick={() => alternarContexto(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="fila" style={{ marginTop: 8 }}>
        <input
          className="crece"
          value={contextoCustom}
          onChange={(e) => setContextoCustom(e.target.value)}
          placeholder="Otro contexto (ej. Curso de piano)…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && contextoCustom.trim()) {
              alternarContexto(contextoCustom.trim())
              setContextoCustom('')
            }
          }}
        />
        <button
          className="btn btn-secundario btn-mini"
          disabled={!contextoCustom.trim()}
          onClick={() => {
            alternarContexto(contextoCustom.trim())
            setContextoCustom('')
          }}
        >
          +
        </button>
      </div>

      <label>Nivel de confianza</label>
      <div className="chips">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`chip ${confianza === n ? 'activo' : ''}`}
            onClick={() => setConfianza(confianza === n ? undefined : n)}
            title={CONFIANZA_TEXTO[n]}
          >
            {'❤️'.repeat(n)} {CONFIANZA_TEXTO[n]}
          </button>
        ))}
      </div>

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

      <label>¿Cómo se conocieron?</label>
      <input
        value={comoConocimos}
        onChange={(e) => setComoConocimos(e.target.value)}
        placeholder="Compañeros de generación, nos presentó Ana…"
      />

      <label>Lo que le importa</label>
      <input
        value={loQueImporta}
        onChange={(e) => setLoQueImporta(e.target.value)}
        placeholder="Familia, startups, fútbol…"
      />

      <label>Notas (tu memoria externa)</label>
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Su esposa es Ana, tienen 2 hijos, está buscando cambiar de trabajo…"
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
  const [proxima, setProxima] = useState<string | null>(null)
  const [datoEtiqueta, setDatoEtiqueta] = useState('')
  const [datoValor, setDatoValor] = useState('')

  const persona = useLiveQuery(() => db.personas.get(id), [id])
  const historial =
    useLiveQuery(() => db.interacciones.where('personaId').equals(id).reverse().sortBy('fecha'), [id]) ?? []

  if (!persona) return null
  const ultima = historial.length ? historial[0].fecha : null
  const cumple = diasHastaCumple(persona.cumpleanos)

  async function agregarDato() {
    if (!persona || !datoEtiqueta.trim() || !datoValor.trim()) return
    await db.personas.update(id, {
      datos: [...(persona.datos ?? []), { id: uid(), etiqueta: datoEtiqueta.trim(), valor: datoValor.trim() }],
    })
    setDatoEtiqueta('')
    setDatoValor('')
  }

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
        <div className="fila" style={{ flexWrap: 'wrap', gap: 8 }}>
          <Corazones n={persona.confianza} tam={14} />
          {(persona.contextos ?? []).map((c) => (
            <span key={c} className="badge badge-nivel">
              {c}
            </span>
          ))}
          <span className="badge badge-media">{persona.circulo}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          {ultima ? `Último contacto: ${haceTexto(ultima)}` : 'Sin contactos registrados aún'}
          <span className="subtitulo"> · quieres cada {persona.frecuenciaDias} días</span>
        </div>
        {cumple !== null && (
          <div className="subtitulo" style={{ marginTop: 4 }}>
            🎂 Cumpleaños: {persona.cumpleanos} {cumple === 0 ? '— ¡es hoy!' : `(en ${cumple} días)`}
          </div>
        )}
      </div>

      <button className="btn btn-primario btn-bloque" onClick={() => setInterAbierta(true)}>
        Registrar interacción
      </button>

      {(persona.comoConocimos || persona.loQueImporta || persona.notas) && (
        <div className="tarjeta" style={{ marginTop: 12 }}>
          <div className="seccion-titulo">Sobre {persona.nombre}</div>
          {persona.comoConocimos && (
            <p style={{ marginBottom: 8 }}>
              <span className="subtitulo">Cómo se conocieron:</span> {persona.comoConocimos}
            </p>
          )}
          {persona.loQueImporta && (
            <p style={{ marginBottom: 8 }}>
              <span className="subtitulo">Le importa:</span> {persona.loQueImporta}
            </p>
          )}
          {persona.notas && <p style={{ whiteSpace: 'pre-wrap' }}>{persona.notas}</p>}
        </div>
      )}

      <div className="tarjeta" style={{ marginTop: 12 }}>
        <div className="seccion-titulo">Ficha rápida</div>
        {(persona.datos ?? []).length === 0 && (
          <p className="subtitulo" style={{ marginBottom: 8 }}>
            Datos que no quieres cargar en la cabeza: su pareja, sus hijos, su equipo, su café
            favorito…
          </p>
        )}
        {(persona.datos ?? []).map((d) => (
          <div key={d.id} className="fila" style={{ padding: '4px 0' }}>
            <span className="subtitulo" style={{ minWidth: 90 }}>
              {d.etiqueta}
            </span>
            <span className="crece">{d.valor}</span>
            <button
              aria-label={`Borrar dato ${d.etiqueta}`}
              style={{ color: 'var(--gray-400)' }}
              onClick={() =>
                db.personas.update(id, { datos: (persona.datos ?? []).filter((x) => x.id !== d.id) })
              }
            >
              ✕
            </button>
          </div>
        ))}
        <div className="fila" style={{ marginTop: 8 }}>
          <input
            style={{ width: 110 }}
            value={datoEtiqueta}
            onChange={(e) => setDatoEtiqueta(e.target.value)}
            placeholder="Esposa"
          />
          <input
            className="crece"
            value={datoValor}
            onChange={(e) => setDatoValor(e.target.value)}
            placeholder="Ana"
            onKeyDown={(e) => e.key === 'Enter' && agregarDato()}
          />
          <button
            className="btn btn-secundario btn-mini"
            disabled={!datoEtiqueta.trim() || !datoValor.trim()}
            onClick={agregarDato}
          >
            +
          </button>
        </div>
      </div>

      <div className="tarjeta" style={{ marginTop: 12 }}>
        <div className="seccion-titulo">Para la próxima vez</div>
        {proxima === null ? (
          <div className="fila">
            <span className="crece" style={{ whiteSpace: 'pre-wrap' }}>
              {persona.preguntarProxima || (
                <span className="subtitulo">¿Qué quieres preguntarle o contarle?</span>
              )}
            </span>
            <button className="btn btn-fantasma btn-mini" onClick={() => setProxima(persona.preguntarProxima)}>
              Editar
            </button>
          </div>
        ) : (
          <div className="fila">
            <input className="crece" value={proxima} onChange={(e) => setProxima(e.target.value)} autoFocus />
            <button
              className="btn btn-primario btn-mini"
              onClick={async () => {
                await db.personas.update(id, { preguntarProxima: proxima.trim() })
                setProxima(null)
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

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
            await archivarPersona(persona)
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
      {persona.preguntarProxima && (
        <div className="tarjeta" style={{ background: 'var(--primary-surface)', marginTop: 8 }}>
          <span className="subtitulo">Tenías pendiente:</span> {persona.preguntarProxima}
        </div>
      )}
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
