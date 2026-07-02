import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, uid } from '../db/db'
import { AREAS_CATALOGO } from '../db/seeds'
import { estadoPorArea } from '../logic/xp'
import { haceTexto } from '../logic/dates'
import { BadgeAtencion, Barra, Hoja, Vacio } from '../components/ui'
import type { Nav } from '../App'

export function Areas({ nav }: { nav: Nav }) {
  const [crearAbierto, setCrearAbierto] = useState(false)
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const visibles = areas.filter((a) => a.visible)
  const estados = useLiveQuery(
    () => estadoPorArea(areas.map((a) => a.id)),
    [areas.map((a) => a.id).join()],
  )
  const ritmos = useLiveQuery(() => db.ritmos.where('estado').equals('activo').toArray()) ?? []
  const metas = useLiveQuery(() => db.metas.where('estado').equals('activa').toArray()) ?? []

  return (
    <div className="pantalla">
      <div className="encabezado">
        <h1>Áreas</h1>
        <button className="btn btn-primario btn-mini" onClick={() => setCrearAbierto(true)}>
          + Área
        </button>
      </div>
      <p className="subtitulo" style={{ marginBottom: 16 }}>
        Los atributos de tu personaje. Suben de nivel con tu actividad real.
      </p>

      {visibles.length === 0 && <Vacio icono="🗺️" texto="Crea tu primera área de vida." />}

      {visibles.map((a) => {
        const e = estados?.get(a.id)
        const nRitmos = ritmos.filter((r) => r.areaIds.includes(a.id)).length
        const nMetas = metas.filter((m) => m.areaIds.includes(a.id)).length
        return (
          <div key={a.id} className="tarjeta tocable" onClick={() => nav.abrir({ t: 'area', id: a.id })}>
            <div className="fila" style={{ marginBottom: e ? 8 : 0 }}>
              <span style={{ fontSize: 24 }}>{a.icono}</span>
              <div className="crece">
                <div className="fila" style={{ gap: 8 }}>
                  <b>{a.nombre}</b>
                  {e && <span className="badge badge-nivel">Nv {e.nivel.nivel}</span>}
                </div>
                <div className="subtitulo">
                  {nRitmos} ritmo{nRitmos !== 1 ? 's' : ''} · {nMetas} meta{nMetas !== 1 ? 's' : ''}
                </div>
              </div>
              {e && <BadgeAtencion nivel={e.atencion} />}
            </div>
            {e && <Barra fraccion={e.nivel.fraccion} color={a.color} />}
          </div>
        )
      })}

      <CrearAreaHoja abierta={crearAbierto} onCerrar={() => setCrearAbierto(false)} orden={areas.length} />
    </div>
  )
}

function CrearAreaHoja({
  abierta,
  onCerrar,
  orden,
}: {
  abierta: boolean
  onCerrar: () => void
  orden: number
}) {
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('🌱')
  const [color, setColor] = useState('#6366F1')
  const ICONOS = ['🌱', '💪', '💼', '👥', '💰', '🙏', '📚', '🎨', '🤝', '❤️', '🏠', '✈️', '🎮', '🎵']

  async function crear() {
    if (!nombre.trim()) return
    await db.areas.add({
      id: uid(),
      nombre: nombre.trim(),
      icono,
      color,
      visible: true,
      orden,
      prompts: [],
    })
    setNombre('')
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>Nueva área</h2>
      <label>Nombre</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Hogar, Viajes…" />
      <label>Icono</label>
      <div className="chips">
        {ICONOS.map((i) => (
          <button key={i} className={`chip ${icono === i ? 'activo' : ''}`} onClick={() => setIcono(i)}>
            {i}
          </button>
        ))}
      </div>
      <label>Color</label>
      <div className="chips">
        {AREAS_CATALOGO.map((c) => (
          <button
            key={c.color}
            className="chip"
            style={{
              background: c.color,
              width: 34,
              height: 34,
              borderRadius: 999,
              border: color === c.color ? '3px solid var(--gray-900)' : 'none',
            }}
            onClick={() => setColor(c.color)}
            aria-label={c.color}
          />
        ))}
      </div>
      <button
        className="btn btn-primario btn-bloque"
        style={{ marginTop: 20 }}
        disabled={!nombre.trim()}
        onClick={crear}
      >
        Crear área
      </button>
    </Hoja>
  )
}

export function AreaDetail({ nav, id }: { nav: Nav; id: string }) {
  const area = useLiveQuery(() => db.areas.get(id), [id])
  const estados = useLiveQuery(() => estadoPorArea([id]), [id])
  const ritmos = useLiveQuery(() => db.ritmos.where('estado').equals('activo').toArray()) ?? []
  const metas = useLiveQuery(() => db.metas.toArray()) ?? []
  const entradas = useLiveQuery(() => db.entries.orderBy('fecha').reverse().limit(300).toArray()) ?? []

  if (!area) return null
  const e = estados?.get(id)
  const misRitmos = ritmos.filter((r) => r.areaIds.includes(id))
  const misMetas = metas.filter((m) => m.areaIds.includes(id) && m.estado === 'activa')
  const misEntradas = entradas.filter((en) => en.areaIds.includes(id)).slice(0, 5)

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Áreas
        </button>
        <h1 style={{ fontSize: 22 }}>
          {area.icono} {area.nombre}
        </h1>
        <span style={{ width: 48 }} />
      </div>

      {e && (
        <div className="tarjeta">
          <div className="fila" style={{ marginBottom: 8 }}>
            <span className="badge badge-nivel">Nivel {e.nivel.nivel}</span>
            <span className="crece" />
            <BadgeAtencion nivel={e.atencion} />
          </div>
          <Barra fraccion={e.nivel.fraccion} color={area.color} />
          <div className="subtitulo" style={{ marginTop: 6 }}>
            {e.xpTotal} XP total · {e.xp14d} XP en los últimos 14 días
          </div>
        </div>
      )}

      <div className="seccion" style={{ marginTop: 20 }}>
        <div className="seccion-titulo">Ritmos</div>
        {misRitmos.length === 0 && <div className="subtitulo">Sin ritmos en esta área.</div>}
        {misRitmos.map((r) => (
          <div key={r.id} className="tarjeta fila">
            <span style={{ fontSize: 20 }}>{r.icono}</span>
            <span className="crece" style={{ fontWeight: 600 }}>
              {r.nombre}
            </span>
            <span className="subtitulo">
              {r.frecuencia === 'diario' ? 'Diario' : `${r.vecesPorSemana}x/sem`}
            </span>
          </div>
        ))}
      </div>

      <div className="seccion">
        <div className="seccion-titulo">Metas</div>
        {misMetas.length === 0 && <div className="subtitulo">Sin metas activas aquí.</div>}
        {misMetas.map((m) => (
          <div key={m.id} className="tarjeta tocable" onClick={() => nav.abrir({ t: 'meta', id: m.id })}>
            <div className="fila" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{m.icono}</span>
              <b className="crece">{m.titulo}</b>
              <span className="subtitulo">{m.progreso}%</span>
            </div>
            <Barra fraccion={m.progreso / 100} color="var(--secondary)" />
          </div>
        ))}
      </div>

      <div className="seccion">
        <div className="seccion-titulo">Entradas recientes</div>
        {misEntradas.length === 0 && <div className="subtitulo">Aún no hay entradas vinculadas.</div>}
        {misEntradas.map((en) => (
          <div key={en.id} className="tarjeta">
            <div className="subtitulo" style={{ marginBottom: 4 }}>
              {haceTexto(en.fecha)}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {en.privacidad === 'privada' ? '🔒 Entrada privada' : en.contenido}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
