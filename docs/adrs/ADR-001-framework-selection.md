# ADR-001: Framework Selection

**Status:** Superseded by [ADR-006](ADR-006-pwa-pivot.md) (pivote a PWA, julio 2026)  
**Date:** January 2026  
**Decision Makers:** Development Team

---

## Context

Life Copilot is a personal life tracking mobile application that needs to run on both iOS and Android platforms. We need to choose a cross-platform framework that balances:

- Development speed and efficiency
- Performance (especially for smooth animations and UI interactions)
- Native feature access (biometrics, local storage, notifications)
- Long-term maintainability
- Community support and ecosystem maturity

## Decision

**We will use Flutter (Dart) as the primary framework for Life Copilot.**

## Options Considered

### Option A: Flutter (Dart)
**Pros:**
- Single codebase for iOS and Android
- Excellent performance (compiled to native ARM code)
- Rich widget library with Material and Cupertino designs
- Strong typing with Dart
- Hot reload for rapid development
- Growing ecosystem and community
- Good local database support (Drift, sqflite, Isar)
- Excellent animation framework built-in
- Widget testing built into the framework

**Cons:**
- Dart is less widely known than JavaScript/TypeScript
- Larger app bundle size than native
- Some platform-specific features require plugins

### Option B: React Native (TypeScript)
**Pros:**
- JavaScript/TypeScript ecosystem (widely known)
- Large community and mature ecosystem
- Many third-party libraries
- Good for teams with web development background

**Cons:**
- Bridge-based architecture can impact performance
- Debugging can be more complex
- More frequent breaking changes
- "Learn once, write everywhere" often requires platform-specific code

### Option C: Native Development (Swift + Kotlin)
**Pros:**
- Best possible performance
- Full access to platform features
- Platform-specific UI/UX

**Cons:**
- Two separate codebases to maintain
- Double the development time and cost
- Requires expertise in both platforms

## Rationale

Flutter is chosen because:

1. **Performance**: Life Copilot requires smooth animations for check-ins, sliders, and the chat interface. Flutter's compiled performance is superior to React Native's bridge architecture.

2. **Design System Implementation**: The detailed design system in DESIGN_SYSTEM.md maps well to Flutter's widget-based architecture. Custom widgets can be created once and used consistently.

3. **Local-First Architecture**: Flutter has excellent support for local databases (SQLite via Drift) and encryption (SQLCipher), which aligns with our privacy-first approach.

4. **Single Codebase Efficiency**: As noted in PRODUCT_SPEC.md section 13.1, we need to ship for both iOS and Android. Flutter provides true code sharing (~95%+).

5. **AI Integration**: Dart's async/await pattern and strong HTTP client support make API integrations (OpenAI, Whisper) straightforward.

6. **Future Widget Development**: iOS and Android widget development is supported via home_widget package.

## Consequences

### Positive
- Faster development cycle with single codebase
- Consistent UI/UX across platforms
- Easier to maintain design system consistency
- Hot reload improves iteration speed
- Strong type safety reduces runtime errors

### Negative
- Team needs to learn Dart (if not already proficient)
- Some native features may require platform channels
- App size will be larger than pure native (~20MB baseline)

### Risks
- Flutter's widget paradigm may be unfamiliar
- Platform-specific bugs may require native debugging skills

### Mitigations
- Allocate time for team onboarding on Flutter
- Use established plugins for common features
- Create abstraction layers for platform-specific code

## Implementation Notes

### Project Structure
```
life_copilot/
├── lib/
│   ├── core/           # Design system, utilities, constants
│   ├── features/       # Feature-based modules
│   ├── shared/         # Shared widgets and services
│   └── main.dart
├── test/
├── android/
├── ios/
└── pubspec.yaml
```

### Key Dependencies
- State Management: Riverpod or BLoC
- Database: Drift (SQLite with type safety)
- HTTP: Dio
- Local Storage: shared_preferences, flutter_secure_storage
- Biometrics: local_auth

## References

- [Flutter Official Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- PRODUCT_SPEC.md Section 13 (Technical Considerations)
- DESIGN_SYSTEM.md Section 11.2 (Flutter/Dart Tokens)
