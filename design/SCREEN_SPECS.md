# Life Copilot - Especificaciones de Pantallas

> Especificaciones detalladas de las 38 pantallas de la aplicación.
> Versión: 1.0
> Última actualización: Enero 2026

---

## Índice de Pantallas

| Grupo | ID | Nombre | MVP | Página |
|-------|-----|--------|-----|--------|
| **Onboarding** | A1-A6 | Bienvenida a AI Opcional | ✓ | [Ir](#a-onboarding) |
| **Hoy** | B1-B3 | Dashboard a Sugerencias | ✓ | [Ir](#b-hoy) |
| **Registro** | C1-C4 | Timeline a Detalle | ✓ | [Ir](#c-registro) |
| **Áreas** | D1-D3 | Lista a Configurar | ✓ | [Ir](#d-áreas) |
| **Ritmos** | E1-E3 | Lista a Sesión | ✓ | [Ir](#e-ritmos) |
| **Metas** | F1-F3 | Lista a Crear | V1 | [Ir](#f-metas) |
| **Personas** | G1-G3 | Lista a Interacción | ✓ | [Ir](#g-personas) |
| **Ideas** | H1-H2 | Inbox a Detalle | V1 | [Ir](#h-ideas) |
| **Insights** | I1-I2 | Dashboard a Revisión | V1 | [Ir](#i-insights) |
| **Copiloto** | J1-J4 | Chat a Preferencias | ✓ | [Ir](#j-copiloto) |
| **Ajustes** | K1-K2 | Generales a Sensible | ✓ | [Ir](#k-ajustes) |
| **Auxiliares** | L1-L3 | Calendario a Bienvenida | V1 | [Ir](#l-auxiliares) |

---

## A. ONBOARDING

### A1 — Bienvenida

**Propósito:** Introducir al usuario y permitir elegir nivel de complejidad inicial.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    (safe area top: 44px)                        │
│                                                                 │
│                 ┌─────────────────────────┐                     │
│                 │                         │                     │
│                 │      [Ilustración       │   240x240px         │
│                 │       animada]          │   Lottie animation  │
│                 │                         │                     │
│                 └─────────────────────────┘                     │
│                                                                 │
│                                             margin-top: 48px    │
│                    Life Copilot             Display Medium      │
│                                             32px, 700           │
│                                                                 │
│                 "Tu copiloto de vida"       Heading 3           │
│                                             20px, gray-500      │
│                                                                 │
│                   Registra, da              Body                │
│                   seguimiento,              16px, gray-600      │
│                   y recibe sugerencias.     center aligned      │
│                                                                 │
│                                             margin-top: 48px    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Quiero algo ligero                           │    │
│  │            → Configuración mínima, empieza rápido       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                             Card, 80px height   │
│                                             padding: 16px       │
│                                             margin: 12px        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Quiero algo completo                         │    │
│  │            → Configura todo a tu medida                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                                             margin-top: 24px    │
│                    Saltar setup →           Button Ghost        │
│                                             gray-500            │
│                                                                 │
│                    (safe area bottom: 34px)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones técnicas:**

| Elemento | Especificación |
|----------|----------------|
| Status Bar | Light content |
| Background | white |
| Illustration | Lottie, 240x240px, autoplay, loop |
| Cards | Tap → expand subtle, navigate to A2 |
| Skip | Navigate directly to B1 with defaults |

**Comportamiento:**
- "Ligero" → Pre-selecciona plantilla "Minimal", salta A4
- "Completo" → Pre-selecciona plantilla "Equilibrado", muestra todo
- "Saltar" → Defaults, flag `onboarding_completed = true`

---

### A2 — Configurar Áreas

**Propósito:** Seleccionar las dimensiones de vida a seguir.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Atrás                              Siguiente →               │
│                                       Button Ghost, primary     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ¿Qué dimensiones de tu vida         Heading 2                 │
│   quieres seguir?                      24px, 600                │
│                                                                 │
│   Puedes cambiar esto cuando          Body Small                │
│   quieras                              14px, gray-500           │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   Plantillas:                          Caption, 12px            │
│   ┌───────┐ ┌───────┐ ┌───────┐       Chip, horizontal scroll  │
│   │Minimal│ │Equili.│ │Fe+Com │       32px height               │
│   └───────┘ └───────┘ └───────┘                                 │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [✓] 💪 Salud                                           │   │
│   │     Ejercicio, sueño, nutrición                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [✓] 💼 Trabajo                                         │   │
│   │     Proyectos, productividad, carrera                  │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [✓] 👥 Relaciones                                      │   │
│   │     Amigos, familia, networking                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 💰 Finanzas                                        │   │
│   │     Ahorro, inversiones, gastos                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 🙏 Fe / Espiritualidad                             │   │
│   │     Oración, meditación, servicio                      │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 📚 Aprendizaje                                     │   │
│   │     Cursos, lectura, habilidades                       │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 🎨 Creatividad                                     │   │
│   │     Arte, música, escritura                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                       List, scrollable          │
│                                       Item height: 72px         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ + Crear área personalizada                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones técnicas:**

| Elemento | Especificación |
|----------|----------------|
| Back Button | Icon + text, gray-600 |
| Next Button | Text only, primary, disabled if 0 selected |
| Template Chips | Horizontal scroll, single select |
| Area Items | Checkbox + emoji + name + description |
| Create Custom | Opens modal for custom area |

**Validación:**
- Mínimo 1 área seleccionada para continuar
- Máximo 10 áreas
- Plantilla seleccionada marca/desmarca automáticamente

---

### A3 — Ritmos Iniciales

**Propósito:** Configurar los primeros hábitos/prácticas.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Atrás                              Siguiente →               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Elige 3-8 hábitos o prácticas        Heading 2               │
│   para empezar                          24px, 600              │
│                                                                 │
│   Menos es más al inicio.               Body Small             │
│   Puedes agregar más después.           gray-500               │
│                                                                 │
│   Sugeridos para ti:                    Caption, 12px          │
│   (basado en tus áreas)                 gray-400               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [✓] 💧 Beber agua                              Diario   │   │
│   │     💪 Salud                                            │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [✓] 🏃 Movimiento                              Diario   │   │
│   │     💪 Salud                                            │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [✓] 🙏 Gratitud                                Diario   │   │
│   │     🧘 Bienestar                                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 📖 Lectura                                 Diario   │   │
│   │     📚 Aprendizaje                                      │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 🧘 Meditación                              Diario   │   │
│   │     🧘 Bienestar                                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [ ] 💪 Ejercicio                            3x semana   │   │
│   │     💪 Salud                                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   + Crear ritmo personalizado                                   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   CONFIGURAR SELECCIONADOS              Section header          │
│                                                                 │
│   💧 Beber agua                         Expandable card         │
│   Frecuencia: [Diario ▼]                Select                  │
│   Recordatorio: [ ] 08:00               Toggle + Time picker    │
│   ¿Por qué? [________________]          Optional input          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Comportamiento:**
- Al seleccionar ritmo, aparece en sección "Configurar"
- Frecuencias: Diario, 3x semana, Semanal, Mensual, Personalizado
- Recordatorio es opcional pero recomendado

---

### A4 — Personas Importantes

**Propósito:** Agregar personas para seguimiento de relaciones.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Atrás                              Siguiente →               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ¿Con quién quieres mantener          Heading 2               │
│   contacto regular?                     24px, 600              │
│                                                                 │
│   Tu círculo cercano (5-20 personas)    Body Small             │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │  ┌───┐  + Agregar persona                               │   │
│   │  │ + │                                                  │   │
│   │  └───┘  Escribe el nombre                               │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📱 Importar de contactos                                │   │
│   │    (opcional, nunca se comparte)                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   Personas agregadas:                   Caption                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ┌───┐                                                   │   │
│   │ │ M │  Mamá                        [Cada 1 sem ▼]  ✕    │   │
│   │ └───┘  Familia                                          │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ ┌───┐                                                   │   │
│   │ │ C │  Carlos                      [Cada 2 sem ▼]  ✕    │   │
│   │ └───┘  Cercano                                          │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ ┌───┐                                                   │   │
│   │ │ A │  Ana                         [Cada mes ▼]    ✕    │   │
│   │ └───┘  Trabajo                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   Puedes agregar más después                                    │
│                                                                 │
│              [Saltar por ahora]          Button Ghost           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Modal "Agregar Persona":**
- Nombre (requerido)
- Círculo: Cercano / Familia / Trabajo / Conocido
- Frecuencia deseada: 1 sem / 2 sem / 1 mes / 3 meses

---

### A5 — Preferencias

**Propósito:** Configurar notificaciones y privacidad.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Atrás                              Siguiente →               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Preferencias                          Heading 2               │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   NOTIFICACIONES                        Section header          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ○ Suaves                                                │   │
│   │   Solo recordatorios de ritmos                          │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ ● Moderadas (recomendado)                               │   │
│   │   Recordatorios + sugerencias importantes               │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ ○ Completas                                             │   │
│   │   Todo: recordatorios, sugerencias, insights            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   PRIVACIDAD                            Section header          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [✓] Bloquear app con PIN/biometría                      │   │
│   │     Recomendado para proteger tus datos                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   RESPALDO                              Section header          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [ ] Sincronizar con iCloud/Google Drive                 │   │
│   │     Próximamente disponible                             │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ [✓] Respaldo local automático                           │   │
│   │     Se guarda una copia cada semana                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### A6 — AI Opcional

**Propósito:** Configurar el Copiloto AI.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Atrás                              Empezar →                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Copiloto AI (opcional)                Heading 2               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   Un asistente que te ayuda a registrar                 │   │
│   │   y organizar tu vida conversando.                      │   │
│   │                                                         │   │
│   │   • Dicta tus actualizaciones por voz                   │   │
│   │   • Obtén sugerencias personalizadas                    │   │
│   │   • Convierte conversaciones en datos                   │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [ ] Activar Copiloto                          Toggle    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   (Si se activa:)                                               │
│                                                                 │
│   API Key de OpenAI                     Label                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ sk-xxxxxxxxxxxxxxxxxxxxx                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ¿Cómo obtener una? →                  Link, gray-500          │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   El copiloto puede:                    Checkboxes              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ [✓] Leer tus datos para contexto                        │   │
│   │ [✓] Sugerir acciones                                    │   │
│   │ [✓] Proponer cambios a revisar                          │   │
│   │ [ ] Ejecutar cambios con confirmación                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ────────────────────────────────────                          │
│                                                                 │
│   Sin copiloto la app funciona          Body Small              │
│   exactamente igual.                    gray-500                │
│                                                                 │
│              [Configurar después]        Button Ghost           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## B. HOY

### B1 — Dashboard

**Propósito:** Centro operativo diario con resumen y acciones rápidas.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Hoy                                         🔍    📅    ⚙️    │
│                                              Icon buttons 44px  │
├─────────────────────────────────────────────────────────────────┤
│                                              Scrollable content │
│                                                                 │
│  Buenos días, Juan                          Heading 2, 24px     │
│  Miércoles, 29 de enero                     Body, gray-500      │
│                                                                 │
│  ┌─ Check-in rápido ──────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  😊 Ánimo     [○ ○ ● ○ ○]                                  │ │
│  │  ⚡ Energía    [○ ● ○ ○ ○]                                  │ │
│  │  🎯 Enfoque   [○ ○ ○ ● ○]                                  │ │
│  │                                                            │ │
│  │                          [Check-in completo →]             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                              Card, padding 16px │
│                                              margin-bottom: 16px│
│                                                                 │
│  ┌─ Ritmos de hoy ────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  [✓] Beber agua                                            │ │
│  │  [✓] Meditación                                   15 min   │ │
│  │  [ ] Lectura                                      30 min   │ │
│  │  [ ] Gratitud                                              │ │
│  │  [ ] Ejercicio                                    45 min   │ │
│  │                                                            │ │
│  │  ██████████░░░░░░░░░░  2/5                Ver todos →      │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Siguiente acción ─────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  🎹 Practicar piano                               20 min   │ │
│  │     Meta: Aprender piano                                   │ │
│  │                                                            │ │
│  │                              [Hecho]  [Después]            │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Personas ─────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ⚠️ 45 días sin hablar con Carlos                          │ │
│  │                                                            │ │
│  │                            [Registrar contacto]            │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Sugerencias (3) ──────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  → Ver todas                                               │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                          ┌─────┐                                │
│                          │  +  │                    FAB         │
│                          └─────┘                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ☀️        📖        ⬜        👥        ✨                    │
│   Hoy     Registro   Áreas   Personas  Copiloto                │
└─────────────────────────────────────────────────────────────────┘
```

**Especificaciones técnicas:**

| Elemento | Especificación |
|----------|----------------|
| Header Height | 56px |
| Content Padding | 16px horizontal |
| Card Spacing | 16px vertical |
| FAB Position | Center, 16px above tab bar |
| Tab Bar Height | 83px (con safe area) |

---

### B2 — Check-in (Mañana/Noche)

**Propósito:** Reflexión estructurada matutina o nocturna.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✕ Cerrar                              Check-in mañana         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                              Scrollable         │
│                                                                 │
│  ☀️ Buenos días                             Heading 2 + emoji   │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Cómo te sientes?                          Label              │
│                                                                 │
│  [😫]  [😕]  [😐]  [🙂]  [😊]               Emoji buttons       │
│                                              48px each          │
│                                              spacing: 16px      │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Cómo está tu energía?                     Label              │
│                                                                 │
│  [●─────────────────○]                      Slider              │
│   Baja          Alta                        with labels         │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Intención para hoy:                        Label              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ¿Qué quieres lograr o sentir hoy?                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Textarea           │
│                                              min-height: 80px   │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  3 prioridades:                             Label              │
│  1. ┌──────────────────────────────────────────────────────┐    │
│     └──────────────────────────────────────────────────────┘    │
│  2. ┌──────────────────────────────────────────────────────┐    │
│     └──────────────────────────────────────────────────────┘    │
│  3. ┌──────────────────────────────────────────────────────┐    │
│     └──────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Qué haría que hoy sea un buen día?        Label              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  [🎤 Hacer check-in por voz]                Button Secondary    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Guardar                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Button Primary     │
│                                              fixed bottom       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Variante Check-in Noche:**
- Emoji: 🌙
- Título: "Buenas noches"
- Campos diferentes:
  - ¿Qué salió bien hoy?
  - 3 cosas por las que estás agradecido
  - ¿Qué aprendí hoy?
  - Una mejora para mañana

---

### B3 — Sugerencias (Inbox)

**Propósito:** Ver y actuar sobre sugerencias pendientes.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Hoy                                      Sugerencias         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  3 sugerencias pendientes                   Body, gray-500      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  👤 Reconexión                           Type badge     │    │
│  │                                                         │    │
│  │  Llevas 45 días sin hablar con Carlos.   Body          │    │
│  │                                                         │    │
│  │  Por qué: Definiste contactarlo cada     Body Small    │    │
│  │  2 semanas.                              gray-500      │    │
│  │                                                         │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │           Registrar contacto                    │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  │                                          Button Sec.   │    │
│  │                                                         │    │
│  │  [Posponer 1 sem]         [Descartar]    Ghost btns   │    │
│  │                                                         │    │
│  │  ☐ No sugerir más para Carlos            Checkbox     │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              margin: 16px       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🎹 Consistencia                                        │    │
│  │                                                         │    │
│  │  Tu práctica de piano bajó: solo 2                      │    │
│  │  sesiones en 3 semanas.                                 │    │
│  │                                                         │    │
│  │  [Registrar sesión]                                     │    │
│  │  [Ajustar ritmo]  [Pausar]                              │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📋 Planificación                                       │    │
│  │                                                         │    │
│  │  No has hecho revisión semanal en 2 semanas.            │    │
│  │                                                         │    │
│  │  [Hacer ahora]  [El domingo]                            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## C. REGISTRO

### C1 — Timeline

**Propósito:** Vista cronológica de todas las entradas y actividad.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Registro                                    🔍    📅    ⚙️    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filtros: [Todos ▼]  [Área ▼]  [Fecha]      Filter chips       │
│                                              horizontal scroll  │
├─────────────────────────────────────────────────────────────────┤
│                                              Scrollable list    │
│                                                                 │
│  HOY                                         Section header     │
│  ────────────────────────────────────        Sticky            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  10:30   ✓ Meditación                        15 min     │    │
│  │          💪 Salud                                       │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  09:15   📝 "Desperté con energía              →        │    │
│  │          después de dormir bien..."                     │    │
│  │          💪 Salud  💼 Trabajo                           │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  08:00   ✓ Beber agua                                   │    │
│  │          💪 Salud                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  AYER                                        Section header     │
│  ────────────────────────────────────                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  21:00   🌙 Check-in noche                              │    │
│  │          Ánimo: 🙂  Energía: 3                          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  18:30   👤 Llamé a Mamá                     20 min     │    │
│  │          "Hablamos sobre el viaje..."                   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  15:00   🎹 Piano: escalas                   30 min     │    │
│  │          🎨 Creatividad                                 │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  09:00   📝 "Reunión difícil pero              →        │    │
│  │          productiva con el cliente..."                  │    │
│  │          💼 Trabajo                                     │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  08:00   ☀️ Check-in mañana                             │    │
│  │          Ánimo: 🙂  Energía: 4                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                          ┌─────┐                                │
│                          │  +  │                                │
│                          └─────┘                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ☀️        📖        ⬜        👥        ✨                    │
│   Hoy     Registro   Áreas   Personas  Copiloto                │
└─────────────────────────────────────────────────────────────────┘
```

---

### C2 — Nueva Entrada (Texto)

**Propósito:** Crear una entrada de diario o nota.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✕ Cancelar              Nueva entrada                     ✓   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Escribe aquí tu reflexión, nota o lo que               │    │
│  │  quieras recordar...                                    │    │
│  │                                                         │    │
│  │                                                         │    │
│  │                                                         │    │
│  │                                                         │    │
│  │                                                         │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Textarea           │
│                                              min-height: 200px  │
│                                              auto-expand        │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Prompts (opcional):                        Collapsible         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • ¿Qué pasó hoy?                                       │    │
│  │  • ¿Cómo me siento ahora?                               │    │
│  │  • ¿Qué aprendí?                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Tap to insert      │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Adjuntar:                                                      │
│  [🎤 Audio]  [📷 Foto]  [📍 Ubicación]      Icon buttons        │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Vincular:                                   Chip selectors     │
│                                                                 │
│  Áreas:    [+ Salud]  [+ Trabajo]                               │
│  Personas: [+ Seleccionar]                                      │
│  Ritmos:   [+ Meditación]                                       │
│  Metas:    [+ Aprender piano]                                   │
│  Tags:     [+ reflexión]  [+ crear]                             │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Privacidad: [Normal ▼]                     Dropdown            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ○ Normal - visible en timeline                          │    │
│  │ ● Privada - oculta en previews                          │    │
│  │ ○ Ultra privada - requiere PIN adicional                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### C3 — Nueva Entrada (Voz)

**Propósito:** Grabar entrada por voz con transcripción.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✕ Cancelar                            Entrada por voz         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                                                                 │
│                      ┌───────────────┐                          │
│                      │               │                          │
│                      │      🎤       │      80x80px             │
│                      │               │      primary bg          │
│                      └───────────────┘                          │
│                                                                 │
│                   Tap para grabar                               │
│                                              Body, gray-500     │
│                                                                 │
│                                                                 │
│  ════════════════════════════════════════════════════════════   │
│                                                                 │
│  (Estado: Grabando)                                             │
│                                                                 │
│                      ┌───────────────┐                          │
│                      │               │                          │
│                      │      ■        │      pulsing             │
│                      │               │      red bg              │
│                      └───────────────┘                          │
│                                                                 │
│                    Grabando... 0:45                             │
│                                                                 │
│           ─────────────────────────────                         │
│           █ █ █ ▌▌▌█ █ █ ▌▌▌█ █ █      waveform               │
│                                                                 │
│                      [■ Detener]                                │
│                                                                 │
│  ════════════════════════════════════════════════════════════   │
│                                                                 │
│  Transcripción:                          Label                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  "Hoy tuve una reunión complicada                       │    │
│  │  con el cliente. Me sentí frustrado                     │    │
│  │  porque no entendieron la propuesta..."                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              real-time          │
│                                              editable           │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Si tienes Copiloto activo:             Info box               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✨ [Convertir en actualizaciones]                       │    │
│  │    El AI propondrá crear entradas,                      │    │
│  │    marcar ritmos y registrar interacciones.             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Guardar como entrada                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### C4 — Detalle de Entrada

**Propósito:** Ver y editar una entrada existente.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Timeline           29 ene, 09:15                        ✏️  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Desperté con energía baja pero después      Body              │
│  de meditar me sentí mejor. La reunión       16px              │
│  de ayer me dejó pensando en cómo            line-height: 28px │
│  manejar mejor esas situaciones.                               │
│                                                                 │
│  Es curioso cómo el ejercicio afecta                           │
│  mi estado de ánimo durante el día...                          │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  [📷 foto adjunta]                          Image preview       │
│                                              tap to expand      │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Vinculado a:                               Label, gray-500    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  💪 Salud                                           >   │    │
│  │  💼 Trabajo                                         >   │    │
│  │  ✓ Meditación                                       >   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Tappable links     │
│                                                                 │
│  Tags: #reflexión #mañana                   Chips              │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Privacidad: Normal                         Info               │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Acciones:                                  Button group       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [✏️ Editar]  [📋 Duplicar]                             │    │
│  │  [💡 Convertir a idea]  [📋 Extraer tareas]             │    │
│  │  [🗑️ Eliminar]                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## D. ÁREAS

### D1 — Lista de Áreas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Áreas                                       🔍    📅    ⚙️    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  💪 Salud                                        🟢     │    │
│  │     3 ritmos • 1 meta                                   │    │
│  │     Última actividad: hoy                               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  💼 Trabajo                                      🟡     │    │
│  │     2 ritmos • 2 metas                                  │    │
│  │     Última actividad: ayer                              │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  👥 Relaciones                                   🟠     │    │
│  │     0 ritmos • 0 metas                                  │    │
│  │     Última actividad: 5 días                            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🙏 Fe                                           🟢     │    │
│  │     2 ritmos • 1 meta                                   │    │
│  │     Última actividad: hoy                               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [+ Crear área]                              Button Ghost       │
│                                                                 │
│                          ┌─────┐                                │
│                          │  +  │                                │
│                          └─────┘                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ☀️        📖        ⬜        👥        ✨                    │
│   Hoy     Registro   Áreas   Personas  Copiloto                │
└─────────────────────────────────────────────────────────────────┘
```

---

### D2 — Detalle de Área

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Áreas                                          💪 Salud     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Atención: 🟢 Alta                          Status badge       │
│  Esta semana: 5 entradas, 12 ritmos                            │
│                                                                 │
│  ════════════════════════════════════════════════════════════   │
│                                                                 │
│  RITMOS                                          Ver más →      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ✓ Ejercicio                            [3/3 sem]       │    │
│  │  ✓ Dormir 7h+                           [5/7 días]      │    │
│  │    Beber agua                           [hoy pend]      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  METAS                                           Ver más →      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🏃 Correr 10K                               [65%]      │    │
│  │     Próximo: correr 6km domingo                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ENTRADAS RECIENTES                              Ver más →      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Hoy: "Buena sesión de gym, me sentí..."                │    │
│  │  Ayer: "Dormí mal porque me acosté tarde..."            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  SUGERENCIAS PARA ESTA ÁREA                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  💡 "Tus días de ejercicio coinciden                    │    │
│  │      con mejor ánimo"                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ⚙️ Configurar área                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### D3 — Configurar Área

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Salud                                    Configurar área    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Nombre:                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Salud                                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Icono:                                                         │
│  [💪] ← [🏃] [❤️] [🍎] [🧘] [🏋️]            Emoji picker        │
│                                                                 │
│  Color:                                                         │
│  [●] [○] [○] [○] [○] [○] [○] [○]            Color picker       │
│   🟢  🔵  🟣  🟠  🟡  🔴  ⚪  ⚫                                  │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  VISIBILIDAD                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [✓] Visible en lista de áreas                           │    │
│  │ [✓] Incluir en dashboard                                │    │
│  │ [ ] Ocultar de búsqueda                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  PROMPTS DE JOURNAL (opcionales)                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • ¿Cómo está mi cuerpo hoy?                      [✕]   │    │
│  │  • ¿Dormí bien?                                   [✕]   │    │
│  │  • ¿Qué comí?                                     [✕]   │    │
│  │  [+ Agregar prompt]                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  MÉTRICAS (opcional)                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [ ] Horas de sueño                                      │    │
│  │ [ ] Peso                                                │    │
│  │ [ ] Pasos (si hay integración)                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                       Guardar                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [🗑️ Eliminar área]                         Danger, bottom      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## E. RITMOS

### E1 — Lista de Ritmos

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Ritmos                                      🔍    📅    ⚙️    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Hoy]  [Semana]  [Todos]  [Pausados]        Tab chips         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HOY (5 pendientes)                          Section header     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [✓] 💧 Beber agua                                      │    │
│  │  [✓] 🧘 Meditación                            15 min    │    │
│  │  [ ] 📖 Lectura                               30 min    │    │
│  │  [ ] 🙏 Gratitud                                        │    │
│  │  [ ] 💪 Ejercicio                             45 min    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ESTA SEMANA                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🎹 Piano                              [2/3 hecho]      │    │
│  │     Próximo: hoy                                        │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  📋 Revisión semanal                   [0/1 hecho]      │    │
│  │     Próximo: domingo                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Consistencia general: 78%                   Progress bar       │
│  ████████████████░░░░                        (sin juicio)       │
│                                                                 │
│  [+ Crear ritmo]                             Button Ghost       │
│                                                                 │
│                          ┌─────┐                                │
│                          │  +  │                                │
│                          └─────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### E2 — Detalle de Ritmo

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Ritmos                                          🎹 Piano    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Estado: 🟢 Activo                          Status badge       │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  POR QUÉ                                     Section            │
│  "Quiero tocar mis canciones favoritas                         │
│   y relajarme después del trabajo"          Body, gray-700     │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  CONFIGURACIÓN                                                  │
│  Frecuencia: 3 veces por semana                                │
│  Duración objetivo: 30 minutos                                 │
│  Recordatorio: Lun, Mié, Vie a las 19:00                       │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  HISTORIAL (últimos 30 días)                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │   L   M   M   J   V   S   D                             │    │
│  │   ●   ·   ●   ·   ●   ·   ·   sem -3                   │    │
│  │   ●   ·   ·   ·   ●   ·   ·   sem -2                   │    │
│  │   ·   ·   ●   ·   ·   ·   ·   sem -1                   │    │
│  │   ●   ·   ·   ·   ·   ·   ·   actual                   │    │
│  │                                                         │    │
│  │   Consistencia: 60% (6/10)                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Heatmap calendar   │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  VINCULADO A                                                    │
│  • Meta: Aprender piano                                        │
│  • Área: Creatividad                        Tappable links     │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  AJUSTES                                                        │
│  [Hacerlo más fácil]  → 15 min                                  │
│  [Cambiar horario]                                              │
│  [Pausar temporalmente]                                         │
│  [Archivar]                                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🎹 Registrar sesión                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Button Primary     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### E3 — Registrar Sesión

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✕ Cancelar                Sesión de Piano                 ✓   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ¿Cuánto tiempo practicaste?                                    │
│                                                                 │
│              ┌─────────────────────┐                            │
│              │         35          │         Number picker      │
│              │       minutos       │                            │
│              └─────────────────────┘                            │
│                                                                 │
│              [-5]    [+5]    [+15]           Stepper buttons    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Qué tipo de práctica?                                         │
│                                                                 │
│  [Escalas] [Acordes] [Canción ✓]            Chip multiselect   │
│  [Lectura] [Improv.] [Otro]                                     │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Qué trabajaste específicamente?                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Practiqué "Claro de Luna" - primer                      │    │
│  │ movimiento. Mejoré la mano izquierda.                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Textarea           │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Cómo fue la sesión?                                           │
│                                                                 │
│  [😫]  [😕]  [😐]  [🙂 ✓]  [😊]             Emoji selector      │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ¿Cómo te sentiste?                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Relajado, aunque frustrado con un pasaje.               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Adjuntar:                                                      │
│  [📷 Foto]  [🎥 Video]  [🎤 Audio]          Optional            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Guardar sesión                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## F. METAS

### F1 — Lista de Metas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Metas                                       🔍    📅    ⚙️    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Activas]  [Pausadas]  [Completadas]        Tab chips         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACTIVAS (3)                                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🎹 Aprender piano                                      │    │
│  │  ████████████░░░░░░░░  65%                              │    │
│  │                                                         │    │
│  │  Próximo: practicar escalas                             │    │
│  │  Área: Creatividad                                      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🏃 Correr 10K                                          │    │
│  │  █████████░░░░░░░░░░░  40%                              │    │
│  │                                                         │    │
│  │  Próximo: correr 6km                                    │    │
│  │  Fecha: 15 marzo  •  Área: Salud                        │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📖 Leer 12 libros este año                             │    │
│  │  ██░░░░░░░░░░░░░░░░░░  2/12                             │    │
│  │                                                         │    │
│  │  Próximo: terminar libro actual                         │    │
│  │  Área: Aprendizaje                                      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [+ Nueva meta]                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## G. PERSONAS

### G1 — Lista de Personas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Personas                                    🔍    📅    ⚙️    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Todos] [Cercanos] [Familia] [Trabajo]      Filter chips      │
│                                                                 │
│  Ordenar: [Último contacto ▼]               Sort dropdown      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚠️ NECESITAN ATENCIÓN                       Section header     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ┌───┐                                                  │    │
│  │  │ C │  Carlos                          hace 45 días    │    │
│  │  └───┘  Frecuencia: cada 2 semanas                      │    │
│  │                     [Registrar contacto]                │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ┌───┐                                                  │    │
│  │  │ A │  Ana                             hace 30 días    │    │
│  │  └───┘  Frecuencia: cada mes                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  AL DÍA                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ┌───┐                                                  │    │
│  │  │ M │  Mamá                            hace 2 días     │    │
│  │  └───┘  Familia                                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ┌───┐                                                  │    │
│  │  │ J │  Juan                            hace 5 días     │    │
│  │  └───┘  Cercano                                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ┌───┐                                                  │    │
│  │  │ M │  María                           hace 1 semana   │    │
│  │  └───┘  Trabajo                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [+ Agregar persona]                                            │
│                                                                 │
│                          ┌─────┐                                │
│                          │  +  │                                │
│                          └─────┘                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ☀️        📖        ⬜        👥        ✨                    │
│   Hoy     Registro   Áreas   Personas  Copiloto                │
└─────────────────────────────────────────────────────────────────┘
```

---

## J. COPILOTO

### J1 — Chat

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Copiloto                                    [⚙️]               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                              Chat messages      │
│                                              scrollable         │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │ ¡Hola! Soy tu copiloto. ¿En qué         │                    │
│  │ puedo ayudarte hoy?                     │    Copilot bubble  │
│  └─────────────────────────────────────────┘                    │
│  10:00                                                          │
│                                                                 │
│                    ┌─────────────────────────────────────────┐  │
│                    │ Hoy hice ejercicio y practiqué         │  │
│                    │ piano por 30 minutos.                  │  │
│                    └─────────────────────────────────────────┘  │
│                                                         10:01  │
│                                              User bubble        │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │ ¡Excelente! Veo que mencionaste:        │                    │
│  │                                         │                    │
│  │ • Ejercicio                             │                    │
│  │ • Piano (30 min)                        │                    │
│  │                                         │                    │
│  │ ¿Quieres que registre esto en tu        │                    │
│  │ sistema?                                │                    │
│  │                                         │                    │
│  │     [Sí, registrar]  [Ver detalles]     │                    │
│  └─────────────────────────────────────────┘                    │
│  10:01                                                          │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Accesos rápidos:                           Horizontal scroll   │
│  [Resumen de hoy] [Crear entrada]                               │
│  [Marcar ritmos] [Registrar interacción]                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Escribe un mensaje...                         [🎤] [➤]  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Input bar          │
│                                              fixed bottom       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   ☀️        📖        ⬜        👥        ✨                    │
│   Hoy     Registro   Áreas   Personas  Copiloto                │
└─────────────────────────────────────────────────────────────────┘
```

---

### J3 — Cambios Propuestos

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Chat                              Cambios propuestos        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  El copiloto identificó 4 cambios en                           │
│  tu mensaje. Revisa y confirma:          Body, gray-600        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📝 ENTRADA DE DIARIO                                   │    │
│  │  ───────────────────────────────────────────            │    │
│  │  [✓] Crear entrada                                      │    │
│  │                                                         │    │
│  │  "Hoy hice ejercicio y practiqué piano..."              │    │
│  │                                                         │    │
│  │  Áreas: 💪 Salud, 🎨 Creatividad                        │    │
│  │                                                         │    │
│  │                                             [✏️ Editar] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ✓ RITMOS                                               │    │
│  │  ───────────────────────────────────────────            │    │
│  │  [✓] Marcar: Ejercicio                                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🎹 SESIÓN DE PRÁCTICA                                  │    │
│  │  ───────────────────────────────────────────            │    │
│  │  [✓] Piano: 30 minutos                                  │    │
│  │                                                         │    │
│  │                                             [✏️ Editar] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  💡 SUGERENCIA                                          │    │
│  │  ───────────────────────────────────────────            │    │
│  │  [ ] Crear recordatorio: "Revisar progreso              │    │
│  │      de piano el viernes"                               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Aplicar (3)                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              Button Primary     │
│                                              Count of selected  │
│                                                                 │
│              [Cancelar todo]                 Button Ghost       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## K. AJUSTES

### K1 — Ajustes Generales

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Ajustes                                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERFIL                                      Section            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Tu nombre: Juan                                    >   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  PRIVACIDAD                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Bloquear app                                 [    ●]   │    │
│  │  PIN o biometría                                        │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Contenido sensible                                 >   │    │
│  │  Configurar áreas y personas privadas                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  NOTIFICACIONES                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Nivel de notificaciones                            >   │    │
│  │  Moderado                                               │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Recordatorios de ritmos                      [    ●]   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Sugerencias                                  [●    ]   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  DATOS                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Exportar datos                                     >   │    │
│  │  JSON, CSV                                              │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Crear respaldo                                     >   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Restaurar desde respaldo                           >   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  COPILOTO AI                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Configurar copiloto                                >   │    │
│  │  API key, permisos, estilo                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ACERCA DE                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Versión 1.0.0                                          │    │
│  │  © 2026 Life Copilot                                    │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Política de privacidad                             >   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Términos de servicio                               >   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## L. AUXILIARES

### L1 — Calendario

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Hoy                                           Calendario    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           ◀  Enero 2026  ▶                      Month nav      │
│                                                                 │
│   L     M     M     J     V     S     D                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │       │       │       │   1   │   2   │   3   │   4   │    │
│  │       │       │       │   ·   │       │       │   ·   │    │
│  ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │   5   │   6   │   7   │   8   │   9   │  10   │  11   │    │
│  │   ●   │   ·   │   ●   │   ·   │   ●   │   ·   │   ·   │    │
│  ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │  12   │  13   │  14   │  15   │  16   │  17   │  18   │    │
│  │   ●   │   ·   │   ●   │   ·   │   ●   │   ·   │   ·   │    │
│  ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │  19   │  20   │  21   │  22   │  23   │  24   │  25   │    │
│  │   ●   │   ·   │   ●   │   ·   │   ●   │   ·   │   ·   │    │
│  ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │  26   │  27   │  28   │ [29]  │  30   │  31   │       │    │
│  │   ●   │   ·   │   ●   │   ●   │       │       │       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                              ● = activity       │
│                                              · = ritmo done     │
│                                              [29] = selected    │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  Mostrar: [○ Solo ritmos] [● Todo]           Toggle            │
│                                                                 │
│  ────────────────────────────────────                           │
│                                                                 │
│  29 ENERO                                    Day detail         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  10:30  ✓ Meditación                          15 min    │    │
│  │  09:15  📝 "Desperté con energía..."                    │    │
│  │  08:00  ✓ Beber agua                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### L3 — Bienvenida de Vuelta

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                                                                 │
│                 ┌─────────────────────────┐                     │
│                 │                         │                     │
│                 │      ¡Qué bueno         │      Heading 1      │
│                 │        verte!           │      28px, center   │
│                 │                         │                     │
│                 └─────────────────────────┘                     │
│                                                                 │
│                 Han pasado 15 días desde                        │
│                 tu última visita.                               │
│                                              Body, gray-500     │
│                                              center             │
│                                                                 │
│                 ────────────────────────                        │
│                                                                 │
│                 ¿Cómo quieres continuar?                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📊 Ver resumen rápido                                  │    │
│  │     Qué pasó mientras no estuviste                      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🌅 Empezar fresco                                      │    │
│  │     Ir directo al dashboard                             │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ⚙️ Ajustar mi sistema                                  │    │
│  │     Simplificar ritmos y metas                          │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist de Pantallas

### Onboarding (6)
- [x] A1 - Bienvenida
- [x] A2 - Configurar áreas
- [x] A3 - Ritmos iniciales
- [x] A4 - Personas importantes
- [x] A5 - Preferencias
- [x] A6 - AI opcional

### Hoy (3)
- [x] B1 - Dashboard
- [x] B2 - Check-in
- [x] B3 - Sugerencias

### Registro (4)
- [x] C1 - Timeline
- [x] C2 - Nueva entrada texto
- [x] C3 - Nueva entrada voz
- [x] C4 - Detalle entrada

### Áreas (3)
- [x] D1 - Lista
- [x] D2 - Detalle
- [x] D3 - Configurar

### Ritmos (3)
- [x] E1 - Lista
- [x] E2 - Detalle
- [x] E3 - Sesión

### Metas (3)
- [x] F1 - Lista
- [ ] F2 - Detalle (ver PRODUCT_SPEC)
- [ ] F3 - Crear (ver PRODUCT_SPEC)

### Personas (3)
- [x] G1 - Lista
- [ ] G2 - Detalle (ver PRODUCT_SPEC)
- [ ] G3 - Interacción (ver PRODUCT_SPEC)

### Ideas (2)
- [ ] H1 - Inbox (ver PRODUCT_SPEC)
- [ ] H2 - Detalle (ver PRODUCT_SPEC)

### Insights (2)
- [ ] I1 - Dashboard (ver PRODUCT_SPEC)
- [ ] I2 - Revisión (ver PRODUCT_SPEC)

### Copiloto (4)
- [x] J1 - Chat
- [ ] J2 - Voz (ver PRODUCT_SPEC)
- [x] J3 - Cambios propuestos
- [ ] J4 - Preferencias (ver PRODUCT_SPEC)

### Ajustes (2)
- [x] K1 - Generales
- [ ] K2 - Sensible (ver PRODUCT_SPEC)

### Auxiliares (3)
- [x] L1 - Calendario
- [ ] L2 - Búsqueda (ver PRODUCT_SPEC)
- [x] L3 - Bienvenida

---

*Especificaciones de pantallas de Life Copilot.*
*Para uso de diseñadores y desarrolladores.*
