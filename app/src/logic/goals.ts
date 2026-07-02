// Seguimiento de metas con mejores prácticas:
// - SMART al crear (el form guía: medible + fecha + porqué + primer paso)
// - Durante: progreso esperado vs real ("¿voy al ritmo que pide la fecha?")
// - Al vencer: evaluación obligada — replantear fecha, reformular el objetivo
//   o abandonar con aprendizaje. Un objetivo vencido sin evaluar no ayuda a nadie.

import { db, uid } from '../db/db'
import type { Meta, Replanteo } from '../db/types'
import { DIA_MS } from './dates'

export type EstadoPlan = 'sin_fecha' | 'adelante' | 'al_dia' | 'atrasada' | 'vencida'

/** % de progreso que "tocaría" llevar hoy si avanzas parejo hasta la fecha límite */
export function progresoEsperado(meta: Pick<Meta, 'creado' | 'fechaLimite'>, ahora = Date.now()): number | null {
  if (!meta.fechaLimite || meta.fechaLimite <= meta.creado) return null
  const fraccion = (ahora - meta.creado) / (meta.fechaLimite - meta.creado)
  return Math.round(Math.min(1, Math.max(0, fraccion)) * 100)
}

/** Margen de tolerancia: hasta 15 puntos por debajo del plan sigue siendo "al día" */
const TOLERANCIA = 15

export function estadoPlan(
  meta: Pick<Meta, 'creado' | 'fechaLimite' | 'progreso' | 'estado'>,
  ahora = Date.now(),
): EstadoPlan {
  if (!meta.fechaLimite) return 'sin_fecha'
  if (ahora > meta.fechaLimite && meta.progreso < 100 && meta.estado === 'activa') return 'vencida'
  const esperado = progresoEsperado(meta, ahora)
  if (esperado === null) return 'sin_fecha'
  const diff = meta.progreso - esperado
  if (diff > TOLERANCIA) return 'adelante'
  if (diff >= -TOLERANCIA) return 'al_dia'
  return 'atrasada'
}

export function diasRestantes(meta: Pick<Meta, 'fechaLimite'>, ahora = Date.now()): number | null {
  if (!meta.fechaLimite) return null
  return Math.ceil((meta.fechaLimite - ahora) / DIA_MS)
}

export const ETIQUETA_PLAN: Record<EstadoPlan, { texto: string; clase: string }> = {
  sin_fecha: { texto: 'Sin fecha', clase: 'badge-nivel' },
  adelante: { texto: '🚀 Adelante del plan', clase: 'badge-alta' },
  al_dia: { texto: '✓ Al día', clase: 'badge-alta' },
  atrasada: { texto: '⏳ Atrasada vs plan', clase: 'badge-media' },
  vencida: { texto: '⏰ Venció — evalúala', clase: 'badge-baja' },
}

/* ---------- Evaluación final: replantear o cerrar con aprendizaje ---------- */

/** Replantear la fecha límite (mantiene el objetivo, mueve el plan) */
export async function replantearFecha(meta: Meta, fechaNueva: number, nota: string): Promise<void> {
  const replanteo: Replanteo = {
    id: uid(),
    fecha: Date.now(),
    tipo: 'fecha',
    nota: nota.trim(),
    fechaAnterior: meta.fechaLimite,
    fechaNueva,
  }
  await db.metas.update(meta.id, {
    fechaLimite: fechaNueva,
    replanteos: [...(meta.replanteos ?? []), replanteo],
    actualizado: Date.now(),
  })
}

/** Reformular el objetivo mismo (título/métrica/porqué cambian tras aprender) */
export async function reformularObjetivo(
  meta: Meta,
  cambios: Partial<Pick<Meta, 'titulo' | 'porque' | 'metrica' | 'proximoPaso' | 'fechaLimite'>>,
  nota: string,
): Promise<void> {
  const replanteo: Replanteo = {
    id: uid(),
    fecha: Date.now(),
    tipo: 'objetivo',
    nota: nota.trim(),
    fechaAnterior: meta.fechaLimite,
    fechaNueva: cambios.fechaLimite,
  }
  await db.metas.update(meta.id, {
    ...cambios,
    replanteos: [...(meta.replanteos ?? []), replanteo],
    actualizado: Date.now(),
  })
}

/** Abandonar con aprendizaje explícito: cerrar bien también cuenta */
export async function abandonarConAprendizaje(meta: Meta, aprendizaje: string): Promise<void> {
  await db.metas.update(meta.id, {
    estado: 'abandonada',
    notaAbandono: aprendizaje.trim(),
    actualizado: Date.now(),
  })
}
