# Life Copilot - Guía de Desarrollo

> Configuración del entorno para la PWA. Actualizado en el pivote a web (julio 2026, [ADR-006](adrs/ADR-006-pwa-pivot.md)).

---

## Requisitos

- **Node.js 20+** (probado con 22)
- **npm 10+**
- Un navegador moderno (Chrome/Edge/Safari/Firefox)

No se necesita Android Studio, Xcode ni cuenta de desarrollador: la app es una PWA.

## Configuración rápida

```bash
git clone https://github.com/jorgelmr01/LifePlanner.git
cd LifePlanner/app
npm install
npm run dev
```

Abre `http://localhost:5173`. Para simular móvil usa las DevTools (modo responsive, ej. iPhone 14).

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Type-check (`tsc -b`) + build de producción en `dist/` |
| `npm run preview` | Sirve `dist/` en `http://localhost:4173` (necesario para probar el service worker) |
| `npm run icons` | Regenera los iconos PWA desde el SVG en `scripts/gen-icons.mjs` |

## Probar como app instalada

1. `npm run build && npm run preview`
2. **Android/desktop Chrome**: menú ⋮ → "Instalar app".
3. **iPhone**: sirve el build por HTTPS (ej. un deploy de prueba en Netlify/Vercel) y en Safari usa Compartir → "Agregar a pantalla de inicio". El service worker y la instalación requieren HTTPS (localhost está exento).

## Estructura del código

```
app/
├── index.html                  # Shell + meta tags PWA/iOS
├── vite.config.ts              # Plugin PWA: manifest + Workbox
├── scripts/gen-icons.mjs       # Generación de iconos (sharp)
├── public/icons/               # Iconos generados
└── src/
    ├── main.tsx / App.tsx      # Bootstrap, tabs y navegación (pila de vistas)
    ├── styles.css              # Design tokens (design/DESIGN_SYSTEM.md) + componentes CSS
    ├── db/
    │   ├── types.ts            # Modelo de datos (PRODUCT_SPEC.md §3)
    │   ├── db.ts               # Esquema Dexie + export/import JSON
    │   └── seeds.ts            # Catálogos de áreas y ritmos sugeridos
    ├── logic/
    │   ├── xp.ts               # Capa RPG: XP, niveles, atención por área
    │   ├── suggestions.ts      # Motor de sugerencias por reglas
    │   ├── actions.ts          # Mutaciones compartidas (otorgan XP)
    │   └── dates.ts            # Utilidades de fecha en español
    ├── components/             # Hoja (bottom sheet), Radar, chips, toast…
    └── screens/                # Onboarding, Today, Journal, Areas, People,
                                # Goals, Character, Suggestions, Settings
```

## Convenciones

- **Idioma**: la UI y el código de dominio están en español (nombres del modelo: `Ritmo`, `Meta`, `Persona`…).
- **Datos**: toda mutación que deba otorgar XP pasa por `logic/actions.ts`.
- **Reactividad**: leer con `useLiveQuery` de `dexie-react-hooks`; no hay store global.
- **TypeScript estricto**: `strict: true`; el build falla con variables sin uso.

## Pruebas manuales rápidas

1. Completa el onboarding (personaje + áreas + ritmos + personas).
2. Marca un ritmo en "Hoy" → debe aparecer el toast `+15 XP`.
3. En Ajustes exporta el JSON, borra todo e importa de nuevo.
4. Para ver sugerencias sin esperar días reales, inserta una interacción con fecha vieja vía la consola del navegador (IndexedDB `life-copilot` → tabla `interacciones`) y recarga.
