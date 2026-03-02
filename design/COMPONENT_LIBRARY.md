# Life Copilot - Librería de Componentes

> Especificaciones detalladas de todos los componentes de UI.
> Versión: 1.0
> Última actualización: Enero 2026

---

## Índice de Componentes

### Componentes Base
1. [Botones](#1-botones)
2. [Inputs](#2-inputs)
3. [Cards](#3-cards)
4. [Listas](#4-listas)
5. [Modales y Sheets](#5-modales-y-sheets)
6. [Tab Bar](#6-tab-bar)
7. [Headers](#7-headers)
8. [Estados](#8-estados)

### Componentes Específicos
9. [Check-in Widget](#9-check-in-widget)
10. [Ritmo Item](#10-ritmo-item)
11. [Persona Item](#11-persona-item)
12. [Entrada Item](#12-entrada-item)
13. [Sugerencia Card](#13-sugerencia-card)
14. [Meta Progress](#14-meta-progress)
15. [Chat Bubbles](#15-chat-bubbles)
16. [Grabación de Voz](#16-grabación-de-voz)
17. [FAB Menu](#17-fab-menu)
18. [Area Card](#18-area-card)

---

## 1. Botones

### 1.1 Button Primary

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ESTADOS:                                                       │
│                                                                 │
│  Default:                                                       │
│  ┌───────────────────────────┐                                  │
│  │       Guardar             │  bg: primary, text: white        │
│  └───────────────────────────┘                                  │
│                                                                 │
│  Hover/Pressed:                                                 │
│  ┌───────────────────────────┐                                  │
│  │       Guardar             │  bg: primary-dark                │
│  └───────────────────────────┘                                  │
│                                                                 │
│  Disabled:                                                      │
│  ┌───────────────────────────┐                                  │
│  │       Guardar             │  bg: gray-200, text: gray-400    │
│  └───────────────────────────┘                                  │
│                                                                 │
│  Loading:                                                       │
│  ┌───────────────────────────┐                                  │
│  │       ○ ○ ○               │  spinner + bg: primary           │
│  └───────────────────────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 48px |
| Min Width | 120px |
| Padding | 16px horizontal |
| Border Radius | 12px (radius-lg) |
| Font | Button (15px, 600) |
| Background | primary (#6366F1) |
| Text Color | white |
| Shadow | shadow-sm |
| Transition | 200ms ease-default |

### 1.2 Button Secondary

```
┌───────────────────────────┐
│       Cancelar            │  bg: transparent, border: gray-300
└───────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 48px |
| Border | 1.5px solid gray-300 |
| Background | transparent |
| Text Color | gray-700 |
| Hover Background | gray-50 |

### 1.3 Button Ghost

```
┌───────────────────────────┐
│       Ver más →           │  bg: transparent, text: primary
└───────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 40px |
| Padding | 12px horizontal |
| Background | transparent |
| Text Color | primary |
| Hover Background | primary-surface |

### 1.4 Button Danger

```
┌───────────────────────────┐
│       Eliminar            │  bg: error, text: white
└───────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 48px |
| Background | error (#EF4444) |
| Hover Background | #DC2626 |
| Text Color | white |

### 1.5 Icon Button

```
┌─────┐   ┌─────┐   ┌─────┐
│  +  │   │  ✎  │   │  ⚙  │
└─────┘   └─────┘   └─────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Size | 44x44px (touch target) |
| Icon Size | 24x24px |
| Border Radius | radius-lg (12px) |
| Background | transparent |
| Hover Background | gray-100 |

### 1.6 Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 36px | 12px | 13px |
| Medium | 44px | 16px | 15px |
| Large | 52px | 20px | 17px |

---

## 2. Inputs

### 2.1 Text Input

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Label                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Placeholder text...                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│  Helper text o error message                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 48px |
| Padding | 16px horizontal |
| Border | 1.5px solid gray-200 |
| Border Radius | radius-md (8px) |
| Background | white |
| Font | Body (16px) |
| Label | Body Small (14px), gray-700 |
| Label Spacing | 8px bottom |
| Placeholder Color | gray-400 |

**Estados:**
| Estado | Border | Background |
|--------|--------|------------|
| Default | gray-200 | white |
| Focus | primary | white |
| Error | error | error-light |
| Disabled | gray-100 | gray-50 |

### 2.2 Textarea

```
┌───────────────────────────────────────────────────────────────┐
│ Escribe tu reflexión aquí...                                  │
│                                                               │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Min Height | 120px |
| Max Height | 300px (expandible) |
| Padding | 16px |
| Line Height | 24px |

### 2.3 Select / Dropdown

```
┌───────────────────────────────────────────────────────────┐
│ Seleccionar área                                    ▼     │
└───────────────────────────────────────────────────────────┘

(Expandido)
┌───────────────────────────────────────────────────────────┐
│ 💪 Salud                                                  │
├───────────────────────────────────────────────────────────┤
│ 💼 Trabajo                                                │
├───────────────────────────────────────────────────────────┤
│ 👥 Relaciones                                             │
├───────────────────────────────────────────────────────────┤
│ 🙏 Fe                                                     │
└───────────────────────────────────────────────────────────┘
```

### 2.4 Slider

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Energía                                                        │
│  ○────────●────────○────────○────────○                          │
│  1        2        3        4        5                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Track Height | 4px |
| Track Color | gray-200 |
| Active Track | primary |
| Thumb Size | 24px |
| Thumb Color | white |
| Thumb Shadow | shadow-md |
| Steps | 5 (1-5 rating) |

### 2.5 Checkbox

```
┌─────┐      ┌─────┐      ┌─────┐
│     │      │  ✓  │      │  -  │
└─────┘      └─────┘      └─────┘
Unchecked    Checked      Indeterminate
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Size | 24x24px |
| Border Radius | 6px |
| Border | 2px solid gray-300 |
| Checked Background | primary |
| Checkmark | white, 2px stroke |

### 2.6 Radio Button

```
◯  Opción A (unchecked)
●  Opción B (checked)
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Size | 24x24px |
| Border | 2px solid gray-300 |
| Selected Border | 2px solid primary |
| Inner Circle | 12px, primary |

### 2.7 Toggle / Switch

```
┌─────────────┐      ┌─────────────┐
│ ○           │      │           ● │
└─────────────┘      └─────────────┘
     OFF                   ON
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Width | 52px |
| Height | 32px |
| Border Radius | radius-full |
| Off Background | gray-200 |
| On Background | primary |
| Thumb Size | 28px |
| Thumb Color | white |
| Transition | 200ms |

### 2.8 Chip / Tag Selector

```
[+ Salud]  [+ Trabajo]  [✓ Relaciones]
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 32px |
| Padding | 8px 12px |
| Border Radius | radius-full |
| Unselected Background | gray-100 |
| Selected Background | primary |
| Font | Body Small (14px) |

---

## 3. Cards

### 3.1 Card Standard

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │   Título del Card                                         │  │
│  │   Descripción o contenido secundario que puede            │  │
│  │   extenderse a múltiples líneas.                          │  │
│  │                                                           │  │
│  │   [Acción Primaria]  [Acción Secundaria]                  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Padding | 16px |
| Border Radius | radius-lg (12px) |
| Background | white |
| Border | 1px solid gray-100 |
| Shadow | shadow-sm |
| Margin Bottom | 12px |

### 3.2 Card Compact

```
┌───────────────────────────────────────────────────────────┐
│ 💪 Salud                                          🟢 Alta │
│    3 ritmos • 1 meta • última actividad: hoy             │
└───────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Padding | 12px 16px |
| Min Height | 64px |
| Border Radius | radius-lg |

### 3.3 Card Expandable

```
┌───────────────────────────────────────────────────────────┐
│ Ritmos de hoy                                         ▼   │
├───────────────────────────────────────────────────────────┤
│ [✓] Beber agua                                            │
│ [ ] Meditación                                            │
│ [ ] Ejercicio                                             │
└───────────────────────────────────────────────────────────┘
```

**Comportamiento:**
- Tap en header → expande/colapsa
- Animación: 300ms ease-out
- Icono rota 180° al expandir

---

## 4. Listas

### 4.1 List Item Simple

```
┌───────────────────────────────────────────────────────────┐
│ Título del item                                       >   │
└───────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 56px |
| Padding | 16px |
| Border Bottom | 1px solid gray-100 |
| Chevron | gray-400 |

### 4.2 List Item con Acción

```
┌───────────────────────────────────────────────────────────┐
│ [✓] Meditación                               15 min       │
└───────────────────────────────────────────────────────────┘
```

### 4.3 List Item con Avatar

```
┌───────────────────────────────────────────────────────────┐
│ ┌───┐                                                     │
│ │👤 │  Carlos                              hace 45 días   │
│ └───┘  Frecuencia: cada 2 semanas                         │
└───────────────────────────────────────────────────────────┘
```

### 4.4 List Item con Indicador

```
┌───────────────────────────────────────────────────────────┐
│ 🟢  Salud                                                 │
│     3 ritmos activos                                  >   │
└───────────────────────────────────────────────────────────┘
```

---

## 5. Modales y Sheets

### 5.1 Modal Small

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               ┌───────────────────────────────┐                 │
│               │                               │                 │
│               │    ¿Eliminar entrada?         │                 │
│               │                               │                 │
│               │    Esta acción no se puede    │                 │
│               │    deshacer.                  │                 │
│               │                               │                 │
│               │   [Cancelar]  [Eliminar]      │                 │
│               │                               │                 │
│               └───────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Width | 320px |
| Padding | 24px |
| Border Radius | radius-xl (16px) |
| Background | white |
| Shadow | shadow-xl |
| Overlay | black 50% opacity |
| Animation | fadeIn + scaleIn 200ms |

### 5.2 Modal Medium

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│   Título del Modal                                   ✕    │
│   ─────────────────────────────────────────────────────   │
│                                                           │
│   Contenido del modal que puede incluir formularios,      │
│   listas, o información detallada.                        │
│                                                           │
│   ┌─────────────────────────────────────────────────────┐ │
│   │ Input field                                         │ │
│   └─────────────────────────────────────────────────────┘ │
│                                                           │
│                               [Cancelar]  [Guardar]       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Width | 90% (max 400px) |
| Max Height | 80vh |

### 5.3 Bottom Sheet

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│     (contenido de la app oscurecido)                          │
│                                                               │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                         ─────                                 │
│                                                               │
│   Título del Sheet                                            │
│                                                               │
│   ┌─────────────────────────────────────────────────────────┐ │
│   │ Opción 1                                            >   │ │
│   ├─────────────────────────────────────────────────────────┤ │
│   │ Opción 2                                            >   │ │
│   ├─────────────────────────────────────────────────────────┤ │
│   │ Opción 3                                            >   │ │
│   └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                          [Cancelar]                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Border Radius | 24px (top only) |
| Handle | 40x4px, gray-300, centered |
| Handle Margin Top | 12px |
| Padding | 16px, bottom: 32px (safe area) |
| Animation | slideUp 300ms ease-out |
| Drag to dismiss | Enabled |

---

## 6. Tab Bar

### 6.1 Estructura

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   ☀️        📖        ⬜        👥        ✨                  │
│   Hoy     Registro   Áreas   Personas  Copiloto              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 83px (con safe area) |
| Content Height | 49px |
| Background | white |
| Border Top | 1px solid gray-100 |
| Shadow | 0 -2px 10px rgba(0,0,0,0.05) |

### 6.2 Tab Item

| Estado | Icono | Label | Color |
|--------|-------|-------|-------|
| Inactive | Outline | Caption (12px) | gray-400 |
| Active | Filled | Caption (12px) | primary |

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Icon Size | 24px |
| Icon to Label | 4px |
| Tap Area | Full width / 5 |
| Transition | 150ms |

---

## 7. Headers

### 7.1 Header Principal

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   Título de Pantalla                        🔍    📅    ⚙️   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 56px |
| Padding | 16px |
| Title | Heading 3 (20px, 600) |
| Background | white |
| Border Bottom | 1px solid gray-100 (opcional) |

### 7.2 Header con Back

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   ←  Título                                            ✏️    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 7.3 Header de Modal

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   ✕ Cancelar          Título                      Guardar ✓  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 8. Estados

### 8.1 Empty State

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│                         ┌─────────┐                           │
│                         │   📝    │                           │
│                         └─────────┘                           │
│                                                               │
│                    No hay entradas aún                        │
│                                                               │
│              Comienza capturando tu primer                    │
│              pensamiento o reflexión.                         │
│                                                               │
│                   [+ Nueva entrada]                           │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Icon Size | 64px |
| Icon Color | gray-300 |
| Title | Heading 4 (18px, 600) |
| Description | Body (16px), gray-500 |
| Alignment | Center |
| Max Width | 280px |

### 8.2 Loading State

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                         ◐                                     │
│                                                               │
│                      Cargando...                              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Spinner:**
- Size: 32px
- Color: primary
- Animation: spin 1s linear infinite

### 8.3 Skeleton Loading

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████                                │  │
│  │ ████████████████████████████████████                    │  │
│  │ ████████████████████                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████████                            │  │
│  │ ████████████████████████████████████████████            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Background | gray-200 |
| Animation | shimmer 1.5s infinite |
| Border Radius | radius-sm |

### 8.4 Error State

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                         ┌─────────┐                           │
│                         │   ⚠️    │                           │
│                         └─────────┘                           │
│                                                               │
│                   Algo salió mal                              │
│                                                               │
│              No pudimos cargar tus datos.                     │
│              Por favor intenta de nuevo.                      │
│                                                               │
│                    [Reintentar]                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 9. Check-in Widget

### 9.1 Estructura

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─ Check-in rápido ─────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  😊 Ánimo                                                 │  │
│  │  [○ ○ ● ○ ○]                                              │  │
│  │   1  2  3  4  5                                           │  │
│  │                                                           │  │
│  │  ⚡ Energía                                                │  │
│  │  [○ ● ○ ○ ○]                                              │  │
│  │   1  2  3  4  5                                           │  │
│  │                                                           │  │
│  │  🎯 Enfoque                                               │  │
│  │  [○ ○ ○ ● ○]                                              │  │
│  │   1  2  3  4  5                                           │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Card Padding | 16px |
| Label | Body Small + Emoji, gray-700 |
| Dots Size | 24px |
| Dot Spacing | 16px |
| Dot Default | gray-200 |
| Dot Selected | primary |
| Row Height | 48px |
| Animation | Scale bounce on tap |

### 9.2 Comportamiento

- Tap en dot → selecciona nivel
- Deslizar → ajusta nivel (accesible)
- Feedback háptico al seleccionar
- Guarda automáticamente al cambiar

---

## 10. Ritmo Item

### 10.1 Estructura Simple

```
┌───────────────────────────────────────────────────────────────┐
│ [✓] Beber agua                                                │
└───────────────────────────────────────────────────────────────┘
```

### 10.2 Estructura Completa

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  [✓] 🎹 Practicar piano                          30 min      │
│      Consistencia: ████████░░ 80%                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 56px (simple) / 72px (con consistencia) |
| Checkbox | 24x24px |
| Icon/Emoji | 24px |
| Title | Body (16px) |
| Duration | Body Small, gray-500, right |
| Progress Bar | 80x4px, radius-full |

### 10.3 Estados

| Estado | Checkbox | Text Style | Background |
|--------|----------|------------|------------|
| Pendiente | Empty | Normal | white |
| Completado | Checked | Normal | white |
| Atrasado | Empty | Normal + ⚠️ badge | warning-light |

---

## 11. Persona Item

### 11.1 Estructura

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌───┐                                                        │
│  │ C │  Carlos                                 hace 45 días   │
│  └───┘  Círculo: Cercano                                      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Height | 72px |
| Avatar Size | 48px |
| Avatar Radius | radius-full |
| Avatar Background | area-color o gray-200 |
| Avatar Text | 18px, 600, white |
| Name | Body (16px, 500) |
| Subtitle | Body Small, gray-500 |
| Time | Body Small, right |

### 11.2 Con Indicador de Atención

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌───┐  ⚠️                                                    │
│  │ C │  Carlos                                 hace 45 días   │
│  └───┘  Frecuencia deseada: 2 semanas                        │
│         [Registrar contacto]                                  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 12. Entrada Item

### 12.1 Estructura

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  10:30                                             📝         │
│  "Hoy desperté con energía después de dormir bien.           │
│   La meditación de ayer me ayudó a..."                       │
│                                                               │
│  💪 Salud  💼 Trabajo  #reflexión                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Padding | 16px |
| Time | Caption, gray-400 |
| Content | Body, max 3 lines, ellipsis |
| Tags | Chips, margin-top: 8px |
| Type Icon | Top right, 20px, gray-300 |

### 12.2 Tipos de Entrada

| Tipo | Icono |
|------|-------|
| Texto | 📝 |
| Audio | 🎤 |
| Check-in mañana | ☀️ |
| Check-in noche | 🌙 |
| Ritmo completado | ✓ |
| Interacción | 👤 |
| Sesión práctica | 🎹 |

---

## 13. Sugerencia Card

### 13.1 Estructura

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  👤 Reconexión                                                │
│                                                               │
│  Llevas 45 días sin hablar con Carlos.                       │
│                                                               │
│  Por qué: Definiste contactarlo cada 2 semanas               │
│                                                               │
│  [Registrar contacto]                                         │
│  [Posponer 1 sem]  [Descartar]                               │
│                                                               │
│  ☐ No sugerir más para Carlos                                │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Padding | 16px |
| Type Icon | 24px + Label, primary |
| Message | Body (16px), gray-800 |
| Reason | Body Small, gray-500, italic |
| Primary Action | Button Secondary |
| Secondary Actions | Button Ghost |
| Checkbox | Bottom, Body Small |

### 13.2 Tipos de Sugerencia

| Tipo | Icono | Color |
|------|-------|-------|
| Reconexión | 👤 | pink |
| Consistencia | 🎯 | orange |
| Balance | ⚖️ | blue |
| Planificación | 📋 | purple |

---

## 14. Meta Progress

### 14.1 Card

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  🎹 Aprender piano                                            │
│  ████████████░░░░░░░░  65%                                   │
│                                                               │
│  Próximo: Practicar escalas mayores                          │
│  Área: Creatividad                                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Progress Bar Height | 8px |
| Progress Bar Radius | radius-full |
| Progress Background | gray-200 |
| Progress Fill | primary (gradiente opcional) |
| Percentage | Body Small, 500, right of bar |

### 14.2 Detalle de Progreso

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  PRÓXIMO PASO                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  → Practicar escalas mayores                            │  │
│  │    [Hecho]  [Editar]                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  MILESTONES                                                   │
│  [✓] Aprender postura correcta                               │
│  [✓] Escalas básicas                                         │
│  [✓] Acordes mayores                                         │
│  [ ] Primera canción completa                                │
│  [ ] Tocar de memoria                                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 15. Chat Bubbles

### 15.1 Usuario

```
                          ┌─────────────────────────────────────┐
                          │ Hoy hice ejercicio y practiqué      │
                          │ piano por 30 minutos.               │
                          └─────────────────────────────────────┘
                                                         10:30
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Background | primary |
| Text Color | white |
| Border Radius | 16px 16px 4px 16px |
| Max Width | 75% |
| Padding | 12px 16px |
| Margin Left | 25% |

### 15.2 Copiloto

```
┌─────────────────────────────────────┐
│ ¡Excelente! Veo que mencionaste:    │
│ - Ejercicio                         │
│ - Piano (30 min)                    │
│                                     │
│ ¿Quieres que registre esto?         │
└─────────────────────────────────────┘
10:31
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Background | gray-100 |
| Text Color | gray-800 |
| Border Radius | 16px 16px 16px 4px |
| Max Width | 75% |
| Margin Right | 25% |

### 15.3 Accesos Rápidos

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  Accesos rápidos:                                             │
│  [Resumen de hoy]  [Crear entrada]  [Marcar ritmos]          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 16. Grabación de Voz

### 16.1 Botón de Grabación

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│                      ┌─────────────┐                          │
│                      │             │                          │
│                      │     🎤      │                          │
│                      │             │                          │
│                      └─────────────┘                          │
│                                                               │
│                    Tap para grabar                            │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones (Normal):**
| Propiedad | Valor |
|-----------|-------|
| Size | 80x80px |
| Background | primary |
| Border Radius | radius-full |
| Icon Size | 32px |
| Icon Color | white |
| Shadow | shadow-lg |

### 16.2 Estado Grabando

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                      ┌─────────────┐                          │
│                      │             │                          │
│                      │     ■       │   (animación pulsante)   │
│                      │             │                          │
│                      └─────────────┘                          │
│                                                               │
│                    Grabando... 0:45                           │
│                                                               │
│          ─────────────────────────────────                    │
│          (waveform visualization)                             │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones (Grabando):**
| Propiedad | Valor |
|-----------|-------|
| Background | error (red) |
| Animation | pulse 1s infinite |
| Waveform | 5 bars, animated |
| Timer | Caption, center |

---

## 17. FAB Menu

### 17.1 Botón FAB

```
         ┌─────┐
         │  +  │
         └─────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Size | 56x56px |
| Background | primary |
| Icon | plus, 24px, white |
| Border Radius | radius-2xl (24px) |
| Shadow | shadow-lg |
| Position | Bottom center, 16px above tab bar |

### 17.2 FAB Expandido

```
                              ┌─ + Entrada rápida
                              │
                              ├─ ✓ Marcar ritmo
                              │
         ┌─────┐              ├─ 🎹 Registrar sesión
         │  ✕  │ ────────────►│
         └─────┘              ├─ 👤 Interacción
                              │
                              ├─ 💡 Nueva idea
                              │
                              └─ 🎯 Nuevo objetivo
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Menu Item Height | 48px |
| Menu Item Spacing | 8px |
| Animation | scaleIn, staggered 50ms |
| Overlay | black 30% opacity |
| FAB Icon | rotates to X |

---

## 18. Area Card

### 18.1 Dashboard View

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  💪 Salud                                              🟢     │
│     3 ritmos • 1 meta                                        │
│     Última actividad: hoy                                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 18.2 Detalle View

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  💪 Salud                                              🟢     │
│                                                               │
│  Esta semana:                                                 │
│  • 5 entradas                                                │
│  • 12 ritmos completados                                     │
│  • Ánimo promedio: 4.2                                       │
│                                                               │
│  Ritmos activos: Ejercicio, Dormir 7h+, Beber agua          │
│  Meta principal: Correr 10K (65%)                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Padding | 16px |
| Icon Size | 24px |
| Indicator | 12px circle, right |
| Background | white |
| Border Left | 4px solid area-color |

---

## Checklist de Componentes

### Componentes Base
- [x] Botones (Primary, Secondary, Ghost, Danger, Icon)
- [x] Inputs (Text, Textarea, Select, Slider, Checkbox, Radio, Toggle, Chip)
- [x] Cards (Standard, Compact, Expandable)
- [x] Listas (Simple, Con Acción, Con Avatar, Con Indicador)
- [x] Modales (Small, Medium, Bottom Sheet)
- [x] Tab Bar
- [x] Headers
- [x] Estados (Empty, Loading, Skeleton, Error)

### Componentes Específicos
- [x] Check-in Widget
- [x] Ritmo Item
- [x] Persona Item
- [x] Entrada Item
- [x] Sugerencia Card
- [x] Meta Progress
- [x] Chat Bubbles
- [x] Grabación de Voz
- [x] FAB Menu
- [x] Area Card

---

*Librería de componentes de Life Copilot.*
*Para uso de diseñadores y desarrolladores.*
