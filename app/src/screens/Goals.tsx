import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Meta } from '../db/types'
import {
  agregarMilestone,
  alternarMilestone,
  avanzarMeta,
  borrarMilestone,
  crearMeta,
} from '../logic/actions'
import {
  ETIQUETA_PLAN,
  abandonarConAprendizaje,
  diasRestantes,
  estadoPlan,
  progresoEsperado,
  reformularObjetivo,
  replantearFecha,
} from '../logic/goals'
import { Barra, ChipsSelector, Hoja, Vacio, toast } from '../components/ui'
import { fechaCorta, haceTexto } from '../logic/dates'
import type { Nav } from '../App'

function aInputDate(t?: number): string {
  if (!t) return ''
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function deInputDate(v: string): number | undefined {
  if (!v) return undefined
  const [y, m, d] = v.split('-').map(Number)
  return new Date(y, m - 1, d, 23, 59, 59).getTime() // fin del día elegido
}

function BadgePlan({ meta }: { meta: Meta }) {
  const plan = estadoPlan(meta)
  if (meta.estado !== 'activa') return null
  const e = ETIQUETA_PLAN[plan]
  if (plan === 'sin_fecha') return null
  return <span className={`badge ${e.clase}`}>{e.texto}</span>
}

export function Goals({ nav }: { nav: Nav }) {
  const [crearAbierta, setCrearAbierta] = useState(false)
  const [filtro, setFiltro] = useState<Meta['estado']>('activa')
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
        {(
          [
            ['activa', 'Activas'],
            ['completada', 'Completadas'],
            ['abandonada', 'Cerradas con aprendizaje'],
          ] as const
        ).map(([v, t]) => (
          <button key={v} className={`chip ${filtro === v ? 'activo' : ''}`} onClick={() => setFiltro(v)}>
            {t}
          </button>
        ))}
      </div>

      {lista.length === 0 && (
        <Vacio
          icono="🎯"
          texto={
            filtro === 'activa'
              ? 'Tú defines el objetivo. Crea tu primera meta y la app te ayuda a llegar.'
              : filtro === 'completada'
                ? 'Aún no completas metas. ¡Ya llegará!'
                : 'Aquí viven las metas cerradas con su aprendizaje.'
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
          <div className="fila" style={{ marginTop: 8, flexWrap: 'wrap', gap: 6 }}>
            <BadgePlan meta={m} />
            {m.fechaLimite && m.estado === 'activa' && (
              <span className="subtitulo">
                📅 {fechaCorta(m.fechaLimite)}
                {(diasRestantes(m) ?? 0) >= 0 && ` (${diasRestantes(m)} días)`}
              </span>
            )}
            {m.proximoPaso && m.estado === 'activa' && (
              <span className="subtitulo crece" style={{ minWidth: '100%' }}>
                Próximo: {m.proximoPaso}
              </span>
            )}
            {m.estado === 'abandonada' && m.notaAbandono && (
              <span className="subtitulo">💡 {m.notaAbandono.slice(0, 80)}</span>
            )}
          </div>
        </div>
      ))}

      <MetaHoja abierta={crearAbierta} onCerrar={() => setCrearAbierta(false)} />
    </div>
  )
}

/** Crear/editar meta con guía de mejores prácticas (SMART sin decir SMART) */
export function MetaHoja({
  abierta,
  onCerrar,
  existente,
}: {
  abierta: boolean
  onCerrar: () => void
  existente?: Meta
}) {
  const [titulo, setTitulo] = useState(existente?.titulo ?? '')
  const [porque, setPorque] = useState(existente?.porque ?? '')
  const [metrica, setMetrica] = useState(existente?.metrica ?? '')
  const [fecha, setFecha] = useState(aInputDate(existente?.fechaLimite))
  const [proximoPaso, setProximoPaso] = useState(existente?.proximoPaso ?? '')
  const [areaIds, setAreaIds] = useState<string[]>(existente?.areaIds ?? [])
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []

  async function guardar() {
    if (!titulo.trim()) return
    if (existente) {
      await db.metas.update(existente.id, {
        titulo: titulo.trim(),
        porque: porque.trim(),
        metrica: metrica.trim(),
        fechaLimite: deInputDate(fecha),
        proximoPaso: proximoPaso.trim(),
        areaIds,
        actualizado: Date.now(),
      })
    } else {
      await crearMeta({
        titulo: titulo.trim(),
        icono: '🎯',
        porque: porque.trim(),
        metrica: metrica.trim(),
        progreso: 0,
        proximoPaso: proximoPaso.trim(),
        milestones: [],
        fechaLimite: deInputDate(fecha),
        replanteos: [],
        areaIds,
        estado: 'activa',
      })
      setTitulo('')
      setPorque('')
      setMetrica('')
      setFecha('')
      setProximoPaso('')
      setAreaIds([])
    }
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>{existente ? '🎯 Editar meta' : '🎯 Nueva meta'}</h2>
      {!existente && (
        <p className="subtitulo">
          Un buen objetivo es específico, medible y con fecha. El form te guía; solo el título es
          obligatorio.
        </p>
      )}
      <label>¿Qué quieres lograr? (específico)</label>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder='Mejor "Correr 10K en menos de 60 min" que "hacer ejercicio"'
      />
      <label>¿Cómo sabrás que lo lograste? (medible)</label>
      <input
        value={metrica}
        onChange={(e) => setMetrica(e.target.value)}
        placeholder="Cruzar la meta del 10K del 15 de marzo"
      />
      <label>¿Para cuándo? (con fecha el plan te avisa si te atrasas)</label>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <label>¿Por qué es importante para ti? (relevante)</label>
      <textarea
        value={porque}
        onChange={(e) => setPorque(e.target.value)}
        placeholder="Tu porqué es lo que te sostiene cuando cuesta…"
      />
      <label>Primer paso (alcanzable: la acción más pequeña posible)</label>
      <input
        value={proximoPaso}
        onChange={(e) => setProximoPaso(e.target.value)}
        placeholder="Salir a trotar 15 min mañana"
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
        {existente ? 'Guardar cambios' : 'Crear meta'}
      </button>
    </Hoja>
  )
}

export function GoalDetail({ nav, id }: { nav: Nav; id: string }) {
  const meta = useLiveQuery(() => db.metas.get(id), [id])
  const [paso, setPaso] = useState<string | null>(null)
  const [nuevoMilestone, setNuevoMilestone] = useState('')
  const [editAbierta, setEditAbierta] = useState(false)
  const [evaluacion, setEvaluacion] = useState<'fecha' | 'objetivo' | 'abandonar' | null>(null)

  if (!meta) return null
  const plan = estadoPlan(meta)
  const esperado = progresoEsperado(meta)
  const dias = diasRestantes(meta)

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
        <button className="link" onClick={() => setEditAbierta(true)}>
          Editar
        </button>
      </div>

      {plan === 'vencida' && (
        <div className="tarjeta" style={{ borderColor: 'var(--warning)', background: 'var(--warning-light)' }}>
          <b>⏰ Esta meta venció con {meta.progreso}%</b>
          <p className="subtitulo" style={{ margin: '6px 0 12px' }}>
            No pasa nada — pero una meta vencida sin evaluar no sirve. Elige qué aprendiste:
          </p>
          <div className="chips">
            <button className="btn btn-primario btn-mini" onClick={() => setEvaluacion('fecha')}>
              📅 La fecha era irreal → replantear fecha
            </button>
            <button className="btn btn-secundario btn-mini" onClick={() => setEvaluacion('objetivo')}>
              🔄 El objetivo cambió → reformularlo
            </button>
            <button className="btn btn-fantasma btn-mini" onClick={() => setEvaluacion('abandonar')}>
              🕊️ Ya no va → cerrar con aprendizaje
            </button>
          </div>
        </div>
      )}

      <div className="tarjeta">
        <div className="fila" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
          <b className="crece">Progreso</b>
          <BadgePlan meta={meta} />
          <span className="badge badge-nivel">{meta.progreso}%</span>
        </div>
        <Barra fraccion={meta.progreso / 100} color="var(--secondary)" />
        {esperado !== null && meta.estado === 'activa' && plan !== 'vencida' && (
          <>
            <div style={{ marginTop: 6 }}>
              <Barra fraccion={esperado / 100} color="var(--gray-300)" />
            </div>
            <div className="subtitulo" style={{ marginTop: 6 }}>
              Plan: ~{esperado}% a hoy (gris) · quedan {dias} días para el{' '}
              {fechaCorta(meta.fechaLimite!)}
            </div>
          </>
        )}
        {meta.estado === 'activa' && (
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
        )}
        <div className="subtitulo" style={{ marginTop: 8 }}>
          Última actualización: {haceTexto(meta.actualizado)}
        </div>
      </div>

      {(meta.porque || meta.metrica) && (
        <div className="tarjeta">
          {meta.porque && (
            <>
              <div className="seccion-titulo">Por qué importa</div>
              <p style={{ marginBottom: meta.metrica ? 10 : 0 }}>{meta.porque}</p>
            </>
          )}
          {meta.metrica && (
            <>
              <div className="seccion-titulo">Sabré que lo logré cuando…</div>
              <p>{meta.metrica}</p>
            </>
          )}
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

      {(meta.replanteos ?? []).length > 0 && (
        <div className="tarjeta">
          <div className="seccion-titulo">Historial de replanteos</div>
          {(meta.replanteos ?? []).map((r) => (
            <div key={r.id} style={{ padding: '4px 0' }}>
              <span className="subtitulo">{fechaCorta(r.fecha)} · </span>
              {r.tipo === 'fecha'
                ? `📅 Fecha movida${r.fechaNueva ? ` al ${fechaCorta(r.fechaNueva)}` : ''}`
                : '🔄 Objetivo reformulado'}
              {r.nota && <div className="subtitulo" style={{ fontStyle: 'italic' }}>“{r.nota}”</div>}
            </div>
          ))}
        </div>
      )}

      {meta.estado === 'abandonada' && (
        <div className="tarjeta" style={{ background: 'var(--primary-surface)' }}>
          <div className="seccion-titulo">Cerrada con aprendizaje</div>
          <p style={{ fontStyle: 'italic' }}>“{meta.notaAbandono || 'Sin nota'}”</p>
        </div>
      )}

      {meta.estado === 'activa' && (
        <div className="fila">
          <button
            className="btn btn-secundario crece"
            onClick={() => avanzarMeta(meta, { progreso: 100, estado: 'completada' })}
          >
            ✓ Completar
          </button>
          <button className="btn btn-fantasma" onClick={() => setEvaluacion('abandonar')}>
            Cerrar
          </button>
        </div>
      )}
      {meta.estado === 'completada' && (
        <div className="tarjeta" style={{ background: 'var(--success-light)', textAlign: 'center' }}>
          🏆 ¡Meta completada!
        </div>
      )}

      {editAbierta && <MetaHoja abierta={true} existente={meta} onCerrar={() => setEditAbierta(false)} />}
      {evaluacion && (
        <EvaluacionHoja meta={meta} modo={evaluacion} onCerrar={() => setEvaluacion(null)} />
      )}
    </div>
  )
}

/** Panel de evaluación: replantear fecha, reformular objetivo o cerrar con aprendizaje */
function EvaluacionHoja({
  meta,
  modo,
  onCerrar,
}: {
  meta: Meta
  modo: 'fecha' | 'objetivo' | 'abandonar'
  onCerrar: () => void
}) {
  const [fecha, setFecha] = useState('')
  const [titulo, setTitulo] = useState(meta.titulo)
  const [metrica, setMetrica] = useState(meta.metrica)
  const [nota, setNota] = useState('')

  async function confirmar() {
    if (modo === 'fecha') {
      const f = deInputDate(fecha)
      if (!f) return
      await replantearFecha(meta, f, nota)
      toast('Fecha replanteada 📅 — plan recalculado')
    } else if (modo === 'objetivo') {
      await reformularObjetivo(
        meta,
        { titulo: titulo.trim() || meta.titulo, metrica: metrica.trim(), fechaLimite: deInputDate(fecha) ?? meta.fechaLimite },
        nota,
      )
      toast('Objetivo reformulado 🔄')
    } else {
      if (!nota.trim()) return
      await abandonarConAprendizaje(meta, nota)
      toast('Meta cerrada con aprendizaje 🕊️')
    }
    onCerrar()
  }

  return (
    <Hoja abierta={true} onCerrar={onCerrar}>
      {modo === 'fecha' && (
        <>
          <h2>📅 Replantear la fecha</h2>
          <p className="subtitulo">
            Las fechas irreales matan metas buenas. Elige una alcanzable: el plan de seguimiento se
            recalcula desde hoy.
          </p>
          <label>Nueva fecha límite</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <label>¿Por qué no alcanzó el tiempo? (tu aprendizaje)</label>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Subestimé X, surgió Y…" />
          <button
            className="btn btn-primario btn-bloque"
            style={{ marginTop: 20 }}
            disabled={!fecha}
            onClick={confirmar}
          >
            Replantear fecha
          </button>
        </>
      )}
      {modo === 'objetivo' && (
        <>
          <h2>🔄 Reformular el objetivo</h2>
          <p className="subtitulo">
            A veces el aprendizaje es que el objetivo correcto era otro. Reescríbelo.
          </p>
          <label>Nuevo título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <label>¿Cómo sabrás que lo lograste?</label>
          <input value={metrica} onChange={(e) => setMetrica(e.target.value)} />
          <label>Nueva fecha (opcional)</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <label>¿Qué aprendiste que te hizo cambiarlo?</label>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Me di cuenta de que…" />
          <button className="btn btn-primario btn-bloque" style={{ marginTop: 20 }} onClick={confirmar}>
            Reformular objetivo
          </button>
        </>
      )}
      {modo === 'abandonar' && (
        <>
          <h2>🕊️ Cerrar con aprendizaje</h2>
          <p className="subtitulo">
            Abandonar bien también es ganar: suelta la meta, quédate con la lección. Nada se borra.
          </p>
          <label>¿Qué aprendiste de esta meta?</label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="No era el momento, mi prioridad real era…"
          />
          <button
            className="btn btn-primario btn-bloque"
            style={{ marginTop: 20 }}
            disabled={!nota.trim()}
            onClick={confirmar}
          >
            Cerrar meta
          </button>
        </>
      )}
    </Hoja>
  )
}
