# Life Copilot - Documentación de Diseño UI/UX

> Sistema de diseño completo para Life Copilot.
> Fase 2 del plan de implementación.

---

## 📁 Estructura de Documentos

```
design/
├── README.md                  ← Este archivo
├── DESIGN_SYSTEM.md          ← Tokens, colores, tipografía, espaciado
├── COMPONENT_LIBRARY.md      ← Componentes base y específicos
├── SCREEN_SPECS.md           ← Especificaciones de 38 pantallas
├── PROTOTYPE_FLOWS.md        ← Animaciones y transiciones
└── ASSETS_SPEC.md            ← Iconos, ilustraciones, store assets
```

---

## 🎨 Resumen del Sistema de Diseño

### Identidad Visual

| Elemento | Valor |
|----------|-------|
| **Nombre** | Life Copilot |
| **Tagline** | "Tu copiloto de vida" |
| **Primary Color** | `#6366F1` (Indigo) |
| **Secondary Color** | `#14B8A6` (Teal) |
| **Font** | Inter |

### Colores Principales

```
Primary:    #6366F1  ████████████
Secondary:  #14B8A6  ████████████
Success:    #10B981  ████████████
Warning:    #F59E0B  ████████████
Error:      #EF4444  ████████████
```

### Escala de Espaciado

```
4px  - space-1  (micro)
8px  - space-2  (small)
12px - space-3  (compact)
16px - space-4  (standard)
24px - space-6  (section)
32px - space-8  (group)
```

---

## 📱 Pantallas (38 total)

### Por Grupo

| Grupo | Cantidad | MVP |
|-------|----------|-----|
| Onboarding (A) | 6 | ✓ |
| Hoy (B) | 3 | ✓ |
| Registro (C) | 4 | ✓ |
| Áreas (D) | 3 | ✓ |
| Ritmos (E) | 3 | ✓ |
| Metas (F) | 3 | V1 |
| Personas (G) | 3 | ✓ |
| Ideas (H) | 2 | V1 |
| Insights (I) | 2 | V1 |
| Copiloto (J) | 4 | ✓ |
| Ajustes (K) | 2 | ✓ |
| Auxiliares (L) | 3 | V1 |

### Pantallas MVP (25)

```
A1-A6  Onboarding completo
B1-B3  Dashboard, Check-in, Sugerencias
C1-C4  Timeline y entradas
D1-D2  Áreas (lista, detalle)
E1-E3  Ritmos completo
G1-G3  Personas completo
J1-J4  Copiloto completo
K1-K2  Ajustes completo
```

---

## 🧩 Componentes

### Base (18 componentes)

| Categoría | Componentes |
|-----------|-------------|
| Botones | Primary, Secondary, Ghost, Danger, Icon |
| Inputs | Text, Textarea, Select, Slider, Checkbox, Radio, Toggle, Chip |
| Cards | Standard, Compact, Expandable |
| Modales | Small, Medium, Bottom Sheet |
| Navegación | Tab Bar, Header, FAB |
| Estados | Empty, Loading, Skeleton, Error |

### Específicos (10 componentes)

| Componente | Descripción |
|------------|-------------|
| Check-in Widget | 3 sliders de mood/energía/foco |
| Ritmo Item | Checkbox con progreso |
| Persona Item | Avatar con último contacto |
| Entrada Item | Timeline item |
| Sugerencia Card | Card con acciones |
| Meta Progress | Barra de progreso |
| Chat Bubbles | Usuario y copiloto |
| Voice Recording | Grabación con waveform |
| FAB Menu | Menú expandible |
| Area Card | Card con indicador de salud |

---

## 🎬 Animaciones Clave

| Animación | Duración | Easing |
|-----------|----------|--------|
| Tab change | 150ms | ease-out |
| Push navigation | 300ms | ease-out |
| Bottom sheet | 300ms | ease-out |
| FAB expand | 450ms total | ease-bounce |
| Checkbox check | 200ms | ease-default |
| Modal open | 200ms | ease-out |

---

## 📦 Assets Requeridos

### Iconos
- 5 iconos de tab bar (10 variantes: active/inactive)
- ~25 iconos de acción
- 9 emojis de áreas predefinidas

### Ilustraciones
- 6 ilustraciones de onboarding (240x240px)
- 5+ ilustraciones de empty states (120x120px)

### App Icon
- iOS: 11 tamaños (20px a 1024px)
- Android: Adaptive icon + legacy

### Store Assets
- 24+ screenshots (iOS + Android)
- Feature graphic (Android)
- App preview video (opcional)

---

## ✅ Checklist de Entregables

### Sistema de Diseño
- [x] Identidad visual definida
- [x] Paleta de colores completa
- [x] Escala tipográfica
- [x] Design tokens documentados
- [x] Espaciado y grid
- [x] Iconografía definida

### Componentes
- [x] 18 componentes base especificados
- [x] 10 componentes específicos especificados
- [x] Estados documentados
- [x] Especificaciones para desarrollo

### Pantallas
- [x] 38 pantallas especificadas
- [x] Wireframes de alta fidelidad (ASCII)
- [x] Elementos y medidas documentados

### Prototipos
- [x] Flujos de navegación documentados
- [x] Animaciones especificadas
- [x] Transiciones definidas
- [x] Haptic feedback guide

### Assets
- [x] Especificaciones de iconos
- [x] Guía de app icon
- [x] Requisitos de store assets
- [x] Naming conventions

---

## 🔗 Documentos Relacionados

- [PRODUCT_SPEC.md](../PRODUCT_SPEC.md) - Especificación de producto
- [DESIGN_DECISIONS.md](../DESIGN_DECISIONS.md) - Decisiones de diseño
- [SCREEN_FLOWS.md](../SCREEN_FLOWS.md) - Flujos de pantalla

---

## 📝 Notas de Implementación

### Para Diseñadores

1. Usar Figma como herramienta principal
2. Crear component library basada en estas specs
3. Mantener consistencia con design tokens
4. Exportar assets según especificaciones

### Para Desarrolladores

1. Implementar design tokens como variables CSS/Flutter
2. Crear componentes reutilizables
3. Seguir especificaciones de animación
4. Respetar touch targets de accesibilidad (44px iOS, 48px Android)

### Prioridad de Implementación

```
1. Design tokens y tema base
2. Componentes de navegación (Tab Bar, Header, FAB)
3. Componentes de entrada (Inputs, Buttons)
4. Componentes de contenido (Cards, Lists)
5. Componentes específicos (Check-in, Ritmo Item, etc.)
6. Pantallas MVP
7. Animaciones y transiciones
8. Pantallas V1
```

---

*Documentación de diseño creada como parte de la Fase 2.*
*Para uso del equipo de diseño y desarrollo.*
