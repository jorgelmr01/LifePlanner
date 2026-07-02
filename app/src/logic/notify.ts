// Notificaciones locales y badge de la app (best-effort en PWA).
// Limitación conocida: sin backend no hay push real; notificamos al abrir la app
// y actualizamos el badge del icono donde el navegador lo soporte.

import { db } from '../db/db'

export function soportaNotificaciones(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (!soportaNotificaciones()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  return (await Notification.requestPermission()) === 'granted'
}

async function mostrar(titulo: string, cuerpo: string) {
  try {
    // preferir el service worker (requerido en Android; funciona con la app cerrada en algunos casos)
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) {
      await reg.showNotification(titulo, { body: cuerpo, icon: 'icons/icon-192.png', tag: 'sugerencias' })
      return
    }
  } catch {
    /* cae al fallback */
  }
  try {
    new Notification(titulo, { body: cuerpo })
  } catch {
    /* Safari iOS sin instalar: sin soporte */
  }
}

/**
 * Notifica las sugerencias pendientes (máximo una notificación por día)
 * si el usuario activó las notificaciones en Ajustes.
 */
export async function notificarSugerencias(): Promise<void> {
  const ajustes = await db.ajustes.get('main')
  if (!ajustes?.notificaciones) return
  if (!soportaNotificaciones() || Notification.permission !== 'granted') return
  const hoy = new Date().toDateString()
  if (ajustes.ultimaNotificacion && new Date(ajustes.ultimaNotificacion).toDateString() === hoy) return
  const pendientes = await db.sugerencias.where('estado').equals('pendiente').toArray()
  if (!pendientes.length) return
  const cuerpo =
    pendientes.length === 1
      ? pendientes[0].mensaje
      : `${pendientes[0].mensaje} (+${pendientes.length - 1} más)`
  await mostrar('Life Copilot — para re-balancearte', cuerpo)
  await db.ajustes.update('main', { ultimaNotificacion: Date.now() })
}

/** Badge en el icono de la app con el número de sugerencias pendientes */
export async function actualizarBadge(pendientes: number): Promise<void> {
  const n = navigator as Navigator & {
    setAppBadge?: (n: number) => Promise<void>
    clearAppBadge?: () => Promise<void>
  }
  try {
    if (pendientes > 0) await n.setAppBadge?.(pendientes)
    else await n.clearAppBadge?.()
  } catch {
    /* no soportado */
  }
}

/** Pide almacenamiento persistente para reducir el riesgo de purga del navegador */
export async function pedirPersistencia(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true
      return await navigator.storage.persist()
    }
  } catch {
    /* ignorar */
  }
  return false
}
