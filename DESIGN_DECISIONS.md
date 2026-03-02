# Life Copilot - Decisiones de Diseño

> Documento que registra las decisiones clave tomadas durante el diseño del producto,
> incluyendo las respuestas a las preguntas abiertas identificadas en la fase de planificación.

---

## Preguntas Abiertas Resueltas

### 1. Notificaciones por persona

**Pregunta:** ¿El usuario puede silenciar sugerencias de reconexión para personas específicas sin archivarlas?

**Decisión:** Sí

**Implementación:**
- Campo `silenciar_sugerencias: boolean` en el objeto Persona
- Toggle en la pantalla de detalle de persona
- La persona sigue activa y visible, pero no genera sugerencias de reconexión

**Justificación:**
- Hay relaciones que el usuario quiere mantener registradas pero no necesita recordatorios (ej: colegas de trabajo, conocidos)
- Archivar es demasiado drástico para estos casos
- El usuario mantiene control granular

**Ubicación en UI:**
```
Pantalla G2 (Detalle de persona):
  → Sección de configuración
  → Toggle: "Silenciar sugerencias de reconexión"
  → Tooltip: "No recibirás recordatorios para contactar a esta persona"
```

---

### 2. Historial del copiloto

**Pregunta:** ¿Se guarda el transcript completo o solo las acciones resultantes? (privacidad vs contexto)

**Decisión:** Solo acciones resultantes por defecto, con opción de guardar completo

**Implementación:**
- Por defecto: guardar solo los cambios estructurados (entradas, ritmos marcados, etc.)
- Opción en preferencias: "Guardar conversaciones completas"
- Tercera opción: "No guardar nada" (solo sesión actual)

**Justificación:**
- Privacidad primero: muchos usuarios no quieren que sus conversaciones se almacenen
- Los datos estructurados (entradas, check-ins) son suficientes para el valor de la app
- Usuarios power que quieran contexto pueden activar guardado completo
- El copiloto puede funcionar sin historial (cada sesión es independiente)

**Ubicación en UI:**
```
Pantalla J4 (Preferencias del copiloto):
  → Sección "Privacidad"
  → Radio buttons:
    ○ Guardar conversaciones completas
    ● Solo guardar resultados (recomendado)
    ○ No guardar nada
```

**Memoria del copiloto (V2):**
- En V2, si el usuario activa "guardar completo", el copiloto puede usar ese contexto
- Si no, el copiloto solo tiene acceso a los datos estructurados (entradas, personas, etc.)

---

### 3. Compartir

**Pregunta:** ¿Habrá alguna funcionalidad de compartir (ej: exportar resumen semanal, compartir meta con accountability partner)?

**Decisión:** No en MVP ni V1; evaluación para V2 con alcance limitado

**Justificación:**
- La app es fundamentalmente personal y privada
- Compartir añade complejidad técnica (permisos, formatos, privacidad)
- El valor principal no depende de compartir
- Riesgo de "social pressure" que contradice el principio anti-gamificación

**Posible implementación en V2:**
- Exportar resumen semanal como imagen/PDF (sin conexión a redes)
- Compartir meta específica con 1 persona (accountability partner) vía link privado
- Sin feed, sin likes, sin comparaciones

**Lo que NO se hará:**
- Perfiles públicos
- Compartir en redes sociales
- Comparaciones entre usuarios
- Rankings o leaderboards

---

### 4. Multi-dispositivo

**Pregunta:** ¿La app funcionará en múltiples dispositivos? Si es así, ¿cómo se maneja el conflicto de edición?

**Decisión:** MVP/V1 single-device; V2 sync simple con "último gana"

**Implementación por fase:**

**MVP/V1:**
- Datos 100% locales
- Respaldo manual (exportar JSON)
- Restaurar desde archivo
- Sin cuenta de usuario requerida

**V2:**
- Sync opcional vía servicio propio o iCloud/Google Drive
- Estrategia de conflicto: "último gana" (last-write-wins)
- Merge automático cuando sea posible (ej: dos entradas nuevas se combinan)
- Alertar al usuario si hay conflicto irreconciliable

**Justificación:**
- La sincronización bien hecha es compleja y costosa
- MVP debe probar product-market fit sin esta complejidad
- La mayoría del uso es en un dispositivo (phone)
- Usuarios power pueden exportar/importar manualmente

**Limitaciones aceptadas:**
- En V1, si cambias de teléfono, necesitas exportar/importar
- No hay "historial de versiones"

---

### 5. Monetización

**Pregunta:** ¿Freemium, pago único, suscripción? Esto afecta qué features van dónde.

**Decisión:** Pago único con un precio justo

**Precio sugerido:** $9.99 - $14.99 USD (una sola vez)

**Justificación:**

| Modelo | Pros | Contras |
|--------|------|---------|
| Gratis con ads | Mayor adopción | Contradice privacidad; experiencia degradada |
| Freemium | Prueba antes de comprar | Features fragmentadas; presión constante de upgrade |
| Suscripción | Ingreso recurrente | Fatiga de suscripciones; usuarios sienten "alquiler" |
| **Pago único** | Simple; usuario "posee" la app; sin presión | Menor ingreso a largo plazo |

**Por qué pago único:**
- Alineado con privacidad (no necesitas servidores para monetizar datos)
- Sin fragmentación de features (todos tienen acceso a todo)
- Sin "nagware" ni presión de upgrade
- Usuario se siente dueño, no inquilino
- Actualizaciones mayores (V2, V3) pueden ser upgrades pagados separados

**Alternativas consideradas pero descartadas:**

1. **Freemium con límites:**
   - Gratis: 3 áreas, 5 ritmos, sin AI
   - Pago: ilimitado + AI
   - Problema: fragmenta la experiencia; usuarios gratis se sienten limitados

2. **Suscripción mensual:**
   - $2.99/mes para "Pro"
   - Problema: $36/año por una app de notas personal se siente caro; usuarios odian suscripciones para herramientas personales

3. **Gratis + tips/donaciones:**
   - "Si te gusta, apoya el desarrollo"
   - Problema: conversión muy baja (<1%); no es sostenible

---

## Otras Decisiones de Diseño

### Tono del copiloto

**Decisión:** Equilibrado por defecto, con opciones

**Opciones disponibles:**
- Directo: respuestas cortas, eficientes
- Equilibrado (default): cálido pero no verboso
- Coaching: más preguntas, más reflexión

**Regla de oro:** Nunca juzgar, nunca moralizar, especialmente en temas de religión, relaciones, y ritmos no cumplidos.

---

### Qué es una "Entrada"

**Decisión:** Unificar journal y eventos

**Todo lo que el usuario registra es una "Entrada":**
- Texto libre (journal)
- Grabación de voz transcrita
- Check-in (mood/energía)
- Nota adjunta a un ritmo
- Reflexión de revisión semanal

**Beneficios:**
- Modelo de datos simple
- Todo aparece en el timeline
- Búsqueda unificada
- Menos confusión para el usuario

---

### Nivel de privacidad por defecto

**Decisión:** "Normal" por defecto, con opción de cambiar default por área

**Niveles:**
1. Normal: visible en timeline, búsqueda, previews
2. Privada: visible en timeline, oculta en previews
3. Ultra privada: requiere PIN adicional, oculta de búsqueda

**Por área:**
- El usuario puede configurar que todas las entradas de "Fe" sean "Privadas" por defecto
- Relaciones personales pueden tener default "Privada"

---

### Streaks y gamificación

**Decisión:** Disponibles pero no prominentes

**Implementación:**
- Streaks existen en el modelo de datos
- NO se muestran en el dashboard
- Solo visibles en el detalle del ritmo si el usuario lo quiere
- NO hay animaciones llamativas por streaks
- NO hay "perder" un streak (si fallas un día, el contador se reinicia silenciosamente)

**Celebraciones permitidas:**
- "Momentos" sutiles: "Llevas una semana con meditación"
- Nunca: "¡RACHA DE 30 DÍAS!" con fuegos artificiales

---

### Widgets

**Decisión:** 3 tamaños, funcionalidad limitada

**Widget pequeño (2x2):**
- Check-in rápido (3 sliders)
- Botón captura

**Widget mediano (4x2):**
- Ritmos del día (checkboxes)
- Tocar para marcar

**Widget grande (4x4):**
- Mini-dashboard
- Check-in + ritmos + próxima acción

**Lo que NO hacen los widgets:**
- Mostrar contenido de entradas (privacidad)
- Mostrar nombres de personas
- Cualquier dato sensible

---

### Manejo de "fallo"

**Decisión:** No existe el concepto de "fallar"

**En la app:**
- Ritmo no marcado = "pendiente", no "fallado"
- Varios días sin marcar = sugerencia suave, no notificación de "perdiste tu racha"
- Meta abandonada = aprendizaje, no fracaso (con campo "por qué abandonaste")
- Días sin usar la app = "bienvenida de vuelta", no "te extrañamos, perdiste X días"

**Lenguaje en la UI:**
- Nunca: "Fallaste", "Perdiste", "Te retrasaste"
- Sí: "Pendiente", "Sin marcar", "Hace X días"

---

### Accesibilidad

**Decisión:** Soporte completo desde V1

**Requisitos:**
- VoiceOver (iOS) y TalkBack (Android) 100% funcional
- Alto contraste disponible
- Texto escalable (respeta configuración del sistema)
- Reducir animaciones (opción)
- Etiquetas descriptivas en todos los elementos interactivos
- Navegación por teclado (en versión web)

**Justificación:**
- Es lo correcto
- Amplia la audiencia
- Mejora la UX para todos

---

### Onboarding progresivo

**Decisión:** Onboarding inicial + contextual

**Onboarding inicial (6 pantallas):**
- Promesa de valor
- Selección de áreas
- Ritmos iniciales
- Personas importantes
- Preferencias básicas
- AI opcional

**Onboarding contextual (lazy):**
- Primera vez que abre "Metas": mini-tutorial
- Primera revisión semanal: guía paso a paso
- Primer uso de voz con AI: explicación breve
- Se puede saltar y no vuelve a aparecer

---

### Datos y respaldos

**Decisión:** Local-first con export fácil

**MVP:**
- Datos en SQLite local (o equivalente)
- Export JSON (completo)
- Export CSV (por tipo de objeto)
- Import desde JSON (restaurar)

**V1:**
- Export PDF (resumen legible)
- Respaldo automático local (última semana)

**V2:**
- Sync opcional
- Respaldo en iCloud/Google Drive

---

## Resumen de decisiones clave

| Área | Decisión |
|------|----------|
| Notificaciones por persona | Silenciar individualmente sin archivar |
| Historial del copiloto | Solo resultados por defecto |
| Compartir | No en MVP/V1; limitado en V2 |
| Multi-dispositivo | V2 con sync simple |
| Monetización | Pago único ($9.99-$14.99) |
| Tono del copiloto | Equilibrado, nunca juzga |
| Entradas | Unificadas (journal = evento) |
| Privacidad default | Normal, configurable por área |
| Streaks | Existen pero no prominentes |
| Fallo | No existe el concepto |

---

*Decisiones tomadas durante el diseño conceptual del producto.*
*Sujetas a revisión durante la implementación y testing con usuarios.*
