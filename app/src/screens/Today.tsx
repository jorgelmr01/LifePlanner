import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Ritmo } from '../db/types'
import { claveDia, DIA_MS, diasDesde, fechaLarga, inicioDia } from '../logic/dates'
import { generarSugerencias, esperadasPorSemana } from '../logic/suggestions'
import { progresoNivel } from '../logic/xp'
import { evaluarLogros } from '../logic/achievements'
import {
  buscarRecuerdo,
  cargarDatosMisiones,
  evaluarMisiones,
  misionesDelDia,
  preguntaDelDia,
  rachaFlexible,
  tituloDeNivel,
  type Mision,
} from '../logic/engagement'
import { notificarSugerencias, pedirPersistencia } from '../logic/notify'
import { marcarRitmoHoy, desmarcarRitmoHoy, crearEntrada } from '../logic/actions'
import { Barra, EscalaEmoji, Hoja } from '../components/ui'
import { EntradaHoja } from './Journal'
import type { Nav } from '../App'

export function Today({ nav }: { nav: Nav }) {
  const [checkinAbierto, setCheckinAbierto] = useState<'manana' | 'noche' | null>(null)
  const [preguntaAbierta, setPreguntaAbierta] = useState(false)

  useEffect(() => {
    pedirPersistencia()
    generarSugerencias()
      .then(() => notificarSugerencias())
      .then(() => evaluarLogros())
      .then(() => evaluarMisiones())
      .catch(() => {})
  }, [])

  // se recalculan en vivo cuando cambian los datos subyacentes
  const misiones: Mision[] =
    useLiveQuery(() => cargarDatosMisiones().then(misionesDelDia)) ?? []

  const ajustes = useLiveQuery(() => db.ajustes.get('main'))
  const ritmos = useLiveQuery(() => db.ritmos.where('estado').equals('activo').toArray()) ?? []
  const logsHoy = useLiveQuery(() => db.ritmoLogs.where('dia').equals(claveDia()).toArray()) ?? []
  const logsSemana =
    useLiveQuery(() => db.ritmoLogs.where('fecha').aboveOrEqual(inicioDia() - 6 * DIA_MS).toArray()) ?? []
  const sugerencias =
    useLiveQuery(() => db.sugerencias.where('estado').equals('pendiente').toArray()) ?? []
  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []
  const interacciones = useLiveQuery(() => db.interacciones.toArray()) ?? []
  const xpEventos = useLiveQuery(() => db.xpEvents.toArray()) ?? []
  const entradasRecientes =
    useLiveQuery(() =>
      db.entries.where('fecha').aboveOrEqual(inicioDia() - 6 * DIA_MS).toArray(),
    ) ?? []

  const xpTotal = xpEventos.reduce((s, e) => s + e.cantidad, 0)
  const nivel = progresoNivel(xpTotal)
  const racha = rachaFlexible(xpEventos)
  const titulo = tituloDeNivel(nivel.nivel)
  const pregunta = preguntaDelDia()
  const preguntaRespondida = entradasRecientes.some(
    (e) => e.fecha >= inicioDia() && e.tipo === 'journal' && e.tags.includes('pregunta-del-dia'),
  )
  const todasEntradas = useLiveQuery(() => db.entries.toArray()) ?? []
  const recuerdo = buscarRecuerdo(todasEntradas)

  const hechoHoy = new Set(logsHoy.map((l) => l.ritmoId))
  const hoy = new Date().getDay()
  const hora = new Date().getHours()
  const ritmosHoy = ritmos.filter(
    (r) => r.frecuencia === 'diario' || (r.frecuencia === 'personalizado' && r.diasSemana.includes(hoy)),
  )
  const ritmosSemana = ritmos.filter((r) => r.frecuencia === 'semanal')

  const checkinsHoy = entradasRecientes.filter((e) => e.fecha >= inicioDia() && e.tipo !== 'journal')
  const mananaHecha = checkinsHoy.some((e) => e.tipo === 'checkin_manana')
  const nocheHecha = checkinsHoy.some((e) => e.tipo === 'checkin_noche')

  // primer día: sin ningún XP registrado aún
  const primerDia = xpEventos.length === 0

  // recordatorio de respaldo: >21 días desde el último export (o desde el primer evento)
  const primerEvento = xpEventos.length ? Math.min(...xpEventos.map((e) => e.fecha)) : Date.now()
  const refRespaldo = ajustes?.ultimoRespaldo ?? primerEvento
  const pedirRespaldo = xpEventos.length > 0 && diasDesde(refRespaldo) > 21

  // revisión semanal: domingos, si no hay reflexión reciente
  const revisionHecha = entradasRecientes.some(
    (e) => e.tags.includes('revisión') && e.fecha >= inicioDia() - 2 * DIA_MS,
  )
  const esDomingo = hoy === 0

  // personas con contacto vencido
  const ultimaPorPersona = new Map<string, number>()
  for (const i of interacciones) {
    ultimaPorPersona.set(i.personaId, Math.max(ultimaPorPersona.get(i.personaId) ?? 0, i.fecha))
  }
  const atrasadas = personas
    .filter((p) => !p.silenciarSugerencias)
    .map((p) => {
      const ultima = ultimaPorPersona.get(p.id)
      return { p, dias: ultima ? diasDesde(ultima) : null }
    })
    .filter((x) => x.dias !== null && x.dias >= x.p.frecuenciaDias)
    .sort((a, b) => (b.dias ?? 0) - (a.dias ?? 0))
    .slice(0, 2)

  const saludo = hora < 12 ? 'Buenos días' : hora >= 19 ? 'Buenas noches' : 'Buenas tardes'

  function cuentaSemana(r: Ritmo) {
    return logsSemana.filter((l) => l.ritmoId === r.id).length
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <div>
          <h1>
            {saludo}
            {ajustes?.nombre ? `, ${ajustes.nombre}` : ''}
          </h1>
          <div className="subtitulo">{fechaLarga()}</div>
        </div>
        <div className="fila" style={{ gap: 14 }}>
          <button style={{ fontSize: 22 }} onClick={() => nav.abrir({ t: 'copiloto' })} aria-label="Copiloto AI">
            🤖
          </button>
          <button style={{ fontSize: 22 }} onClick={() => nav.abrir({ t: 'ajustes' })} aria-label="Ajustes">
            ⚙️
          </button>
        </div>
      </div>

      {primerDia && (
        <div className="tarjeta" style={{ background: 'var(--primary-surface)', borderColor: 'var(--primary-light)' }}>
          <b>🗺️ Tu primer día de aventura</b>
          <p className="subtitulo" style={{ margin: '6px 0 0' }}>
            Tres formas de ganar tu primer XP: marca un ritmo aquí abajo, haz tu check-in, o escribe
            tu primera entrada en Registro. Cada acción sube el nivel de tus áreas.
          </p>
        </div>
      )}

      {(ajustes?.mostrarNiveles ?? true) && (
        <div className="tarjeta tocable" onClick={() => nav.tab('personaje')}>
          <div className="fila" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 26 }}>🧭</span>
            <div className="crece">
              <b>
                Nivel {nivel.nivel} · {titulo}
              </b>
              <div className="subtitulo">
                {nivel.xp} XP · {nivel.xpSiguienteNivel - nivel.xp} para el nivel {nivel.nivel + 1}
              </div>
            </div>
            {racha > 0 && (
              <span className="badge badge-media" title="Racha flexible: un día de descanso no la rompe">
                🔥 {racha}d
              </span>
            )}
          </div>
          <Barra fraccion={nivel.fraccion} />
        </div>
      )}

      {misiones.length > 0 && (
        <div className="tarjeta">
          <div className="seccion-titulo">
            🎁 Misiones bonus de hoy
            <span>+20 XP c/u</span>
          </div>
          {misiones.map((m) => (
            <div key={m.id} className="fila" style={{ padding: '5px 0' }}>
              <span className={`check ${m.hecha ? 'hecho' : ''}`} style={{ width: 24, height: 24, fontSize: 13 }}>
                {m.hecha ? '✓' : ''}
              </span>
              <span style={{ fontSize: 18 }}>{m.icono}</span>
              <span
                className="crece"
                style={{ fontSize: 14.5, opacity: m.hecha ? 0.6 : 1, textDecoration: m.hecha ? 'line-through' : 'none' }}
              >
                {m.texto}
              </span>
            </div>
          ))}
          <div className="subtitulo" style={{ marginTop: 6 }}>
            Se completan solas con tu actividad. Mañana habrá otras.
          </div>
        </div>
      )}

      {sugerencias.length > 0 && (
        <div className="tarjeta tocable" onClick={() => nav.abrir({ t: 'sugerencias' })}>
          <div className="fila">
            <span style={{ fontSize: 24 }}>💡</span>
            <div className="crece">
              <b>
                {sugerencias.length} sugerencia{sugerencias.length > 1 ? 's' : ''} para re-balancearte
              </b>
              <div className="subtitulo">{sugerencias[0].mensaje}</div>
            </div>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
          </div>
        </div>
      )}

      {esDomingo && !revisionHecha && !primerDia && (
        <div className="tarjeta tocable" onClick={() => nav.abrir({ t: 'revision' })}>
          <div className="fila">
            <span style={{ fontSize: 24 }}>📋</span>
            <div className="crece">
              <b>Es domingo: revisión semanal</b>
              <div className="subtitulo">Tu semana vs la anterior, en 2 minutos</div>
            </div>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
          </div>
        </div>
      )}

      {pedirRespaldo && (
        <div className="tarjeta tocable" onClick={() => nav.abrir({ t: 'ajustes' })}>
          <div className="fila">
            <span style={{ fontSize: 24 }}>💾</span>
            <div className="crece">
              <b>Exporta tu respaldo</b>
              <div className="subtitulo">
                Tus datos viven solo en este dispositivo. Un respaldo JSON toma 5 segundos.
              </div>
            </div>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
          </div>
        </div>
      )}

      {!preguntaRespondida && (
        <div className="tarjeta tocable" onClick={() => setPreguntaAbierta(true)}>
          <div className="fila">
            <span style={{ fontSize: 24 }}>✨</span>
            <div className="crece">
              <b>Pregunta del día</b>
              <div className="subtitulo">{pregunta}</div>
            </div>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
          </div>
        </div>
      )}

      {recuerdo && (
        <div className="tarjeta" style={{ borderColor: 'var(--secondary)', background: 'var(--secondary-surface)' }}>
          <div className="fila" style={{ alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>📸</span>
            <div className="crece">
              <b>{diasDesde(recuerdo.fecha) >= 25 ? 'Hace un mes escribiste' : `Hace ${diasDesde(recuerdo.fecha)} días escribiste`}</b>
              <div className="subtitulo" style={{ marginTop: 4, fontStyle: 'italic' }}>
                “{recuerdo.contenido.length > 140 ? recuerdo.contenido.slice(0, 140) + '…' : recuerdo.contenido}”
              </div>
            </div>
          </div>
        </div>
      )}

      {!mananaHecha && (
        <div className="tarjeta">
          <div className="fila">
            <span style={{ fontSize: 24 }}>☀️</span>
            <div className="crece">
              <b>Check-in de la mañana</b>
              <div className="subtitulo">Ánimo, energía y una intención</div>
            </div>
            <button className="btn btn-secundario btn-mini" onClick={() => setCheckinAbierto('manana')}>
              Hacer
            </button>
          </div>
        </div>
      )}

      {!nocheHecha && hora >= 17 && (
        <div className="tarjeta">
          <div className="fila">
            <span style={{ fontSize: 24 }}>🌙</span>
            <div className="crece">
              <b>Check-in de la noche</b>
              <div className="subtitulo">¿Qué salió bien hoy? ¿Qué agradeces?</div>
            </div>
            <button className="btn btn-secundario btn-mini" onClick={() => setCheckinAbierto('noche')}>
              Hacer
            </button>
          </div>
        </div>
      )}

      <div className="seccion" style={{ marginTop: 24 }}>
        <div className="seccion-titulo">
          Misiones de hoy
          <span className="fila" style={{ gap: 10 }}>
            {ritmosHoy.filter((r) => !hechoHoy.has(r.id)).length > 1 && (
              <a
                className="link"
                onClick={async () => {
                  for (const r of ritmosHoy) if (!hechoHoy.has(r.id)) await marcarRitmoHoy(r)
                }}
              >
                ✓ Marcar todo
              </a>
            )}
            {ritmosHoy.filter((r) => hechoHoy.has(r.id)).length}/{ritmosHoy.length}
          </span>
        </div>
        {ritmosHoy.length === 0 && (
          <div className="subtitulo">No tienes ritmos diarios. Crea uno con el botón +.</div>
        )}
        {ritmosHoy.map((r) => (
          <div
            key={r.id}
            className="tarjeta tocable fila"
            onClick={() => (hechoHoy.has(r.id) ? desmarcarRitmoHoy(r.id) : marcarRitmoHoy(r))}
          >
            <span className={`check ${hechoHoy.has(r.id) ? 'hecho' : ''}`}>
              {hechoHoy.has(r.id) ? '✓' : ''}
            </span>
            <span style={{ fontSize: 20 }}>{r.icono}</span>
            <span
              className="crece"
              style={{
                fontWeight: 600,
                textDecoration: hechoHoy.has(r.id) ? 'line-through' : 'none',
                opacity: hechoHoy.has(r.id) ? 0.55 : 1,
              }}
            >
              {r.nombre}
            </span>
            <button
              aria-label={`Detalle de ${r.nombre}`}
              style={{ color: 'var(--gray-400)', padding: '4px 8px' }}
              onClick={(e) => {
                e.stopPropagation()
                nav.abrir({ t: 'ritmo', id: r.id })
              }}
            >
              ›
            </button>
          </div>
        ))}
      </div>

      {ritmosSemana.length > 0 && (
        <div className="seccion">
          <div className="seccion-titulo">Esta semana</div>
          {ritmosSemana.map((r) => {
            const hechas = cuentaSemana(r)
            const esperadas = esperadasPorSemana(r)
            const completoHoy = hechoHoy.has(r.id)
            return (
              <div key={r.id} className="tarjeta fila">
                <span style={{ fontSize: 20 }}>{r.icono}</span>
                <div
                  className="crece"
                  style={{ cursor: 'pointer' }}
                  onClick={() => nav.abrir({ t: 'ritmo', id: r.id })}
                >
                  <div style={{ fontWeight: 600 }}>{r.nombre}</div>
                  <div style={{ marginTop: 6 }}>
                    <Barra fraccion={hechas / esperadas} color="var(--secondary)" />
                  </div>
                  <div className="subtitulo" style={{ marginTop: 4 }}>
                    {hechas}/{esperadas} esta semana
                  </div>
                </div>
                <button
                  className={`btn btn-mini ${completoHoy ? 'btn-fantasma' : 'btn-secundario'}`}
                  onClick={() => (completoHoy ? desmarcarRitmoHoy(r.id) : marcarRitmoHoy(r))}
                >
                  {completoHoy ? '✓ Hoy' : 'Hecho'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {atrasadas.length > 0 && (
        <div className="seccion">
          <div className="seccion-titulo">Tu gente</div>
          {atrasadas.map(({ p, dias }) => (
            <div key={p.id} className="tarjeta tocable fila" onClick={() => nav.abrir({ t: 'persona', id: p.id })}>
              <span style={{ fontSize: 20 }}>👤</span>
              <div className="crece">
                <b>{p.nombre}</b>
                <div className="subtitulo">
                  {dias} días sin contacto (querías cada {p.frecuenciaDias})
                </div>
              </div>
              <span className="badge badge-baja">⚠️ {dias}d</span>
            </div>
          ))}
        </div>
      )}

      <CheckinHoja
        abierta={checkinAbierto !== null}
        noche={checkinAbierto === 'noche'}
        onCerrar={() => setCheckinAbierto(null)}
      />
      {preguntaAbierta && (
        <EntradaHoja
          abierta={true}
          onCerrar={() => setPreguntaAbierta(false)}
          promptInicial={pregunta}
          tagsExtra={['pregunta-del-dia']}
        />
      )}
    </div>
  )
}

function CheckinHoja({
  abierta,
  noche,
  onCerrar,
}: {
  abierta: boolean
  noche: boolean
  onCerrar: () => void
}) {
  const [mood, setMood] = useState<number>()
  const [energia, setEnergia] = useState<number>()
  const [texto1, setTexto1] = useState('')
  const [texto2, setTexto2] = useState('')

  async function guardar() {
    const partes: string[] = []
    if (noche) {
      if (texto1.trim()) partes.push(`Qué salió bien: ${texto1.trim()}`)
      if (texto2.trim()) partes.push(`Gratitud: ${texto2.trim()}`)
    } else {
      if (texto1.trim()) partes.push(`Intención: ${texto1.trim()}`)
      if (texto2.trim()) partes.push(`Prioridades: ${texto2.trim()}`)
    }
    await crearEntrada({
      fecha: Date.now(),
      tipo: noche ? 'checkin_noche' : 'checkin_manana',
      contenido: partes.join('\n'),
      mood,
      energia,
      areaIds: [],
      personaIds: [],
      tags: ['check-in'],
      privacidad: 'normal',
    })
    setMood(undefined)
    setEnergia(undefined)
    setTexto1('')
    setTexto2('')
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>{noche ? '🌙 Check-in de la noche' : '☀️ Check-in de la mañana'}</h2>
      <label>¿Cómo te sientes?</label>
      <EscalaEmoji valor={mood} onCambio={setMood} />
      <label>¿Cómo está tu energía?</label>
      <div className="escala">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={energia === n ? 'activo' : ''}
            style={{ fontSize: 16, fontWeight: 700 }}
            onClick={() => setEnergia(n)}
            aria-label={`Energía ${n} de 5`}
          >
            ⚡{n}
          </button>
        ))}
      </div>
      <label>{noche ? '¿Qué salió bien hoy?' : 'Intención para hoy'}</label>
      <input value={texto1} onChange={(e) => setTexto1(e.target.value)} placeholder="Escribe aquí…" />
      <label>{noche ? '3 cosas que agradeces' : '¿Qué haría que hoy sea un buen día?'}</label>
      <input value={texto2} onChange={(e) => setTexto2(e.target.value)} placeholder="Opcional" />
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 20 }} onClick={guardar}>
        Guardar check-in
      </button>
    </Hoja>
  )
}
