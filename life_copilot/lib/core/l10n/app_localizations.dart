import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

/// Localization configuration for Life Copilot
/// Primary language: Spanish (es)
/// Secondary language: English (en)
abstract final class AppLocalizations {
  /// Supported locales
  static const List<Locale> supportedLocales = [
    Locale('es'), // Spanish - primary
    Locale('en'), // English
  ];

  /// Localization delegates
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = [
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    // TODO: Add app-specific localizations delegate
  ];
}

// TODO: Implement full localization with intl package
// For now, using constants file for Spanish strings

/// Spanish string constants
/// Will be replaced with proper localization in future
abstract final class Strings {
  // App
  static const String appName = 'Life Copilot';
  static const String appTagline = 'Tu copiloto de vida';

  // Navigation
  static const String navToday = 'Hoy';
  static const String navEntries = 'Registro';
  static const String navAreas = 'Áreas';
  static const String navPeople = 'Personas';
  static const String navCopilot = 'Copiloto';

  // Common actions
  static const String save = 'Guardar';
  static const String cancel = 'Cancelar';
  static const String delete = 'Eliminar';
  static const String edit = 'Editar';
  static const String done = 'Hecho';
  static const String skip = 'Saltar';
  static const String next = 'Siguiente';
  static const String back = 'Atrás';
  static const String close = 'Cerrar';
  static const String search = 'Buscar';
  static const String filter = 'Filtrar';
  static const String add = 'Agregar';
  static const String create = 'Crear';
  static const String seeAll = 'Ver todos';
  static const String seeMore = 'Ver más';

  // Greetings
  static const String goodMorning = 'Buenos días';
  static const String goodAfternoon = 'Buenas tardes';
  static const String goodEvening = 'Buenas noches';

  // Check-in
  static const String checkIn = 'Check-in';
  static const String mood = 'Ánimo';
  static const String energy = 'Energía';
  static const String focus = 'Enfoque';
  static const String quickCheckIn = 'Check-in rápido';
  static const String morningCheckIn = 'Check-in mañana';
  static const String nightCheckIn = 'Check-in noche';

  // Rhythms
  static const String rhythms = 'Ritmos';
  static const String rhythmsToday = 'Ritmos de hoy';
  static const String createRhythm = 'Crear ritmo';
  static const String dailyRhythms = 'Diario';
  static const String weeklyRhythms = 'Semanal';
  static const String monthlyRhythms = 'Mensual';
  static const String pausedRhythms = 'Pausados';
  static const String consistency = 'Consistencia';

  // Entries
  static const String entries = 'Entradas';
  static const String newEntry = 'Nueva entrada';
  static const String textEntry = 'Texto';
  static const String voiceEntry = 'Voz';
  static const String today = 'Hoy';
  static const String yesterday = 'Ayer';

  // Areas
  static const String areas = 'Áreas';
  static const String createArea = 'Crear área';
  static const String areaHealth = 'Salud';
  static const String areaWork = 'Trabajo';
  static const String areaRelationships = 'Relaciones';
  static const String areaFinances = 'Finanzas';
  static const String areaFaith = 'Fe / Espiritualidad';
  static const String areaLearning = 'Aprendizaje';
  static const String areaCreativity = 'Creatividad';
  static const String areaService = 'Servicio';
  static const String areaPartner = 'Pareja';

  // People
  static const String people = 'Personas';
  static const String addPerson = 'Agregar persona';
  static const String needsAttention = 'Necesitan atención';
  static const String upToDate = 'Al día';
  static const String lastContact = 'Último contacto';
  static const String desiredFrequency = 'Frecuencia deseada';
  static const String registerInteraction = 'Registrar interacción';

  // Goals
  static const String goals = 'Metas';
  static const String createGoal = 'Nueva meta';
  static const String activeGoals = 'Activas';
  static const String pausedGoals = 'Pausadas';
  static const String completedGoals = 'Completadas';
  static const String nextStep = 'Próximo paso';
  static const String progress = 'Progreso';

  // Copilot
  static const String copilot = 'Copiloto';
  static const String copilotGreeting = 'Hola! ¿Cómo va tu día?';
  static const String proposedChanges = 'Cambios propuestos';
  static const String applyChanges = 'Aplicar cambios';
  static const String apiKey = 'API Key';

  // Suggestions
  static const String suggestions = 'Sugerencias';
  static const String reconnection = 'Reconexión';
  static const String consistencyAlert = 'Consistencia';
  static const String balanceAlert = 'Balance';
  static const String planningAlert = 'Planificación';
  static const String doNow = 'Hacer ahora';
  static const String postpone = 'Posponer';
  static const String discard = 'Descartar';
  static const String dontSuggestAgain = 'No sugerir más';

  // Settings
  static const String settings = 'Ajustes';
  static const String privacy = 'Privacidad';
  static const String notifications = 'Notificaciones';
  static const String appLock = 'Bloqueo de app';
  static const String biometrics = 'Biometría';
  static const String exportData = 'Exportar datos';
  static const String createBackup = 'Crear respaldo';
  static const String restoreBackup = 'Restaurar respaldo';

  // Privacy levels
  static const String privacyNormal = 'Normal';
  static const String privacyPrivate = 'Privada';
  static const String privacyUltraPrivate = 'Ultra privada';

  // Time
  static const String daysAgo = 'días';
  static const String weeksAgo = 'semanas';
  static const String monthsAgo = 'meses';
  static const String minutes = 'minutos';
  static const String hours = 'horas';

  // Onboarding
  static const String welcome = 'Bienvenido';
  static const String welcomeMessage =
      'Registra, da seguimiento, y recibe sugerencias.';
  static const String lightSetup = 'Quiero algo ligero';
  static const String completeSetup = 'Quiero algo completo';
  static const String skipSetup = 'Saltar setup';
  static const String configureAreas = '¿Qué dimensiones de tu vida quieres seguir?';
  static const String configureRhythms = 'Elige 3-8 hábitos o prácticas para empezar';
  static const String configurePeople = '¿Con quién quieres mantener contacto regular?';
  static const String configurePreferences = 'Preferencias';
  static const String configureAI = 'Copiloto AI (opcional)';

  // Circles (for people)
  static const String circleClose = 'Cercano';
  static const String circleFamily = 'Familia';
  static const String circleWork = 'Trabajo';
  static const String circleAcquaintance = 'Conocido';

  // Interaction types
  static const String interactionCall = 'Llamada';
  static const String interactionMessage = 'Mensaje';
  static const String interactionInPerson = 'En persona';
  static const String interactionEvent = 'Evento';
  static const String interactionOther = 'Otro';

  // Empty states
  static const String noEntries = 'Sin entradas';
  static const String noRhythms = 'Sin ritmos';
  static const String noPeople = 'Sin personas';
  static const String noGoals = 'Sin metas';
  static const String noSuggestions = 'Sin sugerencias';

  // Error messages
  static const String errorGeneric = 'Algo salió mal';
  static const String errorNetwork = 'Error de conexión';
  static const String errorSave = 'Error al guardar';
  static const String errorLoad = 'Error al cargar';
}
