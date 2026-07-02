import { describe, expect, it } from 'vitest'
import { claveDia, diasDesde, diasHastaCumple, haceTexto, inicioDia, DIA_MS } from '../src/logic/dates'

describe('claveDia', () => {
  it('formatea YYYY-MM-DD con ceros', () => {
    expect(claveDia(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(claveDia(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('diasDesde', () => {
  it('cuenta días de calendario, no de 24h', () => {
    expect(diasDesde(Date.now())).toBe(0)
    expect(diasDesde(inicioDia() - 1)).toBe(1) // un ms antes de medianoche = ayer
    expect(diasDesde(Date.now() - 45 * DIA_MS)).toBe(45)
  })
})

describe('haceTexto', () => {
  it('devuelve etiquetas legibles', () => {
    expect(haceTexto(Date.now())).toBe('hoy')
    expect(haceTexto(Date.now() - DIA_MS)).toBe('ayer')
    expect(haceTexto(Date.now() - 3 * DIA_MS)).toBe('hace 3 días')
    expect(haceTexto(Date.now() - 14 * DIA_MS)).toBe('hace 2 sem')
  })
})

describe('diasHastaCumple', () => {
  it('devuelve null sin dato o con formato inválido', () => {
    expect(diasHastaCumple(undefined)).toBeNull()
    expect(diasHastaCumple('marzo 15')).toBeNull()
  })
  it('calcula días hacia adelante (0-365)', () => {
    const hoy = new Date()
    const mmdd = `${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
    expect(diasHastaCumple(mmdd)).toBe(0)
    const manana = new Date(Date.now() + DIA_MS)
    const mmddM = `${String(manana.getMonth() + 1).padStart(2, '0')}-${String(manana.getDate()).padStart(2, '0')}`
    const d = diasHastaCumple(mmddM)
    expect(d === 1 || d === 0).toBe(true) // 0 solo en cambios de mes raros por DST
  })
  it('un cumpleaños pasado apunta al próximo año', () => {
    const ayer = new Date(Date.now() - 2 * DIA_MS)
    const mmdd = `${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`
    const d = diasHastaCumple(mmdd)!
    expect(d).toBeGreaterThan(300)
  })
})
