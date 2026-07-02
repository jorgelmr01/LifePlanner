// Modelo de datos — ver PRODUCT_SPEC.md §3 y ADR-006 (PWA + IndexedDB)

export type Privacidad = 'normal' | 'privada'

export interface Area {
  id: string
  nombre: string
  icono: string
  color: string
  visible: boolean
  orden: number
  prompts: string[]
}

export interface Entry {
  id: string
  fecha: number // epoch ms
  tipo: 'journal' | 'checkin_manana' | 'checkin_noche'
  contenido: string
  mood?: number // 1-5
  energia?: number // 1-5
  areaIds: string[]
  personaIds: string[]
  tags: string[]
  privacidad: Privacidad
}

export type Frecuencia = 'diario' | 'semanal' | 'personalizado'

export interface Ritmo {
  id: string
  nombre: string
  icono: string
  proposito: string
  frecuencia: Frecuencia
  // Para 'personalizado': días de la semana activos (0=Dom … 6=Sáb)
  diasSemana: number[]
  // Para 'semanal': veces por semana esperadas
  vecesPorSemana: number
  areaIds: string[]
  estado: 'activo' | 'pausado' | 'archivado'
  creado: number
}

export interface RitmoLog {
  id: string
  ritmoId: string
  fecha: number
  dia: string // 'YYYY-MM-DD' para dedupe y consultas
  duracionMin?: number
  nota?: string
}

export interface Milestone {
  id: string
  titulo: string
  hecho: boolean
}

export interface Meta {
  id: string
  titulo: string
  icono: string
  porque: string
  metrica: string
  progreso: number // 0-100
  proximoPaso: string
  milestones: Milestone[]
  fechaLimite?: number
  areaIds: string[]
  estado: 'activa' | 'pausada' | 'completada' | 'abandonada'
  creado: number
  actualizado: number
}

export interface Persona {
  id: string
  nombre: string
  circulo: 'cercano' | 'familia' | 'trabajo' | 'conocido'
  loQueImporta: string
  preguntarProxima: string
  frecuenciaDias: number // cada cuántos días quiero contacto
  cumpleanos?: string // 'MM-DD'
  areaIds: string[]
  estado: 'activa' | 'archivada'
  silenciarSugerencias: boolean
}

export interface Interaccion {
  id: string
  personaId: string
  fecha: number
  tipo: 'llamada' | 'mensaje' | 'en_persona' | 'evento' | 'otro'
  nota: string
  calidad?: number // 1-5
}

export type SugerenciaTipo = 'reconexion' | 'consistencia' | 'balance' | 'cumpleanos' | 'meta'

export interface Sugerencia {
  id: string
  tipo: SugerenciaTipo
  mensaje: string
  razon: string
  // referencia al objeto que la originó (persona, ritmo, área, meta)
  refId: string
  estado: 'pendiente' | 'hecha' | 'pospuesta' | 'descartada'
  creada: number
  posponerHasta?: number
}

export interface XpEvent {
  id: string
  fecha: number
  dia: string // 'YYYY-MM-DD'
  areaId: string // '' si no aplica a un área
  cantidad: number
  fuente: 'entrada' | 'checkin' | 'ritmo' | 'interaccion' | 'meta' | 'sugerencia' | 'logro'
  refId: string
}

/** Logro desbloqueado (insignia); id = clave del catálogo en logic/achievements.ts */
export interface Logro {
  id: string
  fecha: number
}

export interface ConfigAI {
  proveedor: 'anthropic' | 'openai'
  apiKey: string
  modelo: string
}

export interface Ajustes {
  id: 'main'
  nombre: string
  onboardingCompleto: boolean
  tema: 'claro' | 'oscuro' | 'sistema'
  mostrarNiveles: boolean
  notificaciones?: boolean
  ultimoRespaldo?: number
  ultimaNotificacion?: number
  ai?: ConfigAI
}
