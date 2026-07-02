// Pantalla de Personaje: la vista RPG de tu vida.
// Radar de balance + niveles por área + racha amable (sin culpa).

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { estadoPorArea, progresoNivel } from '../logic/xp'
import { DIA_MS, claveDia, inicioDia } from '../logic/dates'
import { Barra, BadgeAtencion } from '../components/ui'
import { Radar } from '../components/Radar'
import type { Nav } from '../App'

export function Character({ nav }: { nav: Nav }) {
  const ajustes = useLiveQuery(() => db.ajustes.get('main'))
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const visibles = areas.filter((a) => a.visible)
  const estados = useLiveQuery(
    () => estadoPorArea(visibles.map((a) => a.id)),
    [visibles.map((a) => a.id).join()],
  )
  const xpEventos = useLiveQuery(() => db.xpEvents.toArray()) ?? []

  const xpTotal = xpEventos.reduce((s, e) => s + e.cantidad, 0)
  const nivel = progresoNivel(xpTotal)

  // radar: actividad 14d normalizada contra el área más activa
  const valores = new Map<string, number>()
  if (estados) {
    const max = Math.max(1, ...[...estados.values()].map((e) => e.xp14d))
    for (const [id, e] of estados) valores.set(id, e.xp14d / max)
  }

  // días activos de los últimos 7 (algo registrado ese día)
  const diasActivos = new Set(
    xpEventos.filter((e) => e.fecha >= inicioDia() - 6 * DIA_MS).map((e) => e.dia),
  )
  const dias7 = [...Array(7)].map((_, i) => claveDia(inicioDia() - (6 - i) * DIA_MS))

  const masBaja = estados
    ? [...estados.values()].sort((a, b) => a.xp14d - b.xp14d)[0]
    : undefined
  const areaBaja = masBaja ? visibles.find((a) => a.id === masBaja.areaId) : undefined

  return (
    <div className="pantalla">
      <div className="encabezado">
        <h1>Personaje</h1>
        <button className="link" onClick={() => nav.abrir({ t: 'metas' })}>
          🎯 Metas →
        </button>
      </div>

      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>🧭</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
          {ajustes?.nombre ?? 'Aventurero'}
        </h2>
        <div className="subtitulo" style={{ marginBottom: 12 }}>
          Nivel {nivel.nivel} · {nivel.xp} XP
        </div>
        <Barra fraccion={nivel.fraccion} />
        <div className="subtitulo" style={{ marginTop: 6 }}>
          {nivel.xpSiguienteNivel - nivel.xp} XP para el nivel {nivel.nivel + 1}
        </div>
      </div>

      {visibles.length >= 3 && (
        <div className="tarjeta">
          <div className="seccion-titulo">Balance de vida (14 días)</div>
          <Radar areas={visibles} valores={valores} />
          {areaBaja && (masBaja?.xp14d ?? 0) < 20 && (
            <div
              className="subtitulo"
              style={{ textAlign: 'center', marginTop: 4, cursor: 'pointer' }}
              onClick={() => nav.abrir({ t: 'area', id: areaBaja.id })}
            >
              ⚖️ {areaBaja.icono} {areaBaja.nombre} es tu área más descuidada — tócala para verla
            </div>
          )}
        </div>
      )}

      <div className="tarjeta">
        <div className="seccion-titulo">Últimos 7 días</div>
        <div className="heat" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {dias7.map((d) => (
            <div key={d} className={diasActivos.has(d) ? 'on' : ''} title={d} />
          ))}
        </div>
        <div className="subtitulo" style={{ marginTop: 8 }}>
          {diasActivos.size} de 7 días con actividad. La consistencia flexible gana: no se trata de
          rachas perfectas.
        </div>
      </div>

      <div className="seccion">
        <div className="seccion-titulo">Atributos</div>
        {visibles.map((a) => {
          const e = estados?.get(a.id)
          if (!e) return null
          return (
            <div key={a.id} className="tarjeta tocable" onClick={() => nav.abrir({ t: 'area', id: a.id })}>
              <div className="fila" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{a.icono}</span>
                <b className="crece">{a.nombre}</b>
                <span className="badge badge-nivel">Nv {e.nivel.nivel}</span>
                <BadgeAtencion nivel={e.atencion} />
              </div>
              <Barra fraccion={e.nivel.fraccion} color={a.color} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
