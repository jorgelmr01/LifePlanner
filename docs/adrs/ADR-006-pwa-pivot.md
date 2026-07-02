# ADR-006: Pivote a PWA (Progressive Web App)

**Status:** Accepted
**Date:** July 2026
**Decision Makers:** Product Owner
**Supersedes:** ADR-001 (Flutter), ADR-002 (SQLite/Drift), ADR-004 (PIN/Biometrics nativos), ADR-005 (Riverpod)

---

## Context

El proyecto se inició como app nativa multiplataforma con Flutter, pero quedó pausado en la FASE 4 con solo el design system implementado. Al retomarlo en julio 2026 se redefinió el alcance:

1. **Distribución sin fricción**: debe funcionar en iOS y Android sin pasar por App Store / Play Store, sin cuenta de desarrollador de Apple y sin builds nativos.
2. **Un solo stack web**: menor costo de mantenimiento para un proyecto personal.
3. **Local-first se mantiene**: los datos siguen viviendo en el dispositivo.
4. **Nueva capa RPG**: la visión evolucionó a "tu vida como personaje de RPG" (ver PRODUCT_SPEC.md §14), lo que no cambia el stack pero sí prioriza iterar rápido sobre UI.

## Decision

**Life Copilot se construye como PWA instalable con React + TypeScript + Vite, datos en IndexedDB (Dexie) y service worker para uso offline.**

| Capa | Antes (ADRs 001-005) | Ahora |
|------|----------------------|-------|
| Framework | Flutter / Dart | React 19 + TypeScript + Vite |
| Persistencia | SQLite + Drift + SQLCipher | IndexedDB vía Dexie 4 |
| Estado | Riverpod | React hooks + `dexie-react-hooks` (`useLiveQuery`) |
| Instalación | Stores | PWA: "Agregar a pantalla de inicio" (iOS Safari) / "Instalar app" (Android Chrome) |
| Offline | Nativo | Service worker (Workbox vía `vite-plugin-pwa`) |
| Seguridad | PIN + biometría + SQLCipher | Sandbox del navegador por origen; respaldo manual JSON. PIN/WebAuthn diferido a V1 |
| AI (ADR-003) | OpenAI (GPT-4 + Whisper) | Diferido a V1; el sistema de sugerencias del MVP es 100% por reglas locales |

## Options Considered

### Option A: Retomar Flutter
- ✅ Design system ya portado a Dart
- ❌ Requiere stores o distribución manual de APK/TestFlight
- ❌ Dos toolchains (Dart + web para landing), fricción alta para un proyecto personal

### Option B: PWA con React + Vite + Dexie (elegida)
- ✅ Un link instala la app en iOS y Android
- ✅ IndexedDB + service worker dan local-first y offline reales
- ✅ Iteración inmediata (HMR, deploy estático en cualquier hosting)
- ⚠️ Sin notificaciones push confiables en iOS (mejoró desde iOS 16.4, pero requiere instalación); las sugerencias viven dentro de la app en el MVP
- ⚠️ Safari puede purgar storage de sitios sin uso (~7 días sin visita en modo no instalado); mitigado con instalación + `navigator.storage.persist()` + exportación JSON

### Option C: React Native / Expo
- ✅ Nativo real
- ❌ Misma fricción de distribución que Flutter

## Consequences

- El proyecto Flutter (`life_copilot/`) se retira del árbol; queda en el historial de git (tag `V0.0.0`).
- El design system documentado en `design/` se conserva: los tokens se implementaron como CSS custom properties en `app/src/styles.css`.
- Los ADRs 001, 002, 004 y 005 quedan **Superseded**; ADR-003 (AI) queda **Deferred** a V1.
- Riesgo de pérdida de datos por purga del navegador → mitigación: exportación/importación JSON en Ajustes (ya implementada) y sync opcional en V2.
