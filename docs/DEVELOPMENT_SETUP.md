# Life Copilot - Guía de Desarrollo

Esta guía contiene todo lo necesario para configurar el entorno de desarrollo y comenzar a contribuir a Life Copilot.

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación del Entorno](#instalación-del-entorno)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Comandos Útiles](#comandos-útiles)
6. [Estilo de Código](#estilo-de-código)
7. [Testing](#testing)
8. [Debugging](#debugging)
9. [Build y Despliegue](#build-y-despliegue)

---

## Requisitos Previos

### Software Requerido

| Herramienta | Versión Mínima | Notas |
|-------------|----------------|-------|
| **Flutter** | 3.16.0+ | SDK principal |
| **Dart** | 3.2.0+ | Incluido con Flutter |
| **Android Studio** | 2023.x | Para desarrollo Android |
| **Xcode** | 15.0+ | Solo macOS, para iOS |
| **VS Code** | Última | Editor recomendado |
| **Git** | 2.x | Control de versiones |

### Hardware Recomendado

- **RAM**: 16GB mínimo (32GB recomendado)
- **Almacenamiento**: 20GB libres mínimo
- **macOS**: Requerido para compilar iOS

---

## Instalación del Entorno

### 1. Instalar Flutter

**Windows:**
```powershell
# Opción 1: Chocolatey
choco install flutter

# Opción 2: Manual
# Descargar desde https://flutter.dev/docs/get-started/install/windows
# Extraer y agregar flutter/bin al PATH
```

**macOS:**
```bash
# Opción 1: Homebrew
brew install flutter

# Opción 2: Manual
# Descargar desde https://flutter.dev/docs/get-started/install/macos
```

**Linux:**
```bash
# Snap (recomendado)
sudo snap install flutter --classic

# O manual
# Descargar desde https://flutter.dev/docs/get-started/install/linux
```

### 2. Verificar Instalación

```bash
flutter doctor -v
```

Asegúrate de que todos los checkmarks estén verdes (✓) para:
- Flutter
- Android toolchain
- Xcode (si estás en macOS)
- Chrome (para web)
- VS Code / Android Studio

### 3. Configurar Android Studio

1. Instalar Android Studio desde [developer.android.com](https://developer.android.com/studio)
2. Abrir Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
3. Instalar:
   - Android SDK Platform 34 (o la más reciente)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator

### 4. Configurar VS Code (Recomendado)

Instalar extensiones:
- **Flutter** (dart-code.flutter)
- **Dart** (dart-code.dart-code)
- **Error Lens** (usernamehw.errorlens)
- **GitLens** (eamodio.gitlens)
- **Thunder Client** (rangav.vscode-thunder-client) - para probar APIs

Configuración recomendada (`.vscode/settings.json`):
```json
{
  "dart.flutterSdkPath": "auto",
  "dart.lineLength": 80,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.rulers": [80],
    "editor.defaultFormatter": "Dart-Code.dart-code"
  }
}
```

---

## Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/[tu-org]/life-copilot.git
cd life-copilot/life_copilot
```

### 2. Instalar Dependencias

```bash
flutter pub get
```

### 3. Generar Código (si es necesario)

```bash
# Generar código de Drift, Freezed, etc.
dart run build_runner build --delete-conflicting-outputs

# O para desarrollo continuo
dart run build_runner watch --delete-conflicting-outputs
```

### 4. Configurar Emuladores

**Android:**
```bash
# Listar dispositivos disponibles
flutter emulators

# Crear nuevo emulador
flutter emulators --create --name pixel_7

# Lanzar emulador
flutter emulators --launch pixel_7
```

**iOS (solo macOS):**
```bash
# Abrir simulador
open -a Simulator
```

### 5. Ejecutar la App

```bash
# Modo debug (default)
flutter run

# Seleccionar dispositivo específico
flutter run -d <device_id>

# Listar dispositivos
flutter devices
```

---

## Estructura del Proyecto

```
life_copilot/
├── lib/
│   ├── main.dart                 # Entry point
│   │
│   ├── core/                     # Core functionality
│   │   ├── theme/               # Design system
│   │   │   ├── app_colors.dart
│   │   │   ├── app_typography.dart
│   │   │   ├── app_spacing.dart
│   │   │   ├── app_radius.dart
│   │   │   ├── app_shadows.dart
│   │   │   ├── app_animations.dart
│   │   │   └── app_theme.dart
│   │   ├── router/              # Navigation
│   │   ├── l10n/                # Localization
│   │   ├── constants/           # App constants
│   │   ├── services/            # Core services
│   │   └── providers/           # Global providers
│   │
│   ├── features/                 # Feature modules
│   │   ├── onboarding/          # A1-A6 screens
│   │   ├── dashboard/           # B1-B3 screens
│   │   ├── entries/             # C1-C4 screens
│   │   ├── areas/               # D1-D3 screens
│   │   ├── rhythms/             # E1-E3 screens
│   │   ├── goals/               # F1-F3 screens
│   │   ├── people/              # G1-G3 screens
│   │   ├── copilot/             # J1-J4 screens
│   │   ├── insights/            # I1-I2 screens
│   │   └── settings/            # K1-K2 screens
│   │
│   ├── shared/                   # Shared code
│   │   ├── widgets/             # Reusable widgets
│   │   └── models/              # Shared models
│   │
│   └── data/                     # Data layer
│       ├── database/            # Drift database
│       └── repositories/        # Data repositories
│
├── test/                         # Tests
│   ├── unit/
│   ├── widget/
│   └── integration/
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── android/                      # Android native
├── ios/                          # iOS native
├── .github/                      # GitHub Actions CI/CD
│
├── pubspec.yaml                  # Dependencies
├── analysis_options.yaml         # Linting rules
└── README.md
```

### Convención de Archivos por Feature

Cada feature sigue esta estructura:

```
features/
└── dashboard/
    ├── providers/           # State management
    │   └── dashboard_provider.dart
    ├── screens/             # Pages/Screens
    │   └── dashboard_screen.dart
    ├── widgets/             # Feature-specific widgets
    │   ├── check_in_widget.dart
    │   ├── rhythms_today_widget.dart
    │   └── suggestion_card.dart
    └── models/              # Feature-specific models (if any)
```

---

## Comandos Útiles

### Desarrollo

```bash
# Ejecutar en debug
flutter run

# Ejecutar con hot reload verbose
flutter run --verbose

# Ejecutar en release mode
flutter run --release

# Ejecutar en profile mode (para performance)
flutter run --profile

# Limpiar build cache
flutter clean

# Actualizar dependencias
flutter pub upgrade
```

### Generación de Código

```bash
# Generar una vez
dart run build_runner build --delete-conflicting-outputs

# Generar continuamente
dart run build_runner watch --delete-conflicting-outputs

# Solo Drift (database)
dart run build_runner build --build-filter="lib/data/database/*.dart"
```

### Análisis y Formato

```bash
# Analizar código
flutter analyze

# Formatear código
dart format .

# Verificar formato sin modificar
dart format --output=none --set-exit-if-changed .

# Arreglar problemas automáticamente
dart fix --apply
```

### Testing

```bash
# Ejecutar todos los tests
flutter test

# Con coverage
flutter test --coverage

# Ver reporte de coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html

# Test específico
flutter test test/unit/services/database_test.dart

# Test con tags
flutter test --tags=unit
```

### Build

```bash
# Build APK (Android)
flutter build apk

# Build App Bundle (Android, para Play Store)
flutter build appbundle

# Build iOS (requiere macOS)
flutter build ios

# Build con flavor
flutter build apk --flavor production --target lib/main_production.dart
```

---

## Estilo de Código

### Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Clases | PascalCase | `DashboardScreen` |
| Variables | camelCase | `checkInState` |
| Constantes | camelCase | `primaryColor` |
| Archivos | snake_case | `dashboard_screen.dart` |
| Carpetas | snake_case | `shared_widgets` |

### Imports

Orden de imports (automático con `dart format`):
1. Dart SDK (`dart:`)
2. Flutter (`package:flutter/`)
3. Packages externos
4. Packages locales (`package:life_copilot/`)
5. Imports relativos

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:life_copilot/core/theme/app_colors.dart';
import '../widgets/custom_button.dart';
```

### Widgets

```dart
/// Descripción breve del widget
class MyWidget extends StatelessWidget {
  const MyWidget({
    required this.title,
    this.onTap,
    super.key,
  });

  /// El título a mostrar
  final String title;
  
  /// Callback cuando se toca el widget
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      // ...
    );
  }
}
```

### Providers (Riverpod)

```dart
// Provider simple
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// Async provider
final areasProvider = FutureProvider<List<Area>>((ref) async {
  final db = ref.watch(databaseProvider);
  return db.getAreas();
});

// Notifier
@riverpod
class Dashboard extends _$Dashboard {
  @override
  DashboardState build() => DashboardState.initial();
  
  void updateMood(int value) {
    state = state.copyWith(mood: value);
  }
}
```

---

## Testing

### Tipos de Tests

1. **Unit Tests**: Lógica de negocio, servicios, utilidades
2. **Widget Tests**: Widgets aislados
3. **Integration Tests**: Flujos completos

### Estructura de Tests

```dart
void main() {
  group('DashboardService', () {
    late DashboardService service;
    late MockDatabase mockDb;

    setUp(() {
      mockDb = MockDatabase();
      service = DashboardService(mockDb);
    });

    test('should return today rhythms', () async {
      // Arrange
      when(() => mockDb.getRhythmsForDate(any()))
          .thenAnswer((_) async => [testRhythm]);

      // Act
      final result = await service.getTodayRhythms();

      // Assert
      expect(result.length, 1);
      expect(result.first.name, testRhythm.name);
    });
  });
}
```

### Mocking con Mocktail

```dart
class MockDatabase extends Mock implements Database {}

// En el test
when(() => mockDb.getAreas()).thenAnswer((_) async => []);
verify(() => mockDb.getAreas()).called(1);
```

---

## Debugging

### VS Code

1. Crear archivo `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "life_copilot (debug)",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart"
    },
    {
      "name": "life_copilot (profile)",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart",
      "flutterMode": "profile"
    }
  ]
}
```

2. Usar breakpoints
3. Inspeccionar variables en el panel Debug

### Flutter DevTools

```bash
# Lanzar DevTools
flutter pub global activate devtools
flutter pub global run devtools

# O desde el navegador después de `flutter run`
# El URL aparece en la terminal
```

### Logs

```dart
// Para desarrollo
debugPrint('Debug message');

// Para logs estructurados
import 'package:flutter/foundation.dart';
if (kDebugMode) {
  print('Solo en debug');
}
```

---

## Build y Despliegue

### Android

```bash
# Generar keystore (una vez)
keytool -genkey -v -keystore ~/life-copilot-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias life-copilot

# Configurar key.properties (NO commitear)
# android/key.properties
storePassword=<password>
keyPassword=<password>
keyAlias=life-copilot
storeFile=/path/to/life-copilot-release.jks

# Build release
flutter build appbundle --release
```

### iOS

```bash
# Abrir en Xcode
open ios/Runner.xcworkspace

# Configurar signing en Xcode
# Build desde Xcode o:
flutter build ios --release
```

### Versioning

En `pubspec.yaml`:
```yaml
version: 1.0.0+1
# formato: MAJOR.MINOR.PATCH+BUILD_NUMBER
```

- **MAJOR**: Cambios incompatibles
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Bug fixes
- **BUILD_NUMBER**: Incrementar en cada build

---

## Recursos Adicionales

### Documentación del Proyecto
- [PRODUCT_SPEC.md](../PRODUCT_SPEC.md) - Especificación completa
- [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md) - Sistema de diseño
- [DESIGN_DECISIONS.md](../DESIGN_DECISIONS.md) - Decisiones de diseño
- [SCREEN_FLOWS.md](../SCREEN_FLOWS.md) - Flujos de usuario

### ADRs (Architecture Decision Records)
- [ADR-001: Framework Selection](adrs/ADR-001-framework-selection.md)
- [ADR-002: Data Persistence](adrs/ADR-002-data-persistence.md)
- [ADR-003: AI Integration](adrs/ADR-003-ai-integration.md)
- [ADR-004: Authentication](adrs/ADR-004-authentication.md)
- [ADR-005: State Management](adrs/ADR-005-state-management.md)

### Enlaces Externos
- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Riverpod Documentation](https://riverpod.dev/)
- [Drift Documentation](https://drift.simonbinder.eu/)

---

## Soporte

Para preguntas o problemas:
1. Revisar documentación existente
2. Buscar en issues existentes
3. Crear nuevo issue con template correspondiente

---

*Última actualización: Enero 2026*
