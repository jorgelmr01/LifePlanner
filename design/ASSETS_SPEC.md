# Life Copilot - Especificaciones de Assets

> Guía de exportación y especificaciones de todos los assets visuales.
> Versión: 1.0
> Última actualización: Enero 2026

---

## 1. App Icon

### 1.1 Concepto del Icono

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  DISEÑO CONCEPTUAL                                             │
│                                                                │
│  ┌─────────────────────────────┐                               │
│  │                             │                               │
│  │         ◐◉                  │   Elementos:                  │
│  │                             │   • Círculo/esfera: totalidad │
│  │                             │   • Gradiente: dinamismo      │
│  │                             │   • Punto/brújula: guía       │
│  │                             │                               │
│  └─────────────────────────────┘                               │
│                                                                │
│  Colores:                                                      │
│  • Gradiente: Primary (#6366F1) → Secondary (#14B8A6)         │
│  • Acento: White                                               │
│  • Fondo: Gradiente o Primary sólido                          │
│                                                                │
│  Estilo:                                                       │
│  • Moderno, minimalista                                       │
│  • Sin detalles excesivos (legible en 29x29)                  │
│  • Evitar texto en el icono                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 iOS App Icon Sizes

| Tamaño | Escala | Uso | Nombre de archivo |
|--------|--------|-----|-------------------|
| 20x20 | @1x | Notification (iPhone) | `Icon-20.png` |
| 20x20 | @2x | Notification (iPhone) | `Icon-20@2x.png` |
| 20x20 | @3x | Notification (iPhone) | `Icon-20@3x.png` |
| 29x29 | @1x | Settings (iPhone) | `Icon-29.png` |
| 29x29 | @2x | Settings (iPhone) | `Icon-29@2x.png` |
| 29x29 | @3x | Settings (iPhone) | `Icon-29@3x.png` |
| 40x40 | @2x | Spotlight (iPhone) | `Icon-40@2x.png` |
| 40x40 | @3x | Spotlight (iPhone) | `Icon-40@3x.png` |
| 60x60 | @2x | App (iPhone) | `Icon-60@2x.png` |
| 60x60 | @3x | App (iPhone) | `Icon-60@3x.png` |
| 1024x1024 | @1x | App Store | `Icon-1024.png` |

**Especificaciones iOS:**
- Formato: PNG
- Sin transparencia
- Sin bordes redondeados (iOS los aplica)
- Color space: sRGB
- Sin canal alfa

### 1.3 Android App Icon Sizes

**Adaptive Icon (Android 8.0+):**

| Capa | Tamaño | Notas |
|------|--------|-------|
| Foreground | 108x108dp | Área segura: 72x72dp centrada |
| Background | 108x108dp | Color sólido o gradiente |

| Densidad | Tamaño Foreground | Tamaño Background |
|----------|-------------------|-------------------|
| mdpi | 108x108px | 108x108px |
| hdpi | 162x162px | 162x162px |
| xhdpi | 216x216px | 216x216px |
| xxhdpi | 324x324px | 324x324px |
| xxxhdpi | 432x432px | 432x432px |

**Legacy Icon (Android <8.0):**

| Densidad | Tamaño |
|----------|--------|
| mdpi | 48x48px |
| hdpi | 72x72px |
| xhdpi | 96x96px |
| xxhdpi | 144x144px |
| xxxhdpi | 192x192px |

### 1.4 Web/PWA Icons (Futuro)

| Tamaño | Uso |
|--------|-----|
| 16x16 | Favicon |
| 32x32 | Favicon |
| 180x180 | Apple touch icon |
| 192x192 | Android Chrome |
| 512x512 | PWA splash |

---

## 2. Tab Bar Icons

### 2.1 Lista de Iconos

| Tab | Icono Inactivo | Icono Activo | Fuente |
|-----|----------------|--------------|--------|
| Hoy | `sun` | `sun-filled` | Lucide |
| Registro | `book-open` | `book-open-filled` | Lucide |
| Áreas | `layout-grid` | `layout-grid-filled` | Lucide |
| Personas | `users` | `users-filled` | Lucide |
| Copiloto | `sparkles` | `sparkles-filled` | Lucide |

### 2.2 Especificaciones de Exportación

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  TAB BAR ICON SPECS                                            │
│                                                                │
│  Tamaño de diseño: 24x24px                                    │
│  Área segura: 20x20px (2px padding)                           │
│  Stroke width: 2px                                            │
│  Corner radius: 2px (si aplica)                               │
│                                                                │
│  Exportación:                                                  │
│                                                                │
│  iOS:                                                          │
│  • @1x: 24x24px                                               │
│  • @2x: 48x48px                                               │
│  • @3x: 72x72px                                               │
│  • Formato: PDF (vector) o PNG                                 │
│                                                                │
│  Android:                                                      │
│  • mdpi: 24x24px                                              │
│  • hdpi: 36x36px                                              │
│  • xhdpi: 48x48px                                             │
│  • xxhdpi: 72x72px                                            │
│  • xxxhdpi: 96x96px                                           │
│  • Formato: PNG o Vector Drawable (XML)                       │
│                                                                │
│  Colores:                                                      │
│  • Inactivo: #9CA3AF (gray-400)                               │
│  • Activo: #6366F1 (primary)                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Action Icons

### 3.1 Lista Completa

| Categoría | Icono | Nombre | Lucide |
|-----------|-------|--------|--------|
| **Navegación** | ← | Back | `arrow-left` |
| | → | Forward | `arrow-right` |
| | ✕ | Close | `x` |
| | ⋯ | More | `more-horizontal` |
| **Acciones** | + | Add | `plus` |
| | ✏️ | Edit | `pencil` |
| | 🗑️ | Delete | `trash-2` |
| | ✓ | Check | `check` |
| | ↗️ | Share | `share` |
| | 📋 | Copy | `copy` |
| **Contenido** | 🔍 | Search | `search` |
| | ⚙️ | Settings | `settings` |
| | 📅 | Calendar | `calendar` |
| | 🎤 | Microphone | `mic` |
| | 📷 | Camera | `camera` |
| | 📍 | Location | `map-pin` |
| | 🔗 | Link | `link` |
| **Estados** | ⚠️ | Warning | `alert-triangle` |
| | ℹ️ | Info | `info` |
| | ✓ | Success | `check-circle` |
| | ✕ | Error | `x-circle` |

### 3.2 Tamaños de Iconos

| Contexto | Tamaño | Padding del touch target |
|----------|--------|-------------------------|
| Inline (en texto) | 16x16px | N/A |
| En botón | 20x20px | 12px |
| Header action | 24x24px | 10px (total 44px) |
| FAB | 24x24px | 16px (total 56px) |
| Empty state | 48x48px | N/A |
| Onboarding | 64x64px | N/A |

---

## 4. Area Icons (Emojis)

### 4.1 Emojis Predefinidos

| Área | Emoji | Unicode |
|------|-------|---------|
| Salud | 💪 | U+1F4AA |
| Trabajo | 💼 | U+1F4BC |
| Relaciones | 👥 | U+1F465 |
| Finanzas | 💰 | U+1F4B0 |
| Fe/Espiritualidad | 🙏 | U+1F64F |
| Aprendizaje | 📚 | U+1F4DA |
| Creatividad | 🎨 | U+1F3A8 |
| Servicio | 🤝 | U+1F91D |
| Pareja | ❤️ | U+2764 |

### 4.2 Emojis Adicionales Sugeridos

| Categoría | Emojis |
|-----------|--------|
| Salud | 🏃 🧘 🍎 😴 💊 🏋️ |
| Trabajo | 💻 📊 📈 🎯 ⏰ 📝 |
| Hobbies | 🎹 🎸 📖 🎮 🎬 ✈️ |
| Familia | 👨‍👩‍👧 👶 🏠 🐕 🌳 |
| Otros | ⭐ 🌟 ✨ 🔥 💡 🎉 |

### 4.3 Renderizado de Emojis

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  EMOJI RENDERING                                               │
│                                                                │
│  Tamaños recomendados:                                         │
│  • En lista: 24px                                             │
│  • En card header: 32px                                       │
│  • En detalle: 48px                                           │
│                                                                │
│  Notas:                                                        │
│  • Usar emojis nativos del sistema                            │
│  • NO usar imágenes de emoji (varían por OS)                  │
│  • Fallback a icono si emoji no disponible                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Illustrations

### 5.1 Onboarding Illustrations

| Pantalla | Descripción | Estilo |
|----------|-------------|--------|
| A1 - Bienvenida | Persona con brújula/camino | Flat, colores primarios |
| A2 - Áreas | Círculos/dimensiones de vida | Abstract, colorido |
| A3 - Ritmos | Patrones/ritmos visuales | Geometric, repetitivo |
| A4 - Personas | Conexiones/red de personas | Warm, humano |
| A5 - Preferencias | Configuración/ajustes | Clean, técnico |
| A6 - AI | Asistente/chat amigable | Friendly, tech |

### 5.2 Empty States

| Contexto | Ilustración | Mensaje |
|----------|-------------|---------|
| Timeline vacío | Cuaderno abierto | "No hay entradas aún" |
| Sin ritmos | Calendario vacío | "Crea tu primer ritmo" |
| Sin personas | Siluetas conectadas | "Agrega a alguien importante" |
| Sin metas | Bandera/montaña | "Define tu primer objetivo" |
| Búsqueda sin resultados | Lupa triste | "No encontramos nada" |

### 5.3 Especificaciones de Ilustración

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ILLUSTRATION SPECS                                            │
│                                                                │
│  Estilo general:                                               │
│  • Flat design con ligeros gradientes                         │
│  • Sin outlines gruesos                                       │
│  • Colores de la paleta de la app                             │
│  • Personajes abstractos (sin rasgos faciales detallados)     │
│                                                                │
│  Tamaños:                                                      │
│  • Onboarding: 240x240px @3x (720x720px)                      │
│  • Empty state: 120x120px @3x (360x360px)                     │
│  • Inline: 64x64px @3x (192x192px)                            │
│                                                                │
│  Formato:                                                      │
│  • SVG preferido (vector)                                     │
│  • PNG con transparencia si necesario                         │
│  • Lottie para animaciones                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Store Assets

### 6.1 App Store (iOS)

**Screenshots:**

| Dispositivo | Tamaño | Cantidad |
|-------------|--------|----------|
| iPhone 6.7" | 1290 x 2796px | 5-10 |
| iPhone 6.5" | 1284 x 2778px | 5-10 |
| iPhone 5.5" | 1242 x 2208px | 5-10 |
| iPad Pro 12.9" | 2048 x 2732px | 5-10 (opcional) |

**Contenido sugerido de screenshots:**

1. Dashboard "Hoy" con check-in
2. Timeline de registro
3. Lista de ritmos con checks
4. Lista de personas
5. Chat del copiloto
6. Sugerencias inbox
7. Detalle de área
8. Revisión semanal

**App Preview Video (opcional):**
- Duración: 15-30 segundos
- Resolución: Igual que screenshots
- Formato: MOV, M4V, MP4 (H.264)
- Sin audio de voz (solo música/SFX)

### 6.2 Play Store (Android)

**Screenshots:**

| Tipo | Tamaño | Cantidad |
|------|--------|----------|
| Phone | 1080 x 1920px (min) | 4-8 |
| 7" Tablet | 1200 x 1920px | 4-8 (opcional) |
| 10" Tablet | 1920 x 1200px | 4-8 (opcional) |

**Feature Graphic:**
- Tamaño: 1024 x 500px
- Contenido: Logo + tagline + ilustración representativa
- Sin texto pequeño (no se lee bien)

**Promo Video (opcional):**
- YouTube URL
- Duración: 30s - 2min

### 6.3 Textos de Store

**App Name:**
- iOS: Life Copilot (30 caracteres max)
- Android: Life Copilot - Tu asistente de vida (50 caracteres max)

**Subtitle (iOS) / Short Description (Android):**
- "Registra, organiza y mejora tu vida" (30/80 caracteres)

**Keywords (iOS):**
```
journal,diario,hábitos,rutinas,metas,objetivos,productividad,
bienestar,mindfulness,relaciones,seguimiento,copiloto
```

**Description (ambas plataformas):**
```
Life Copilot es tu compañero personal para llevar el registro de 
tu vida de manera integral.

✨ CARACTERÍSTICAS PRINCIPALES

📝 REGISTRO FLEXIBLE
• Escribe notas, graba audio, captura fotos
• Check-ins diarios para tracking de ánimo y energía
• Timeline cronológico de toda tu actividad

🎯 RITMOS Y HÁBITOS
• Crea ritmos (hábitos) con frecuencia personalizada
• Seguimiento sin culpa - consistencia sobre perfección
• Sesiones de práctica para hobbies (piano, ejercicio, etc.)

👥 RELACIONES
• Mantén registro de tus personas importantes
• Sugerencias de reconexión inteligentes
• Historial de interacciones

🧭 COPILOTO AI (Opcional)
• Dicta tus actualizaciones por voz
• El AI detecta y organiza la información
• Tú apruebas antes de guardar

🔒 PRIVACIDAD PRIMERO
• Datos 100% locales en tu dispositivo
• PIN/biometría para proteger tu información
• Exporta tus datos cuando quieras

💰 SIN SUSCRIPCIONES
• Pago único, acceso completo
• Sin publicidad
• Sin venta de datos

Descarga Life Copilot y empieza a vivir más intencionalmente.
```

---

## 7. Export Checklist

### 7.1 Iconos

- [ ] Tab bar icons (5 pares inactive/active)
  - [ ] @1x, @2x, @3x (iOS)
  - [ ] mdpi-xxxhdpi (Android)
  
- [ ] Action icons (~25 iconos)
  - [ ] SVG source files
  - [ ] PNG exports all sizes
  
- [ ] FAB icon (plus)
  - [ ] All sizes

### 7.2 App Icon

- [ ] iOS icon set completo (11 tamaños)
- [ ] Android adaptive icon
  - [ ] Foreground layer
  - [ ] Background layer
  - [ ] Legacy icons
- [ ] Web icons (favicon, PWA)

### 7.3 Ilustraciones

- [ ] Onboarding (6 ilustraciones)
  - [ ] SVG source
  - [ ] PNG @1x, @2x, @3x
  - [ ] Lottie animations (si aplica)
  
- [ ] Empty states (5+ ilustraciones)
  - [ ] SVG source
  - [ ] PNG exports

### 7.4 Store Assets

- [ ] iOS screenshots (8 por dispositivo × 3 dispositivos)
- [ ] Android screenshots (8 por tipo × 3 tipos)
- [ ] Feature graphic (Android)
- [ ] App preview video (opcional)

---

## 8. Naming Conventions

### 8.1 Iconos

```
Formato: ic_[nombre]_[estado]_[tamaño].[ext]

Ejemplos:
ic_sun_inactive_24.svg
ic_sun_active_24.svg
ic_sun_inactive_24@2x.png
ic_sun_inactive_24@3x.png
```

### 8.2 Ilustraciones

```
Formato: il_[contexto]_[nombre]_[tamaño].[ext]

Ejemplos:
il_onboarding_welcome_240.svg
il_empty_timeline_120.svg
il_empty_timeline_120@2x.png
```

### 8.3 Screenshots

```
Formato: ss_[plataforma]_[dispositivo]_[número].[ext]

Ejemplos:
ss_ios_iphone67_01_dashboard.png
ss_ios_iphone67_02_timeline.png
ss_android_phone_01_dashboard.png
```

---

## 9. Herramientas Recomendadas

### 9.1 Diseño

| Herramienta | Uso |
|-------------|-----|
| Figma | UI design, prototipos |
| Sketch | Alternativa a Figma |
| Adobe XD | Alternativa |
| Illustrator | Ilustraciones vectoriales |

### 9.2 Iconos

| Herramienta | Uso |
|-------------|-----|
| Lucide | Librería de iconos base |
| Nucleo | Exportación multi-formato |
| SVG Optimizer | Optimización de SVGs |

### 9.3 Exportación

| Herramienta | Uso |
|-------------|-----|
| Figma Export | Exports automáticos |
| ImageOptim | Compresión PNG |
| SVGO | Optimización SVG |
| App Icon Generator | Generación de tamaños |

### 9.4 Animaciones

| Herramienta | Uso |
|-------------|-----|
| LottieFiles | Animaciones Lottie |
| After Effects + Bodymovin | Crear Lottie |
| Rive | Animaciones interactivas |

---

## 10. Recursos y Referencias

### 10.1 Guías de Plataforma

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
- [App Store Asset Guidelines](https://developer.apple.com/app-store/product-page/)
- [Play Store Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)

### 10.2 Recursos de Iconos

- [Lucide Icons](https://lucide.dev/) - Librería base
- [Feather Icons](https://feathericons.com/) - Alternativa compatible
- [Heroicons](https://heroicons.com/) - Alternativa

### 10.3 Recursos de Ilustración

- [unDraw](https://undraw.co/) - Ilustraciones gratuitas
- [Blush](https://blush.design/) - Ilustraciones customizables
- [Storyset](https://storyset.com/) - Ilustraciones animadas

---

*Especificaciones de assets de Life Copilot.*
*Para uso de diseñadores en preparación de assets.*
