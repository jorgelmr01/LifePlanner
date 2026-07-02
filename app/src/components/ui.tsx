import { useEffect, useState, type ReactNode } from 'react'

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

/* ---------- Toast global (para "+15 XP") ---------- */
let emitir: ((msg: string) => void) | null = null

export function toast(msg: string) {
  emitir?.(msg)
}

export function ToastHost() {
  const [msgs, setMsgs] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    emitir = (msg: string) => {
      const id = Date.now() + Math.random()
      setMsgs((m) => [...m, { id, msg }])
      setTimeout(() => setMsgs((m) => m.filter((x) => x.id !== id)), 2100)
    }
    return () => {
      emitir = null
    }
  }, [])
  return (
    <>
      {msgs.map((m) => (
        <div key={m.id} className="toast">
          {m.msg}
        </div>
      ))}
    </>
  )
}

/* ---------- Badge de atención ---------- */
export function BadgeAtencion({ nivel }: { nivel: 'alta' | 'media' | 'baja' }) {
  const texto = { alta: 'Alta', media: 'Media', baja: 'Baja' }[nivel]
  return <span className={`badge badge-${nivel}`}>● {texto}</span>
}
