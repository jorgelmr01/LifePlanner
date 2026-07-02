import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Ritmo } from '../db/types'
import { claveDia, DIA_MS, diasDesde, fechaLarga, inicioDia } from '../logic/dates'
import { generarSugerencias, esperadasPorSemana } from '../logic/suggestions'
import { progresoNivel } from '../logic/xp'
import { marcarRitmoHoy, desmarcarRitmoHoy, crearEntrada } from '../logic/actions'
import { Barra, EscalaEmoji, Hoja } from '../components/ui'
import type { Nav } from '../App'

export function Today({ nav }: { nav: Nav }) {
  const [checkinAbierto, setCheckinAbierto] = useState(false)

  useEffect(() => {
    generarSugerencias()
  }, [])

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
  const checkinsHoy =
    useLiveQuery(() =>
      db.entries
        .where('fecha')
        .aboveOrEqual(inicioDia())
        .and((e) => e.tipo !== 'journal')
        .toArray(),
    ) ?? []

  const xpTotal = xpEventos.reduce((s, e) => s + e.cantidad, 0)
  const nivel = progresoNivel(xpTotal)

  const hechoHoy = new Set(logsHoy.map((l) => l.ritmoId))
  const hoy = new Date().getDay()
  const ritmosHoy = ritmos.filter(
    (r) => r.frecuencia === 'diario' || (r.frecuencia === 'personalizado' && r.diasSemana.includes(hoy)),
  )
  const ritmosSemana = ritmos.filter((r) => r.frecuencia === 'semanal')

  const esNoche = new Date().getHours() >= 18
  const checkinHecho = checkinsHoy.some((e) => e.tipo === (esNoche ? 'checkin_noche' : 'checkin_manana'))

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

  const saludo = new Date().getHours() < 12 ? 'Buenos días' : esNoche ? 'Buenas noches' : 'Buenas tardes'

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
        <button style={{ fontSize: 22 }} onClick={() => nav.abrir({ t: 'ajustes' })} aria-label="Ajustes">
          ⚙️
        </button>
      </div>

      {(ajustes?.mostrarNiveles ?? true) && (
        <div className="tarjeta tocable" onClick={() => nav.tab('personaje')}>
          <div className="fila" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 26 }}>🧭</span>
            <div className="crece">
              <b>Nivel {nivel.nivel}</b>
              <div className="subtitulo">
                {nivel.xp} XP · {nivel.xpSiguienteNivel - nivel.xp} para el nivel {nivel.nivel + 1}
              </div>
            </div>
            <span className="link">Ver personaje →</span>
          </div>
          <Barra fraccion={nivel.fraccion} />
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

      {!checkinHecho && (
        <div className="tarjeta">
          <div className="fila">
            <span style={{ fontSize: 24 }}>{esNoche ? '🌙' : '☀️'}</span>
            <div className="crece">
              <b>Check-in de {esNoche ? 'la noche' : 'la mañana'}</b>
              <div className="subtitulo">30 segundos: ánimo, energía y una intención</div>
            </div>
            <button className="btn btn-secundario btn-mini" onClick={() => setCheckinAbierto(true)}>
              Hacer
            </button>
          </div>
        </div>
      )}

      <div className="seccion" style={{ marginTop: 24 }}>
        <div className="seccion-titulo">
          Misiones de hoy
          <span>
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
                <div className="crece">
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

      <CheckinHoja abierta={checkinAbierto} noche={esNoche} onCerrar={() => setCheckinAbierto(false)} />
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
          >
            {'⚡'.repeat(1)}
            {n}
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
