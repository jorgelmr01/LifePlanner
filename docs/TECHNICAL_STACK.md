# Life Copilot - Stack Técnico

> Resumen de las decisiones técnicas tomadas para el proyecto Life Copilot.
> Versión: 1.0
> Fecha: Enero 2026

---

## Resumen Ejecutivo

| Categoría | Decisión | Justificación |
|-----------|----------|---------------|
| **Framework** | Flutter (Dart) | Performance nativa, single codebase, excelente soporte para animaciones |
| **Base de Datos** | SQLite + Drift + SQLCipher | Local-first, relacional, encriptado |
| **State Management** | Riverpod | Type-safe, testeable, sin contexto requerido |
| **AI Integration** | OpenAI APIs (GPT-4 + Whisper) | Calidad superior, user-provided API keys |
| **Autenticación** | Local PIN + Biometrics | Sin backend, máxima privacidad |

---

## 1. Framework: Flutter

**Versión objetivo:** Flutter 3.16.0+ / Dart 3.2.0+

### Por qué Flutter

- **Rendimiento**: Compilado a código ARM nativo, 60fps consistentes
- **Código compartido**: ~95% de código compartido entre iOS y Android
- **Design System**: La arquitectura de widgets permite implementar el design system de forma consistente
- **Hot Reload**: Desarrollo iterativo rápido
- **Ecosistema maduro**: Plugins para todas las funcionalidades requeridas

### Estructura del Proyecto

```
lib/
├── core/           # Fundamentos (theme, router, l10n)
├── features/       # Módulos por funcionalidad
├── shared/         # Código compartido
└── data/           # Capa de datos
```

**ADR relacionado:** [ADR-001-framework-selection.md](adrs/ADR-001-framework-selection.md)

---

## 2. Base de Datos: SQLite + Drift + SQLCipher

### Stack de Datos

| Componente | Rol |
|------------|-----|
| **SQLite** | Motor de base de datos |
| **Drift** | ORM type-safe para Dart |
| **SQLCipher** | Encriptación AES-256 |

### Características

- **Local-first**: Todos los datos en el dispositivo
- **Relacional**: Soporte completo para relaciones N:N del modelo de datos
- **Full-text search**: Via FTS5 para búsqueda de entradas
- **Migraciones**: Controladas via Drift
- **Export/Import**: Fácil extracción a JSON/CSV

### Esquema Principal

5 objetos principales con relaciones N:N:
- `areas` - Dimensiones de vida
- `entradas` - Journal entries
- `ritmos` - Hábitos/ritmos
- `metas` - Objetivos
- `personas` - Relaciones

**ADR relacionado:** [ADR-002-data-persistence.md](adrs/ADR-002-data-persistence.md)

---

## 3. State Management: Riverpod

### Por qué Riverpod

- **Compile-time safety**: Errores detectados antes de runtime
- **Testing**: ProviderContainer permite tests aislados
- **Sin Context**: Servicios pueden acceder a state sin widget
- **Auto-disposal**: Limpieza automática de recursos

### Tipos de Provider Usados

```dart
// State simple
StateProvider<ThemeMode>

// Datos async (DB/API)
FutureProvider<List<Entry>>

// Streams (tiempo real)
StreamProvider<List<Rhythm>>

// Lógica compleja
NotifierProvider<DashboardNotifier, DashboardState>
```

**ADR relacionado:** [ADR-005-state-management.md](adrs/ADR-005-state-management.md)

---

## 4. AI Integration: OpenAI APIs

### Servicios Utilizados

| Servicio | Uso |
|----------|-----|
| **GPT-4** | Chat del copiloto, parsing de texto a acciones |
| **Whisper** | Transcripción de audio a texto |

### Modelo de Integración

- **User-provided API keys**: El usuario provee su propia clave
- **Sin backend propio**: Llamadas directas desde el cliente
- **Function calling**: Para estructurar respuestas en JSON
- **Confirmación requerida**: El AI propone, el usuario aprueba

### Privacidad

- Sin AI la app funciona 100%
- El usuario controla qué datos puede leer el copiloto
- Historial configurable (solo resultados / completo / nada)

**ADR relacionado:** [ADR-003-ai-integration.md](adrs/ADR-003-ai-integration.md)

---

## 5. Autenticación y Seguridad

### Modelo de Autenticación

- **PIN de 4-6 dígitos**: Almacenado como hash con salt
- **Biometría**: FaceID / TouchID / Fingerprint via `local_auth`
- **Sin cuenta cloud**: No se requiere email ni servidor

### Niveles de Privacidad

| Nivel | Protección |
|-------|------------|
| **Normal** | Encriptación base de datos |
| **Privada** | Oculta de previews y widgets |
| **Ultra-privada** | Encriptación adicional + PIN por acceso |

### Almacenamiento Seguro

- **flutter_secure_storage**: Para API keys y secrets
- **SQLCipher**: Para datos de la base de datos
- **Argon2id**: Para derivación de claves (ultra-private)

**ADR relacionado:** [ADR-004-authentication.md](adrs/ADR-004-authentication.md)

---

## 6. Dependencias Principales

```yaml
# State Management
flutter_riverpod: ^2.4.9

# Database
drift: ^2.14.1
sqlcipher_flutter_libs: ^0.5.5

# Authentication
local_auth: ^2.1.8
flutter_secure_storage: ^9.0.0

# Networking
dio: ^5.4.0

# UI
lucide_icons: ^0.257.0
google_fonts: ^6.1.0
flutter_animate: ^4.3.0

# Audio
record: ^5.0.4
just_audio: ^0.9.36

# Utilities
uuid: ^4.2.2
intl: ^0.19.0
freezed_annotation: ^2.4.1
```

---

## 7. CI/CD

### GitHub Actions

| Workflow | Trigger | Acciones |
|----------|---------|----------|
| **ci.yml** | push, PR | Analyze, Test, Build Android/iOS |
| **pr-checks.yml** | PR | Validación rápida, size check |

### Flujo de Builds

```
PR → Analyze → Test → Build Debug
     ↓
main → Build Release → Artifacts
```

---

## 8. Design System en Código

El design system de DESIGN_SYSTEM.md está implementado en:

| Archivo | Contenido |
|---------|-----------|
| `app_colors.dart` | Paleta de colores (primarios, semánticos, áreas) |
| `app_typography.dart` | Escala tipográfica, estilos de texto |
| `app_spacing.dart` | Sistema de espaciado, EdgeInsets helpers |
| `app_radius.dart` | Border radius para diferentes elementos |
| `app_shadows.dart` | Definiciones de sombras/elevación |
| `app_animations.dart` | Curvas, duraciones, transiciones |
| `app_theme.dart` | ThemeData para Material (light/dark) |

---

## 9. Roadmap Técnico

### MVP
- [x] Setup de proyecto Flutter
- [x] Design system implementado
- [x] ADRs documentados
- [x] CI/CD configurado
- [ ] Base de datos con Drift
- [ ] Pantallas de onboarding (A1-A6)
- [ ] Dashboard (B1-B3)
- [ ] Copiloto AI básico (J1-J4)

### V1
- [ ] Todas las 38 pantallas
- [ ] Motor de sugerencias
- [ ] Insights y revisión semanal
- [ ] Búsqueda y calendario

### V2
- [ ] Sincronización multi-dispositivo
- [ ] Integraciones (calendario, salud)
- [ ] Mejoras de AI (memoria, análisis profundo)

---

## 10. Referencias

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Riverpod Documentation](https://riverpod.dev/)
- [Drift Documentation](https://drift.simonbinder.eu/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

*Documento generado como parte de FASE 3: Setup Técnico*
