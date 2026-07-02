// Catálogos por defecto — ver PRODUCT_SPEC.md §10 (plantillas) y design/DESIGN_SYSTEM.md §2.7

export const AREAS_CATALOGO = [
  { nombre: 'Salud', icono: '💪', color: '#22C55E', prompts: ['¿Cómo está mi cuerpo hoy?', '¿Dormí bien?'] },
  { nombre: 'Trabajo', icono: '💼', color: '#3B82F6', prompts: ['¿Qué avancé hoy?', '¿Qué me trabó?'] },
  { nombre: 'Relaciones', icono: '👥', color: '#EC4899', prompts: ['¿Con quién conecté hoy?'] },
  { nombre: 'Finanzas', icono: '💰', color: '#EAB308', prompts: ['¿Gasté con intención?'] },
  { nombre: 'Fe', icono: '🙏', color: '#A855F7', prompts: ['¿Qué agradezco hoy?', '¿Dediqué tiempo a orar?'] },
  { nombre: 'Aprendizaje', icono: '📚', color: '#6366F1', prompts: ['¿Qué aprendí hoy?'] },
  { nombre: 'Creatividad', icono: '🎨', color: '#F97316', prompts: ['¿Qué creé o practiqué?'] },
  { nombre: 'Servicio', icono: '🤝', color: '#14B8A6', prompts: ['¿A quién ayudé hoy?'] },
  { nombre: 'Pareja', icono: '❤️', color: '#EF4444', prompts: ['¿Qué momento compartimos?'] },
]

export const AREAS_DEFAULT = ['Salud', 'Trabajo', 'Relaciones']

export interface RitmoSugerido {
  nombre: string
  icono: string
  frecuencia: 'diario' | 'semanal'
  vecesPorSemana: number
  area: string
}

export const RITMOS_CATALOGO: RitmoSugerido[] = [
  { nombre: 'Beber agua', icono: '💧', frecuencia: 'diario', vecesPorSemana: 7, area: 'Salud' },
  { nombre: 'Movimiento', icono: '🏃', frecuencia: 'diario', vecesPorSemana: 7, area: 'Salud' },
  { nombre: 'Ejercicio', icono: '🏋️', frecuencia: 'semanal', vecesPorSemana: 3, area: 'Salud' },
  { nombre: 'Gratitud', icono: '✨', frecuencia: 'diario', vecesPorSemana: 7, area: 'Fe' },
  { nombre: 'Oración', icono: '🙏', frecuencia: 'diario', vecesPorSemana: 7, area: 'Fe' },
  { nombre: 'Hora santa', icono: '⛪', frecuencia: 'semanal', vecesPorSemana: 1, area: 'Fe' },
  { nombre: 'Lectura', icono: '📖', frecuencia: 'diario', vecesPorSemana: 7, area: 'Aprendizaje' },
  { nombre: 'Meditación', icono: '🧘', frecuencia: 'diario', vecesPorSemana: 7, area: 'Salud' },
  { nombre: 'Práctica creativa', icono: '🎹', frecuencia: 'semanal', vecesPorSemana: 3, area: 'Creatividad' },
  { nombre: 'Revisión semanal', icono: '📋', frecuencia: 'semanal', vecesPorSemana: 1, area: 'Trabajo' },
]

export const PROMPTS_JOURNAL = [
  '¿Qué pasó hoy?',
  '¿Cómo me siento ahora?',
  '¿Qué aprendí?',
  '¿Qué agradezco?',
]
