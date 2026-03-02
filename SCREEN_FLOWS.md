# Life Copilot - Flujos de Pantalla

> Documento que detalla los flujos de navegación entre pantallas para cada caso de uso principal.

---

## Mapa de Navegación General

```
                                    ┌─────────────┐
                                    │  ONBOARDING │
                                    │   A1 → A6   │
                                    └──────┬──────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              APP PRINCIPAL                                    │
│                                                                               │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │   HOY   │   │ REGISTRO│   │  ÁREAS  │   │PERSONAS │   │COPILOTO │        │
│  │   B1    │   │   C1    │   │   D1    │   │   G1    │   │   J1    │        │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘        │
│       │             │             │             │             │              │
│       ▼             ▼             ▼             ▼             ▼              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │Check-in │   │ Nueva   │   │ Detalle │   │ Detalle │   │  Voz    │        │
│  │   B2    │   │ entrada │   │  área   │   │ persona │   │   J2    │        │
│  │         │   │ C2/C3   │   │   D2    │   │   G2    │   │         │        │
│  └─────────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘        │
│       │             │             │             │             │              │
│       ▼             ▼             ▼             ▼             ▼              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │Sugerenc.│   │ Detalle │   │ Config  │   │Registrar│   │Cambios  │        │
│  │   B3    │   │ entrada │   │  área   │   │interacc.│   │propuest.│        │
│  │         │   │   C4    │   │   D3    │   │   G3    │   │   J3    │        │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│                                                                               │
│  ══════════════════════════════════════════════════════════════════════      │
│                                                                               │
│  ACCESOS SECUNDARIOS (desde header o modales):                               │
│                                                                               │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │Calendario│  │Búsqueda │   │ Ajustes │   │ Ritmos  │   │  Metas  │        │
│  │   L1    │   │   L2    │   │   K1    │   │   E1    │   │   F1    │        │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo 1: Onboarding (Primer Uso)

**Contexto:** Usuario descarga la app por primera vez

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   A1 Bienvenida                                                         │
│   │                                                                     │
│   ├──► "Quiero algo ligero"  ──► Preselecciona plantilla Minimal       │
│   │                                                                     │
│   └──► "Quiero algo completo" ──► Preselecciona plantilla Equilibrado  │
│         │                                                               │
│         ▼                                                               │
│   A2 Configurar Áreas                                                   │
│   │                                                                     │
│   │   • Toggle áreas visibles                                          │
│   │   • Aplicar plantilla (opcional)                                   │
│   │   • Crear área personalizada (opcional)                            │
│   │                                                                     │
│   └──► [Siguiente]                                                     │
│         │                                                               │
│         ▼                                                               │
│   A3 Ritmos Iniciales                                                   │
│   │                                                                     │
│   │   • Seleccionar 3-8 ritmos sugeridos                               │
│   │   • Configurar frecuencia y recordatorios                          │
│   │   • Agregar "por qué" (opcional)                                   │
│   │                                                                     │
│   └──► [Siguiente]                                                     │
│         │                                                               │
│         ▼                                                               │
│   A4 Personas Importantes                                               │
│   │                                                                     │
│   │   • Agregar manualmente                                            │
│   │   • O importar de contactos (opcional)                             │
│   │   • Definir frecuencia de contacto deseada                         │
│   │                                                                     │
│   ├──► [Siguiente]                                                     │
│   │                                                                     │
│   └──► [Saltar por ahora]                                              │
│         │                                                               │
│         ▼                                                               │
│   A5 Preferencias                                                       │
│   │                                                                     │
│   │   • Nivel de notificaciones                                        │
│   │   • Activar bloqueo PIN/biometría                                  │
│   │   • Configurar respaldo                                            │
│   │                                                                     │
│   └──► [Siguiente]                                                     │
│         │                                                               │
│         ▼                                                               │
│   A6 AI Opcional                                                        │
│   │                                                                     │
│   │   • Explicación del copiloto                                       │
│   │   • Pegar API key (opcional)                                       │
│   │   • Configurar permisos                                            │
│   │                                                                     │
│   ├──► [Activar Copiloto] ──► Prueba rápida ──► B1 Dashboard           │
│   │                                                                     │
│   └──► [Configurar después] ──► B1 Dashboard                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo estimado: 3-5 minutos
```

---

## Flujo 2: Uso Diario Rápido (sin AI)

**Contexto:** Usuario abre la app para registro diario rápido

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   [Abre app]                                                            │
│       │                                                                 │
│       ▼                                                                 │
│   B1 Dashboard "Hoy"                                                    │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Check-in rápido (opcional)              │                      │
│   │   │   😊 Ánimo    [● ● ● ○ ○]               │ ──► 5 segundos      │
│   │   │   ⚡ Energía  [● ● ○ ○ ○]               │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Ritmos del día                          │                      │
│   │   │   [✓] Beber agua    ←── tap            │ ──► 2 seg/ritmo     │
│   │   │   [✓] Meditación                        │                      │
│   │   │   [ ] Ejercicio                         │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Sugerencia: "45 días sin Carlos"        │                      │
│   │   │   [Posponer]  ←── tap                   │ ──► 2 segundos      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► [LISTO - cierra app]                                            │
│                                                                         │
│   ═══════════════════════════════════════════════                      │
│                                                                         │
│   ALTERNATIVA: Agregar entrada rápida                                   │
│                                                                         │
│   │                                                                     │
│   └──► [Tap botón +]                                                   │
│         │                                                               │
│         ▼                                                               │
│   Menú captura rápida                                                   │
│   │                                                                     │
│   └──► [Entrada rápida]                                                │
│         │                                                               │
│         ▼                                                               │
│   C2 Nueva entrada (texto)                                              │
│   │                                                                     │
│   │   "Buen día, reunión productiva"                                   │
│   │   + tags opcionales                                                │
│   │                                                                     │
│   └──► [✓ Guardar] ──► B1 Dashboard                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo total: 30-90 segundos
```

---

## Flujo 3: Registro por Voz con AI

**Contexto:** Usuario quiere registrar su día conversando

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   [Abre app] ──► Tab Copiloto                                           │
│       │                                                                 │
│       ▼                                                                 │
│   J1 Copiloto (chat)                                                    │
│   │                                                                     │
│   └──► [Tap botón 🎤]                                                  │
│         │                                                               │
│         ▼                                                               │
│   J2 Copiloto (voz)                                                     │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │        [🎤 Grabando...]                 │                      │
│   │   │                                         │                      │
│   │   │  "Hoy tuve un día productivo.          │                      │
│   │   │   Hice ejercicio en la mañana,         │                      │
│   │   │   practiqué piano 30 minutos,          │ ──► 60-120 seg       │
│   │   │   y hablé con mamá por teléfono.       │                      │
│   │   │   Me sentí bien aunque cansado..."     │                      │
│   │   │                                         │                      │
│   │   │        [■ Detener]                      │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► [Procesar]                                                      │
│         │                                                               │
│         ▼                                                               │
│   J3 Cambios propuestos                                                 │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ENTRADA DE DIARIO                       │                      │
│   │   │ [✓] Crear entrada                       │                      │
│   │   │     "Hoy tuve un día productivo..."     │                      │
│   │   │     Áreas: Salud, Creatividad           │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ RITMOS                                  │                      │
│   │   │ [✓] Marcar: Ejercicio                   │                      │
│   │   │ [✓] Sesión piano: 30 min                │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ INTERACCIONES                           │                      │
│   │   │ [✓] Llamada con Mamá                    │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   [Editar] cualquier item si es necesario                          │
│   │                                                                     │
│   └──► [Aplicar (4)]                                                   │
│         │                                                               │
│         ▼                                                               │
│   J1 Copiloto (chat)                                                    │
│   │                                                                     │
│   │   "Listo, registré todo. ¿Algo más?"                               │
│   │                                                                     │
│   └──► [Cerrar] ──► B1 Dashboard                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo total: 2-5 minutos
```

---

## Flujo 4: Check-in Mañana/Noche

**Contexto:** Usuario hace su reflexión matutina o nocturna

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   B1 Dashboard ──► [Tap "Check-in mañana" / notificación]              │
│       │                                                                 │
│       ▼                                                                 │
│   B2 Check-in (mañana)                                                  │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ¿Cómo te sientes?                       │                      │
│   │   │ [😫] [😕] [😐] [🙂] [😊] ←── tap       │                      │
│   │   │                                         │                      │
│   │   │ ¿Cómo está tu energía?                  │                      │
│   │   │ [● ● ● ○ ○] ←── slider                 │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Intención para hoy:                     │                      │
│   │   │ [________________________] ←── escribir │                      │
│   │   │                                         │                      │
│   │   │ 3 prioridades:                          │                      │
│   │   │ 1. [____________________]               │                      │
│   │   │ 2. [____________________]               │                      │
│   │   │ 3. [____________________]               │                      │
│   │   │                                         │                      │
│   │   │ ¿Qué haría que hoy sea bueno?           │                      │
│   │   │ [________________________]              │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   ├──► [🎤 Por voz] ──► Grabar ──► Transcribe ──► Llena campos        │
│   │                                                                     │
│   └──► [Guardar] ──► B1 Dashboard                                      │
│                                                                         │
│   ═══════════════════════════════════════════════                      │
│                                                                         │
│   CHECK-IN NOCHE (similar pero con):                                    │
│                                                                         │
│   • ¿Qué salió bien hoy?                                               │
│   • 3 cosas por las que estás agradecido                               │
│   • ¿Qué aprendiste?                                                   │
│   • Una mejora para mañana                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo: 2-5 minutos
```

---

## Flujo 5: Registrar Sesión de Práctica (Hobby)

**Contexto:** Usuario practicó piano y quiere registrarlo con detalle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   OPCIÓN A: Desde Dashboard                                             │
│                                                                         │
│   B1 Dashboard ──► [Tap "Piano" en ritmos del día]                     │
│       │                                                                 │
│       ▼                                                                 │
│   E2 Detalle de ritmo (Piano)                                           │
│   │                                                                     │
│   └──► [🎹 Registrar sesión]                                           │
│         │                                                               │
│         ▼                                                               │
│   E3 Registrar sesión                                                   │
│                                                                         │
│   ─────────────────────────────────────────────────────────────        │
│                                                                         │
│   OPCIÓN B: Desde botón +                                               │
│                                                                         │
│   [Cualquier pantalla] ──► [Tap +]                                     │
│       │                                                                 │
│       ▼                                                                 │
│   Menú captura ──► [🎹 Registrar sesión]                               │
│       │                                                                 │
│       ▼                                                                 │
│   Selector de ritmo ──► [Piano]                                        │
│       │                                                                 │
│       ▼                                                                 │
│   E3 Registrar sesión                                                   │
│                                                                         │
│   ═══════════════════════════════════════════════                      │
│                                                                         │
│   E3 Registrar sesión                                                   │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ¿Cuánto tiempo?                         │                      │
│   │   │       [35 minutos]                      │                      │
│   │   │   [-5]  [+5]  [+15]                     │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Tipo de práctica:                       │                      │
│   │   │ [Escalas] [Acordes] [Canción✓]         │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ¿Qué trabajaste?                        │                      │
│   │   │ [Practiqué "Claro de Luna" ________]   │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ¿Cómo fue?                              │                      │
│   │   │ [😫] [😕] [😐] [🙂✓] [😊]              │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Adjuntar: [📷] [🎥] [🎤]               │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► [Guardar sesión] ──► E2 Detalle ritmo / B1 Dashboard            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo: 1-2 minutos
```

---

## Flujo 6: Gestión de Relaciones

**Contexto:** Usuario quiere ver con quién debe reconectarse

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   Tab Personas                                                          │
│       │                                                                 │
│       ▼                                                                 │
│   G1 Lista de personas                                                  │
│   │                                                                     │
│   │   Ordenar: [Último contacto ▼]                                     │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ ⚠️ NECESITAN ATENCIÓN                   │                      │
│   │   │                                         │                      │
│   │   │ 👤 Carlos          45 días              │ ←── tap              │
│   │   │ 👤 Ana             30 días              │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► [Tap Carlos]                                                    │
│         │                                                               │
│         ▼                                                               │
│   G2 Detalle de Carlos                                                  │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Última interacción: hace 45 días        │                      │
│   │   │ Frecuencia deseada: cada 2 semanas      │                      │
│   │   │                                         │                      │
│   │   │ Para preguntar:                         │                      │
│   │   │ • ¿Cómo va su nuevo trabajo?            │ ←── recordatorio     │
│   │   │ • ¿Nació su segundo hijo?               │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   [Usuario contacta a Carlos fuera de la app]                      │
│   │                                                                     │
│   └──► [Registrar interacción]                                         │
│         │                                                               │
│         ▼                                                               │
│   G3 Registrar interacción                                              │
│   │                                                                     │
│   │   Tipo: [💬 Mensaje ✓]                                             │
│   │   Nota: [Le escribí preguntando por su trabajo]                    │
│   │   ¿Cómo fue? [🙂]                                                  │
│   │   Seguimiento: [✓] Recordar en [2 semanas]                         │
│   │                                                                     │
│   └──► [Guardar] ──► G2 Detalle Carlos                                 │
│         │                                                               │
│         │   (Última interacción: hoy)                                  │
│         │   (Ya no aparece en "necesitan atención")                    │
│         │                                                               │
│         └──► G1 Lista / B1 Dashboard                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo: 1-2 minutos
```

---

## Flujo 7: Revisión Semanal

**Contexto:** Usuario hace su revisión semanal (domingo típicamente)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   B1 Dashboard ──► Sugerencia "Revisión semanal pendiente"             │
│       │                                                                 │
│       └──► [Hacer ahora]                                               │
│             │                                                           │
│             ▼                                                           │
│   I2 Revisión semanal                                                   │
│   │                                                                     │
│   │   ════════════════════════════════════════════                     │
│   │   RESUMEN AUTOMÁTICO DE LA SEMANA                                  │
│   │   ════════════════════════════════════════════                     │
│   │                                                                     │
│   │   • Ritmos completados: 75%                                        │
│   │   • Ánimo promedio: 3.8/5                                          │
│   │   • Áreas más activas: Salud, Trabajo                              │
│   │   • Entradas: 12                                                   │
│   │   • Sesiones de práctica: 3                                        │
│   │                                                                     │
│   │   ════════════════════════════════════════════                     │
│   │   PREGUNTAS GUIADAS                                                │
│   │   ════════════════════════════════════════════                     │
│   │                                                                     │
│   │   ¿Qué salió bien esta semana?                                     │
│   │   [___________________________________________]                     │
│   │                                                                     │
│   │   ¿Qué no salió como esperabas?                                    │
│   │   [___________________________________________]                     │
│   │                                                                     │
│   │   Una lección de esta semana:                                      │
│   │   [___________________________________________]                     │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │   AJUSTES DE RITMOS                                                │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   Piano: 1/3 sesiones                                              │
│   │   [Mantener] [Ajustar] [Pausar]                                    │
│   │                                                                     │
│   │   Meditación: 7/7 días 🎉                                          │
│   │   [Mantener]                                                       │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │   PERSONAS                                                         │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   Sugeridos: Carlos (45 días), Ana (30 días)                       │
│   │   ¿A quién quieres contactar esta semana?                          │
│   │   [+ Carlos] [+ Ana] [+ otro]                                      │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │   PRÓXIMA SEMANA                                                   │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   Prioridades:                                                     │
│   │   1. [___________________________]                                 │
│   │   2. [___________________________]                                 │
│   │   3. [___________________________]                                 │
│   │                                                                     │
│   └──► [Completar revisión]                                            │
│         │                                                               │
│         ▼                                                               │
│   Sistema genera "Plan de la semana"                                    │
│   │                                                                     │
│   │   • 3 prioridades guardadas                                        │
│   │   • Ajustes a ritmos aplicados                                     │
│   │   • Recordatorios de contacto creados                              │
│   │                                                                     │
│   └──► B1 Dashboard                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo: 10-20 minutos
```

---

## Flujo 8: Crear Nueva Meta

**Contexto:** Usuario quiere establecer un nuevo objetivo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   [Cualquier pantalla] ──► [Tap +]                                     │
│       │                                                                 │
│       ▼                                                                 │
│   Menú captura ──► [🎯 Nuevo objetivo]                                 │
│       │                                                                 │
│       ▼                                                                 │
│   F3 Crear meta                                                         │
│   │                                                                     │
│   │   ¿Qué quieres lograr?                                             │
│   │   [Correr una carrera de 10K___________]                           │
│   │                                                                     │
│   │   ¿Para cuándo?                                                    │
│   │   [15 marzo 2026] [Sin fecha]                                      │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   ¿Por qué es importante para ti?                                  │
│   │   [Quiero mejorar mi salud y demostrarme__]                        │
│   │   [que puedo lograr metas físicas_________]                        │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   ¿Cómo sabrás que lo lograste?                                    │
│   │   [Completar la carrera sin caminar_______]                        │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   Primeros 3 pasos:                                                │
│   │   1. [Inscribirme en la carrera___________]                        │
│   │   2. [Empezar programa de entrenamiento___]                        │
│   │   3. [Comprar tenis adecuados_____________]                        │
│   │                                                                     │
│   │   ────────────────────────────────────────────                     │
│   │                                                                     │
│   │   Vincular a:                                                      │
│   │   Área: [Salud ▼]                                                  │
│   │                                                                     │
│   │   Sugerencia de ritmo:                                             │
│   │   [+ Crear: Correr (3x semana)]                                    │
│   │                                                                     │
│   └──► [Crear meta]                                                    │
│         │                                                               │
│         ▼                                                               │
│   F2 Detalle de meta (recién creada)                                    │
│   │                                                                     │
│   │   🏃 Correr 10K                                                    │
│   │   Progreso: 0%                                                     │
│   │   Próximo paso: Inscribirme en la carrera                          │
│   │                                                                     │
│   └──► [Volver] ──► F1 Lista de metas / B1 Dashboard                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tiempo: 3-5 minutos
```

---

## Flujo 9: Búsqueda

**Contexto:** Usuario busca algo específico en su historial

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   [Cualquier pantalla] ──► [Tap 🔍 en header]                          │
│       │                                                                 │
│       ▼                                                                 │
│   L2 Búsqueda                                                           │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ 🔍 [piano_____________________]         │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   Filtros: [Tipo ▼] [Área ▼] [Fecha ▼]                            │
│   │                                                                     │
│   │   ════════════════════════════════════════════                     │
│   │   RESULTADOS PARA "piano"                                          │
│   │   ════════════════════════════════════════════                     │
│   │                                                                     │
│   │   ENTRADAS (5)                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ 28 ene: "Hoy logré tocar..."  ←── tap  │                      │
│   │   │ 25 ene: "Sesión frustrante..."         │                      │
│   │   │ 20 ene: "Primer día con piano..."      │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   RITMOS (1)                                                       │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ 🎹 Práctica de piano         ←── tap   │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   METAS (1)                                                        │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ 🎹 Aprender piano (65%)      ←── tap   │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   │   SESIONES (8)                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ 28 ene: 30 min - Escalas     ←── tap   │                      │
│   │   │ 26 ene: 25 min - Acordes               │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► [Tap resultado] ──► Pantalla de detalle correspondiente         │
│         │                                                               │
│         └──► C4 / E2 / F2 / E3                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo 10: Re-engagement (Volver después de tiempo)

**Contexto:** Usuario no ha usado la app en 2+ semanas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   [Abre app después de 15 días]                                         │
│       │                                                                 │
│       ▼                                                                 │
│   L3 Bienvenida de vuelta                                               │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │                                         │                      │
│   │   │      ¡Qué bueno verte!                  │                      │
│   │   │                                         │                      │
│   │   │  Han pasado 15 días desde tu            │                      │
│   │   │  última visita.                         │                      │
│   │   │                                         │                      │
│   │   │  ¿Cómo quieres continuar?               │                      │
│   │   │                                         │                      │
│   │   │  ┌─────────────────────────────────┐   │                      │
│   │   │  │ 📊 Ver resumen rápido           │   │                      │
│   │   │  └─────────────────────────────────┘   │                      │
│   │   │                                         │                      │
│   │   │  ┌─────────────────────────────────┐   │                      │
│   │   │  │ 🌅 Empezar fresco               │   │                      │
│   │   │  └─────────────────────────────────┘   │                      │
│   │   │                                         │                      │
│   │   │  ┌─────────────────────────────────┐   │                      │
│   │   │  │ ⚙️ Ajustar mi sistema           │   │                      │
│   │   │  └─────────────────────────────────┘   │                      │
│   │   │                                         │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   ├──► [Ver resumen]                                                   │
│   │     │                                                               │
│   │     ▼                                                               │
│   │   Modal: Resumen de las últimas 2 semanas                          │
│   │   • Áreas: Salud (sin actividad), Trabajo (3 entradas)             │
│   │   • Personas: Carlos necesita atención (60 días)                   │
│   │   • Metas: Piano en pausa automática                               │
│   │   │                                                                 │
│   │   └──► [Entendido] ──► B1 Dashboard                                │
│   │                                                                     │
│   ├──► [Empezar fresco]                                                │
│   │     │                                                               │
│   │     └──► B1 Dashboard (ignora el gap)                              │
│   │                                                                     │
│   └──► [Ajustar sistema]                                               │
│         │                                                               │
│         ▼                                                               │
│   Modal: Simplificar                                                    │
│   │                                                                     │
│   │   ┌─────────────────────────────────────────┐                      │
│   │   │ Ritmos activos: 8                       │                      │
│   │   │ ¿Quieres reducir a 3?                   │                      │
│   │   │                                         │                      │
│   │   │ Mantener:                               │                      │
│   │   │ [✓] Beber agua                         │                      │
│   │   │ [✓] Meditación                         │                      │
│   │   │ [✓] Gratitud                           │                      │
│   │   │                                         │                      │
│   │   │ Pausar:                                 │                      │
│   │   │ [ ] Piano                               │                      │
│   │   │ [ ] Ejercicio                           │                      │
│   │   │ ...                                     │                      │
│   │   │                                         │                      │
│   │   │ [Aplicar cambios]                       │                      │
│   │   └─────────────────────────────────────────┘                      │
│   │                                                                     │
│   └──► B1 Dashboard                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Tono: Cero culpa, celebrar que volvió
```

---

## Resumen de Tiempos por Flujo

| Flujo | Tiempo | Frecuencia típica |
|-------|--------|-------------------|
| Uso diario rápido | 30-90 seg | Diaria |
| Registro por voz con AI | 2-5 min | Diaria (opcional) |
| Check-in mañana/noche | 2-5 min | 1-2x día |
| Registrar sesión de práctica | 1-2 min | Por sesión |
| Gestión de relaciones | 1-2 min | Semanal |
| Revisión semanal | 10-20 min | Semanal |
| Crear nueva meta | 3-5 min | Mensual |
| Búsqueda | 30 seg - 2 min | Cuando sea necesario |
| Onboarding | 3-5 min | Una vez |
| Re-engagement | 1-2 min | Cuando aplique |

---

*Documento de flujos de pantalla para Life Copilot.*
*Usar como referencia para diseño de UI y desarrollo.*
