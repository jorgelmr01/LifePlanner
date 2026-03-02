# ADR-002: Data Persistence Strategy

**Status:** Accepted  
**Date:** January 2026  
**Decision Makers:** Development Team

---

## Context

Life Copilot is a local-first application that stores sensitive personal data including:
- Journal entries (text, audio references, photos)
- Personal relationships and interaction history
- Spiritual/religious content (configurable area)
- Health-related tracking
- Mood and energy levels

The data model (PRODUCT_SPEC.md Section 3) includes 5 main objects with N:N relationships:
- Entries (Entradas)
- Rhythms (Ritmos)
- Goals (Metas)
- People (Personas)
- Areas (Áreas)

We need a persistence solution that provides:
- Strong relational support (N:N relationships)
- Encryption at rest
- Full-text search capabilities
- Efficient queries for timeline and filtering
- Export/import functionality
- Offline-first operation

## Decision

**We will use SQLite with Drift (formerly Moor) as the ORM and SQLCipher for encryption.**

## Options Considered

### Option A: SQLite + Drift + SQLCipher
**Pros:**
- Mature, battle-tested technology
- Excellent relational support
- SQLCipher provides military-grade encryption (AES-256)
- Drift provides type-safe queries and migrations
- Full-text search via FTS5 extension
- Small footprint
- Wide Flutter community support

**Cons:**
- Manual migration management
- Learning curve for Drift API
- SQLCipher adds ~3MB to app size

### Option B: Isar Database
**Pros:**
- Built specifically for Flutter
- Very fast performance
- Easy to use API
- Built-in full-text search

**Cons:**
- Less mature than SQLite
- No built-in encryption (requires external solution)
- Limited complex query support
- Smaller community

### Option C: Hive/ObjectBox
**Pros:**
- Very simple API
- Good for key-value storage
- Fast performance

**Cons:**
- Not ideal for complex relational data
- Limited query capabilities
- No built-in encryption

### Option D: Firebase/Supabase
**Pros:**
- Real-time sync built-in
- No backend setup needed

**Cons:**
- Requires internet connection
- Contradicts local-first principle
- Less privacy control
- Ongoing costs

## Rationale

SQLite with Drift and SQLCipher is chosen because:

1. **Privacy Requirements**: DESIGN_DECISIONS.md emphasizes local-first architecture. SQLCipher provides encryption at rest without sending data to servers.

2. **Complex Relationships**: The N:N relationships between all 5 main objects (PRODUCT_SPEC.md Section 3.4) are best handled by a relational database.

3. **Search Requirements**: Timeline filtering (C1 screen), search (L2 screen), and insights (I1 screen) require efficient querying that SQLite provides.

4. **Export Capability**: SQLite data can be easily exported to JSON/CSV as required by MVP features.

5. **Type Safety**: Drift generates type-safe Dart code, reducing runtime errors and improving developer experience.

6. **Maturity**: SQLite is the most deployed database in the world. This reduces risk.

## Consequences

### Positive
- Full control over data with no cloud dependencies
- Strong encryption protects sensitive content
- Complex queries possible for insights and search
- Type-safe database operations
- Easy data export/import

### Negative
- Need to manage database migrations
- SQLCipher slightly increases app size
- Need to handle key management for encryption

### Risks
- User loses data if key is lost (for ultra-private content)
- Large datasets may need query optimization

### Mitigations
- Implement secure key storage using flutter_secure_storage
- Use database indexes for frequently queried columns
- Regular backup reminders to users
- Comprehensive migration testing

## Implementation Notes

### Database Schema (Core Tables)

```sql
-- Areas
CREATE TABLE areas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  icono TEXT,
  visible INTEGER NOT NULL DEFAULT 1,
  orden INTEGER,
  color TEXT,
  prompts_journal TEXT, -- JSON array
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Entries
CREATE TABLE entradas (
  id TEXT PRIMARY KEY,
  fecha INTEGER NOT NULL,
  contenido TEXT,
  audio_path TEXT,
  mood INTEGER CHECK(mood BETWEEN 1 AND 5),
  energia INTEGER CHECK(energia BETWEEN 1 AND 5),
  foco INTEGER CHECK(foco BETWEEN 1 AND 5),
  privacidad TEXT NOT NULL DEFAULT 'normal',
  ubicacion_lat REAL,
  ubicacion_lng REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Rhythms
CREATE TABLE ritmos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  proposito TEXT,
  frecuencia TEXT NOT NULL,
  dias_semana TEXT, -- JSON array
  horario TEXT,
  duracion_objetivo INTEGER,
  estado TEXT NOT NULL DEFAULT 'activo',
  recordatorio INTEGER NOT NULL DEFAULT 0,
  dificultad INTEGER CHECK(dificultad BETWEEN 1 AND 3),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Goals
CREATE TABLE metas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  porque TEXT,
  fecha_limite INTEGER,
  metrica TEXT,
  progreso INTEGER DEFAULT 0,
  proximo_paso TEXT,
  estado TEXT NOT NULL DEFAULT 'activa',
  nota_abandono TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- People
CREATE TABLE personas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  circulo TEXT,
  como_conocieron TEXT,
  lo_que_importa TEXT,
  preguntar_proxima TEXT,
  frecuencia_deseada INTEGER,
  ultima_interaccion INTEGER,
  cumpleanos INTEGER,
  estado TEXT NOT NULL DEFAULT 'activa',
  es_sensible INTEGER NOT NULL DEFAULT 0,
  silenciar_sugerencias INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Junction Tables (N:N relationships)
CREATE TABLE entrada_areas (
  entrada_id TEXT REFERENCES entradas(id) ON DELETE CASCADE,
  area_id TEXT REFERENCES areas(id) ON DELETE CASCADE,
  PRIMARY KEY (entrada_id, area_id)
);

-- Similar for: entrada_personas, entrada_ritmos, entrada_metas,
-- ritmo_areas, ritmo_metas, meta_areas, meta_personas, persona_areas

-- Tags
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL DEFAULT 'usuario',
  color TEXT
);

-- Full-text search
CREATE VIRTUAL TABLE entradas_fts USING fts5(
  contenido,
  content='entradas',
  content_rowid='rowid'
);
```

### Encryption Setup

```dart
// Initialize SQLCipher with secure key
final db = await openDatabase(
  'life_copilot.db',
  password: await _getOrCreateEncryptionKey(),
  // ...
);

Future<String> _getOrCreateEncryptionKey() async {
  final storage = FlutterSecureStorage();
  var key = await storage.read(key: 'db_key');
  if (key == null) {
    key = _generateSecureKey();
    await storage.write(key: 'db_key', value: key);
  }
  return key;
}
```

### Key Packages
- `drift: ^2.x` - Type-safe ORM
- `sqlite3_flutter_libs: ^0.5.x` - SQLite native libraries
- `sqlcipher_flutter_libs: ^0.5.x` - SQLCipher encryption
- `flutter_secure_storage: ^9.x` - Secure key storage

## References

- [Drift Documentation](https://drift.simonbinder.eu/)
- [SQLCipher](https://www.zetetic.net/sqlcipher/)
- PRODUCT_SPEC.md Section 3 (Data Model)
- DESIGN_DECISIONS.md Section "Datos y respaldos"
