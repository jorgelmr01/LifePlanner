# Life Copilot - Sistema de Diseño

> Documento técnico del sistema de diseño para desarrollo.
> Versión: 1.0
> Última actualización: Enero 2026

---

## 1. Identidad Visual

### 1.1 Nombre y Marca

**Nombre:** Life Copilot

**Variantes del nombre:**
- Completo: "Life Copilot"
- Corto: "Copilot"
- Interno: "LC"

**Tagline:** "Tu copiloto de vida"

### 1.2 Logo

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  VARIANTE COMPLETA (horizontal)                                │
│  ┌──────┐                                                      │
│  │  ◐◉  │  Life Copilot                                        │
│  └──────┘                                                      │
│                                                                │
│  VARIANTE ICONO (app icon)                                     │
│  ┌──────────┐                                                  │
│  │          │                                                  │
│  │    ◐◉    │   Círculo con gradiente + elemento de brújula   │
│  │          │                                                  │
│  └──────────┘                                                  │
│                                                                │
│  VARIANTE MONOGRAMA                                            │
│  ┌────┐                                                        │
│  │ LC │   Para espacios reducidos                              │
│  └────┘                                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Especificaciones del icono:**
- Forma base: Squircle (iOS) / Adaptive (Android)
- Elemento principal: Brújula estilizada que representa guía
- Colores: Gradiente del primario al secundario
- Tamaño mínimo: 24x24px

---

## 2. Paleta de Colores

### 2.1 Colores Primarios

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Primary** | `#6366F1` | rgb(99, 102, 241) | Acciones principales, elementos interactivos |
| **Primary Light** | `#818CF8` | rgb(129, 140, 248) | Hover states, fondos suaves |
| **Primary Dark** | `#4F46E5` | rgb(79, 70, 229) | Pressed states, acentos |
| **Primary Surface** | `#EEF2FF` | rgb(238, 242, 255) | Fondos con tinte primario |

### 2.2 Colores Secundarios

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Secondary** | `#14B8A6` | rgb(20, 184, 166) | Elementos de éxito, progreso |
| **Secondary Light** | `#5EEAD4` | rgb(94, 234, 212) | Badges, indicadores positivos |
| **Secondary Dark** | `#0F766E` | rgb(15, 118, 110) | Acentos secundarios |
| **Secondary Surface** | `#F0FDFA` | rgb(240, 253, 250) | Fondos de estado positivo |

### 2.3 Colores Neutros

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Gray 50** | `#F9FAFB` | rgb(249, 250, 251) | Fondos de página |
| **Gray 100** | `#F3F4F6` | rgb(243, 244, 246) | Fondos de tarjetas |
| **Gray 200** | `#E5E7EB` | rgb(229, 231, 235) | Bordes, divisores |
| **Gray 300** | `#D1D5DB` | rgb(209, 213, 219) | Bordes hover, iconos inactivos |
| **Gray 400** | `#9CA3AF` | rgb(156, 163, 175) | Texto placeholder |
| **Gray 500** | `#6B7280` | rgb(107, 114, 128) | Texto secundario |
| **Gray 600** | `#4B5563` | rgb(75, 85, 99) | Texto de cuerpo |
| **Gray 700** | `#374151` | rgb(55, 65, 81) | Texto de encabezado |
| **Gray 800** | `#1F2937` | rgb(31, 41, 55) | Texto principal |
| **Gray 900** | `#111827` | rgb(17, 24, 39) | Texto de mayor énfasis |

### 2.4 Colores Semánticos

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Success** | `#10B981` | rgb(16, 185, 129) | Completado, éxito |
| **Success Light** | `#D1FAE5` | rgb(209, 250, 229) | Fondo de éxito |
| **Warning** | `#F59E0B` | rgb(245, 158, 11) | Advertencias, atención |
| **Warning Light** | `#FEF3C7` | rgb(254, 243, 199) | Fondo de advertencia |
| **Error** | `#EF4444` | rgb(239, 68, 68) | Errores, acciones destructivas |
| **Error Light** | `#FEE2E2` | rgb(254, 226, 226) | Fondo de error |
| **Info** | `#3B82F6` | rgb(59, 130, 246) | Información, tooltips |
| **Info Light** | `#DBEAFE` | rgb(219, 234, 254) | Fondo de información |

### 2.5 Colores de Indicadores de Área

| Indicador | Color | Hex | Significado |
|-----------|-------|-----|-------------|
| **Alta** | Verde | `#22C55E` | Área con actividad reciente |
| **Media** | Amarillo | `#EAB308` | Algo de actividad |
| **Baja** | Naranja | `#F97316` | Poca atención (NO rojo) |

### 2.6 Colores de Mood

| Nivel | Emoji | Color | Hex |
|-------|-------|-------|-----|
| 1 | 😫 | Rojo suave | `#F87171` |
| 2 | 😕 | Naranja | `#FB923C` |
| 3 | 😐 | Amarillo | `#FBBF24` |
| 4 | 🙂 | Verde claro | `#4ADE80` |
| 5 | 😊 | Verde | `#22C55E` |

### 2.7 Colores de Áreas Predefinidas

| Área | Icono | Color | Hex |
|------|-------|-------|-----|
| Salud | 💪 | Verde | `#22C55E` |
| Trabajo | 💼 | Azul | `#3B82F6` |
| Relaciones | 👥 | Rosa | `#EC4899` |
| Finanzas | 💰 | Amarillo | `#EAB308` |
| Fe/Espiritualidad | 🙏 | Púrpura | `#A855F7` |
| Aprendizaje | 📚 | Índigo | `#6366F1` |
| Creatividad | 🎨 | Naranja | `#F97316` |
| Servicio | 🤝 | Teal | `#14B8A6` |
| Pareja | ❤️ | Rojo | `#EF4444` |

### 2.8 Modo Oscuro (Dark Mode)

| Elemento | Light | Dark |
|----------|-------|------|
| Background | `#FFFFFF` | `#111827` |
| Surface | `#F9FAFB` | `#1F2937` |
| Card | `#FFFFFF` | `#374151` |
| Border | `#E5E7EB` | `#4B5563` |
| Text Primary | `#111827` | `#F9FAFB` |
| Text Secondary | `#6B7280` | `#9CA3AF` |

---

## 3. Tipografía

### 3.1 Familia Tipográfica

**Fuente principal:** Inter
- Fallback: SF Pro (iOS), Roboto (Android), system-ui

**Fuente monoespaciada:** JetBrains Mono
- Uso: Código, contadores, métricas
- Fallback: SF Mono, monospace

### 3.2 Escala Tipográfica

| Nombre | Tamaño | Peso | Line Height | Letter Spacing | Uso |
|--------|--------|------|-------------|----------------|-----|
| **Display Large** | 36px | 700 | 44px | -0.5px | Splash screens |
| **Display Medium** | 32px | 700 | 40px | -0.5px | Títulos principales |
| **Heading 1** | 28px | 600 | 36px | -0.25px | Títulos de pantalla |
| **Heading 2** | 24px | 600 | 32px | -0.25px | Secciones principales |
| **Heading 3** | 20px | 600 | 28px | 0 | Subsecciones |
| **Heading 4** | 18px | 600 | 24px | 0 | Cards, elementos |
| **Body Large** | 17px | 400 | 26px | 0 | Texto principal iOS |
| **Body** | 16px | 400 | 24px | 0 | Texto de cuerpo |
| **Body Small** | 14px | 400 | 20px | 0 | Texto secundario |
| **Caption** | 12px | 400 | 16px | 0.25px | Etiquetas, timestamps |
| **Overline** | 11px | 500 | 16px | 0.5px | Categorías, tags |
| **Button** | 15px | 600 | 20px | 0.25px | Botones |

### 3.3 Estilos de Texto

```css
/* Heading 1 */
.heading-1 {
  font-family: 'Inter', system-ui;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: -0.25px;
  color: var(--gray-900);
}

/* Body */
.body {
  font-family: 'Inter', system-ui;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--gray-700);
}

/* Caption */
.caption {
  font-family: 'Inter', system-ui;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.25px;
  color: var(--gray-500);
}
```

---

## 4. Espaciado

### 4.1 Escala de Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `space-0` | 0px | Reset |
| `space-1` | 4px | Micro-espaciado entre iconos/texto |
| `space-2` | 8px | Espaciado interno pequeño |
| `space-3` | 12px | Espaciado en componentes compactos |
| `space-4` | 16px | Padding estándar |
| `space-5` | 20px | Padding de tarjetas |
| `space-6` | 24px | Margen entre secciones |
| `space-8` | 32px | Margen entre grupos |
| `space-10` | 40px | Espaciado de pantalla |
| `space-12` | 48px | Espaciado grande |
| `space-16` | 64px | Espaciado extra grande |

### 4.2 Aplicación de Espaciado

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  PANTALLA                                                      │
│  ├─ Padding horizontal: 16px (space-4)                        │
│  ├─ Padding top: 16px (debajo del header)                     │
│  └─ Padding bottom: 100px (sobre tab bar)                     │
│                                                                │
│  SECCIÓN                                                       │
│  ├─ Margin entre secciones: 24px (space-6)                    │
│  └─ Título a contenido: 12px (space-3)                        │
│                                                                │
│  CARD                                                          │
│  ├─ Padding interno: 16px (space-4)                           │
│  └─ Margin entre cards: 12px (space-3)                        │
│                                                                │
│  LISTA                                                         │
│  ├─ Padding de item: 16px horizontal, 12px vertical           │
│  └─ Separador entre items: 1px + 16px indent                  │
│                                                                │
│  FORMULARIO                                                    │
│  ├─ Label a input: 8px (space-2)                              │
│  ├─ Entre campos: 16px (space-4)                              │
│  └─ Error text a input: 4px (space-1)                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-none` | 0px | Sin redondeo |
| `radius-sm` | 4px | Badges, chips pequeños |
| `radius-md` | 8px | Inputs, botones pequeños |
| `radius-lg` | 12px | Cards, botones principales |
| `radius-xl` | 16px | Modales, sheets |
| `radius-2xl` | 24px | FAB, elementos destacados |
| `radius-full` | 9999px | Pills, avatares |

---

## 6. Sombras (Elevación)

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-none` | none | Elementos planos |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Elementos sutiles |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Cards estándar |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Cards elevadas, modales |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)` | Bottom sheets, popovers |

---

## 7. Iconografía

### 7.1 Sistema de Iconos

**Librería:** Lucide Icons (compatible con Feather Icons)
- Tamaño base: 24x24px
- Stroke width: 2px
- Style: Outline

### 7.2 Tamaños de Iconos

| Tamaño | Dimensión | Uso |
|--------|-----------|-----|
| **XS** | 16x16px | Badges, indicadores inline |
| **SM** | 20x20px | Dentro de botones, inputs |
| **MD** | 24x24px | Navegación, acciones |
| **LG** | 32x32px | Elementos destacados |
| **XL** | 48x48px | Empty states, onboarding |
| **2XL** | 64x64px | Splash, ilustraciones |

### 7.3 Iconos de Tab Bar

| Tab | Icono Inactivo | Icono Activo |
|-----|----------------|--------------|
| Hoy | `sun` (outline) | `sun` (filled) |
| Registro | `book-open` (outline) | `book-open` (filled) |
| Áreas | `layout-grid` (outline) | `layout-grid` (filled) |
| Personas | `users` (outline) | `users` (filled) |
| Copiloto | `sparkles` (outline) | `sparkles` (filled) |

### 7.4 Iconos de Áreas

| Área | Emoji | Icono Alternativo |
|------|-------|-------------------|
| Salud | 💪 | `heart-pulse` |
| Trabajo | 💼 | `briefcase` |
| Relaciones | 👥 | `users` |
| Finanzas | 💰 | `wallet` |
| Fe | 🙏 | `sparkles` |
| Aprendizaje | 📚 | `book` |
| Creatividad | 🎨 | `palette` |
| Servicio | 🤝 | `hand-heart` |
| Pareja | ❤️ | `heart` |

### 7.5 Iconos de Acciones

| Acción | Icono |
|--------|-------|
| Agregar | `plus` |
| Editar | `pencil` |
| Eliminar | `trash-2` |
| Buscar | `search` |
| Filtrar | `filter` |
| Ordenar | `arrow-up-down` |
| Configuración | `settings` |
| Compartir | `share` |
| Cerrar | `x` |
| Volver | `arrow-left` |
| Más opciones | `more-horizontal` |
| Check | `check` |
| Audio | `mic` |
| Foto | `camera` |
| Calendario | `calendar` |

---

## 8. Animaciones y Transiciones

### 8.1 Curvas de Easing

| Nombre | Valor | Uso |
|--------|-------|-----|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transiciones estándar |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elementos que salen |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elementos que entran |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebraciones sutiles |

### 8.2 Duraciones

| Token | Valor | Uso |
|-------|-------|-----|
| `duration-instant` | 0ms | Cambios inmediatos |
| `duration-fast` | 100ms | Hovers, micro-interacciones |
| `duration-normal` | 200ms | Transiciones estándar |
| `duration-slow` | 300ms | Modales, sheets |
| `duration-slower` | 400ms | Animaciones complejas |

### 8.3 Animaciones Específicas

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up (para modales) */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Scale In (para FAB menu) */
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Pulse (para grabación de voz) */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Check animation */
@keyframes checkmark {
  0% { stroke-dashoffset: 16; }
  100% { stroke-dashoffset: 0; }
}
```

---

## 9. Breakpoints

### 9.1 Dispositivos Objetivo

| Dispositivo | Ancho | Uso |
|-------------|-------|-----|
| **iPhone SE** | 375px | Mínimo soportado |
| **iPhone 14** | 390px | Referencia iOS |
| **iPhone 14 Pro Max** | 430px | iOS grande |
| **Android** | 360-412px | Referencia Android |
| **Tablet** | 768px+ | Futuro (V2) |

### 9.2 Breakpoints Definidos

```css
/* Mobile First */
--breakpoint-sm: 375px;   /* Teléfonos pequeños */
--breakpoint-md: 390px;   /* Teléfonos estándar */
--breakpoint-lg: 428px;   /* Teléfonos grandes */
--breakpoint-xl: 768px;   /* Tablets (V2) */
```

---

## 10. Accesibilidad

### 10.1 Contraste

- **Texto sobre fondo:** Mínimo 4.5:1 (WCAG AA)
- **Texto grande (18px+):** Mínimo 3:1
- **Elementos interactivos:** Mínimo 3:1 contra fondo adyacente

### 10.2 Touch Targets

- **Tamaño mínimo:** 44x44px (iOS) / 48x48px (Android)
- **Espaciado mínimo:** 8px entre targets

### 10.3 Motion

```css
/* Respetar preferencias de usuario */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10.4 Labels

- Todos los inputs deben tener labels visibles o aria-labels
- Todos los iconos de acción deben tener aria-labels
- Los estados de carga deben ser anunciados

---

## 11. Design Tokens (Código)

### 11.1 CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #6366F1;
  --color-primary-light: #818CF8;
  --color-primary-dark: #4F46E5;
  --color-primary-surface: #EEF2FF;
  
  --color-secondary: #14B8A6;
  --color-secondary-light: #5EEAD4;
  --color-secondary-dark: #0F766E;
  
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04);
  
  /* Animation */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

### 11.2 Flutter/Dart Tokens

```dart
class AppColors {
  static const primary = Color(0xFF6366F1);
  static const primaryLight = Color(0xFF818CF8);
  static const primaryDark = Color(0xFF4F46E5);
  static const primarySurface = Color(0xFFEEF2FF);
  
  static const secondary = Color(0xFF14B8A6);
  static const secondaryLight = Color(0xFF5EEAD4);
  static const secondaryDark = Color(0xFF0F766E);
  
  static const gray50 = Color(0xFFF9FAFB);
  static const gray100 = Color(0xFFF3F4F6);
  static const gray200 = Color(0xFFE5E7EB);
  static const gray300 = Color(0xFFD1D5DB);
  static const gray400 = Color(0xFF9CA3AF);
  static const gray500 = Color(0xFF6B7280);
  static const gray600 = Color(0xFF4B5563);
  static const gray700 = Color(0xFF374151);
  static const gray800 = Color(0xFF1F2937);
  static const gray900 = Color(0xFF111827);
  
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);
  static const info = Color(0xFF3B82F6);
}

class AppSpacing {
  static const space1 = 4.0;
  static const space2 = 8.0;
  static const space3 = 12.0;
  static const space4 = 16.0;
  static const space5 = 20.0;
  static const space6 = 24.0;
  static const space8 = 32.0;
  static const space10 = 40.0;
  static const space12 = 48.0;
  static const space16 = 64.0;
}

class AppRadius {
  static const sm = 4.0;
  static const md = 8.0;
  static const lg = 12.0;
  static const xl = 16.0;
  static const xxl = 24.0;
}
```

---

## 12. Checklist de Implementación

### 12.1 Design System

- [ ] Definir identidad visual ✓
- [ ] Crear logo (3 variantes) 
- [ ] Definir paleta de colores ✓
- [ ] Definir tipografía ✓
- [ ] Crear design tokens ✓
- [ ] Definir espaciado ✓
- [ ] Definir border radius ✓
- [ ] Definir sombras ✓
- [ ] Definir iconografía ✓
- [ ] Definir animaciones ✓
- [ ] Documentar accesibilidad ✓

---

*Documento técnico del sistema de diseño de Life Copilot.*
*Para uso de diseñadores y desarrolladores.*
