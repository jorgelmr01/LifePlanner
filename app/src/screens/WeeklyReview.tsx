// Revisión semanal (pantalla I2 del spec): esta semana vs la anterior + reflexión.

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { DIA_MS, inicioDia } from '../logic/dates'
import { crearEntrada } from '../logic/actions'
import { Vacio } from '../components/ui'
import type { Nav } from '../App'

export function WeeklyReview({ nav }: { nav: Nav }) {
  const [reflexion, setReflexion] = useState('')
  const [guardada, setGuardada] = useState(false)

  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const xp = useLiveQuery(() =>
    db.xpEvents.where('fecha').aboveOrEqual(inicioDia() - 13 * DIA_MS).toArray(),
  ) ?? []
  const logs = useLiveQuery(() =>
    db.ritmoLogs.where('fecha').aboveOrEqual(inicioDia() - 13 * DIA_MS).toArray(),
  ) ?? []
  const inters = useLiveQuery(() =>
    db.interacciones.where('fecha').aboveOrEqual(inicioDia() - 13 * DIA_MS).toArray(),
  ) ?? []
  const checkins = useLiveQuery(() =>
    db.entries
      .where('fecha')
      .aboveOrEqual(inicioDia() - 6 * DIA_MS)
      .and((e) => e.tipo !== 'journal' && e.mood !== undefined)
      .toArray(),
  ) ?? []

  const corteSemana = inicioDia() - 6 * DIA_MS
  const estaSemana = (f: number) => f >= corteSemana

  const visibles = areas.filter((a) => a.visible)
  const porArea = visibles.map((a) => {
    const ahora = xp.filter((e) => e.areaId === a.id && estaSemana(e.fecha)).reduce((s, e) => s + e.cantidad, 0)
    const antes = xp.filter((e) => e.areaId === a.id && !estaSemana(e.fecha)).reduce((s, e) => s + e.cantidad, 0)
    return { a, ahora, antes }
  })
  const maxXp = Math.max(1, ...porArea.flatMap((x) => [x.ahora, x.antes]))

  const ritmosAhora = logs.filter((l) => estaSemana(l.fecha)).length
  const ritmosAntes = logs.length - ritmosAhora
  const gente = new Set(inters.filter((i) => estaSemana(i.fecha)).map((i) => i.personaId)).size
  const moodProm = checkins.length
    ? (checkins.reduce((s, e) => s + (e.mood ?? 0), 0) / checkins.length).toFixed(1)
    : null

  const delta = (ahora: number, antes: number) =>
    ahora > antes ? '↑' : ahora < antes ? '↓' : '→'

  async function guardar() {
    if (!reflexion.trim()) return
    await crearEntrada({
      fecha: Date.now(),
      tipo: 'journal',
      contenido: `Revisión semanal:\n${reflexion.trim()}`,
      areaIds: [],
      personaIds: [],
      tags: ['revisión'],
      privacidad: 'normal',
    })
    setGuardada(true)
  }

  const sinDatos = xp.length === 0 && logs.length === 0

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>📋 Revisión semanal</h1>
        <span style={{ width: 48 }} />
      </div>

      {sinDatos && <Vacio icono="🌱" texto="Aún no hay suficiente actividad. Vuelve en unos días." />}

      {!sinDatos && (
        <>
          <div className="tarjeta">
            <div className="seccion-titulo">XP por área — esta semana vs la anterior</div>
            <div className="comparativa">
              {porArea.map(({ a, ahora, antes }) => (
                <div key={a.id} style={{ display: 'contents' }}>
                  <span>
                    {a.icono} {a.nombre} {delta(ahora, antes)}
                  </span>
                  <div className="barras">
                    <div style={{ width: `${(ahora / maxXp) * 100}%`, background: a.color }} />
                    <div style={{ width: `${(antes / maxXp) * 100}%`, background: 'var(--gray-300)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="subtitulo" style={{ marginTop: 10 }}>
              Barra de color = esta semana · gris = semana anterior
            </div>
          </div>

          <div className="tarjeta">
            <div className="seccion-titulo">Resumen</div>
            <p>
              🔁 Ritmos completados: <b>{ritmosAhora}</b> ({delta(ritmosAhora, ritmosAntes)} vs{' '}
              {ritmosAntes} la semana pasada)
            </p>
            <p>
              👥 Personas contactadas: <b>{gente}</b>
            </p>
            {moodProm && (
              <p>
                😊 Ánimo promedio en check-ins: <b>{moodProm}/5</b>
              </p>
            )}
          </div>

          <div className="tarjeta">
            <div className="seccion-titulo">Reflexión</div>
            {guardada ? (
              <p>✓ Reflexión guardada en tu registro.</p>
            ) : (
              <>
                <textarea
                  value={reflexion}
                  onChange={(e) => setReflexion(e.target.value)}
                  placeholder="¿Qué salió bien esta semana? ¿Qué área merece más atención la próxima?"
                />
                <button
                  className="btn btn-primario btn-bloque"
                  style={{ marginTop: 12 }}
                  disabled={!reflexion.trim()}
                  onClick={guardar}
                >
                  Guardar reflexión (+10 XP)
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
