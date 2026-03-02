# Life Copilot

> Un copiloto personal para registrar, dar seguimiento, y recibir sugerencias sobre todas las dimensiones de tu vida.

---

## Descripción

Life Copilot es una aplicación móvil que combina:

- **Journaling**: Captura de momentos, reflexiones y notas
- **Tracking de hábitos**: Seguimiento flexible de ritmos y prácticas
- **Gestión de relaciones**: Mantener contacto con personas importantes
- **Objetivos**: Metas con progreso y próximos pasos
- **Copiloto AI opcional**: Asistente conversacional para registro y sugerencias

Todo en un sistema coherente donde las dimensiones de vida (Salud, Trabajo, Fe, Relaciones, etc.) se conectan entre sí.

---

## Documentación

### Documentos de Producto

| Documento | Descripción |
|-----------|-------------|
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Especificación completa del producto: modelo de datos, catálogo de pantallas (38), features, roadmap |
| [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) | Decisiones de diseño clave y respuestas a preguntas abiertas |
| [SCREEN_FLOWS.md](SCREEN_FLOWS.md) | Flujos de navegación y casos de uso detallados |

### Sistema de Diseño UI/UX (Fase 2) ✅

| Documento | Descripción |
|-----------|-------------|
| [design/README.md](design/README.md) | Índice y resumen del sistema de diseño |
| [design/DESIGN_SYSTEM.md](design/DESIGN_SYSTEM.md) | Tokens, colores, tipografía, espaciado, iconografía |
| [design/COMPONENT_LIBRARY.md](design/COMPONENT_LIBRARY.md) | 28 componentes (18 base + 10 específicos) |
| [design/SCREEN_SPECS.md](design/SCREEN_SPECS.md) | Especificaciones detalladas de 38 pantallas |
| [design/PROTOTYPE_FLOWS.md](design/PROTOTYPE_FLOWS.md) | Animaciones, transiciones, haptics |
| [design/ASSETS_SPEC.md](design/ASSETS_SPEC.md) | Iconos, ilustraciones, app icon, store assets |

### Contenido por documento

#### PRODUCT_SPEC.md (Documento principal)
1. Visión y propuesta de valor
2. Principios de diseño
3. Modelo de datos completo (5 objetos + relaciones)
4. Navegación y arquitectura de información
5. Catálogo de 38 pantallas con wireframes textuales
6. Sistema de sugerencias
7. Comportamiento del copiloto AI
8. Flujos de usuario
9. Features por categoría (MVP/V1/V2)
10. Plantillas predefinidas (5)
11. Roadmap
12. Decisiones de diseño
13. Consideraciones técnicas

#### DESIGN_DECISIONS.md
- Respuestas a las 5 preguntas abiertas:
  1. Notificaciones por persona (silenciar individualmente)
  2. Historial del copiloto (solo resultados por defecto)
  3. Compartir (no en MVP, limitado en V2)
  4. Multi-dispositivo (V2 con sync simple)
  5. Monetización (pago único)
- Decisiones adicionales sobre tono, privacidad, gamificación, etc.

#### SCREEN_FLOWS.md
- 10 flujos de usuario detallados con diagramas ASCII
- Tiempos estimados por flujo
- Navegación entre pantallas

---

## Estructura del Producto

### Los 5 Bloques (Objetos principales)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ÁREAS                                    │
│  (Contenedores: Salud, Trabajo, Fe, Relaciones, etc.)           │
├─────────────────────────────────────────────────────────────────┤
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │ ENTRADAS │◄──►│  RITMOS  │◄──►│  METAS   │◄──►│ PERSONAS │ │
│   │ (Journal)│    │ (Hábitos)│    │(Objetivos)│   │(Relacion)│ │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Navegación

```
┌─────────────────────────────────────────────────────────────┐
│ [Hoy] [Registro] [Áreas] [Personas] [Copiloto]    [+]      │
└─────────────────────────────────────────────────────────────┘
```

### Pantallas (38 total)

- **Onboarding**: 6 pantallas (A1-A6)
- **Hoy**: 3 pantallas (B1-B3)
- **Registro**: 4 pantallas (C1-C4)
- **Áreas**: 3 pantallas (D1-D3)
- **Ritmos**: 3 pantallas (E1-E3)
- **Metas**: 3 pantallas (F1-F3)
- **Personas**: 3 pantallas (G1-G3)
- **Ideas**: 2 pantallas (H1-H2)
- **Insights**: 2 pantallas (I1-I2)
- **Copiloto**: 4 pantallas (J1-J4)
- **Ajustes**: 2 pantallas (K1-K2)
- **Auxiliares**: 3 pantallas (L1-L3)

---

## Roadmap

### MVP - Lo mínimo mágico
- Dashboard "Hoy"
- Journal y timeline
- Ritmos (hábitos/prácticas)
- Personas básico
- Copiloto AI con confirmación
- Sugerencias por reglas

### V1 - Más redondo
- Metas/proyectos completos
- Insights y revisión semanal
- Plantillas
- Calendario y búsqueda
- Privacidad avanzada
- Celebraciones ("Momentos")

### V2 - Pro
- Integraciones (calendario, salud)
- Sync multi-dispositivo
- Memoria del copiloto
- Análisis profundo con AI
- Automatizaciones

---

## Principios clave

1. **AI siempre opcional**: Sin AI la app funciona completa
2. **Confirmación obligatoria**: El copiloto propone, el usuario aprueba
3. **Anti-gamificación**: Sin streaks prominentes, sin puntos, sin culpa
4. **Privacidad por defecto**: Datos locales, exportación fácil
5. **Fricción mínima**: Captura rápida en <10 segundos

---

## Stack Técnico

El proyecto utiliza las siguientes tecnologías (definidas en [FASE 3 - Setup Técnico](docs/TECHNICAL_STACK.md)):

| Categoría | Tecnología | 
|-----------|------------|
| **Framework** | Flutter 3.16+ (Dart) |
| **Base de Datos** | SQLite + Drift + SQLCipher |
| **State Management** | Riverpod |
| **AI** | OpenAI APIs (GPT-4 + Whisper) |
| **Autenticación** | Local PIN + Biometrics |

### ADRs (Architecture Decision Records)

- [ADR-001: Framework Selection](docs/adrs/ADR-001-framework-selection.md) - Flutter
- [ADR-002: Data Persistence](docs/adrs/ADR-002-data-persistence.md) - SQLite/Drift
- [ADR-003: AI Integration](docs/adrs/ADR-003-ai-integration.md) - OpenAI
- [ADR-004: Authentication](docs/adrs/ADR-004-authentication.md) - Local PIN/Biometrics
- [ADR-005: State Management](docs/adrs/ADR-005-state-management.md) - Riverpod

---

## Estructura del Repositorio

```
Life Planner/
├── README.md                    ← Este archivo (índice)
├── PRODUCT_SPEC.md              ← Especificación completa del producto
├── DESIGN_DECISIONS.md          ← Decisiones de diseño
├── SCREEN_FLOWS.md              ← Flujos de navegación
│
├── design/
│   ├── README.md                ← Índice del sistema de diseño
│   ├── DESIGN_SYSTEM.md         ← Tokens, colores, tipografía
│   ├── COMPONENT_LIBRARY.md     ← 28 componentes UI
│   ├── SCREEN_SPECS.md          ← Especificaciones de 38 pantallas
│   ├── PROTOTYPE_FLOWS.md       ← Animaciones y transiciones
│   └── ASSETS_SPEC.md           ← Iconos, ilustraciones, store assets
│
├── docs/
│   ├── DEVELOPMENT_SETUP.md     ← Guía de configuración para desarrollo
│   ├── TECHNICAL_STACK.md       ← Resumen del stack técnico
│   └── adrs/                    ← Architecture Decision Records
│       ├── ADR-001-framework-selection.md
│       ├── ADR-002-data-persistence.md
│       ├── ADR-003-ai-integration.md
│       ├── ADR-004-authentication.md
│       └── ADR-005-state-management.md
│
└── life_copilot/                ← Proyecto Flutter
    ├── lib/
    │   ├── core/                ← Theme, router, l10n
    │   ├── features/            ← Módulos de funcionalidad
    │   ├── shared/              ← Widgets y modelos compartidos
    │   └── data/                ← Database y repositorios
    ├── test/                    ← Tests
    ├── assets/                  ← Imágenes, iconos, fuentes
    ├── .github/workflows/       ← CI/CD pipelines
    ├── pubspec.yaml             ← Dependencias
    └── analysis_options.yaml    ← Reglas de linting
```

---

## Desarrollo

### Requisitos

- Flutter 3.16.0+
- Dart 3.2.0+
- Android Studio / Xcode (para emuladores)

### Configuración rápida

```bash
# Clonar repositorio
git clone https://github.com/[org]/life-copilot.git
cd life-copilot/life_copilot

# Instalar dependencias
flutter pub get

# Ejecutar en modo debug
flutter run
```

Para instrucciones detalladas, ver [DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md).

---

## Estado del Proyecto

### Completado ✓
- [x] **FASE 1: Validación y Research**
  - [x] Especificación de producto (PRODUCT_SPEC.md)
  - [x] Decisiones de diseño (DESIGN_DECISIONS.md)
  - [x] Flujos de pantallas (SCREEN_FLOWS.md)
- [x] **FASE 2: Diseño UI/UX** ← Recién completado
  - [x] Sistema de diseño completo (design/DESIGN_SYSTEM.md)
  - [x] Librería de componentes - 28 componentes (design/COMPONENT_LIBRARY.md)
  - [x] Especificaciones de 38 pantallas (design/SCREEN_SPECS.md)
  - [x] Flujos de prototipo y animaciones (design/PROTOTYPE_FLOWS.md)
  - [x] Especificaciones de assets (design/ASSETS_SPEC.md)
- [x] **FASE 3: Setup Técnico**
  - [x] Definición de stack técnico
  - [x] ADRs documentados
  - [x] Proyecto Flutter configurado
  - [x] Design system implementado en código
  - [x] CI/CD con GitHub Actions

### En progreso
- [ ] FASE 4: Desarrollo MVP
  - [ ] Base de datos con Drift
  - [ ] Onboarding (A1-A6)
  - [ ] Dashboard (B1-B3)
  - [ ] Copiloto AI (J1-J4)

---

*Documentación y código fuente para Life Copilot.*
*Última actualización: Enero 2026*
