import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, uid } from '../db/db'
import type { Persona } from '../db/types'
import { claveDia } from '../logic/dates'
import { marcarRitmoHoy } from '../logic/actions'
import { ChipsSelector, Hoja } from '../components/ui'
import { EntradaHoja } from '../screens/Journal'
import { MetaHoja } from '../screens/Goals'
import { InteraccionHoja, PersonaHoja } from '../screens/People'

type Modo = 'menu' | 'entrada' | 'ritmos' | 'persona' | 'meta' | 'nuevoRitmo' | 'nuevaPersona'

export function QuickCapture() {
  const [modo, setModo] = useState<Modo | null>(null)
  const [personaSel, setPersonaSel] = useState<Persona | null>(null)

  const cerrar = () => {
    setModo(null)
    setPersonaSel(null)
  }

  return (
    <>
      <button className="fab" onClick={() => setModo('menu')} aria-label="Captura rápida">
        +
      </button>

      <Hoja abierta={modo === 'menu'} onCerrar={cerrar}>
        <h2>Captura rápida</h2>
        <div style={{ marginTop: 12 }}>
          {[
            { icono: '📝', texto: 'Entrada rápida', sub: 'Journal, momento, reflexión', modo: 'entrada' as Modo },
            { icono: '✓', texto: 'Marcar ritmo', sub: 'Checklist de hoy', modo: 'ritmos' as Modo },
            { icono: '👤', texto: 'Registrar interacción', sub: 'Contacté a alguien', modo: 'persona' as Modo },
            { icono: '👋', texto: 'Conocí a alguien', sub: 'Captúralo antes de que se te olvide', modo: 'nuevaPersona' as Modo },
            { icono: '🎯', texto: 'Nueva meta', sub: 'Tú defines el objetivo', modo: 'meta' as Modo },
            { icono: '🔁', texto: 'Nuevo ritmo', sub: 'Hábito o práctica recurrente', modo: 'nuevoRitmo' as Modo },
          ].map((op) => (
            <div key={op.texto} className="tarjeta tocable fila" onClick={() => setModo(op.modo)}>
              <span style={{ fontSize: 22 }}>{op.icono}</span>
              <div className="crece">
                <b>{op.texto}</b>
                <div className="subtitulo">{op.sub}</div>
              </div>
              <span style={{ color: 'var(--gray-400)' }}>›</span>
            </div>
          ))}
        </div>
      </Hoja>

      <EntradaHoja abierta={modo === 'entrada'} onCerrar={cerrar} />
      <RitmosRapidos abierta={modo === 'ritmos'} onCerrar={cerrar} />
      <ElegirPersona
        abierta={modo === 'persona' && !personaSel}
        onCerrar={cerrar}
        onElegir={setPersonaSel}
      />
      {personaSel && (
        <InteraccionHoja abierta={true} persona={personaSel} onCerrar={cerrar} />
      )}
      <MetaHoja abierta={modo === 'meta'} onCerrar={cerrar} />
      <NuevoRitmoHoja abierta={modo === 'nuevoRitmo'} onCerrar={cerrar} />
      <PersonaHoja abierta={modo === 'nuevaPersona'} onCerrar={cerrar} />
    </>
  )
}

function RitmosRapidos({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const ritmos = useLiveQuery(() => db.ritmos.where('estado').equals('activo').toArray()) ?? []
  const logsHoy = useLiveQuery(() => db.ritmoLogs.where('dia').equals(claveDia()).toArray()) ?? []
  const hechos = new Set(logsHoy.map((l) => l.ritmoId))

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>✓ Marcar ritmos de hoy</h2>
      <div style={{ marginTop: 12 }}>
        {ritmos.map((r) => (
          <div
            key={r.id}
            className="tarjeta tocable fila"
            onClick={() => !hechos.has(r.id) && marcarRitmoHoy(r)}
          >
            <span className={`check ${hechos.has(r.id) ? 'hecho' : ''}`}>
              {hechos.has(r.id) ? '✓' : ''}
            </span>
            <span style={{ fontSize: 20 }}>{r.icono}</span>
            <span className="crece" style={{ fontWeight: 600 }}>
              {r.nombre}
            </span>
          </div>
        ))}
      </div>
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 8 }} onClick={onCerrar}>
        Listo
      </button>
    </Hoja>
  )
}

function ElegirPersona({
  abierta,
  onCerrar,
  onElegir,
}: {
  abierta: boolean
  onCerrar: () => void
  onElegir: (p: Persona) => void
}) {
  const personas = useLiveQuery(() => db.personas.where('estado').equals('activa').toArray()) ?? []
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>¿Con quién fue el contacto?</h2>
      <div style={{ marginTop: 12 }}>
        {personas.length === 0 && (
          <p className="subtitulo">Primero agrega personas en la pestaña Personas.</p>
        )}
        {personas.map((p) => (
          <div key={p.id} className="tarjeta tocable fila" onClick={() => onElegir(p)}>
            <span style={{ fontSize: 20 }}>👤</span>
            <b className="crece">{p.nombre}</b>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
          </div>
        ))}
      </div>
    </Hoja>
  )
}

function NuevoRitmoHoja({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('🔁')
  const [frecuencia, setFrecuencia] = useState<'diario' | 'semanal'>('diario')
  const [veces, setVeces] = useState(3)
  const [areaIds, setAreaIds] = useState<string[]>([])
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const ICONOS = ['🔁', '💧', '🏃', '🏋️', '🧘', '📖', '🙏', '⛪', '🎹', '🎨', '✍️', '🌅', '💤', '📋']

  async function crear() {
    if (!nombre.trim()) return
    await db.ritmos.add({
      id: uid(),
      nombre: nombre.trim(),
      icono,
      proposito: '',
      frecuencia,
      diasSemana: [],
      vecesPorSemana: frecuencia === 'diario' ? 7 : veces,
      areaIds,
      estado: 'activo',
      creado: Date.now(),
    })
    setNombre('')
    setAreaIds([])
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>🔁 Nuevo ritmo</h2>
      <label>Nombre</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. Hora santa, Piano, Correr…"
      />
      <label>Icono</label>
      <div className="chips">
        {ICONOS.map((i) => (
          <button key={i} className={`chip ${icono === i ? 'activo' : ''}`} onClick={() => setIcono(i)}>
            {i}
          </button>
        ))}
      </div>
      <label>Frecuencia</label>
      <div className="chips">
        <button
          className={`chip ${frecuencia === 'diario' ? 'activo' : ''}`}
          onClick={() => setFrecuencia('diario')}
        >
          Diario
        </button>
        <button
          className={`chip ${frecuencia === 'semanal' ? 'activo' : ''}`}
          onClick={() => setFrecuencia('semanal')}
        >
          Por semana
        </button>
      </div>
      {frecuencia === 'semanal' && (
        <>
          <label>¿Cuántas veces por semana?</label>
          <div className="chips">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`chip ${veces === n ? 'activo' : ''}`} onClick={() => setVeces(n)}>
                {n}x
              </button>
            ))}
          </div>
        </>
      )}
      {areas.length > 0 && (
        <>
          <label>¿A qué áreas da XP?</label>
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
        disabled={!nombre.trim()}
        onClick={crear}
      >
        Crear ritmo
      </button>
    </Hoja>
  )
}
