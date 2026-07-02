import { useEffect, useRef, useState, type ReactNode } from 'react'
import { pushCapa } from '../logic/backstack'

/* ---------- Bottom sheet ---------- */
export function Hoja({
  abierta,
  onCerrar,
  children,
}: {
  abierta: boolean
  onCerrar: () => void
  children: ReactNode
}) {
  const onCerrarRef = useRef(onCerrar)
  onCerrarRef.current = onCerrar

  // botón/gesto atrás cierra la hoja en lugar de salir de la app
  useEffect(() => {
    if (!abierta) return
    const consumir = pushCapa(() => onCerrarRef.current())
    return consumir
  }, [abierta])

  if (!abierta) return null
  return (
    <div
      className="velo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="hoja">
        <div className="hoja-asa" />
        {children}
      </div>
    </div>
  )
}

/* ---------- Escala de emojis 1-5 ---------- */
const EMOJIS = ['😫', '😕', '😐', '🙂', '😊']
export function EscalaEmoji({
  valor,
  onCambio,
}: {
  valor?: number
  onCambio: (v: number) => void
}) {
  return (
    <div className="escala">
      {EMOJIS.map((e, i) => (
        <button
          key={i}
          type="button"
          className={valor === i + 1 ? 'activo' : ''}
          onClick={() => onCambio(i + 1)}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

/* ---------- Barra de progreso ---------- */
export function Barra({ fraccion, color }: { fraccion: number; color?: string }) {
  return (
    <div className="barra">
      <div
        style={{
          width: `${Math.min(100, Math.max(0, fraccion * 100))}%`,
          background: color ?? 'var(--primary)',
        }}
      />
    </div>
  )
}

/* ---------- Selector de chips múltiple ---------- */
export function ChipsSelector<T extends { id: string }>({
  items,
  seleccion,
  onCambio,
  etiqueta,
}: {
  items: T[]
  seleccion: string[]
  onCambio: (ids: string[]) => void
  etiqueta: (item: T) => string
}) {
  const alternar = (id: string) =>
    onCambio(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id])
  return (
    <div className="chips">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`chip ${seleccion.includes(it.id) ? 'activo' : ''}`}
          onClick={() => alternar(it.id)}
        >
          {etiqueta(it)}
        </button>
      ))}
    </div>
  )
}

/* ---------- Estado vacío ---------- */
export function Vacio({ icono, texto }: { icono: string; texto: string }) {
  return (
    <div className="vacio">
      <span className="icono">{icono}</span>
      {texto}
    </div>
  )
}

/* ---------- Toast global (para "+15 XP" y acciones Deshacer) ---------- */
interface AccionToast {
  texto: string
  fn: () => void
}
interface ToastMsg {
  id: number
  msg: string
  accion?: AccionToast
}
let emitir: ((msg: string, accion?: AccionToast) => void) | null = null

export function toast(msg: string, accion?: AccionToast) {
  emitir?.(msg, accion)
}

export function ToastHost() {
  const [msgs, setMsgs] = useState<ToastMsg[]>([])
  useEffect(() => {
    emitir = (msg, accion) => {
      const id = Date.now() + Math.random()
      setMsgs((m) => [...m, { id, msg, accion }])
      // con acción se queda más tiempo para dar chance de deshacer
      setTimeout(() => setMsgs((m) => m.filter((x) => x.id !== id)), accion ? 5000 : 2100)
    }
    return () => {
      emitir = null
    }
  }, [])
  return (
    <>
      {msgs.map((m) => (
        <div key={m.id} className={`toast ${m.accion ? 'toast-accion' : ''}`}>
          {m.msg}
          {m.accion && (
            <button
              onClick={() => {
                m.accion!.fn()
                setMsgs((ms) => ms.filter((x) => x.id !== m.id))
              }}
            >
              {m.accion.texto}
            </button>
          )}
        </div>
      ))}
    </>
  )
}

/* ---------- Celebración de level-up ---------- */
export function LevelUpOverlay() {
  const [nivel, setNivel] = useState<number | null>(null)
  useEffect(() => {
    const onLevelUp = (e: Event) => {
      setNivel((e as CustomEvent<{ nivel: number }>).detail.nivel)
      setTimeout(() => setNivel(null), 2600)
    }
    window.addEventListener('levelup', onLevelUp)
    return () => window.removeEventListener('levelup', onLevelUp)
  }, [])
  if (nivel === null) return null
  return (
    <div className="levelup" aria-live="polite">
      <div className="levelup-tarjeta">
        <div className="levelup-estrellas" aria-hidden="true">
          {['✦', '✧', '✦', '✧', '✦', '✧'].map((s, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              {s}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 46 }}>🧭</div>
        <b>¡Subiste a nivel {nivel}!</b>
        <span className="subtitulo">Tu constancia está pagando</span>
      </div>
    </div>
  )
}

/* ---------- Badge de atención ---------- */
export function BadgeAtencion({ nivel }: { nivel: 'alta' | 'media' | 'baja' }) {
  const texto = { alta: 'Alta', media: 'Media', baja: 'Baja' }[nivel]
  return <span className={`badge badge-${nivel}`}>● {texto}</span>
}
