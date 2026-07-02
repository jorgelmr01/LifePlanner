import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Sugerencia } from '../db/types'
import {
  completarSugerencia,
  descartarSugerencia,
  posponerSugerencia,
} from '../logic/suggestions'
import { otorgarXp } from '../logic/xp'
import { toast, Vacio } from '../components/ui'
import type { Nav } from '../App'

const ICONO: Record<Sugerencia['tipo'], string> = {
  reconexion: '👤',
  consistencia: '🔁',
  balance: '⚖️',
  cumpleanos: '🎂',
  meta: '🎯',
}

const TITULO: Record<Sugerencia['tipo'], string> = {
  reconexion: 'Reconexión',
  consistencia: 'Consistencia',
  balance: 'Balance',
  cumpleanos: 'Cumpleaños',
  meta: 'Meta estancada',
}

export function Suggestions({ nav }: { nav: Nav }) {
  const pendientes =
    useLiveQuery(() => db.sugerencias.where('estado').equals('pendiente').toArray()) ?? []

  async function hecha(s: Sugerencia) {
    await completarSugerencia(s.id)
    const r = await otorgarXp('sugerencia', s.id, [])
    toast(r.critico ? `💥 ¡CRÍTICO! +${r.total} XP` : `+${r.total} XP ✨ ¡Bien ahí!`)
  }

  function abrirRef(s: Sugerencia) {
    if (s.tipo === 'reconexion' || s.tipo === 'cumpleanos') nav.abrir({ t: 'persona', id: s.refId })
    else if (s.tipo === 'meta') nav.abrir({ t: 'meta', id: s.refId })
    else if (s.tipo === 'balance') nav.abrir({ t: 'area', id: s.refId })
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Hoy
        </button>
        <h1 style={{ fontSize: 22 }}>Sugerencias</h1>
        <span style={{ width: 48 }} />
      </div>
      <p className="subtitulo" style={{ marginBottom: 16 }}>
        Aquí es donde tu copiloto detecta dónde te estás quedando atrás y te propone cómo
        re-balancearte.
      </p>

      {pendientes.length === 0 && (
        <Vacio icono="🌤️" texto="Todo en orden. Nada pendiente por ahora." />
      )}

      {pendientes.map((s) => (
        <div key={s.id} className="tarjeta">
          <div className="fila" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{ICONO[s.tipo]}</span>
            <b className="crece">{TITULO[s.tipo]}</b>
          </div>
          <p style={{ marginBottom: 6 }}>{s.mensaje}</p>
          <p className="subtitulo" style={{ marginBottom: 12 }}>
            {s.razon}
          </p>
          <div className="chips">
            <button className="btn btn-primario btn-mini" onClick={() => abrirRef(s)}>
              Ir
            </button>
            <button className="btn btn-secundario btn-mini" onClick={() => hecha(s)}>
              ✓ Hecho
            </button>
            <button className="btn btn-fantasma btn-mini" onClick={() => posponerSugerencia(s.id, 7)}>
              Posponer 1 sem
            </button>
            <button className="btn btn-fantasma btn-mini" onClick={() => descartarSugerencia(s.id)}>
              Descartar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
