# Life Copilot - Flujos de Prototipo y Animaciones

> Especificaciones de interacciones, transiciones y animaciones.
> Versión: 1.0
> Última actualización: Enero 2026

---

## 1. Navegación Principal

### 1.1 Tab Bar Navigation

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  TRANSICIÓN ENTRE TABS                                         │
│                                                                │
│  Tab A ──────────────────────► Tab B                           │
│                                                                │
│  Animación:                                                    │
│  • Icono activo: scale 1.0 → 0.9 → 1.0 (bounce)               │
│  • Icono inactivo: opacity 1.0 → 0.5                          │
│  • Label: color transition 150ms                               │
│  • Contenido: crossfade 200ms                                  │
│                                                                │
│  NO hacer:                                                     │
│  • Slide horizontal (confunde con back)                        │
│  • Animaciones largas (>300ms)                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Especificaciones:**
| Propiedad | Valor |
|-----------|-------|
| Duración | 150-200ms |
| Easing | ease-out |
| Feedback háptico | Light impact |

### 1.2 Push Navigation (Detalle)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PUSH (Lista → Detalle)                                        │
│                                                                │
│  ┌─────────┐                    ┌─────────┐                    │
│  │  Lista  │ ────────────────►  │ Detalle │                    │
│  │         │                    │         │                    │
│  │   [tap] │                    │         │                    │
│  └─────────┘                    └─────────┘                    │
│                                                                │
│  Animación:                                                    │
│  • Nueva pantalla: slideIn from right (0% → 100%)             │
│  • Pantalla anterior: slideOut to left (0% → -30%)            │
│  • Duración: 300ms                                             │
│  • Easing: ease-out                                            │
│                                                                │
│  Shared Element (opcional):                                    │
│  • Título del item → Título del header                         │
│  • Icono del item → Icono del header                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Pop Navigation (Volver)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  POP (Detalle → Lista)                                         │
│                                                                │
│  ┌─────────┐                    ┌─────────┐                    │
│  │ Detalle │ ◄────────────────  │  Lista  │                    │
│  │         │                    │         │                    │
│  │  [back] │                    │         │                    │
│  └─────────┘                    └─────────┘                    │
│                                                                │
│  Trigger:                                                      │
│  • Tap botón back                                              │
│  • Swipe from left edge (iOS)                                  │
│  • Back button (Android)                                       │
│                                                                │
│  Animación:                                                    │
│  • Pantalla actual: slideOut to right                         │
│  • Pantalla anterior: slideIn from left (-30% → 0%)           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Modales y Sheets

### 2.1 Bottom Sheet

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  OPEN BOTTOM SHEET                                             │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  (contenido)                                            │   │
│  │                                                         │   │
│  │                                                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                      ─────                              │   │
│  │                                                         │   │
│  │  Sheet content                                          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Animación:                                                    │
│  1. Overlay: fadeIn (0 → 50% opacity)                         │
│  2. Sheet: slideUp from bottom                                │
│  3. Duración: 300ms                                           │
│  4. Easing: ease-out                                          │
│                                                                │
│  CLOSE BOTTOM SHEET                                            │
│                                                                │
│  Triggers:                                                     │
│  • Tap overlay                                                 │
│  • Swipe down (velocity threshold: 500px/s)                   │
│  • Tap close button                                           │
│                                                                │
│  Animación:                                                    │
│  1. Sheet: slideDown to bottom                                │
│  2. Overlay: fadeOut (50% → 0)                                │
│  3. Duración: 250ms                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Drag Behavior:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DRAG TO DISMISS                                               │
│                                                                │
│  Si drag distance > 100px && velocity > 500px/s:              │
│    → Dismiss sheet                                             │
│                                                                │
│  Si drag distance > 100px && velocity < 500px/s:              │
│    → Snap to closed                                            │
│                                                                │
│  Si drag distance < 100px:                                    │
│    → Bounce back to open                                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Center Modal

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  OPEN MODAL                                                    │
│                                                                │
│  Animación:                                                    │
│  1. Overlay: fadeIn (0 → 50% opacity)                         │
│  2. Modal: scaleIn (0.9 → 1.0) + fadeIn                       │
│  3. Duración: 200ms                                           │
│  4. Easing: ease-out                                          │
│                                                                │
│  CLOSE MODAL                                                   │
│                                                                │
│  Animación:                                                    │
│  1. Modal: scaleOut (1.0 → 0.9) + fadeOut                     │
│  2. Overlay: fadeOut                                          │
│  3. Duración: 150ms                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. FAB Menu

### 3.1 Expansión del FAB

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  FAB EXPAND                                                    │
│                                                                │
│  Estado cerrado:           Estado abierto:                     │
│                                                                │
│                            ┌─ + Entrada      │ Item 6         │
│                            │                  │ stagger: 50ms  │
│                            ├─ ✓ Ritmo        │ Item 5         │
│                            │                  │                │
│       ┌─────┐              ├─ 🎹 Sesión      │ Item 4         │
│       │  +  │    ──────►   │                  │                │
│       └─────┘              ├─ 👤 Interacción │ Item 3         │
│                            │                  │                │
│                            ├─ 💡 Idea        │ Item 2         │
│                            │                  │                │
│                            └─ 🎯 Meta        │ Item 1         │
│                                                                │
│                            ┌─────┐                             │
│                            │  ✕  │  FAB rotates 45°           │
│                            └─────┘                             │
│                                                                │
│  Animación por item:                                           │
│  • scaleIn: 0 → 1.0                                           │
│  • fadeIn: 0 → 1.0                                            │
│  • translateY: 20px → 0                                       │
│  • Duración: 200ms                                            │
│  • Stagger: 50ms entre items                                  │
│  • Total: ~450ms                                               │
│                                                                │
│  FAB icon:                                                     │
│  • rotate: 0° → 45° (+ se convierte en ✕)                     │
│  • Duración: 200ms                                            │
│                                                                │
│  Overlay:                                                      │
│  • fadeIn: 0 → 30% black                                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Selección de Item

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ITEM TAP                                                      │
│                                                                │
│  1. Item tap feedback:                                         │
│     • backgroundColor: highlight briefly                       │
│     • scale: 1.0 → 0.95 → 1.0                                 │
│     • Duración: 100ms                                         │
│                                                                │
│  2. Close menu:                                                │
│     • Items: scaleOut + fadeOut (reverse stagger)             │
│     • FAB: rotate back 45° → 0°                               │
│     • Overlay: fadeOut                                        │
│                                                                │
│  3. Navigate to action:                                        │
│     • Push new screen                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Check-in Widget

### 4.1 Slider Interaction

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  SLIDER DOT TAP                                                │
│                                                                │
│  😊 Ánimo                                                      │
│  [○ ○ ● ○ ○]  →  [○ ○ ○ ○ ●]                                  │
│                                                                │
│  Animación:                                                    │
│  1. Dot anterior:                                              │
│     • scale: 1.0 → 0.8 (shrink)                               │
│     • backgroundColor: primary → gray                          │
│                                                                │
│  2. Dot nuevo:                                                 │
│     • scale: 1.0 → 1.2 → 1.0 (bounce)                         │
│     • backgroundColor: gray → primary                          │
│                                                                │
│  3. Feedback:                                                  │
│     • Haptic: light impact                                     │
│                                                                │
│  Duración: 200ms                                               │
│  Easing: ease-bounce                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Mood Emoji Selection

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  EMOJI TAP                                                     │
│                                                                │
│  [😫] [😕] [😐] [🙂] [😊]                                      │
│                    ↑                                           │
│                  (tap)                                         │
│                                                                │
│  Animación:                                                    │
│  1. Emoji tapped:                                              │
│     • scale: 1.0 → 1.3 → 1.1 (bounce, stays slightly bigger) │
│     • Duración: 300ms                                         │
│     • Ring highlight appears around                            │
│                                                                │
│  2. Other emojis:                                              │
│     • opacity: 1.0 → 0.5                                      │
│     • scale: 1.0 → 0.9                                        │
│                                                                │
│  3. Feedback:                                                  │
│     • Haptic: medium impact                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Ritmo Checkbox

### 5.1 Check Animation

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  CHECKBOX CHECK                                                │
│                                                                │
│  [ ] Beber agua  →  [✓] Beber agua                             │
│                                                                │
│  Animación:                                                    │
│  1. Checkbox box:                                              │
│     • backgroundColor: white → primary                         │
│     • border: gray → primary                                   │
│     • scale: 1.0 → 1.1 → 1.0                                  │
│                                                                │
│  2. Checkmark:                                                 │
│     • strokeDashoffset: 16 → 0 (draw in)                      │
│     • Duración: 200ms                                         │
│                                                                │
│  3. Row:                                                       │
│     • Subtle highlight flash                                   │
│     • Text: normal → slightly muted                            │
│                                                                │
│  4. Feedback:                                                  │
│     • Haptic: success                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 Uncheck Animation

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  CHECKBOX UNCHECK                                              │
│                                                                │
│  [✓] Beber agua  →  [ ] Beber agua                             │
│                                                                │
│  Animación:                                                    │
│  1. Checkmark:                                                 │
│     • opacity: 1 → 0                                          │
│     • Duración: 100ms                                         │
│                                                                │
│  2. Checkbox box:                                              │
│     • backgroundColor: primary → white                         │
│     • border: primary → gray                                   │
│                                                                │
│  NO hacer:                                                     │
│  • Animación inversa del check (se siente como error)         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Voice Recording

### 6.1 Recording Start

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  TAP TO RECORD                                                 │
│                                                                │
│       ┌───────────────┐                                        │
│       │               │                                        │
│       │      🎤       │    Estado: idle                        │
│       │               │                                        │
│       └───────────────┘                                        │
│           (tap)                                                │
│             ↓                                                  │
│       ┌───────────────┐                                        │
│       │               │                                        │
│       │      ■        │    Estado: recording                   │
│       │               │    (pulsing)                           │
│       └───────────────┘                                        │
│                                                                │
│  Animación:                                                    │
│  1. Button:                                                    │
│     • backgroundColor: primary → error (red)                   │
│     • icon: 🎤 → ■ (crossfade)                                │
│     • scale: 1.0 → 1.05 (slight grow)                         │
│                                                                │
│  2. Pulse animation (looping):                                 │
│     • scale: 1.0 → 1.08 → 1.0                                 │
│     • Duración: 1000ms                                        │
│     • Easing: ease-in-out                                     │
│                                                                │
│  3. Timer:                                                     │
│     • fadeIn below button                                      │
│     • "0:00" starts counting                                  │
│                                                                │
│  4. Waveform:                                                  │
│     • fadeIn                                                   │
│     • Bars animate with audio input                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 6.2 Waveform Animation

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  WAVEFORM VISUALIZATION                                        │
│                                                                │
│           █ █ █ ▌▌▌█ █ █ ▌▌▌█ █ █                             │
│                                                                │
│  Especificaciones:                                             │
│  • Número de barras: 15-20                                    │
│  • Altura máxima: 40px                                        │
│  • Altura mínima: 8px                                         │
│  • Ancho de barra: 4px                                        │
│  • Spacing: 2px                                               │
│  • Color: primary                                              │
│                                                                │
│  Comportamiento:                                               │
│  • Altura reactiva a input de audio                           │
│  • Smooth interpolation entre valores                          │
│  • Fallback sin audio: ondulación suave aleatoria             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. Celebraciones (Momentos)

### 7.1 Streak Achievement

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  7-DAY STREAK                                                  │
│                                                                │
│  (Aparece después de completar ritmo)                          │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              ✨                                          │   │
│  │                                                         │   │
│  │      ¡7 días seguidos meditando!                        │   │
│  │                                                         │   │
│  │            Sigue así                                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Animación:                                                    │
│  1. Toast/snackbar slides up from bottom                      │
│  2. Sparkle icon: subtle shimmer animation                    │
│  3. Auto-dismiss: 3 segundos                                  │
│  4. Tap to dismiss immediately                                │
│                                                                │
│  Tono:                                                         │
│  • Sutil, no intrusivo                                        │
│  • Sin fuegos artificiales                                    │
│  • Mensaje cálido, no exagerado                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 7.2 Goal Completed

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  META COMPLETADA                                               │
│                                                                │
│  (Pantalla completa, pero elegante)                            │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                         ✓                               │   │
│  │                                                         │   │
│  │                  ¡Lo lograste!                          │   │
│  │                                                         │   │
│  │              "Aprender piano"                           │   │
│  │                                                         │   │
│  │         Empezaste: 15 octubre 2025                      │   │
│  │         Completado: 29 enero 2026                       │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ ¿Quieres escribir una reflexión sobre            │   │   │
│  │  │ este logro?                                      │   │   │
│  │  │                                                   │   │   │
│  │  │ [Sí, reflexionar]   [Más tarde]                  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Animación:                                                    │
│  1. Checkmark: draw-in animation (SVG path)                   │
│  2. Scale: 0 → 1.2 → 1.0 (bounce)                             │
│  3. Confetti: opcional, muy sutil (solo bordes)               │
│  4. Background: soft gradient pulse                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Transiciones de Onboarding

### 8.1 Step Transition

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  NEXT STEP                                                     │
│                                                                │
│  A1 → A2 → A3 → A4 → A5 → A6 → B1                             │
│                                                                │
│  Animación:                                                    │
│  • Slide horizontal (como página de libro)                    │
│  • Pantalla actual: slideOut to left                          │
│  • Pantalla siguiente: slideIn from right                     │
│  • Duración: 300ms                                            │
│                                                                │
│  Indicador de progreso:                                        │
│  • Dots en la parte inferior                                  │
│  • Dot activo: scale up + color primary                       │
│  • Animación: 200ms                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 8.2 Skip to Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  SKIP / COMPLETE ONBOARDING                                    │
│                                                                │
│  Animación:                                                    │
│  1. Current screen: fadeOut + slight scaleDown                │
│  2. Dashboard: fadeIn + slight scaleUp                        │
│  3. Confetti opcional (solo en complete, no skip)             │
│  4. Duración: 400ms                                           │
│                                                                │
│  Diferente de navegación normal para marcar "transición       │
│  importante"                                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. Pull to Refresh

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PULL TO REFRESH                                               │
│                                                                │
│  Fase 1: Pulling                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           ↓                                             │   │
│  │      (spinner)   Rotates as user pulls                  │   │
│  │                                                         │   │
│  │   Content moves down with finger                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Fase 2: Refreshing                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │      ◐  (spinning)                                      │   │
│  │                                                         │   │
│  │   Content stays down, spinner animates                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Fase 3: Complete                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │      ✓  (checkmark, brief)                              │   │
│  │                                                         │   │
│  │   Content springs back up                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Especificaciones:                                             │
│  • Trigger distance: 80px                                     │
│  • Max pull: 120px                                            │
│  • Spinner size: 24px                                         │
│  • Spring back: 300ms ease-out                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. Loading States

### 10.1 Skeleton Loading

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  SKELETON SHIMMER                                              │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ████████████████████████                                │   │
│  │ ████████████████████████████████████                    │   │
│  │ ████████████████████                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Animación shimmer:                                            │
│  • Gradient: gray-200 → gray-100 → gray-200                   │
│  • Direction: left to right                                   │
│  • Duración: 1.5s                                             │
│  • Repeat: infinite                                           │
│                                                                │
│  CSS:                                                          │
│  background: linear-gradient(                                  │
│    90deg,                                                      │
│    var(--gray-200) 0%,                                        │
│    var(--gray-100) 50%,                                       │
│    var(--gray-200) 100%                                       │
│  );                                                            │
│  background-size: 200% 100%;                                   │
│  animation: shimmer 1.5s infinite;                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 10.2 Button Loading

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  BUTTON LOADING STATE                                          │
│                                                                │
│  Normal:     ┌───────────────────────────┐                     │
│              │       Guardar             │                     │
│              └───────────────────────────┘                     │
│                                                                │
│  Loading:    ┌───────────────────────────┐                     │
│              │       ◐ ◐ ◐               │                     │
│              └───────────────────────────┘                     │
│                                                                │
│  Transición:                                                   │
│  1. Text: fadeOut (100ms)                                     │
│  2. Spinner: fadeIn (100ms)                                   │
│  3. Button stays same size (no layout shift)                  │
│                                                                │
│  Spinner specs:                                                │
│  • 3 dots                                                     │
│  • Animation: scale pulse, staggered                          │
│  • Color: same as text would be                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 11. Error States

### 11.1 Form Validation Error

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  INPUT ERROR                                                   │
│                                                                │
│  Label                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Invalid input                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ⚠️ Error message here                                         │
│                                                                │
│  Animación al mostrar error:                                   │
│  1. Border: gray → error (red)                                │
│  2. Input: shake animation (subtle)                           │
│     • translateX: 0 → -4px → 4px → -2px → 2px → 0            │
│     • Duración: 300ms                                         │
│  3. Error text: slideDown + fadeIn                            │
│  4. Icon: fadeIn                                              │
│                                                                │
│  Animación al corregir:                                        │
│  1. Border: error → gray (o success si válido)                │
│  2. Error text: slideUp + fadeOut                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 11.2 Network Error Toast

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ERROR TOAST                                                   │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⚠️ No se pudo guardar. Intenta de nuevo.     [Reintentar]│  │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Aparición:                                                    │
│  • slideUp from bottom                                        │
│  • Duración: 200ms                                            │
│                                                                │
│  Permanencia:                                                  │
│  • Auto-dismiss: 5 segundos (si no es crítico)               │
│  • O hasta que usuario interactúe                             │
│                                                                │
│  Desaparición:                                                 │
│  • slideDown                                                  │
│  • Duración: 150ms                                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 12. Haptic Feedback Guide

| Acción | Tipo de Haptic | Intensidad |
|--------|----------------|------------|
| Tab change | Light impact | - |
| Checkbox check | Success | - |
| Slider value change | Light impact | - |
| Emoji selection | Medium impact | - |
| Button tap | Light impact | - |
| Error shake | Error | - |
| Pull to refresh complete | Success | - |
| Long press menu | Heavy impact | - |
| Delete confirmation | Warning | - |

---

## Checklist de Implementación

### Navegación
- [ ] Tab bar transitions
- [ ] Push navigation
- [ ] Pop navigation
- [ ] Gesture navigation (swipe back)

### Modales
- [ ] Bottom sheet open/close
- [ ] Bottom sheet drag to dismiss
- [ ] Center modal open/close

### FAB
- [ ] Expand animation
- [ ] Collapse animation
- [ ] Item selection

### Interacciones
- [ ] Check-in slider
- [ ] Mood emoji selection
- [ ] Checkbox check/uncheck
- [ ] Voice recording

### Celebraciones
- [ ] Streak toast
- [ ] Goal completion screen
- [ ] Subtle confetti (opcional)

### Estados
- [ ] Skeleton loading
- [ ] Button loading
- [ ] Pull to refresh
- [ ] Error states

### Haptics
- [ ] Implement all haptic feedback

---

*Especificaciones de animaciones y flujos de Life Copilot.*
*Para uso de desarrolladores en implementación.*
