// Radar de balance de vida: cada eje es un área, el valor es la actividad reciente.

import type { Area } from '../db/types'

export function Radar({
  areas,
  valores,
  tam = 280,
}: {
  areas: Area[]
  valores: Map<string, number> // 0-1 por área
  tam?: number
}) {
  const n = areas.length
  if (n < 3) return null
  const cx = tam / 2
  const cy = tam / 2
  const r = tam / 2 - 44

  const punto = (i: number, frac: number) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(ang) * r * frac, cy + Math.sin(ang) * r * frac] as const
  }

  const anillo = (frac: number) =>
    areas.map((_, i) => punto(i, frac).join(',')).join(' ')

  const datos = areas
    .map((a, i) => punto(i, Math.max(0.06, valores.get(a.id) ?? 0)).join(','))
    .join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${tam} ${tam}`} role="img" aria-label="Balance de vida">
      {[0.33, 0.66, 1].map((f) => (
        <polygon
          key={f}
          points={anillo(f)}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {areas.map((_, i) => {
        const [x, y] = punto(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />
      })}
      <polygon points={datos} fill="rgba(99,102,241,0.25)" stroke="var(--primary)" strokeWidth="2" />
      {areas.map((a, i) => {
        const [x, y] = punto(i, Math.max(0.06, valores.get(a.id) ?? 0))
        return <circle key={a.id} cx={x} cy={y} r="3.5" fill={a.color} />
      })}
      {areas.map((a, i) => {
        const [x, y] = punto(i, 1.22)
        return (
          <text
            key={a.id}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
          >
            {a.icono}
          </text>
        )
      })}
    </svg>
  )
}
