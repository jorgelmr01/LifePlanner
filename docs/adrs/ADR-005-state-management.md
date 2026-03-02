# ADR-005: State Management

**Status:** Accepted  
**Date:** January 2026  
**Decision Makers:** Development Team

---

## Context

Life Copilot has several types of state to manage:

1. **UI State**: Form inputs, scroll positions, animations, tab selection
2. **App State**: Current user, authentication status, selected theme
3. **Server/Cache State**: AI responses, pending operations
4. **Persistent State**: Database records (entries, rhythms, people, etc.)

The app needs a state management solution that:
- Scales well with the 38+ screens documented in PRODUCT_SPEC.md
- Handles async operations (database, AI calls)
- Supports testing
- Works well with Flutter's reactive paradigm
- Is maintainable by a small team

## Decision

**We will use Riverpod for state management.**

## Options Considered

### Option A: Riverpod
**Pros:**
- Compile-time safety (catches errors early)
- No context required for provider access
- Built-in support for async operations
- Excellent testing support
- Provider auto-disposal
- Works well with code generation
- Clear dependency injection pattern

**Cons:**
- Learning curve for team
- Requires understanding of provider types
- Code generation setup (optional but recommended)

### Option B: BLoC (Business Logic Component)
**Pros:**
- Very structured approach
- Clear separation of concerns
- Event-driven pattern
- Good documentation
- Widely used in enterprise

**Cons:**
- Verbose boilerplate
- Steeper learning curve
- Can be overkill for simple screens
- Many files per feature

### Option C: Provider (basic)
**Pros:**
- Simple API
- Official Flutter favorite
- Easy to learn

**Cons:**
- Requires BuildContext
- No compile-time safety
- Manual disposal needed
- Less structured than alternatives

### Option D: GetX
**Pros:**
- Very simple API
- All-in-one solution
- Minimal boilerplate

**Cons:**
- Too magical/implicit
- Poor separation of concerns
- Testing can be difficult
- Not recommended by Flutter team

## Rationale

Riverpod is chosen because:

1. **Scale**: With 38+ screens and complex state relationships (areas affecting ritmos, personas affecting sugerencias), Riverpod's dependency system handles cascading updates elegantly.

2. **Async First**: Many operations are async (database queries, AI calls). Riverpod's `AsyncValue` and `FutureProvider` make this natural.

3. **Testing**: Critical for a quality app. Riverpod's `ProviderContainer` makes testing isolated and predictable.

4. **No Context Required**: In Life Copilot, services need to access state without widget context (notifications, background suggestions). Riverpod enables this.

5. **Type Safety**: Provider types are checked at compile time, reducing runtime errors.

6. **Balance**: More structure than Provider, less boilerplate than BLoC.

## Consequences

### Positive
- Compile-time errors for provider issues
- Easy to test with `ProviderContainer`
- Clean async handling with `AsyncValue`
- Auto-disposal prevents memory leaks
- Can use code generation for less boilerplate

### Negative
- Team needs Riverpod training
- Different mental model than StatefulWidget
- Code generation adds build step (if used)

### Risks
- Overusing providers for simple state
- Complex provider dependencies

### Mitigations
- Use local state (useState) for widget-specific state
- Document provider dependencies
- Code review for proper provider usage

## Implementation Notes

### Project Structure

```
lib/
├── core/
│   ├── providers/           # App-wide providers
│   │   ├── auth_provider.dart
│   │   ├── theme_provider.dart
│   │   └── ai_provider.dart
│   └── services/
│       ├── database_service.dart
│       └── api_service.dart
│
├── features/
│   ├── dashboard/
│   │   ├── providers/       # Feature-specific providers
│   │   │   ├── today_provider.dart
│   │   │   └── checkin_provider.dart
│   │   ├── widgets/
│   │   └── screens/
│   │
│   ├── entries/
│   │   ├── providers/
│   │   │   ├── entries_provider.dart
│   │   │   └── entry_detail_provider.dart
│   │   ├── widgets/
│   │   └── screens/
│   │
│   └── ... (other features)
```

### Provider Types Guide

```dart
// 1. Simple state
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// 2. Computed/derived values
final filteredEntriesProvider = Provider<List<Entry>>((ref) {
  final entries = ref.watch(entriesProvider);
  final filter = ref.watch(filterProvider);
  return entries.where((e) => e.matchesFilter(filter)).toList();
});

// 3. Async data (database, API)
final areasProvider = FutureProvider<List<Area>>((ref) async {
  final db = ref.watch(databaseProvider);
  return db.getAreas();
});

// 4. Real-time streams
final entriesStreamProvider = StreamProvider<List<Entry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.watchEntries();
});

// 5. Complex state with methods (Notifier)
final checkInProvider = NotifierProvider<CheckInNotifier, CheckInState>(
  CheckInNotifier.new,
);

class CheckInNotifier extends Notifier<CheckInState> {
  @override
  CheckInState build() => CheckInState.initial();
  
  void setMood(int value) {
    state = state.copyWith(mood: value);
  }
  
  void setEnergy(int value) {
    state = state.copyWith(energy: value);
  }
  
  Future<void> save() async {
    final db = ref.read(databaseProvider);
    await db.saveCheckIn(state);
  }
}

// 6. Async operations with state (AsyncNotifier)
final copilotProvider = AsyncNotifierProvider<CopilotNotifier, CopilotState>(
  CopilotNotifier.new,
);

class CopilotNotifier extends AsyncNotifier<CopilotState> {
  @override
  Future<CopilotState> build() async {
    return CopilotState(messages: []);
  }
  
  Future<void> sendMessage(String content) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final api = ref.read(aiServiceProvider);
      final response = await api.chat(content);
      return state.value!.addMessage(response);
    });
  }
}
```

### Handling Async State in UI

```dart
class EntriesScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final entriesAsync = ref.watch(entriesProvider);
    
    return entriesAsync.when(
      loading: () => const LoadingIndicator(),
      error: (error, stack) => ErrorWidget(error: error),
      data: (entries) => EntriesList(entries: entries),
    );
  }
}
```

### Provider Family for Parameterized Data

```dart
// Get entry by ID
final entryProvider = FutureProvider.family<Entry?, String>((ref, id) async {
  final db = ref.watch(databaseProvider);
  return db.getEntry(id);
});

// In widget
final entry = ref.watch(entryProvider('entry-123'));
```

### Auto-dispose for Memory Management

```dart
// Auto-dispose when no longer listened to
final searchResultsProvider = FutureProvider.autoDispose.family<List<Entry>, String>(
  (ref, query) async {
    // Keep alive for 30 seconds after last listener
    ref.keepAlive();
    
    final db = ref.watch(databaseProvider);
    return db.searchEntries(query);
  },
);
```

### Testing Example

```dart
void main() {
  test('filtered entries returns only matching items', () async {
    // Create a container with mock data
    final container = ProviderContainer(
      overrides: [
        entriesProvider.overrideWith((ref) => mockEntries),
        filterProvider.overrideWith((ref) => Filter(area: 'salud')),
      ],
    );
    
    // Read the computed provider
    final filtered = container.read(filteredEntriesProvider);
    
    // Assert
    expect(filtered.every((e) => e.areas.contains('salud')), isTrue);
  });
}
```

### Key Packages
- `flutter_riverpod: ^2.x` - Core state management
- `riverpod_annotation: ^2.x` - Code generation annotations (optional)
- `riverpod_generator: ^2.x` - Code generator (optional)

## References

- [Riverpod Documentation](https://riverpod.dev/)
- [Riverpod vs BLoC vs Provider](https://codewithandrea.com/articles/flutter-state-management-riverpod/)
- Flutter Official State Management Guide
- PRODUCT_SPEC.md Section 5 (Screen Catalog)
