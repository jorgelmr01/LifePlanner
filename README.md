# Life Copilot

> Tu vida como personaje de RPG: registra, da seguimiento y recibe sugerencias para re-balancearte.
> PWA instalable en iOS y Android — sin stores, sin cuentas, local-first.

---

## La idea

Tú defines el objetivo; la app te ayuda a alcanzarlo detectando dónde te estás quedando atrás:

> *"No has platicado con Carlos en 45 días. Mándale un mensaje para ponerse al día."*
> *"¿Por qué no vas a hora santa esta semana?"*
> *"Tu área 🙏 Fe se está quedando atrás. Una entrada o un ritmo pequeño la reactivan."*

Cada dimensión de tu vida (Salud, Trabajo, Fe, Relaciones…) es un **atributo de tu personaje** que sube de nivel con tu actividad real. Un radar de balance muestra de un vistazo qué estás descuidando.

### Los 5 bloques

```
┌─────────────────────────────────────────────────────────────────┐
│                 ÁREAS (atributos del personaje)                  │
│  Salud 💪 Nv4 · Trabajo 💼 Nv6 · Fe 🙏 Nv2 · Relaciones 👥 Nv3  │
├─────────────────────────────────────────────────────────────────┤
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │ ENTRADAS │◄──►│  RITMOS  │◄──►│  METAS   │◄──►│ PERSONAS │ │
│   │ (Journal)│    │(Misiones │    │(Objetivos│    │ (Gremio) │ │
│   │          │    │recurrent)│    │  que TÚ  │    │          │ │
│   │          │    │          │    │ defines) │    │          │ │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│          Todo da XP a tus áreas · Todo se relaciona N:N         │
└─────────────────────────────────────────────────────────────────┘
```

### Cómo funciona la capa RPG

- **XP**: marcar un ritmo +15, escribir una entrada +10, registrar un contacto +15, avanzar una meta +25, check-in +5.
- **Niveles por área**: suben con XP acumulado y **nunca bajan** — sin culpa, sin rachas punitivas.
- **Balance**: el radar de 14 días y el motor de sugerencias detectan el área más descuidada y te proponen la acción mínima para reactivarla.

### Motor de sugerencias (sin AI, 100% local)

| Regla | Dispara cuando… |
|-------|-----------------|
| 👤 Reconexión | Pasaron más días del contacto deseado con una persona |
| 🔁 Consistencia | Un ritmo va a menos del 50% de lo esperado esta semana |
| ⚖️ Balance | Un área casi no tiene actividad mientras otras van bien |
| 🎂 Cumpleaños | El cumpleaños de alguien es en ≤3 días |
| 🎯 Meta estancada | Una meta activa lleva 14 días sin avance |

Cada sugerencia se puede hacer, posponer o descartar; el copiloto propone, tú decides.

---

## La app (`app/`)

PWA con **React 19 + TypeScript + Vite + IndexedDB (Dexie)**. Ver [docs/TECHNICAL_STACK.md](docs/TECHNICAL_STACK.md).

```bash
cd app
npm install
npm run dev        # desarrollo → http://localhost:5173
npm run build      # producción → dist/ (sitio estático)
npm run preview    # probar el build con service worker
```

**Instalar en el celular** (tras publicar `dist/` en cualquier hosting HTTPS):

- **iPhone**: Safari → Compartir → *Agregar a pantalla de inicio*
- **Android**: Chrome → menú ⋮ → *Instalar app*

Funciona offline; los datos viven solo en tu dispositivo (respaldo JSON desde Ajustes).

### Pantallas

| Tab | Qué hay |
|-----|---------|
| ☀️ **Hoy** | Saludo, nivel, check-in de mañana/noche, misiones del día, ritmos semanales, gente que necesita atención, inbox de sugerencias |
| 📖 **Registro** | Timeline unificado (entradas, ritmos, contactos) con filtro por área + nueva entrada con prompts |
| 🗺️ **Áreas** | Atributos con nivel, barra de XP e indicador de atención (alta/media/baja) |
| 👥 **Personas** | CRM personal: círculos, frecuencia de contacto deseada, historial, cumpleaños |
| 🧭 **Personaje** | Radar de balance de vida, nivel global, días activos, atributos, acceso a Metas 🎯 |

Botón **+** flotante: captura rápida (entrada, marcar ritmo, interacción, meta, ritmo nuevo).

---

## Documentación

### Producto
| Documento | Descripción |
|-----------|-------------|
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Especificación completa (modelo de datos, 38 pantallas, features, roadmap) + §14 capa RPG |
| [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) | Decisiones de diseño, incl. gamificación sin culpa (2026) |
| [SCREEN_FLOWS.md](SCREEN_FLOWS.md) | Flujos de navegación y casos de uso |

### Diseño UI/UX
| Documento | Descripción |
|-----------|-------------|
| [design/DESIGN_SYSTEM.md](design/DESIGN_SYSTEM.md) | Tokens, colores, tipografía (implementados en `app/src/styles.css`) |
| [design/COMPONENT_LIBRARY.md](design/COMPONENT_LIBRARY.md) | 28 componentes |
| [design/SCREEN_SPECS.md](design/SCREEN_SPECS.md) | Especificaciones de 38 pantallas |
| [design/PROTOTYPE_FLOWS.md](design/PROTOTYPE_FLOWS.md) | Animaciones y transiciones |
| [design/ASSETS_SPEC.md](design/ASSETS_SPEC.md) | Iconos e ilustraciones |

### Técnica
| Documento | Descripción |
|-----------|-------------|
| [docs/TECHNICAL_STACK.md](docs/TECHNICAL_STACK.md) | Stack PWA actual |
| [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md) | Guía de desarrollo |
| [docs/adrs/ADR-006-pwa-pivot.md](docs/adrs/ADR-006-pwa-pivot.md) | **Pivote a PWA** (supersede ADR-001/002/004/005) |
| [docs/adrs/](docs/adrs/) | ADRs históricos (Flutter, marcados como superseded) |

---

## Principios clave

1. **Tú defines el objetivo**: la app no impone metas; te ayuda con las tuyas
2. **Gamificación sin culpa**: los niveles suben, nunca bajan; sin rachas punitivas ni rojo alarmista
3. **El copiloto propone, tú decides**: toda sugerencia se puede hacer, posponer o descartar
4. **Privacidad por defecto**: local-first, sin cuentas, sin nube, exportación JSON
5. **Fricción mínima**: captura rápida en <10 segundos; lo profundo siempre es opcional
6. **AI opcional (V1)**: sin AI la app funciona completa

---

## Estado del proyecto

- [x] **FASE 1** — Validación y research (PRODUCT_SPEC, DESIGN_DECISIONS, SCREEN_FLOWS)
- [x] **FASE 2** — Diseño UI/UX (design system, 28 componentes, 38 pantallas)
- [x] **FASE 3** — Setup técnico *(revisado: pivote de Flutter a PWA, [ADR-006](docs/adrs/ADR-006-pwa-pivot.md))*
- [x] **FASE 4** — MVP funcional ← **julio 2026**
  - [x] Onboarding (personaje, áreas, ritmos, gremio)
  - [x] Hoy: check-in, misiones diarias/semanales, sugerencias
  - [x] Registro (timeline + entradas con áreas/personas/privacidad)
  - [x] Áreas, Personas, Metas, Personaje (radar de balance)
  - [x] Capa RPG: XP, niveles, balance
  - [x] Motor de sugerencias por reglas (5 reglas)
  - [x] PWA: manifest, service worker, offline, iconos
  - [x] Export/import JSON, modo oscuro
- [x] **V1 (iteración 2)** — julio 2026
  - [x] 🤖 Copiloto AI opcional con API key propia (Anthropic/OpenAI, chat con streaming y contexto de tus datos, carga diferida)
  - [x] 🏅 Logros (16 insignias que solo suman) y celebración de level-up
  - [x] 🪜 Milestones en metas (checklist con XP, avanzan el progreso)
  - [x] ✏️ Editar/borrar entradas, editar/pausar/archivar ritmos, editar/ocultar áreas — con Deshacer
  - [x] 🔍 Búsqueda en el timeline · 📋 Revisión semanal (semana vs anterior + reflexión)
  - [x] 🎤 Dictado por voz (Web Speech API donde exista)
  - [x] 🔔 Notificaciones locales + badge del icono · 💾 recordatorio de respaldo · `storage.persist()`
  - [x] ⬅️ Botón/gesto atrás nativo para vistas y hojas · check-ins mañana y noche · primer día guiado
  - [x] ✅ 24 tests unitarios (Vitest) de XP, sugerencias, logros y fechas
  - [x] 🚀 Workflow de deploy a GitHub Pages (al hacer merge a `main`)
- [x] **Iteración 3 — Retención** (que quieras volver todos los días)
  - [x] 🎁 Misiones bonus diarias: 2 retos que rotan cada día, salen de tus datos y **se completan solos** con tu actividad (+20 XP c/u)
  - [x] 🔥 Racha flexible sin culpa con 🛡️ escudos acumulables (1 cada 7 días, máx. 6): un retiro de una semana no te borra el progreso
  - [x] 📆 Días activos totales: el contador de por vida nunca se pierde aunque la racha se rompa
  - [x] 💥 Golpes críticos: ~10% de probabilidad de x2 XP en cualquier acción
  - [x] 👑 Títulos de nivel (Novato → Aprendiz → … → Leyenda → Mito) con "próximo título" visible
  - [x] ✨ Pregunta del día: 24 prompts de journal que rotan (adiós al "¿qué pasó hoy?" eterno)
  - [x] 📸 Recuerdos: la app te muestra qué escribiste hace un mes
  - [x] ✓ Marcar todo: el checklist diario en un tap
  - [x] 🏅 6 logros nuevos de largo horizonte (22 total): rachas 7/30/100, misiones 10/50, nivel 20
- [x] **Iteración 4 — Hub de relaciones** (tu memoria externa para no olvidar a nadie)
  - [x] 👤 Ficha completa por persona: nivel de confianza (❤️ 1-5), contextos (Universidad, Familia, Iglesia… + personalizados), cómo se conocieron, lo que le importa, notas libres
  - [x] 🗂️ Ficha rápida clave-valor: "Esposa: Ana", "Equipo: Rayados", "Alergia: nueces" — lo que hoy cargas en la cabeza
  - [x] 💬 "Para la próxima vez": pendientes por persona que reaparecen al registrar una interacción
  - [x] 🔍 Búsqueda de personas por nombre, contexto, notas y datos · 🎂 badge de cumpleaños ≤30 días en la lista
  - [x] 👋 "Conocí a alguien" en la captura rápida: registra a alguien nuevo antes de que se te olvide
  - [x] 🏅 3 logros de constancia total (25): 30/150/365 días activos de por vida
- [ ] **V2** — PIN/WebAuthn, calendario, sync multi-dispositivo cifrado, integraciones, automatizaciones

> El prototipo Flutter original (`life_copilot/`) fue retirado en el pivote; vive en el historial de git (tag `V0.0.0`).

---

*Última actualización: Julio 2026*
