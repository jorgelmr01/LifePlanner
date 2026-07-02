export const DIA_MS = 24 * 60 * 60 * 1000

export function claveDia(t: number | Date = new Date()): string {
  const d = typeof t === 'number' ? new Date(t) : t
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function inicioDia(t: number | Date = new Date()): number {
  const d = typeof t === 'number' ? new Date(t) : new Date(t.getTime())
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function diasDesde(t: number): number {
  return Math.floor((inicioDia() - inicioDia(t)) / DIA_MS)
}

export function haceTexto(t: number): string {
  const d = diasDesde(t)
  if (d <= 0) return 'hoy'
  if (d === 1) return 'ayer'
  if (d < 7) return `hace ${d} días`
  if (d < 30) return `hace ${Math.floor(d / 7)} sem`
  return `hace ${Math.floor(d / 30)} meses`
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function fechaLarga(t: number | Date = new Date()): string {
  const d = typeof t === 'number' ? new Date(t) : t
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}

export function fechaCorta(t: number): string {
  const d = new Date(t)
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`
}

export function horaCorta(t: number): string {
  const d = new Date(t)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Días hasta el próximo cumpleaños dado 'MM-DD'; null si no hay dato */
export function diasHastaCumple(mmdd?: string): number | null {
  if (!mmdd) return null
  const [mm, dd] = mmdd.split('-').map(Number)
  if (!mm || !dd) return null
  const hoy = new Date()
  const este = new Date(hoy.getFullYear(), mm - 1, dd)
  este.setHours(0, 0, 0, 0)
  let diff = Math.round((este.getTime() - inicioDia()) / DIA_MS)
  if (diff < 0) {
    const prox = new Date(hoy.getFullYear() + 1, mm - 1, dd)
    diff = Math.round((prox.getTime() - inicioDia()) / DIA_MS)
  }
  return diff
}
