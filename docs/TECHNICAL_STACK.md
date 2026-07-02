# Life Copilot - Stack Técnico

> FASE 3 (revisada): stack para la PWA. Sustituye al stack Flutter original (ver [ADR-006](adrs/ADR-006-pwa-pivot.md)).
> Última actualización: Julio 2026

---

## Resumen Ejecutivo

| Categoría | Tecnología | Justificación |
|-----------|------------|---------------|
| **Plataforma** | PWA instalable (iOS Safari / Android Chrome) | Un solo link, sin stores, offline-first |
| **Framework** | React 19 + TypeScript + Vite 8 | Iteración rápida, tipado estricto, build estático |
| **Base de datos** | IndexedDB vía Dexie 4 | Local-first en el navegador, consultas indexadas |
| **Estado / reactividad** | React hooks + `dexie-react-hooks` | `useLiveQuery` re-renderiza al cambiar la BD; sin store global |
| **Offline / instalación** | `vite-plugin-pwa` (Workbox) + Web App Manifest | Precache de assets, `autoUpdate` del service worker |
| **AI** | Diferido a V1 (ADR-003) | El MVP usa el motor de sugerencias por reglas |

---

## 1. Plataforma: PWA

- **Instalación**: iOS → Safari → Compartir → "Agregar a pantalla de inicio"; Android → Chrome → "Instalar app".
- **Standalone**: `display: standalone`, `viewport-fit=cover` y safe-areas para que se sienta nativa.
- **Offline**: el service worker precachea el shell completo; los datos ya son locales.
- **Riesgo conocido**: Safari puede purgar el storage de sitios no instalados tras ~7 días sin uso. Mitigación: instalar la app, `navigator.storage.persist()` y exportación JSON desde Ajustes.

## 2. Base de Datos: IndexedDB + Dexie

Tablas (ver `app/src/db/db.ts`):

| Tabla | Contenido |
|-------|-----------|
| `areas` | Dimensiones de vida (atributos del personaje) |
| `entries` | Journal y check-ins (mañana/noche) |
| `ritmos` / `ritmoLogs` | Hábitos y sus marcas diarias (índice compuesto `[ritmoId+dia]`) |
| `metas` | Objetivos con progreso y próximo paso |
| `personas` / `interacciones` | CRM personal y contactos registrados |
| `sugerencias` | Inbox del motor de reglas (pendiente/hecha/pospuesta/descartada) |
| `xpEvents` | Ledger de XP por área (alimenta niveles y balance) |
| `ajustes` | Preferencias (nombre, tema, capa RPG visible) |

Respaldo: exportación/importación JSON completa desde Ajustes.

## 3. Capa RPG (lógica local)

- `logic/xp.ts`: XP por acción (entrada 10, ritmo 15, interacción 15, meta 25, check-in 5), nivel = `⌊√(xp/50)⌋+1`, estado de atención por área (alta/media/baja según XP de 14 días).
- `logic/suggestions.ts`: motor de reglas — reconexión (contacto vencido), consistencia (ritmo < 50% de lo esperado en 7 días), balance (área rezagada vs. las demás), cumpleaños, metas estancadas (14 días sin avance). Idempotente; corre en cada apertura.
- Filosofía: los niveles nunca bajan, no hay rachas punitivas (DESIGN_DECISIONS.md).

## 4. Design System

Los tokens de `design/DESIGN_SYSTEM.md` están implementados como CSS custom properties en `app/src/styles.css` (colores, tipografía Inter/system-ui, espaciado, radios, modo oscuro).

## 5. Dependencias

```jsonc
// dependencies
"react", "react-dom"          // UI
"dexie", "dexie-react-hooks"  // IndexedDB reactiva

// devDependencies
"vite", "@vitejs/plugin-react", "typescript"
"vite-plugin-pwa"             // manifest + service worker
"sharp"                       // generación de iconos (scripts/gen-icons.mjs)
```

## 6. Build y Deploy

```bash
cd app
npm install
npm run dev      # desarrollo con HMR
npm run build    # tsc + vite build → dist/ (estático)
npm run preview  # servir el build localmente
npm run icons    # regenerar iconos PWA
```

`dist/` es un sitio estático: se puede publicar en GitHub Pages, Netlify, Vercel o cualquier hosting con HTTPS (requisito para service workers e instalación).

## 7. Roadmap Técnico

- **MVP (hecho)**: onboarding, Hoy, registro, áreas, personas, metas, personaje (radar de balance), sugerencias por reglas, PWA offline, export/import JSON.
- **V1 (hecho, iteración 2)**: copiloto AI opcional con API key propia (`@anthropic-ai/sdk` en modo navegador con carga diferida, o OpenAI vía fetch), logros y level-up, milestones, edición/borrado con Deshacer, búsqueda, revisión semanal, dictado por voz, notificaciones locales + Badging API, `navigator.storage.persist()`, historial/botón atrás nativo, tests con Vitest + fake-indexeddb, deploy a GitHub Pages (`.github/workflows/deploy.yml`, `BASE_PATH`).
- **V2**: bloqueo con PIN/WebAuthn, calendario, sync multi-dispositivo cifrado, integraciones (calendario/salud), análisis profundo.

## 8. Referencias

- [ADR-006: Pivote a PWA](adrs/ADR-006-pwa-pivot.md)
- [PRODUCT_SPEC.md §14: Capa RPG](../PRODUCT_SPEC.md)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) · [Dexie](https://dexie.org/)
