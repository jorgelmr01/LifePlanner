import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import {
  agregarMilestone,
  alternarMilestone,
  avanzarMeta,
  borrarMilestone,
  crearMeta,
} from '../logic/actions'
import { Barra, ChipsSelector, Hoja, Vacio } from '../components/ui'
import { haceTexto } from '../logic/dates'
import type { Nav } from '../App'

export function Goals({ nav }: { nav: Nav }) {
  const [crearAbierta, setCrearAbierta] = useState(false)
  const [filtro, setFiltro] = useState<'activa' | 'completada'>('activa')
  const metas = useLiveQuery(() => db.metas.toArray()) ?? []
  const lista = metas.filter((m) => m.estado === filtro)

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>🎯 Metas</h1>
        <button className="btn btn-primario btn-mini" onClick={() => setCrearAbierta(true)}>
          + Meta
        </button>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        <button className={`chip ${filtro === 'activa' ? 'activo' : ''}`} onClick={() => setFiltro('activa')}>
          Activas
        </button>
        <button
          className={`chip ${filtro === 'completada' ? 'activo' : ''}`}
          onClick={() => setFiltro('completada')}
        >
          Completadas
        </button>
      </div>

      {lista.length === 0 && (
        <Vacio
          icono="🎯"
          texto={
            filtro === 'activa'
              ? 'Tú defines el objetivo. Crea tu primera meta y la app te ayuda a llegar.'
              : 'Aún no completas metas. ¡Ya llegará!'
          }
        />
      )}

      {lista.map((m) => (
        <div key={m.id} className="tarjeta tocable" onClick={() => nav.abrir({ t: 'meta', id: m.id })}>
          <div className="fila" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>{m.icono}</span>
            <b className="crece">{m.titulo}</b>
            <span className="subtitulo">{m.progreso}%</span>
          </div>
          <Barra fraccion={m.progreso / 100} color="var(--secondary)" />
          {m.proximoPaso && (
            <div className="subtitulo" style={{ marginTop: 6 }}>
              Próximo: {m.proximoPaso}
            </div>
          )}
        </div>
      ))}

      <MetaHoja abierta={crearAbierta} onCerrar={() => setCrearAbierta(false)} />
    </div>
  )
}

export function MetaHoja({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [porque, setPorque] = useState('')
  const [proximoPaso, setProximoPaso] = useState('')
  const [areaIds, setAreaIds] = useState<string[]>([])
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []

  async function guardar() {
    if (!titulo.trim()) return
    await crearMeta({
      titulo: titulo.trim(),
      icono: '🎯',
      porque: porque.trim(),
      metrica: '',
      progreso: 0,
      proximoPaso: proximoPaso.trim(),
      milestones: [],
      areaIds,
      estado: 'activa',
    })
    setTitulo('')
    setPorque('')
    setProximoPaso('')
    setAreaIds([])
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>🎯 Nueva meta</h2>
      <label>¿Qué quieres lograr?</label>
      <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Correr 10K" />
      <label>¿Por qué es importante para ti?</label>
      <textarea value={porque} onChange={(e) => setPorque(e.target.value)} placeholder="Tu porqué…" />
      <label>Primer paso</label>
      <input
        value={proximoPaso}
        onChange={(e) => setProximoPaso(e.target.value)}
        placeholder="La acción más pequeña posible"
      />
      {areas.length > 0 && (
        <>
          <label>Áreas que impulsa</label>
          <ChipsSelector
            items={areas}
            seleccion={areaIds}
            onCambio={setAreaIds}
            etiqueta={(a) => `${a.icono} ${a.nombre}`}
          />
        </>
      )}
      <button
        className="btn btn-primario btn-bloque"
        style={{ marginTop: 20 }}
        disabled={!titulo.trim()}
        onClick={guardar}
      >
        Crear meta
      </button>
    </Hoja>
  )
}

export function GoalDetail({ nav, id }: { nav: Nav; id: string }) {
  const meta = useLiveQuery(() => db.metas.get(id), [id])
  const [paso, setPaso] = useState<string | null>(null)
  const [nuevoMilestone, setNuevoMilestone] = useState('')

  if (!meta) return null

  async function progreso(delta: number) {
    if (!meta) return
    const nuevo = Math.min(100, Math.max(0, meta.progreso + delta))
    await avanzarMeta(meta, { progreso: nuevo, estado: nuevo >= 100 ? 'completada' : meta.estado })
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>
          {meta.icono} {meta.titulo}
        </h1>
        <span style={{ width: 48 }} />
      </div>

      <div className="tarjeta">
        <div className="fila" style={{ marginBottom: 8 }}>
          <b className="crece">Progreso</b>
          <span className="badge badge-nivel">{meta.progreso}%</span>
        </div>
        <Barra fraccion={meta.progreso / 100} color="var(--secondary)" />
        <div className="chips" style={{ marginTop: 12 }}>
          <button className="btn btn-secundario btn-mini" onClick={() => progreso(5)}>
            +5%
          </button>
          <button className="btn btn-secundario btn-mini" onClick={() => progreso(10)}>
            +10%
          </button>
          <button className="btn btn-secundario btn-mini" onClick={() => progreso(25)}>
            +25%
          </button>
          <button className="btn btn-fantasma btn-mini" onClick={() => progreso(-5)}>
            -5%
          </button>
        </div>
        <div className="subtitulo" style={{ marginTop: 8 }}>
          Última actualización: {haceTexto(meta.actualizado)}
        </div>
      </div>

      {meta.porque && (
        <div className="tarjeta">
          <div className="seccion-titulo">Por qué importa</div>
          <p>{meta.porque}</p>
        </div>
      )}

      <div className="tarjeta">
        <div className="seccion-titulo">Milestones</div>
        {(meta.milestones ?? []).length === 0 && (
          <p className="subtitulo" style={{ marginBottom: 8 }}>
            Divide la quest en pasos: cada milestone completado da +25 XP y avanza el progreso.
          </p>
        )}
        {(meta.milestones ?? []).map((m) => (
          <div key={m.id} className="fila" style={{ padding: '6px 0' }}>
            <button
              className={`check ${m.hecho ? 'hecho' : ''}`}
              aria-label={m.hecho ? 'Desmarcar milestone' : 'Completar milestone'}
              onClick={() => alternarMilestone(meta, m.id)}
            >
              {m.hecho ? '✓' : ''}
            </button>
            <span
              className="crece"
              style={{ textDecoration: m.hecho ? 'line-through' : 'none', opacity: m.hecho ? 0.6 : 1 }}
            >
              {m.titulo}
            </span>
            <button
              aria-label="Borrar milestone"
              style={{ color: 'var(--gray-400)' }}
              onClick={() => borrarMilestone(meta, m.id)}
            >
              ✕
            </button>
          </div>
        ))}
        <div className="fila" style={{ marginTop: 8 }}>
          <input
            className="crece"
            value={nuevoMilestone}
            onChange={(e) => setNuevoMilestone(e.target.value)}
            placeholder="Nuevo milestone…"
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && nuevoMilestone.trim()) {
                await agregarMilestone(meta, nuevoMilestone)
                setNuevoMilestone('')
              }
            }}
          />
          <button
            className="btn btn-secundario btn-mini"
            disabled={!nuevoMilestone.trim()}
            onClick={async () => {
              await agregarMilestone(meta, nuevoMilestone)
              setNuevoMilestone('')
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className="tarjeta">
        <div className="seccion-titulo">Próximo paso</div>
        {paso === null ? (
          <div className="fila">
            <span className="crece">{meta.proximoPaso || 'Sin definir'}</span>
            <button className="btn btn-fantasma btn-mini" onClick={() => setPaso(meta.proximoPaso)}>
              Editar
            </button>
          </div>
        ) : (
          <div className="fila">
            <input className="crece" value={paso} onChange={(e) => setPaso(e.target.value)} autoFocus />
            <button
              className="btn btn-primario btn-mini"
              onClick={async () => {
                await db.metas.update(id, { proximoPaso: paso.trim() })
                setPaso(null)
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

      {meta.estado === 'activa' && (
        <div className="fila">
          <button
            className="btn btn-secundario crece"
            onClick={() => avanzarMeta(meta, { progreso: 100, estado: 'completada' })}
          >
            ✓ Completar
          </button>
          <button
            className="btn btn-fantasma"
            onClick={async () => {
              await db.metas.update(id, { estado: 'pausada' })
              nav.volver()
            }}
          >
            Pausar
          </button>
        </div>
      )}
      {meta.estado === 'completada' && (
        <div className="tarjeta" style={{ background: 'var(--success-light)', textAlign: 'center' }}>
          🏆 ¡Meta completada!
        </div>
      )}
    </div>
  )
}
