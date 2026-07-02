# Life Copilot - Especificación de Producto Completa

> Documento consolidado con estructura, pantallas, features, modelo de datos y decisiones de diseño.
> Última actualización: Julio 2026
>
> **Nota de revisión (julio 2026):** el proyecto pivotó de app nativa Flutter a **PWA instalable**
> (iOS/Android) y sumó la **capa RPG** descrita en la [sección 14](#14-capa-rpg-y-pivote-a-pwa-2026),
> que ajusta la postura de gamificación de las secciones anteriores. Ver [ADR-006](docs/adrs/ADR-006-pwa-pivot.md).

---

## Tabla de Contenidos

1. [Visión y Propuesta de Valor](#1-visión-y-propuesta-de-valor)
2. [Principios de Diseño](#2-principios-de-diseño)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Navegación y Arquitectura de Información](#4-navegación-y-arquitectura-de-información)
5. [Catálogo de Pantallas](#5-catálogo-de-pantallas)
6. [Sistema de Sugerencias](#6-sistema-de-sugerencias)
7. [Copiloto AI - Comportamiento](#7-copiloto-ai---comportamiento)
8. [Flujos de Usuario](#8-flujos-de-usuario)
9. [Features por Categoría](#9-features-por-categoría)
10. [Plantillas Predefinidas](#10-plantillas-predefinidas)
11. [Roadmap (MVP → V1 → V2)](#11-roadmap-mvp--v1--v2)
12. [Decisiones de Diseño](#12-decisiones-de-diseño)
13. [Consideraciones Técnicas](#13-consideraciones-técnicas)
14. [Capa RPG y Pivote a PWA (2026)](#14-capa-rpg-y-pivote-a-pwa-2026)

---

## 1. Visión y Propuesta de Valor

### Qué es Life Copilot

Un **sistema personal de seguimiento de vida** que combina:

- **Captura**: Journal, notas, momentos, reflexiones
- **Seguimiento**: Hábitos, objetivos, prácticas, relaciones, fe
- **Sugerencias**: Recordatorios inteligentes e insights accionables
- **Copiloto opcional**: AI conversacional (chat/voz) que facilita el registro

### Problema que resuelve

Las personas usan múltiples apps (hábitos, journal, CRM personal, notas) sin conexión entre ellas. Life Copilot unifica todo en un sistema coherente donde las dimensiones de vida se relacionan entre sí.

### Diferenciadores clave

| Aspecto | Apps típicas | Life Copilot |
|---------|--------------|--------------|
| Hábitos | Streaks culpógenos | Consistencia flexible |
| Relaciones | No existe o es CRM frío | Cálido, con contexto personal |
| Religión/Fe | Ignorada o apps separadas | Área configurable integrada |
| AI | Todo o nada | Opcional, con confirmación |
| Privacidad | Datos en la nube | Local-first, exportable |

---

## 2. Principios de Diseño

### 2.1 Modular y personalizable
- Cada usuario define sus áreas (incluyendo religión)
- Cualquier área puede ocultarse completamente
- Plantillas para diferentes estilos de vida

### 2.2 Fricción mínima
- "Captura rápida" desde cualquier pantalla (< 10 segundos)
- Check-ins diarios opcionales (30-90 segundos)
- Lo profundo (reflexiones, revisiones) es siempre opcional

### 2.3 Un sistema, muchas vistas
- La misma información se ve como: Hoy, Calendario, Áreas, Personas, Progreso
- Todo objeto se puede relacionar con otros

### 2.4 AI siempre opcional y con control
- Sin AI la app funciona 100%
- Con AI: nada se ejecuta sin confirmación cuando afecte datos
- El usuario controla qué puede leer/sugerir el copiloto

### 2.5 Privacidad por defecto
- Religión y relaciones son sensibles → permisos granulares
- Bloqueo con PIN/biometría recomendado
- Exportación clara (JSON/CSV/PDF)
- Datos locales por defecto

### 2.6 Anti-gamificación culpógena
- No hay puntos, niveles, ni rankings
- Streaks visibles solo si el usuario quiere
- Celebraciones tranquilas, no fuegos artificiales
- Foco en progreso flexible, no perfección

---

## 3. Modelo de Datos

### 3.1 Los 5 Bloques (Objetos principales)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ÁREAS                                    │
│  (Contenedores: Salud, Trabajo, Fe, Relaciones, etc.)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │ ENTRADAS │◄──►│  RITMOS  │◄──►│  METAS   │◄──►│ PERSONAS │ │
│   │ (Journal)│    │ (Hábitos)│    │(Objetivos)│   │(Relacion)│ │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│         │              │               │               │        │
│         └──────────────┴───────────────┴───────────────┘        │
│                    Todos se relacionan N:N                       │
│                    Todos pertenecen a Áreas                      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Definición de cada objeto

#### ENTRADA (Log / Journal / Momento)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| fecha | DateTime | Sí | Cuándo ocurrió |
| contenido | Text | Sí* | Texto de la entrada |
| audio | File | Sí* | Grabación de voz |
| fotos | File[] | No | Imágenes adjuntas |
| mood | 1-5 | No | Estado de ánimo |
| energia | 1-5 | No | Nivel de energía |
| areas | Area[] | No | Áreas relacionadas |
| personas | Persona[] | No | Personas mencionadas |
| ritmos | Ritmo[] | No | Hábitos relacionados |
| metas | Meta[] | No | Objetivos relacionados |
| tags | Tag[] | No | Etiquetas |
| privacidad | Enum | Sí | normal / privada / ultra_privada |
| ubicacion | GeoPoint | No | Dónde ocurrió |

*Al menos uno: contenido o audio

#### RITMO (Hábito / Rutina / Práctica / Ritual)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| nombre | String | Sí | "Meditar", "Piano", "Oración" |
| proposito | Text | No | Por qué es importante |
| frecuencia | Enum | Sí | diario / semanal / mensual / personalizado |
| dias_semana | Int[] | No | [1,3,5] = Lun, Mié, Vie |
| horario | Time | No | Hora recomendada |
| duracion_objetivo | Int | No | Minutos esperados |
| areas | Area[] | No | Áreas que impacta |
| metas | Meta[] | No | Objetivos que empuja |
| estado | Enum | Sí | activo / pausado / archivado / completado |
| recordatorio | Boolean | No | Notificar o no |
| dificultad | 1-3 | No | Fácil / Medio / Difícil |

#### META (Objetivo / Proyecto / Plan)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| titulo | String | Sí | "Aprender piano", "Correr 10K" |
| porque | Text | No | Por qué importa |
| fecha_limite | Date | No | Deadline opcional |
| metrica | String | No | Cómo medirlo |
| progreso | Int | No | 0-100% |
| milestones | Milestone[] | No | Hitos intermedios |
| proximo_paso | String | No | Acción inmediata |
| areas | Area[] | No | Áreas relacionadas |
| ritmos | Ritmo[] | No | Hábitos que la empujan |
| personas | Persona[] | No | Mentor/compañero |
| estado | Enum | Sí | activa / pausada / completada / abandonada |
| nota_abandono | Text | No | Por qué se abandonó (aprendizaje) |

#### PERSONA (Relación)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| nombre | String | Sí | Nombre de la persona |
| circulo | Enum | No | cercano / familia / trabajo / conocido |
| como_conocieron | Text | No | Historia del encuentro |
| lo_que_importa | Text | No | Sus intereses/valores |
| preguntar_proxima | Text | No | Temas pendientes |
| frecuencia_deseada | Int | No | Días entre contactos |
| ultima_interaccion | Date | Auto | Calculado |
| cumpleanos | Date | No | Para recordatorios |
| areas | Area[] | No | Contexto (trabajo, fe, etc.) |
| metas | Meta[] | No | Proyectos compartidos |
| estado | Enum | Sí | activa / dormida / archivada |
| es_sensible | Boolean | No | Ocultar de previews |
| silenciar_sugerencias | Boolean | No | No sugerir reconexión |

#### ÁREA (Dimensión de vida)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
| nombre | String | Sí | "Salud", "Fe", "Trabajo" |
| icono | String | No | Emoji o icono |
| visible | Boolean | Sí | Mostrar u ocultar |
| orden | Int | No | Posición en lista |
| prompts_journal | String[] | No | Preguntas sugeridas |
| color | String | No | Para visualización |

### 3.3 Objetos secundarios

#### TAG (Etiqueta)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador |
| nombre | String | "#logro", "#obstaculo", "#insight" |
| tipo | Enum | usuario / sistema / heredado |
| color | String | Para visualización |

**Tags de sistema (auto-generados):**
- `#logro` - cuando se completa algo
- `#obstaculo` - cuando se registra dificultad
- `#insight` - reflexiones marcadas como importantes
- `#[area]` - heredado del área (ej: `#salud`)

#### INTERACCIÓN (con Persona)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador |
| persona_id | UUID | Relación |
| fecha | DateTime | Cuándo |
| tipo | Enum | llamada / mensaje / cafe / evento / otro |
| duracion | Int | Minutos (opcional) |
| nota | Text | Qué hablaron |
| calidad | 1-5 | Cómo fue (opcional) |
| seguimiento | Date | Recordar contactar en X días |

#### SESIÓN DE PRÁCTICA (para Ritmos tipo hobby/habilidad)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador |
| ritmo_id | UUID | Hábito relacionado |
| fecha | DateTime | Cuándo |
| duracion | Int | Minutos |
| tipo_practica | String | "Escalas", "Lectura a vista" |
| calidad | 1-5 | Auto-evaluación |
| que_trabaje | Text | Detalle |
| como_senti | Text | Reflexión |
| adjuntos | File[] | Foto/video/audio |

#### SUGERENCIA
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador |
| tipo | Enum | reconexion / consistencia / balance / planificacion |
| mensaje | String | Texto de la sugerencia |
| razon | String | Por qué se sugiere |
| accion | Object | Qué hacer (marcar hábito, contactar, etc.) |
| estado | Enum | pendiente / hecha / pospuesta / descartada |
| no_sugerir_mas | Boolean | El usuario la rechazó permanentemente |
| fecha_creacion | DateTime | Cuándo se generó |
| fecha_pospuesta | DateTime | Hasta cuándo esperar |

### 3.4 Relaciones (Cardinalidades)

| Relación | Cardinalidad | Notas |
|----------|--------------|-------|
| Entrada ↔ Área | N:N | Una entrada puede tocar múltiples áreas |
| Entrada ↔ Persona | N:N | Múltiples personas mencionadas |
| Entrada ↔ Ritmo | N:N | "Hoy hice meditación Y piano" |
| Entrada ↔ Meta | N:N | Progreso de múltiples objetivos |
| Entrada ↔ Tag | N:N | Múltiples etiquetas |
| Ritmo ↔ Área | N:N | Un ritmo puede beneficiar varias áreas |
| Ritmo ↔ Meta | N:N | Un hábito empuja varios objetivos |
| Meta ↔ Área | N:N | Un objetivo toca varias dimensiones |
| Meta ↔ Persona | N:N | Mentores, compañeros |
| Persona ↔ Área | N:N | Contexto de la relación |

---

## 4. Navegación y Arquitectura de Información

### 4.1 Estructura principal

```
┌─────────────────────────────────────────────────────────────┐
│                      HEADER                                  │
│  [Logo/Nombre]                    [Buscar] [Calendario]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                    CONTENIDO PRINCIPAL                       │
│                    (según tab activo)                        │
│                                                              │
│                                                              │
│                         [ + ]  ←── Botón flotante            │
│                                    (captura rápida)          │
├─────────────────────────────────────────────────────────────┤
│                      TAB BAR                                 │
│   [Hoy]   [Registro]   [Áreas]   [Personas]   [Copiloto]   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Tabs principales (5)

| Tab | Icono | Función principal |
|-----|-------|-------------------|
| **Hoy** | Sol/Casa | Dashboard diario, check-in, ritmos pendientes |
| **Registro** | Libro/Timeline | Journal, timeline de entradas |
| **Áreas** | Cuadrícula | Dimensiones de vida y su estado |
| **Personas** | Personas | Relaciones y últimos contactos |
| **Copiloto** | Chat/Estrella | AI chat/voz (o "activar" si está apagado) |

### 4.3 Botón flotante "+" (Captura rápida)

Menú que aparece desde cualquier pantalla:

```
         ┌─────────────────────┐
         │  + Entrada rápida   │  ← Texto o voz
         ├─────────────────────┤
         │  ✓ Marcar ritmo     │  ← Checklist rápido
         ├─────────────────────┤
         │  🎹 Registrar sesión │  ← Para prácticas/hobbies
         ├─────────────────────┤
         │  👤 Interacción      │  ← Contacté a alguien
         ├─────────────────────┤
         │  💡 Nueva idea       │  ← Captura creativa
         ├─────────────────────┤
         │  🎯 Nuevo objetivo   │  ← Crear meta
         └─────────────────────┘
```

### 4.4 Accesos secundarios (en header)

- **Búsqueda**: Icono lupa → Pantalla L2
- **Calendario**: Icono calendario → Pantalla L1
- **Ajustes**: Desde perfil o menú

---

## 5. Catálogo de Pantallas

### Índice de pantallas (38 total)

| Grupo | ID | Nombre | MVP |
|-------|-----|--------|-----|
| **Onboarding** | A1 | Bienvenida | ✓ |
| | A2 | Configurar áreas | ✓ |
| | A3 | Ritmos iniciales | ✓ |
| | A4 | Personas importantes | ✓ |
| | A5 | Preferencias | ✓ |
| | A6 | AI opcional | ✓ |
| **Hoy** | B1 | Dashboard | ✓ |
| | B2 | Check-in (mañana/noche) | ✓ |
| | B3 | Sugerencias (inbox) | ✓ |
| **Registro** | C1 | Timeline | ✓ |
| | C2 | Nueva entrada (texto) | ✓ |
| | C3 | Nueva entrada (voz) | ✓ |
| | C4 | Detalle de entrada | ✓ |
| **Áreas** | D1 | Lista de áreas | ✓ |
| | D2 | Detalle de área | ✓ |
| | D3 | Configurar área | |
| **Ritmos** | E1 | Lista de ritmos | ✓ |
| | E2 | Detalle de ritmo | ✓ |
| | E3 | Registrar sesión | ✓ |
| **Metas** | F1 | Lista de metas | |
| | F2 | Detalle de meta | |
| | F3 | Crear meta | |
| **Personas** | G1 | Lista de personas | ✓ |
| | G2 | Detalle de persona | ✓ |
| | G3 | Registrar interacción | ✓ |
| **Ideas** | H1 | Inbox de ideas | |
| | H2 | Detalle de idea | |
| **Insights** | I1 | Dashboard de insights | |
| | I2 | Revisión semanal | |
| **Copiloto** | J1 | Chat | ✓ |
| | J2 | Voz | ✓ |
| | J3 | Cambios propuestos | ✓ |
| | J4 | Preferencias del copiloto | ✓ |
| **Ajustes** | K1 | Ajustes generales | ✓ |
| | K2 | Contenido sensible | ✓ |
| **Auxiliares** | L1 | Calendario | |
| | L2 | Búsqueda | |
| | L3 | Bienvenida de vuelta | |

---

### A) ONBOARDING (Primer uso)

#### A1 — Bienvenida
```
┌─────────────────────────────────────┐
│                                     │
│         [Ilustración]               │
│                                     │
│     "Tu copiloto de vida"           │
│                                     │
│   Registra, da seguimiento,         │
│   y recibe sugerencias.             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Quiero algo ligero          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Quiero algo completo        │  │
│  └───────────────────────────────┘  │
│                                     │
│          Saltar setup →             │
│                                     │
└─────────────────────────────────────┘
```

**Comportamiento:**
- "Ligero" → preselecciona plantilla Minimal
- "Completo" → preselecciona plantilla Equilibrado
- Saltar → valores por defecto, se puede configurar después

---

#### A2 — Configurar Áreas
```
┌─────────────────────────────────────┐
│  ← Atrás              Siguiente →   │
├─────────────────────────────────────┤
│                                     │
│   ¿Qué dimensiones de tu vida      │
│   quieres seguir?                   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [✓] 💪 Salud                  │  │
│  │ [✓] 💼 Trabajo                │  │
│  │ [✓] 👥 Relaciones             │  │
│  │ [ ] 💰 Finanzas               │  │
│  │ [ ] 🙏 Fe / Espiritualidad    │  │
│  │ [ ] 📚 Aprendizaje            │  │
│  │ [ ] 🎨 Creatividad            │  │
│  │ [ ] 🤝 Servicio               │  │
│  │ [ ] ❤️ Pareja                 │  │
│  │                               │  │
│  │ + Crear área personalizada    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Plantillas:                        │
│  [Minimal] [Equilibrado] [Fe+Com]   │
│  [Productividad] [Creativo]         │
│                                     │
│  Puedes cambiar esto cuando quieras │
│                                     │
└─────────────────────────────────────┘
```

---

#### A3 — Ritmos iniciales
```
┌─────────────────────────────────────┐
│  ← Atrás              Siguiente →   │
├─────────────────────────────────────┤
│                                     │
│   Elige 3-8 hábitos o prácticas    │
│   para empezar                      │
│                                     │
│  Sugeridos para ti:                 │
│  ┌───────────────────────────────┐  │
│  │ [✓] Beber agua (diario)       │  │
│  │ [✓] Movimiento (diario)       │  │
│  │ [✓] Gratitud (diario)         │  │
│  │ [ ] Lectura (diario)          │  │
│  │ [ ] Meditación (diario)       │  │
│  │ [ ] Ejercicio (3x semana)     │  │
│  │ [ ] Revisión semanal (semanal)│  │
│  └───────────────────────────────┘  │
│                                     │
│  + Crear ritmo personalizado        │
│                                     │
│  ────────────────────────────────   │
│  Configurar seleccionados:          │
│                                     │
│  Beber agua                         │
│  Frecuencia: [Diario ▼]             │
│  Recordatorio: [08:00 ▼] [✓]        │
│  ¿Por qué? [___________________]    │
│                                     │
└─────────────────────────────────────┘
```

---

#### A4 — Personas importantes
```
┌─────────────────────────────────────┐
│  ← Atrás              Siguiente →   │
├─────────────────────────────────────┤
│                                     │
│   ¿Con quién quieres mantener      │
│   contacto regular?                 │
│                                     │
│   Círculo cercano (5-20 personas)   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ + Agregar persona             │  │
│  │                               │  │
│  │ [Importar de contactos]       │  │
│  │ (opcional, nunca se comparte) │  │
│  └───────────────────────────────┘  │
│                                     │
│  Personas agregadas:                │
│  ┌───────────────────────────────┐  │
│  │ 👤 Mamá        [Cada 1 sem ▼] │  │
│  │ 👤 Carlos      [Cada 2 sem ▼] │  │
│  │ 👤 Ana         [Cada mes ▼]   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Puedes agregar más después         │
│  [Saltar por ahora]                 │
│                                     │
└─────────────────────────────────────┘
```

---

#### A5 — Preferencias
```
┌─────────────────────────────────────┐
│  ← Atrás              Siguiente →   │
├─────────────────────────────────────┤
│                                     │
│   Preferencias                      │
│                                     │
│  Notificaciones                     │
│  ┌───────────────────────────────┐  │
│  │ ○ Suaves (solo recordatorios) │  │
│  │ ● Moderadas (+ sugerencias)   │  │
│  │ ○ Completas (todo)            │  │
│  └───────────────────────────────┘  │
│                                     │
│  Privacidad                         │
│  ┌───────────────────────────────┐  │
│  │ [✓] Bloquear app con PIN/     │  │
│  │     biometría (recomendado)   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Respaldo                           │
│  ┌───────────────────────────────┐  │
│  │ [ ] Sincronizar con iCloud    │  │
│  │ [✓] Respaldo local automático │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

#### A6 — AI opcional
```
┌─────────────────────────────────────┐
│  ← Atrás              Empezar →     │
├─────────────────────────────────────┤
│                                     │
│   Copiloto AI (opcional)            │
│                                     │
│   Un asistente que te ayuda a       │
│   registrar y organizar tu vida     │
│   conversando.                      │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [ ] Activar Copiloto          │  │
│  │                               │  │
│  │ Necesitas tu propia API key   │  │
│  │ de OpenAI, Anthropic, etc.    │  │
│  │                               │  │
│  │ [Pegar API key: ___________]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  El copiloto puede:                 │
│  ┌───────────────────────────────┐  │
│  │ [✓] Leer tus datos            │  │
│  │ [✓] Sugerir acciones          │  │
│  │ [✓] Proponer cambios          │  │
│  │ [ ] Ejecutar con confirmación │  │
│  └───────────────────────────────┘  │
│                                     │
│  Sin copiloto la app funciona      │
│  exactamente igual.                 │
│                                     │
│  [Configurar después]               │
│                                     │
└─────────────────────────────────────┘
```

---

### B) HOY (Centro operativo)

#### B1 — Dashboard
```
┌─────────────────────────────────────┐
│  Hoy                    🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│                                     │
│  Buenos días, [Nombre]              │
│  Miércoles, 29 de enero             │
│                                     │
│  ┌─ Check-in rápido ─────────────┐  │
│  │ 😊 Ánimo    [● ● ● ○ ○]       │  │
│  │ ⚡ Energía  [● ● ○ ○ ○]       │  │
│  │ 🎯 Enfoque  [● ● ● ● ○]       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Ritmos de hoy ───────────────┐  │
│  │ [✓] Beber agua                │  │
│  │ [ ] Movimiento                │  │
│  │ [ ] Gratitud                  │  │
│  │ [ ] Lectura                   │  │
│  │                    Ver todos →│  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Siguiente acción ────────────┐  │
│  │ 🎹 Practicar piano (20 min)   │  │
│  │    Meta: Aprender piano       │  │
│  │              [Hecho] [Después]│  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Personas ────────────────────┐  │
│  │ ⚠️ 45 días sin hablar con     │  │
│  │    Carlos                     │  │
│  │         [Registrar contacto]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Sugerencias (3) ─────────────┐  │
│  │ → Ver todas                   │  │
│  └───────────────────────────────┘  │
│                                     │
│                [ + ]                │
│                                     │
├─────────────────────────────────────┤
│ [Hoy] [Registro] [Áreas] [👥] [AI] │
└─────────────────────────────────────┘
```

---

#### B2 — Check-in (Mañana / Noche)
```
┌─────────────────────────────────────┐
│  ← Cerrar          Check-in mañana  │
├─────────────────────────────────────┤
│                                     │
│  ☀️ Buenos días                     │
│                                     │
│  ¿Cómo te sientes?                  │
│  [😫] [😕] [😐] [🙂] [😊]           │
│                                     │
│  ¿Cómo está tu energía?             │
│  [● ○ ○ ○ ○]  Baja                  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Intención para hoy:                │
│  [_________________________________]│
│                                     │
│  3 prioridades:                     │
│  1. [_____________________________] │
│  2. [_____________________________] │
│  3. [_____________________________] │
│                                     │
│  ¿Qué haría que hoy sea un buen    │
│  día?                               │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [🎤 Hacer check-in por voz]        │
│                                     │
│           [Guardar]                 │
│                                     │
└─────────────────────────────────────┘
```

**Check-in noche:** Similar pero con:
- ¿Qué salió bien hoy?
- Gratitud (3 cosas)
- ¿Qué aprendí?
- Una mejora para mañana

---

#### B3 — Sugerencias (Inbox)
```
┌─────────────────────────────────────┐
│  ← Hoy                 Sugerencias  │
├─────────────────────────────────────┤
│                                     │
│  3 sugerencias pendientes           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 👤 Reconexión                 │  │
│  │                               │  │
│  │ Llevas 45 días sin hablar     │  │
│  │ con Carlos.                   │  │
│  │                               │  │
│  │ [Registrar contacto]          │  │
│  │ [Posponer 1 sem] [Descartar]  │  │
│  │                               │  │
│  │ ☐ No sugerir más para Carlos  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎹 Consistencia               │  │
│  │                               │  │
│  │ Tu práctica de piano bajó:    │  │
│  │ solo 2 sesiones en 3 semanas. │  │
│  │                               │  │
│  │ [Registrar sesión]            │  │
│  │ [Ajustar ritmo] [Pausar]      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📋 Planificación              │  │
│  │                               │  │
│  │ No has hecho revisión semanal │  │
│  │ en 2 semanas.                 │  │
│  │                               │  │
│  │ [Hacer ahora] [Domingo]       │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

### C) REGISTRO (Journal + Timeline)

#### C1 — Timeline
```
┌─────────────────────────────────────┐
│  Registro               🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│  Filtros: [Todos ▼] [Área ▼] [Fecha]│
├─────────────────────────────────────┤
│                                     │
│  HOY                                │
│  ┌───────────────────────────────┐  │
│  │ 10:30  ✓ Meditación (15 min)  │  │
│  │ 09:15  📝 "Desperté con..."   │  │
│  │ 08:00  ✓ Beber agua           │  │
│  └───────────────────────────────┘  │
│                                     │
│  AYER                               │
│  ┌───────────────────────────────┐  │
│  │ 21:00  📝 Check-in noche      │  │
│  │ 18:30  👤 Llamé a Mamá (20m)  │  │
│  │ 15:00  🎹 Piano: escalas (30m)│  │
│  │ 09:00  📝 "Reunión difícil..."│  │
│  │ 08:00  ☀️ Check-in mañana     │  │
│  └───────────────────────────────┘  │
│                                     │
│  27 ENE                             │
│  ┌───────────────────────────────┐  │
│  │ ...                           │  │
│  └───────────────────────────────┘  │
│                                     │
│                [ + ]                │
│                                     │
├─────────────────────────────────────┤
│ [Hoy] [Registro] [Áreas] [👥] [AI] │
└─────────────────────────────────────┘
```

---

#### C2 — Nueva entrada (texto)
```
┌─────────────────────────────────────┐
│  ✕ Cancelar      Nueva entrada  ✓  │
├─────────────────────────────────────┤
│                                     │
│  [_________________________________]│
│  [_________________________________]│
│  [_________________________________]│
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Prompts (opcional):                │
│  • ¿Qué pasó hoy?                   │
│  • ¿Cómo me siento ahora?           │
│  • ¿Qué aprendí?                    │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Adjuntar:                          │
│  [🎤 Audio] [📷 Foto] [📍 Ubicación]│
│                                     │
│  Vincular:                          │
│  Áreas:    [+ Salud] [+ Trabajo]    │
│  Personas: [+ Carlos]               │
│  Ritmos:   [+ Meditación]           │
│  Metas:    [+ Aprender piano]       │
│  Tags:     [+ reflexión]            │
│                                     │
│  Privacidad: [Normal ▼]             │
│  • Normal                           │
│  • Privada (oculta en previews)     │
│  • Ultra privada (requiere PIN)     │
│                                     │
└─────────────────────────────────────┘
```

---

#### C3 — Nueva entrada (voz)
```
┌─────────────────────────────────────┐
│  ✕ Cancelar        Entrada por voz  │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│           ┌─────────┐               │
│           │         │               │
│           │   🎤    │               │
│           │         │               │
│           └─────────┘               │
│                                     │
│         Grabando... 0:45            │
│                                     │
│         [■ Detener]                 │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Transcripción:                     │
│  ┌───────────────────────────────┐  │
│  │ "Hoy tuve una reunión         │  │
│  │ complicada con el cliente.    │  │
│  │ Me sentí frustrado porque..." │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│  Si tienes Copiloto activo:         │
│                                     │
│  [Convertir en actualizaciones]     │
│  El AI propondrá:                   │
│  • Crear entrada de diario          │
│  • Marcar ritmos mencionados        │
│  • Registrar interacciones          │
│                                     │
└─────────────────────────────────────┘
```

---

#### C4 — Detalle de entrada
```
┌─────────────────────────────────────┐
│  ← Timeline      29 ene, 09:15  ✏️  │
├─────────────────────────────────────┤
│                                     │
│  Desperté con energía baja pero     │
│  después de meditar me sentí mejor. │
│  La reunión de ayer me dejó         │
│  pensando en...                     │
│                                     │
│  [📷 foto adjunta]                  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Vinculado a:                       │
│  ┌───────────────────────────────┐  │
│  │ 💪 Salud                      │  │
│  │ 💼 Trabajo                    │  │
│  │ ✓ Meditación                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Tags: #reflexión #mañana           │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Acciones:                          │
│  [Editar] [Duplicar]                │
│  [Convertir a idea]                 │
│  [Extraer tareas]                   │
│  [Eliminar]                         │
│                                     │
└─────────────────────────────────────┘
```

---

### D) ÁREAS (Dimensiones de vida)

#### D1 — Lista de áreas
```
┌─────────────────────────────────────┐
│  Áreas                  🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💪 Salud              🟢 Alta │  │
│  │    3 ritmos • 1 meta          │  │
│  │    Última actividad: hoy      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💼 Trabajo            🟡 Media│  │
│  │    2 ritmos • 2 metas         │  │
│  │    Última actividad: ayer     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 👥 Relaciones         🟠 Baja │  │
│  │    0 ritmos • 0 metas         │  │
│  │    Última actividad: 5 días   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🙏 Fe                 🟢 Alta │  │
│  │    2 ritmos • 1 meta          │  │
│  │    Última actividad: hoy      │  │
│  └───────────────────────────────┘  │
│                                     │
│  [+ Crear área]                     │
│                                     │
│                [ + ]                │
│                                     │
├─────────────────────────────────────┤
│ [Hoy] [Registro] [Áreas] [👥] [AI] │
└─────────────────────────────────────┘
```

**Indicador de "salud" del área:**
- 🟢 Alta = actividad reciente + ritmos al día
- 🟡 Media = algo de actividad
- 🟠 Baja = poca atención últimamente
- (No usar rojo para evitar ansiedad)

---

#### D2 — Detalle de área
```
┌─────────────────────────────────────┐
│  ← Áreas                  💪 Salud  │
├─────────────────────────────────────┤
│                                     │
│  Atención: 🟢 Alta                  │
│  Esta semana: 5 entradas, 12 ritmos │
│                                     │
│  ═══════════════════════════════    │
│                                     │
│  Ritmos                    Ver más →│
│  ┌───────────────────────────────┐  │
│  │ ✓ Ejercicio      [3/3 sem]   │  │
│  │ ✓ Dormir 7h+     [5/7 días]  │  │
│  │   Beber agua     [hoy pend]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Metas                     Ver más →│
│  ┌───────────────────────────────┐  │
│  │ 🏃 Correr 10K         [65%]  │  │
│  │   Próximo: correr 6km domingo│  │
│  └───────────────────────────────┘  │
│                                     │
│  Entradas recientes        Ver más →│
│  ┌───────────────────────────────┐  │
│  │ Hoy: "Buena sesión de gym..." │  │
│  │ Ayer: "Dormí mal porque..."   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Sugerencias para esta área         │
│  ┌───────────────────────────────┐  │
│  │ "Tus días de ejercicio        │  │
│  │  coinciden con mejor ánimo"   │  │
│  └───────────────────────────────┘  │
│                                     │
│  [⚙️ Configurar área]               │
│                                     │
└─────────────────────────────────────┘
```

---

#### D3 — Configurar área
```
┌─────────────────────────────────────┐
│  ← Salud           Configurar área  │
├─────────────────────────────────────┤
│                                     │
│  Nombre: [Salud________________]    │
│                                     │
│  Icono:  [💪 ▼]                     │
│                                     │
│  Color:  [🟢 Verde ▼]               │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Visibilidad                        │
│  ┌───────────────────────────────┐  │
│  │ [✓] Visible en lista          │  │
│  │ [✓] Incluir en dashboard      │  │
│  │ [ ] Ocultar de búsqueda       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Prompts de journal (opcionales)    │
│  ┌───────────────────────────────┐  │
│  │ • ¿Cómo está mi cuerpo hoy?   │  │
│  │ • ¿Dormí bien?                │  │
│  │ • ¿Qué comí?                  │  │
│  │ [+ Agregar prompt]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  Métricas (opcional)                │
│  ┌───────────────────────────────┐  │
│  │ [ ] Horas de sueño            │  │
│  │ [ ] Peso                      │  │
│  │ [ ] Pasos (si hay integración)│  │
│  └───────────────────────────────┘  │
│                                     │
│  [Guardar]        [Eliminar área]   │
│                                     │
└─────────────────────────────────────┘
```

---

### E) RITMOS (Hábitos, rutinas, prácticas)

#### E1 — Lista de ritmos
```
┌─────────────────────────────────────┐
│  Ritmos                 🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│  [Hoy] [Semana] [Todos] [Pausados]  │
├─────────────────────────────────────┤
│                                     │
│  HOY (5 pendientes)                 │
│  ┌───────────────────────────────┐  │
│  │ [✓] Beber agua                │  │
│  │ [✓] Meditación       15 min   │  │
│  │ [ ] Lectura          30 min   │  │
│  │ [ ] Gratitud                  │  │
│  │ [ ] Ejercicio        45 min   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ESTA SEMANA                        │
│  ┌───────────────────────────────┐  │
│  │ 🎹 Piano         [2/3 hecho]  │  │
│  │    Próximo: hoy               │  │
│  │                               │  │
│  │ 📋 Revisión sem.  [0/1 hecho] │  │
│  │    Próximo: domingo           │  │
│  └───────────────────────────────┘  │
│                                     │
│  Consistencia general: 78%          │
│  (sin juicio, solo información)     │
│                                     │
│  [+ Crear ritmo]                    │
│                                     │
│                [ + ]                │
│                                     │
├─────────────────────────────────────┤
│ [Hoy] [Registro] [Áreas] [👥] [AI] │
└─────────────────────────────────────┘
```

---

#### E2 — Detalle de ritmo
```
┌─────────────────────────────────────┐
│  ← Ritmos                  🎹 Piano │
├─────────────────────────────────────┤
│                                     │
│  Estado: 🟢 Activo                  │
│                                     │
│  Por qué:                           │
│  "Quiero tocar mis canciones        │
│   favoritas y relajarme"            │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Frecuencia: 3 veces por semana     │
│  Duración objetivo: 30 min          │
│  Recordatorio: Lun, Mié, Vie 19:00  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Historial (últimos 30 días)        │
│  ┌───────────────────────────────┐  │
│  │  L  M  M  J  V  S  D          │  │
│  │  ●  ·  ●  ·  ●  ·  ·  sem -3 │  │
│  │  ●  ·  ·  ·  ●  ·  ·  sem -2 │  │
│  │  ·  ·  ●  ·  ·  ·  ·  sem -1 │  │
│  │  ●  ·  ·  ·  ·  ·  ·  actual │  │
│  │                               │  │
│  │  Consistencia: 60% (6/10)     │  │
│  └───────────────────────────────┘  │
│                                     │
│  Vinculado a:                       │
│  • Meta: Aprender piano             │
│  • Área: Creatividad                │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Ajustes:                           │
│  [Hacerlo más fácil] → 15 min       │
│  [Cambiar horario]                  │
│  [Pausar temporalmente]             │
│  [Archivar]                         │
│                                     │
│  [🎹 Registrar sesión]              │
│                                     │
└─────────────────────────────────────┘
```

---

#### E3 — Registrar sesión (para prácticas/hobbies)
```
┌─────────────────────────────────────┐
│  ✕ Cancelar     Sesión de Piano  ✓  │
├─────────────────────────────────────┤
│                                     │
│  ¿Cuánto tiempo practicaste?        │
│       ┌─────────────────┐           │
│       │      35         │           │
│       │    minutos      │           │
│       └─────────────────┘           │
│         [-5]  [+5]  [+15]           │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Qué tipo de práctica?             │
│  [Escalas] [Acordes] [Canción]      │
│  [Lectura] [Improvisación] [Otro]   │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Qué trabajaste específicamente?   │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Cómo fue la sesión?               │
│  [😫] [😕] [😐] [🙂] [😊]           │
│                                     │
│  ¿Cómo te sentiste?                 │
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Adjuntar:                          │
│  [📷 Foto] [🎥 Video] [🎤 Audio]    │
│                                     │
│           [Guardar sesión]          │
│                                     │
└─────────────────────────────────────┘
```

---

### F) METAS (Objetivos y proyectos)

#### F1 — Lista de metas
```
┌─────────────────────────────────────┐
│  Metas                  🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│  [Activas] [Pausadas] [Completadas] │
├─────────────────────────────────────┤
│                                     │
│  ACTIVAS (3)                        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎹 Aprender piano             │  │
│  │    ████████░░░░  65%          │  │
│  │    Próximo: practicar escalas │  │
│  │    Área: Creatividad          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🏃 Correr 10K                 │  │
│  │    █████░░░░░░░  40%          │  │
│  │    Próximo: correr 6km        │  │
│  │    Fecha: 15 marzo            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📖 Leer 12 libros este año    │  │
│  │    ██░░░░░░░░░░  2/12         │  │
│  │    Próximo: terminar actual   │  │
│  └───────────────────────────────┘  │
│                                     │
│  [+ Nueva meta]                     │
│                                     │
│                [ + ]                │
│                                     │
└─────────────────────────────────────┘
```

---

#### F2 — Detalle de meta
```
┌─────────────────────────────────────┐
│  ← Metas            🎹 Aprender piano│
├─────────────────────────────────────┤
│                                     │
│  Estado: 🟢 Activa                  │
│  Progreso: ████████░░░░  65%        │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  POR QUÉ IMPORTA                    │
│  "Siempre quise tocar piano. Me     │
│   relaja y quiero tocar para mi     │
│   familia en navidad."              │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  PRÓXIMO PASO                       │
│  ┌───────────────────────────────┐  │
│  │ → Practicar escalas mayores   │  │
│  │   [Hecho] [Editar]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  MILESTONES                         │
│  [✓] Aprender postura correcta      │
│  [✓] Escalas básicas                │
│  [✓] Acordes mayores                │
│  [ ] Primera canción completa       │
│  [ ] Tocar de memoria               │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  RITMOS VINCULADOS                  │
│  • 🎹 Práctica piano (3x sem)       │
│                                     │
│  PERSONAS                           │
│  • 👤 Profesor Juan (mentor)        │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  DIARIO DE LA META          Ver más│
│  ┌───────────────────────────────┐  │
│  │ 28 ene: "Hoy logré tocar..."  │  │
│  │ 25 ene: "Sesión frustrante..."│  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Pausar] [Completar] [Abandonar]   │
│                                     │
└─────────────────────────────────────┘
```

---

#### F3 — Crear meta
```
┌─────────────────────────────────────┐
│  ✕ Cancelar          Nueva meta  ✓  │
├─────────────────────────────────────┤
│                                     │
│  ¿Qué quieres lograr?               │
│  [_________________________________]│
│                                     │
│  ¿Para cuándo? (opcional)           │
│  [Seleccionar fecha]  [Sin fecha]   │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Por qué es importante para ti?    │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Cómo sabrás que lo lograste?      │
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Primeros 3 pasos:                  │
│  1. [_____________________________] │
│  2. [_____________________________] │
│  3. [_____________________________] │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Vincular a:                        │
│  Área: [Creatividad ▼]              │
│  Ritmo sugerido: [+ Práctica piano] │
│                                     │
│           [Crear meta]              │
│                                     │
└─────────────────────────────────────┘
```

---

### G) PERSONAS (Relaciones)

#### G1 — Lista de personas
```
┌─────────────────────────────────────┐
│  Personas               🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│  [Todos] [Cercanos] [Familia] [Trab]│
│                                     │
│  Ordenar: [Último contacto ▼]       │
├─────────────────────────────────────┤
│                                     │
│  ⚠️ NECESITAN ATENCIÓN              │
│  ┌───────────────────────────────┐  │
│  │ 👤 Carlos          45 días    │  │
│  │    Frecuencia deseada: 2 sem  │  │
│  │    [Registrar contacto]       │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 👤 Ana             30 días    │  │
│  │    Frecuencia deseada: 1 mes  │  │
│  └───────────────────────────────┘  │
│                                     │
│  AL DÍA                             │
│  ┌───────────────────────────────┐  │
│  │ 👤 Mamá            2 días     │  │
│  │ 👤 Juan            5 días     │  │
│  │ 👤 María           1 semana   │  │
│  └───────────────────────────────┘  │
│                                     │
│  [+ Agregar persona]                │
│                                     │
│                [ + ]                │
│                                     │
├─────────────────────────────────────┤
│ [Hoy] [Registro] [Áreas] [👥] [AI] │
└─────────────────────────────────────┘
```

---

#### G2 — Detalle de persona
```
┌─────────────────────────────────────┐
│  ← Personas                👤 Carlos│
├─────────────────────────────────────┤
│                                     │
│  Círculo: Cercano                   │
│  Última interacción: hace 45 días   │
│  Frecuencia deseada: cada 2 semanas │
│                                     │
│  ⚠️ Sugerencia: contactar pronto    │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  SOBRE CARLOS                       │
│                                     │
│  Cómo nos conocimos:                │
│  "Compañeros en la universidad,     │
│   vivimos juntos 2 años."           │
│                                     │
│  Lo que le importa:                 │
│  "Familia, startups, fútbol"        │
│                                     │
│  Para preguntar la próxima vez:     │
│  • ¿Cómo va su nuevo trabajo?       │
│  • ¿Nació su segundo hijo?          │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  HISTORIAL                  Ver más │
│  ┌───────────────────────────────┐  │
│  │ 15 dic: Llamada (30 min)      │  │
│  │   "Hablamos de su nuevo..."   │  │
│  │                               │  │
│  │ 20 nov: Café (1 hora)         │  │
│  │   "Nos pusimos al día..."     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  RECORDATORIOS                      │
│  🎂 Cumpleaños: 15 marzo            │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Registrar interacción]            │
│  [Configurar] [Archivar]            │
│                                     │
└─────────────────────────────────────┘
```

---

#### G3 — Registrar interacción
```
┌─────────────────────────────────────┐
│  ✕ Cancelar      Interacción con  ✓ │
│                  Carlos             │
├─────────────────────────────────────┤
│                                     │
│  Tipo de interacción:               │
│  [📞 Llamada] [💬 Mensaje]          │
│  [☕ En persona] [🎉 Evento]        │
│  [Otro]                             │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Cuándo? [Hoy ▼]                   │
│                                     │
│  Duración (opcional):               │
│  [___] minutos                      │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿De qué hablaron? (opcional)       │
│  [_________________________________]│
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Cómo fue?                         │
│  [😫] [😕] [😐] [🙂] [😊]           │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Seguimiento:                       │
│  [ ] Recordar contactar en:         │
│      [2 semanas ▼]                  │
│                                     │
│  Para preguntar la próxima vez:     │
│  [_________________________________]│
│                                     │
│           [Guardar]                 │
│                                     │
└─────────────────────────────────────┘
```

---

### H) IDEAS (Inbox creativo)

#### H1 — Inbox de ideas
```
┌─────────────────────────────────────┐
│  Ideas                  🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│  [Todas] [Crudas] [En progreso]     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💡 App para tracking de vida  │  │
│  │    Cruda • hace 2 días        │  │
│  │    #proyecto #tech            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💡 Viaje a Japón              │  │
│  │    En progreso • hace 1 sem   │  │
│  │    #viaje #2025               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💡 Empezar podcast            │  │
│  │    Cruda • hace 3 sem         │  │
│  │    #proyecto #creatividad     │  │
│  └───────────────────────────────┘  │
│                                     │
│  [+ Nueva idea]                     │
│                                     │
└─────────────────────────────────────┘
```

---

#### H2 — Detalle de idea
```
┌─────────────────────────────────────┐
│  ← Ideas        💡 App tracking vida│
├─────────────────────────────────────┤
│                                     │
│  Estado: [Cruda ▼]                  │
│  Creada: 27 enero 2026              │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  DESCRIPCIÓN                        │
│  Una app que combine hábitos,       │
│  journal, relaciones, y un          │
│  copiloto AI para registrar todo    │
│  conversando...                     │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  NOTAS                              │
│  • Ver cómo funciona Notion         │
│  • Investigar API de OpenAI         │
│  • Posible nombre: Life Copilot     │
│                                     │
│  [+ Agregar nota]                   │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  LINKS                              │
│  • notion.so                        │
│  • openai.com                       │
│                                     │
│  [+ Agregar link]                   │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Tags: #proyecto #tech              │
│  Área: Creatividad                  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Convertir a objetivo]             │
│  [Archivar]                         │
│                                     │
└─────────────────────────────────────┘
```

---

### I) INSIGHTS Y REVISIÓN

#### I1 — Dashboard de insights
```
┌─────────────────────────────────────┐
│  Insights               🔍  📅  ⚙️  │
├─────────────────────────────────────┤
│                                     │
│  Últimos 30 días                    │
│                                     │
│  ESTADO DE ÁNIMO                    │
│  ┌───────────────────────────────┐  │
│  │  📈 Promedio: 3.8/5           │  │
│  │  [gráfica de línea semanal]   │  │
│  │                               │  │
│  │  Mejor día: Sábados           │  │
│  │  Peor día: Lunes              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ÁREAS MÁS ATENDIDAS                │
│  ┌───────────────────────────────┐  │
│  │  1. Salud         ████████    │  │
│  │  2. Fe            ██████      │  │
│  │  3. Trabajo       ████        │  │
│  │  4. Relaciones    ██          │  │
│  └───────────────────────────────┘  │
│                                     │
│  SEÑALES                            │
│  ┌───────────────────────────────┐  │
│  │ ⚠️ Energía baja 3 semanas     │  │
│  │    seguidas (coincide con     │  │
│  │    dormir <6h)                │  │
│  │                               │  │
│  │ 🟢 Ejercicio consistente      │  │
│  │    mejora tu ánimo +15%       │  │
│  └───────────────────────────────┘  │
│                                     │
│  LO QUE FUNCIONÓ                    │
│  ┌───────────────────────────────┐  │
│  │ "Meditar antes de trabajar"   │  │
│  │ "Llamar a mamá los domingos"  │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Hacer revisión semanal]           │
│                                     │
└─────────────────────────────────────┘
```

---

#### I2 — Revisión semanal
```
┌─────────────────────────────────────┐
│  ← Insights        Revisión semanal │
├─────────────────────────────────────┤
│                                     │
│  Semana del 22-28 enero             │
│                                     │
│  ════════════════════════════════   │
│                                     │
│  ¿Qué salió bien esta semana?       │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿Qué no salió como esperabas?      │
│  [_________________________________]│
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Una lección de esta semana:        │
│  [_________________________________]│
│                                     │
│  ────────────────────────────────   │
│                                     │
│  RITMOS: ¿algún ajuste?             │
│  ┌───────────────────────────────┐  │
│  │ Piano: 1/3 sesiones           │  │
│  │ [Mantener] [Ajustar] [Pausar] │  │
│  │                               │  │
│  │ Meditación: 7/7 días 🎉       │  │
│  │ [Mantener]                    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ¿A quién quieres contactar?        │
│  Sugeridos: Carlos (45 días)        │
│  [_______________] [+ Agregar]      │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Prioridades para la próxima semana │
│  1. [_____________________________] │
│  2. [_____________________________] │
│  3. [_____________________________] │
│                                     │
│  ────────────────────────────────   │
│                                     │
│         [Completar revisión]        │
│                                     │
└─────────────────────────────────────┘
```

---

### J) COPILOTO (AI Chat / Voz)

#### J1 — Chat
```
┌─────────────────────────────────────┐
│  Copiloto               ⚙️          │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🤖 Hola! ¿Cómo va tu día?     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Bien, hoy practiqué piano     │  │
│  │ 30 minutos y hablé con mamá.  │ 👤│
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🤖 Genial. Detecté:           │  │
│  │                               │  │
│  │ • Sesión de piano (30 min)    │  │
│  │ • Interacción con Mamá        │  │
│  │                               │  │
│  │ ¿Quieres que lo registre?     │  │
│  │                               │  │
│  │ [Ver cambios propuestos]      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Sí, y también recordarme      │  │
│  │ llamar a Carlos esta semana   │ 👤│
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🤖 Perfecto, agregué:         │  │
│  │ • Recordatorio: llamar Carlos │  │
│  │                               │  │
│  │ Por cierto, llevas 45 días    │  │
│  │ sin hablar con él. ¿Todo bien?│  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  Accesos rápidos:                   │
│  [Registrar día] [Planear semana]   │
│  [Revisar relaciones]               │
├─────────────────────────────────────┤
│  [____________________] [🎤] [➤]   │
└─────────────────────────────────────┘
```

---

#### J2 — Voz
```
┌─────────────────────────────────────┐
│  ← Copiloto            Modo voz     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│           ┌─────────┐               │
│           │         │               │
│           │   🎤    │               │
│           │         │               │
│           └─────────┘               │
│                                     │
│       Mantén presionado             │
│         para hablar                 │
│                                     │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Transcripción en vivo:             │
│  ┌───────────────────────────────┐  │
│  │ "Hoy fue un día productivo.   │  │
│  │ Hice ejercicio en la mañana,  │  │
│  │ tuve una reunión importante   │  │
│  │ y practiqué piano..."         │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Cancelar]     [Procesar]          │
│                                     │
│  Al procesar, el copiloto           │
│  propondrá actualizaciones          │
│  basadas en lo que dijiste.         │
│                                     │
└─────────────────────────────────────┘
```

---

#### J3 — Cambios propuestos
```
┌─────────────────────────────────────┐
│  ← Copiloto      Cambios propuestos │
├─────────────────────────────────────┤
│                                     │
│  El copiloto detectó estas          │
│  actualizaciones. Revisa y          │
│  confirma lo que quieras guardar.   │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ENTRADA DE DIARIO                  │
│  ┌───────────────────────────────┐  │
│  │ [✓] Crear entrada             │  │
│  │                               │  │
│  │ "Hoy fue un día productivo.   │  │
│  │ Hice ejercicio en la mañana,  │  │
│  │ tuve una reunión importante   │  │
│  │ y practiqué piano."           │  │
│  │                               │  │
│  │ Áreas: Salud, Trabajo, Creat. │  │
│  │                    [Editar]   │  │
│  └───────────────────────────────┘  │
│                                     │
│  RITMOS                             │
│  ┌───────────────────────────────┐  │
│  │ [✓] Marcar: Ejercicio         │  │
│  │ [✓] Marcar: Piano (30 min)    │  │
│  │ [ ] Marcar: Meditación        │  │
│  └───────────────────────────────┘  │
│                                     │
│  RECORDATORIOS                      │
│  ┌───────────────────────────────┐  │
│  │ [✓] Llamar a Carlos           │  │
│  │     Fecha: viernes            │  │
│  │                    [Editar]   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Cancelar todo]    [Aplicar (4)]   │
│                                     │
└─────────────────────────────────────┘
```

---

#### J4 — Preferencias del copiloto
```
┌─────────────────────────────────────┐
│  ← Copiloto   Preferencias AI       │
├─────────────────────────────────────┤
│                                     │
│  API KEY                            │
│  ┌───────────────────────────────┐  │
│  │ sk-xxxxxxxxxxxxx...           │  │
│  │ [Editar] [Eliminar]           │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ESTILO DE COMUNICACIÓN             │
│  ┌───────────────────────────────┐  │
│  │ ○ Directo (respuestas cortas) │  │
│  │ ● Equilibrado                 │  │
│  │ ○ Coaching (más preguntas)    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  PERMISOS                           │
│  ┌───────────────────────────────┐  │
│  │ [✓] Leer mis datos            │  │
│  │ [✓] Sugerir acciones          │  │
│  │ [✓] Proponer cambios          │  │
│  │ [✓] Ejecutar con confirmación │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  LÍMITES                            │
│  ┌───────────────────────────────┐  │
│  │ [✓] No opinar sobre religión  │  │
│  │ [ ] No analizar salud mental  │  │
│  │ [✓] No sugerir sobre finanzas │  │
│  │ [+ Agregar límite]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  PRIVACIDAD                         │
│  ┌───────────────────────────────┐  │
│  │ ○ Guardar conversaciones      │  │
│  │ ● Solo guardar resultados     │  │
│  │ ○ No guardar nada             │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Borrar historial local]           │
│                                     │
└─────────────────────────────────────┘
```

---

### K) AJUSTES

#### K1 — Ajustes generales
```
┌─────────────────────────────────────┐
│  ← Hoy                    Ajustes   │
├─────────────────────────────────────┤
│                                     │
│  CUENTA                             │
│  ┌───────────────────────────────┐  │
│  │ Nombre: [Tu nombre]           │  │
│  │ [Editar perfil]               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  PRIVACIDAD Y SEGURIDAD             │
│  ┌───────────────────────────────┐  │
│  │ Bloqueo de app         [ON]   │  │
│  │ Usar biometría         [ON]   │  │
│  │ Modo discreto          [OFF]  │  │
│  │                               │  │
│  │ [Controles de contenido →]    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  NOTIFICACIONES                     │
│  ┌───────────────────────────────┐  │
│  │ Nivel: [Moderado ▼]           │  │
│  │ Horario: 08:00 - 22:00        │  │
│  │ [Configurar por tipo →]       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  DATOS                              │
│  ┌───────────────────────────────┐  │
│  │ [Exportar datos]              │  │
│  │   Formatos: JSON, CSV, PDF    │  │
│  │                               │  │
│  │ [Crear respaldo]              │  │
│  │ [Restaurar desde respaldo]    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ÁREAS                              │
│  ┌───────────────────────────────┐  │
│  │ [Gestionar áreas →]           │  │
│  │ [Plantillas →]                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  COPILOTO AI                        │
│  ┌───────────────────────────────┐  │
│  │ Estado: Activo                │  │
│  │ [Configurar →]                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  [Acerca de] [Enviar feedback]      │
│                                     │
└─────────────────────────────────────┘
```

---

#### K2 — Controles de contenido sensible
```
┌─────────────────────────────────────┐
│  ← Ajustes     Contenido sensible   │
├─────────────────────────────────────┤
│                                     │
│  Algunas áreas contienen            │
│  información personal sensible.     │
│  Aquí puedes controlar su           │
│  visibilidad.                       │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  OCULTAR ÁREAS                      │
│  ┌───────────────────────────────┐  │
│  │ [ ] Fe / Espiritualidad       │  │
│  │ [ ] Pareja / Relación         │  │
│  │ [ ] Salud                     │  │
│  │ [ ] Finanzas                  │  │
│  │                               │  │
│  │ Las áreas ocultas no aparecen │  │
│  │ en el dashboard ni búsqueda.  │  │
│  │ Solo accesibles desde Áreas   │  │
│  │ con autenticación adicional.  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ENTRADAS ULTRA PRIVADAS            │
│  ┌───────────────────────────────┐  │
│  │ [✓] Requerir PIN adicional    │  │
│  │ [✓] Ocultar de búsqueda       │  │
│  │ [✓] No mostrar en previews    │  │
│  │ [✓] No incluir en exports     │  │
│  │     automáticos               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  PERSONAS SENSIBLES                 │
│  ┌───────────────────────────────┐  │
│  │ Las personas marcadas como    │  │
│  │ "sensibles" no aparecen en    │  │
│  │ sugerencias ni previews.      │  │
│  │                               │  │
│  │ [Gestionar personas →]        │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

### L) PANTALLAS AUXILIARES

#### L1 — Calendario
```
┌─────────────────────────────────────┐
│  ← Hoy                  Calendario  │
├─────────────────────────────────────┤
│           ◄  Enero 2026  ►          │
├─────────────────────────────────────┤
│  L   M   M   J   V   S   D          │
│                                     │
│      ·   ·   ●   ●   ·   ·   1-5   │
│  ●   ●   ·   ●   ●   ·   ·   6-12  │
│  ●   ●   ●   ●   ●   ·   ●  13-19  │
│  ●   ●   ●   ●   ●   ·   ●  20-26  │
│  ●   ●   ●  [●]                27-31│
│                                     │
│  ● = días con actividad             │
├─────────────────────────────────────┤
│  Toggle: [Todo] [Solo ritmos]       │
├─────────────────────────────────────┤
│                                     │
│  29 ENERO (hoy)                     │
│  ┌───────────────────────────────┐  │
│  │ ✓ Meditación (15 min)         │  │
│  │ ✓ Beber agua                  │  │
│  │ ✓ Ejercicio (45 min)          │  │
│  │ 📝 "Desperté con energía..."  │  │
│  │ 👤 Llamada con Mamá           │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

#### L2 — Búsqueda
```
┌─────────────────────────────────────┐
│  ✕ Cerrar                 Búsqueda  │
├─────────────────────────────────────┤
│  [🔍 Buscar...________________]     │
│                                     │
│  Filtros: [Tipo ▼] [Área ▼] [Fecha] │
├─────────────────────────────────────┤
│                                     │
│  RECIENTES                          │
│  • piano                            │
│  • Carlos                           │
│  • reunión                          │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  RESULTADOS PARA "piano"            │
│                                     │
│  ENTRADAS (5)                       │
│  ┌───────────────────────────────┐  │
│  │ 28 ene: "Hoy logré tocar..."  │  │
│  │ 25 ene: "Sesión frustrante..."│  │
│  │ ...                           │  │
│  └───────────────────────────────┘  │
│                                     │
│  RITMOS (1)                         │
│  ┌───────────────────────────────┐  │
│  │ 🎹 Práctica de piano          │  │
│  └───────────────────────────────┘  │
│                                     │
│  METAS (1)                          │
│  ┌───────────────────────────────┐  │
│  │ 🎹 Aprender piano (65%)       │  │
│  └───────────────────────────────┘  │
│                                     │
│  SESIONES (8)                       │
│  ┌───────────────────────────────┐  │
│  │ 28 ene: 30 min - Escalas      │  │
│  │ 26 ene: 25 min - Acordes      │  │
│  │ ...                           │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

#### L3 — Bienvenida de vuelta
```
┌─────────────────────────────────────┐
│                                     │
│         [Ilustración]               │
│                                     │
│      ¡Qué bueno verte!              │
│                                     │
│   Han pasado 15 días desde tu       │
│   última visita.                    │
│                                     │
│   ────────────────────────────────  │
│                                     │
│   ¿Cómo quieres continuar?          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📊 Ver resumen rápido        │  │
│  │     (qué pasó en tus áreas)   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🌅 Empezar fresco            │  │
│  │     (ignorar el gap)          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ⚙️ Ajustar mi sistema        │  │
│  │     (simplificar ritmos)      │  │
│  └───────────────────────────────┘  │
│                                     │
│   Sin presión. Lo importante es     │
│   que estás aquí ahora.             │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Sistema de Sugerencias

### 6.1 Tipos de sugerencias

| Tipo | Trigger | Ejemplo |
|------|---------|---------|
| **Reconexión** | Días sin contacto > frecuencia deseada | "Llevas 45 días sin hablar con Carlos" |
| **Consistencia** | Ritmo en riesgo (X días sin marcar) | "Tu práctica de piano bajó 3 semanas" |
| **Balance** | Área sin actividad reciente | "Casi no registraste nada de 'Salud' esta semana" |
| **Energía** | Patrón detectado | "Días de baja energía coinciden con <6h sueño" |
| **Planificación** | Revisión pendiente | "No has hecho revisión semanal en 2 semanas" |
| **Celebración** | Logro alcanzado | "¡Completaste 7 días seguidos de meditación!" |

### 6.2 Reglas sin AI (funcionan siempre)

```
SI días_sin_contacto(persona) > frecuencia_deseada(persona) * 1.5
ENTONCES sugerir("Reconexión", persona)

SI días_sin_marcar(ritmo) > 5 AND estado(ritmo) == "activo"
ENTONCES sugerir("Consistencia", ritmo)

SI días_desde_última_entrada(área) > 7
ENTONCES sugerir("Balance", área)

SI días_desde_revisión_semanal > 14
ENTONCES sugerir("Planificación", "revisión_semanal")

SI días_consecutivos(ritmo) == 7
ENTONCES celebrar("Racha de 7 días", ritmo)
```

### 6.3 Reglas con AI (opcionales)

- Detectar emociones en entradas → sugerir check-in más profundo
- Identificar patrones de texto → proponer tags automáticos
- Resumir semana → generar insights personalizados
- Analizar conversación → proponer actualizaciones estructuradas

### 6.4 Anatomía de una sugerencia

```
┌─────────────────────────────────────┐
│ [Icono] [Tipo]                      │
│                                     │
│ [Mensaje principal]                 │
│                                     │
│ [Razón en texto pequeño]            │
│                                     │
│ [Acción principal]  [Acción sec.]   │
│                                     │
│ ☐ No sugerir más para [objeto]      │
└─────────────────────────────────────┘
```

### 6.5 Control del usuario

- **Posponer**: "Recordar en X días"
- **Descartar**: "No ahora" (puede volver)
- **Silenciar**: "No sugerir más para este [objeto]"
- **Frecuencia global**: En ajustes, controlar cantidad de sugerencias

---

## 7. Copiloto AI - Comportamiento

### 7.1 Principios del copiloto

1. **Siempre propone, nunca ejecuta sin confirmación**
2. **Valida antes de optimizar** (especialmente emociones)
3. **No juzga** (ritmos no cumplidos, áreas ignoradas)
4. **Respeta límites** configurados por el usuario
5. **Es útil sin ser invasivo**

### 7.2 Casos de uso principales

| Caso | Input del usuario | Respuesta del copiloto |
|------|-------------------|------------------------|
| Registro diario | "Hoy hice ejercicio y llamé a mamá" | Propone: marcar ritmo, registrar interacción, crear entrada |
| Planificación | "¿Qué debería hacer esta semana?" | Sugiere prioridades basadas en metas activas y ritmos pendientes |
| Reflexión | "Me siento abrumado con el trabajo" | Valida la emoción, pregunta si quiere escribir más, no sugiere acciones inmediatas |
| Consulta | "¿Cuándo hablé con Carlos?" | Busca y muestra última interacción |

### 7.3 Casos sensibles

#### Si el usuario expresa malestar emocional:
```
Usuario: "Me siento muy solo últimamente"

Copiloto: "Gracias por compartir eso. Suena difícil. 
¿Quieres escribir más sobre cómo te sientes?

[Escribir en diario]  [No ahora]"

// NO hacer:
// - Sugerir acciones inmediatamente
// - Decir "deberías hablar con alguien"
// - Minimizar el sentimiento
```

#### Si el usuario no cumple ritmos:
```
Copiloto: "Veo que tu práctica de piano lleva 10 días 
sin marcar. Sin juicio, a veces pasa.

¿Quieres:
• Ajustarlo (hacerlo más pequeño)
• Pausarlo temporalmente  
• Dejarlo como está

[Ajustar]  [Pausar]  [Dejar así]"
```

#### Si hay conflicto de prioridades:
```
Copiloto: "Tienes 4 metas activas y 9 ritmos diarios. 
Eso es bastante.

¿Cuál es tu prioridad principal esta semana?

[Revisar metas]  [Simplificar ritmos]"
```

### 7.4 Límites absolutos del copiloto

El copiloto **NUNCA**:
- Da consejos médicos o de salud mental
- Opina sobre decisiones religiosas/espirituales (solo registra)
- Juzga el progreso o falta de él
- Ejecuta cambios sin confirmación
- Comparte datos con terceros

Si detecta algo serio:
```
Copiloto: "Lo que describes suena importante. 
¿Has considerado hablar con alguien de confianza 
sobre esto?

Estoy aquí para registrar lo que quieras compartir."
```

### 7.5 Modos de conversación

| Modo | Descripción | Ejemplo |
|------|-------------|---------|
| **Directo** | Respuestas cortas, al grano | "Registrado. ¿Algo más?" |
| **Equilibrado** | Balance entre eficiencia y calidez | "Listo, marqué ejercicio. ¿Cómo te fue hoy?" |
| **Coaching** | Más preguntas, más reflexión | "¿Qué hizo que hoy decidieras hacer ejercicio? Me ayuda a entender tus patrones." |

---

## 8. Flujos de Usuario

### 8.1 Día normal sin AI (30-90 segundos)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Abrir app → Tab "Hoy"                                   │
│     │                                                       │
│  2. Check-in rápido (opcional)                              │
│     │  Mood: 😊  Energía: ⚡⚡⚡  [10 seg]                    │
│     │                                                       │
│  3. Marcar ritmos completados                               │
│     │  [✓] Agua [✓] Meditación [✓] Lectura  [15 seg]       │
│     │                                                       │
│  4. Si algo pasó: "+ Entrada rápida"                        │
│     │  "Buena mañana, productivo"  [10 seg]                │
│     │                                                       │
│  5. Revisar sugerencia (si hay)                             │
│     │  "Carlos - 45 días" → [Posponer]  [5 seg]            │
│     ▼                                                       │
│  TOTAL: ~40-90 segundos                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Registro por voz con AI (2-5 minutos)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Abrir app → Tab "Copiloto" → Modo voz                   │
│     │                                                       │
│  2. Grabar mensaje                                          │
│     │  "Hoy fue productivo. Hice ejercicio en la           │
│     │   mañana, practiqué piano 30 minutos, y hablé        │
│     │   con mamá por teléfono..."  [60-120 seg]            │
│     │                                                       │
│  3. Copiloto procesa y propone                              │
│     │  → Entrada de diario (resumen)                       │
│     │  → Marcar: Ejercicio ✓                               │
│     │  → Sesión piano: 30 min ✓                            │
│     │  → Interacción: Mamá (llamada) ✓                     │
│     │                                                       │
│  4. Usuario revisa y confirma                               │
│     │  [Ver cambios] → Toggle on/off → [Aplicar]           │
│     ▼                                                       │
│  TOTAL: ~2-5 minutos                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Revisión semanal (10-20 minutos)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Insights → "Hacer revisión semanal"                     │
│     │                                                       │
│  2. Ver resumen automático de la semana                     │
│     │  • Ritmos: 75% consistencia                          │
│     │  • Áreas más activas: Salud, Trabajo                 │
│     │  • Ánimo promedio: 3.8/5                             │
│     │                                                       │
│  3. Responder preguntas guiadas                             │
│     │  • ¿Qué salió bien?                                  │
│     │  • ¿Qué no funcionó?                                 │
│     │  • Una lección                                       │
│     │  • ¿Ajustes a ritmos?                                │
│     │  • ¿A quién contactar?                               │
│     │  • Prioridades próxima semana                        │
│     │                                                       │
│  4. Sistema genera "plan ligero"                            │
│     │  3-7 items para la semana                            │
│     │                                                       │
│  5. Guardar revisión                                        │
│     ▼                                                       │
│  TOTAL: ~10-20 minutos                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 Gestión de relaciones (1-2 minutos)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Tab "Personas" → Ordenar por "último contacto"          │
│     │                                                       │
│  2. Ver lista de personas que necesitan atención            │
│     │  ⚠️ Carlos (45 días)                                 │
│     │  ⚠️ Ana (30 días)                                    │
│     │                                                       │
│  3. Seleccionar persona → Ver detalle                       │
│     │  • "Para preguntar: ¿cómo va su nuevo trabajo?"      │
│     │                                                       │
│  4. Contactar (fuera de la app)                             │
│     │                                                       │
│  5. Registrar interacción                                   │
│     │  Tipo: Mensaje                                       │
│     │  Nota: "Le pregunté por su trabajo"                  │
│     │  Seguimiento: 2 semanas                              │
│     ▼                                                       │
│  TOTAL: ~1-2 minutos                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Features por Categoría

### 9.1 Captura y Journaling

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Entrada de texto libre | ✓ | | |
| Prompts por área | ✓ | | |
| Grabación de audio | ✓ | | |
| Transcripción de audio | ✓ | | |
| Adjuntar fotos | ✓ | | |
| Adjuntar ubicación | | ✓ | |
| Etiquetas (áreas, personas, ritmos, metas) | ✓ | | |
| Niveles de privacidad | ✓ | | |
| Búsqueda por texto | ✓ | | |
| Búsqueda por tags | | ✓ | |
| Búsqueda avanzada con filtros | | | ✓ |

### 9.2 Tracking (Ritmos)

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Checklist diario | ✓ | | |
| Frecuencia flexible (diario/semanal/mensual) | ✓ | | |
| Frecuencia personalizada | | ✓ | |
| Recordatorios | ✓ | | |
| Historial visual (heatmap) | ✓ | | |
| Sesiones de práctica (para hobbies) | ✓ | | |
| Modo mínimo (solo sí/no) | ✓ | | |
| Ajuste de dificultad ("hazlo más fácil") | | ✓ | |
| Pausar/archivar ritmos | ✓ | | |
| Streaks (opcionales, no prominentes) | | ✓ | |

### 9.3 Objetivos/Metas

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Crear metas con título | | ✓ | |
| "Por qué importa" | | ✓ | |
| Fecha límite opcional | | ✓ | |
| Progreso por porcentaje | | ✓ | |
| Milestones | | ✓ | |
| Próximo paso siempre visible | | ✓ | |
| Vincular con ritmos | | ✓ | |
| Vincular con personas | | ✓ | |
| Diario del objetivo | | ✓ | |
| Revisión semanal de metas | | ✓ | |
| Progreso por métricas | | | ✓ |

### 9.4 Relaciones

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Lista de personas | ✓ | | |
| Círculos (cercano, familia, trabajo) | ✓ | | |
| Última interacción (calculado) | ✓ | | |
| Frecuencia deseada | ✓ | | |
| Registrar interacción | ✓ | | |
| Notas sobre la persona | ✓ | | |
| "Para preguntar la próxima vez" | ✓ | | |
| Sugerencias de reconexión | ✓ | | |
| Recordatorio de cumpleaños | | ✓ | |
| Historial de interacciones | ✓ | | |
| Silenciar sugerencias por persona | | ✓ | |
| Importar de contactos | | | ✓ |

### 9.5 Religión/Fe (como área)

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Área "Fe" configurable | ✓ | | |
| Ritmos espirituales (oración, lectura, etc.) | ✓ | | |
| Diario espiritual | ✓ | | |
| Metas espirituales | | ✓ | |
| Calendario de eventos (manual) | | ✓ | |
| Siempre opcional y ocultable | ✓ | | |
| Sin juicios ni métricas de "desempeño" | ✓ | | |

### 9.6 Copiloto AI

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Chat de texto | ✓ | | |
| Input por voz | ✓ | | |
| Transcripción en vivo | ✓ | | |
| Proponer cambios estructurados | ✓ | | |
| Confirmación antes de aplicar | ✓ | | |
| Configurar estilo (directo/coaching) | ✓ | | |
| Límites personalizables | ✓ | | |
| API key del usuario | ✓ | | |
| Accesos rápidos ("registrar día", etc.) | | ✓ | |
| Resúmenes de semana | | ✓ | |
| Detección de patrones | | | ✓ |
| Memoria de conversaciones | | | ✓ |

### 9.7 Insights

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Sugerencias por reglas simples | ✓ | | |
| Tendencias de ánimo/energía | | ✓ | |
| Balance por áreas | | ✓ | |
| "Lo que funcionó" | | ✓ | |
| Señales/alertas suaves | | ✓ | |
| Revisión semanal guiada | | ✓ | |
| Correlaciones (ej: ejercicio → ánimo) | | | ✓ |
| Análisis profundo con AI | | | ✓ |

### 9.8 Privacidad y Control

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| Bloqueo con PIN/biometría | ✓ | | |
| Niveles de privacidad por entrada | ✓ | | |
| Ocultar áreas sensibles | | ✓ | |
| Modo discreto | | ✓ | |
| Exportar datos (JSON/CSV) | ✓ | | |
| Exportar PDF | | ✓ | |
| Respaldo local | ✓ | | |
| Personas "sensibles" | | ✓ | |
| Control granular del copiloto | ✓ | | |
| Borrar datos selectivamente | | | ✓ |

---

## 10. Plantillas Predefinidas

### 10.1 Minimal (5-8 elementos)

**Para quién:** Usuario que quiere empezar simple

**Áreas:**
- Bienestar (única área)

**Ritmos:**
- Beber agua (diario)
- Movimiento (diario, cualquier actividad física)
- Gratitud (diario, 1 cosa)

**Check-in:**
- Solo mood y energía (2 sliders)

**Sin:**
- Metas
- Personas
- Sesiones de práctica

---

### 10.2 Equilibrado (15-20 elementos)

**Para quién:** Usuario típico que quiere balance

**Áreas:**
- Salud
- Trabajo
- Relaciones
- Crecimiento personal

**Ritmos:**
- Ejercicio (3x semana)
- Lectura (diario, 15 min)
- Meditación (diario, 5 min)
- Planificación semanal (semanal)
- Check-in mañana (diario)
- Check-in noche (diario)

**Metas:**
- 1-2 activas sugeridas

**Personas:**
- 5-10 en círculo cercano

---

### 10.3 Fe + Comunidad

**Para quién:** Usuario con vida espiritual activa

**Áreas:**
- Fe / Espiritualidad
- Comunidad
- Servicio
- Familia

**Ritmos:**
- Oración (diario)
- Lectura espiritual (diario)
- Asistencia a servicios (semanal)
- Acto de servicio (semanal)
- Gratitud espiritual (diario)
- Reflexión (semanal)

**Metas:**
- Estudio de texto sagrado
- Servicio comunitario

**Personas:**
- Comunidad de fe
- Líder espiritual

---

### 10.4 Productividad

**Para quién:** Usuario enfocado en logros profesionales

**Áreas:**
- Trabajo
- Aprendizaje
- Finanzas
- Networking

**Ritmos:**
- Planificación diaria (diario)
- Deep work (diario, 2h)
- Revisión semanal (semanal)
- Aprendizaje (diario, 30 min)
- Networking (semanal)

**Metas:**
- 2-3 proyectos profesionales

**Personas:**
- Mentores
- Colegas clave
- Contactos de networking

---

### 10.5 Creativo

**Para quién:** Usuario artista, músico, escritor

**Áreas:**
- Creatividad
- Aprendizaje
- Inspiración
- Proyectos

**Ritmos:**
- Práctica de habilidad (diario, con sesiones detalladas)
- Consumo creativo (diario, ver/leer/escuchar)
- Experimentación (semanal, probar algo nuevo)
- Journal creativo (diario)

**Features destacados:**
- Sesiones de práctica con detalle (duración, tipo, calidad)
- Inbox de ideas prominente
- Metas tipo proyecto

---

## 11. Roadmap (MVP → V1 → V2)

### 11.1 MVP - Lo mínimo mágico

**Objetivo:** Una app usable que ya se siente valiosa

**Incluye:**
- Onboarding básico (6 pantallas)
- Tab "Hoy" con dashboard
- Tab "Registro" con journal y timeline
- Tab "Ritmos" (hábitos/prácticas)
- Tab "Personas" (relaciones básicas)
- Tab "Copiloto" (chat + voz)
- Áreas configurables
- Sugerencias por reglas (sin AI)
- Copiloto AI con confirmación
- Privacidad básica (PIN, niveles de entrada)
- Exportar datos (JSON/CSV)

**No incluye:**
- Metas/proyectos
- Insights y revisión semanal
- Ideas inbox
- Calendario
- Búsqueda avanzada
- Plantillas

---

### 11.2 V1 - Más redondo

**Objetivo:** Sistema completo de seguimiento de vida

**Agrega:**
- Metas/proyectos completos
- Insights básicos (tendencias, balance)
- Revisión semanal guiada
- Plantillas (5 predefinidas)
- Calendario
- Búsqueda con filtros
- Privacidad avanzada (modo discreto, ocultar áreas)
- Widgets básicos
- Celebraciones suaves ("Momentos")
- Bienvenida de vuelta (re-engagement)

---

### 11.3 V2 - Pro

**Objetivo:** Herramienta de poder con integraciones

**Agrega:**
- Integraciones (calendario, salud, notas)
- Búsqueda avanzada con AI
- Memoria del copiloto (contexto entre sesiones)
- Análisis profundo con AI
- Automatizaciones ("si pasa X → sugiere Y")
- Exportar PDF con diseño
- Sincronización multi-dispositivo
- Temas y personalización visual

---

## 12. Decisiones de Diseño

### 12.1 Preguntas resueltas

| Pregunta | Decisión | Justificación |
|----------|----------|---------------|
| ¿Notificaciones por persona? | Sí, silenciar individualmente | Flexibilidad sin perder la relación |
| ¿Historial del copiloto? | Solo resultados por defecto | Privacidad > contexto; opción de guardar completo |
| ¿Compartir? | No en MVP; V2 exportar resumen | Complejidad vs valor; la app es personal |
| ¿Multi-dispositivo? | V2, con sync simple | MVP local-first; conflictos son complejos |
| ¿Monetización? | Pago único sugerido | Evitar presión de suscripción; features no fragmentados |

### 12.2 Principios de UX aplicados

| Principio | Aplicación |
|-----------|------------|
| Fricción mínima | Captura rápida <10s desde cualquier pantalla |
| Progreso flexible | Sin streaks prominentes; consistencia % en vez de racha |
| Control del usuario | Copiloto siempre propone, usuario aprueba |
| Privacidad por defecto | Datos locales; exportación clara; niveles de privacidad |
| Sin juicio | Tono neutro; pausar/ajustar sin "fallar" |
| Celebración tranquila | "Momentos" sutiles, no fuegos artificiales |

### 12.3 Qué NO es esta app

- **No es red social**: Sin perfiles públicos, sin compartir, sin comparar
- **No es task manager**: No hay tareas, deadlines estrictos, ni productividad forzada
- **No es app de salud mental**: No diagnostica, no trata, solo registra
- **No es gamificación**: Sin puntos, niveles, badges, ni competencia
- **No es AI que decide por ti**: Solo propone, tú apruebas

---

## 13. Consideraciones Técnicas

### 13.1 Arquitectura sugerida (no prescriptiva)

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    App (iOS/Android/Web)             │    │
│  │                                                      │    │
│  │  UI Layer ──► State Management ──► Local Storage    │    │
│  │                      │                               │    │
│  │                      ▼                               │    │
│  │              AI Service Adapter                      │    │
│  │              (con API key del usuario)               │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Sync Service (opcional, V2)             │    │
│  │              (si multi-dispositivo)                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                        │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  OpenAI /  │  │  Speech-   │  │  (Futuro)  │             │
│  │  Anthropic │  │  to-Text   │  │  Calendar  │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                              │
│  * Todos opcionales, con API key del usuario                │
└─────────────────────────────────────────────────────────────┘
```

### 13.2 Local-first

- Todos los datos viven en el dispositivo
- No requiere cuenta ni servidor
- Sincronización opcional (V2)
- Exportación siempre disponible

### 13.3 AI como servicio externo

- Usuario provee su propia API key
- Sin AI la app funciona 100%
- Procesamiento de voz puede ser local (Whisper) u online
- Sin datos enviados sin consentimiento explícito

### 13.4 Privacidad técnica

- Encriptación en reposo para datos sensibles
- PIN/biometría a nivel de app
- Entradas "ultra privadas" encriptadas adicionalmente
- Borrado seguro implementado

---

## Apéndice: Glosario

| Término | Definición |
|---------|------------|
| **Entrada** | Cualquier registro: texto, voz, check-in, reflexión |
| **Ritmo** | Acción repetible: hábito, práctica, rutina, ritual |
| **Meta** | Objetivo con progreso y próximo paso |
| **Área** | Dimensión de vida (Salud, Trabajo, Fe, etc.) |
| **Persona** | Relación que quieres mantener |
| **Sesión** | Registro detallado de práctica (para hobbies) |
| **Interacción** | Contacto registrado con una persona |
| **Sugerencia** | Recomendación accionable del sistema |
| **Copiloto** | Asistente AI opcional |
| **Check-in** | Registro rápido de estado (mood, energía, etc.) |

---

## 14. Capa RPG y Pivote a PWA (2026)

> Addendum de julio 2026, al reactivar el proyecto. Complementa (y donde choca, sustituye) lo anterior.

### 14.1 Nueva framing: tu vida como personaje de RPG

La visión evolucionó: Life Copilot presenta tu vida como un **personaje de RPG donde el objetivo lo defines tú**.

| Concepto RPG | En la app |
|--------------|-----------|
| **Personaje** | Tú; nivel global calculado del XP total |
| **Atributos** | Las Áreas (Salud, Trabajo, Fe, Relaciones…), cada una con nivel y barra de XP |
| **XP** | Toda actividad real: entrada +10, ritmo +15, interacción +15, avance de meta +25, check-in +5, sugerencia completada +10 |
| **Misiones diarias/semanales** | Los Ritmos |
| **Quests** | Las Metas (definidas por el usuario) |
| **Gremio** | Las Personas |
| **Mapa de balance** | Radar de actividad de 14 días por área |

**Fórmula de nivel:** `nivel = ⌊√(xp/50)⌋ + 1` (cada nivel cuesta progresivamente más).

### 14.2 Gamificación sin culpa (ajuste al principio 2.6)

El principio anti-gamificación original se matiza: **sí hay niveles y XP, pero diseñados para no generar ansiedad**:

- Los niveles **nunca bajan**; la inactividad no castiga, solo deja de sumar
- No hay rachas punitivas: el heatmap de 7 días es informativo ("5 de 7 días con actividad"), no una racha que se "rompe"
- No hay rankings ni comparación social
- El indicador de atención por área usa verde/amarillo/naranja, nunca rojo
- Toda la capa RPG se puede ocultar desde Ajustes (`mostrarNiveles`)

### 14.3 Re-balanceo: el corazón del producto

El diferenciador es que la app **identifica dónde te estás quedando atrás y te ayuda a re-balancearte**:

1. **Radar de balance** (pantalla Personaje): actividad de 14 días por área, normalizada; el área más hundida se señala con acceso directo
2. **Motor de sugerencias** (5 reglas locales, sin AI):
   - *Reconexión*: "No has platicado con Carlos en 45 días. Mándale un mensaje para ponerse al día."
   - *Consistencia*: "¿Por qué no vas a hora santa esta semana?" (ritmos <50% de lo esperado en 7 días)
   - *Balance*: "Tu área 🙏 Fe se está quedando atrás…" (área con <25% del XP del área top, cuando el top ≥40 XP/14d)
   - *Cumpleaños*: aviso con ≤3 días de anticipación
   - *Meta estancada*: meta activa sin avance en 14 días, recordando su próximo paso
3. **Ciclo de la sugerencia**: pendiente → hecha (+10 XP) / pospuesta (reaparece al vencer) / descartada (no se repite en 7 días). Completar la acción real (marcar el ritmo, registrar el contacto) también resuelve la sugerencia.

### 14.4 Plataforma: PWA en lugar de app nativa

- **Por qué**: distribución sin stores (un link instala en iOS y Android), un solo stack web, iteración inmediata. Detalles y trade-offs en [ADR-006](docs/adrs/ADR-006-pwa-pivot.md).
- **Qué cambia del spec original**:
  - Entrada por voz (C3) y adjuntos multimedia → V1 (dependen de APIs de captura del navegador)
  - Notificaciones push → V1 y solo donde el navegador lo permita; en el MVP las sugerencias viven en la app
  - PIN/biometría (K2) → V1 con WebAuthn; el MVP confía en el bloqueo del dispositivo
  - Copiloto AI (J1-J4) → V1, con API key propia del usuario, llamadas directas desde el cliente
- **Qué se mantiene**: modelo de datos (§3), navegación de 5 tabs (§4), sistema de sugerencias (§6), principios (§2), local-first con exportación JSON.

### 14.5 Alcance del MVP implementado (julio 2026)

Onboarding (4 pasos), Hoy (check-in mañana/noche, misiones, semana, gente, sugerencias), Registro (timeline unificado + entrada con áreas/personas/mood/privacidad), Áreas (lista/detalle/crear), Personas (lista/detalle/interacciones/editar/archivar/silenciar), Metas (lista/detalle/progreso/completar), Personaje (radar, niveles, días activos), Ajustes (nombre, tema, capa RPG, export/import, borrado), captura rápida, PWA offline instalable.

---

*Documento generado como parte del proceso de diseño de producto.*
*Para feedback o preguntas, contactar al autor original.*
