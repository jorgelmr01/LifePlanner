import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:uuid/uuid.dart';

part 'app_database.g.dart';

const _uuid = Uuid();

// ============================================
// ENUMS
// ============================================

/// Privacy level for entries
enum PrivacyLevel {
  normal,
  private,
  ultraPrivate,
}

/// Frequency for rhythms
enum RhythmFrequency {
  daily,
  weekly,
  monthly,
  custom,
}

/// Status for rhythms
enum RhythmStatus {
  active,
  paused,
  archived,
  completed,
}

/// Status for goals
enum GoalStatus {
  active,
  paused,
  completed,
  abandoned,
}

/// Circle type for people
enum CircleType {
  close,
  family,
  work,
  acquaintance,
}

/// Status for people
enum PersonStatus {
  active,
  dormant,
  archived,
}

/// Interaction type
enum InteractionType {
  call,
  message,
  inPerson,
  event,
  other,
}

/// Suggestion type
enum SuggestionType {
  reconnection,
  consistency,
  balance,
  planning,
  celebration,
}

/// Suggestion status
enum SuggestionStatus {
  pending,
  done,
  postponed,
  dismissed,
}

/// Tag type
enum TagType {
  user,
  system,
  inherited,
}

/// Copilot style
enum CopilotStyle {
  direct,
  balanced,
  coaching,
}

/// History privacy
enum HistoryPrivacy {
  full,
  resultsOnly,
  none,
}

/// Notification level
enum NotificationLevel {
  soft,
  moderate,
  full,
}

// ============================================
// TABLES
// ============================================

/// Areas table - dimensions of life
@DataClassName('AreaEntity')
class Areas extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get icon => text().nullable()();
  BoolColumn get visible => boolean().withDefault(const Constant(true))();
  IntColumn get order => integer().withDefault(const Constant(0))();
  TextColumn get color => text().nullable()();
  TextColumn get journalPrompts => text().nullable()(); // JSON array
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Entries table - journal entries, check-ins, notes
@DataClassName('EntryEntity')
class Entries extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  DateTimeColumn get date => dateTime()();
  TextColumn get content => text().nullable()();
  TextColumn get audioPath => text().nullable()();
  TextColumn get transcription => text().nullable()();
  IntColumn get mood => integer().nullable()(); // 1-5
  IntColumn get energy => integer().nullable()(); // 1-5
  IntColumn get focus => integer().nullable()(); // 1-5
  TextColumn get privacyLevel => textEnum<PrivacyLevel>().withDefault(Constant(PrivacyLevel.normal.name))();
  TextColumn get photos => text().nullable()(); // JSON array of paths
  TextColumn get location => text().nullable()(); // JSON with lat/lng
  TextColumn get entryType => text().withDefault(const Constant('journal'))(); // journal, checkin_morning, checkin_night, note
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Rhythms table - habits, routines, practices
@DataClassName('RhythmEntity')
class Rhythms extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get purpose => text().nullable()();
  TextColumn get frequency => textEnum<RhythmFrequency>()();
  TextColumn get weekDays => text().nullable()(); // JSON array [1,3,5] for Mon, Wed, Fri
  TextColumn get time => text().nullable()(); // HH:mm format
  IntColumn get targetDuration => integer().nullable()(); // in minutes
  TextColumn get status => textEnum<RhythmStatus>().withDefault(Constant(RhythmStatus.active.name))();
  BoolColumn get reminder => boolean().withDefault(const Constant(false))();
  IntColumn get difficulty => integer().nullable()(); // 1-3
  TextColumn get icon => text().nullable()();
  BoolColumn get isPractice => boolean().withDefault(const Constant(false))(); // For hobbies with detailed sessions
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Rhythm completions table - tracks when rhythms are completed
@DataClassName('RhythmCompletionEntity')
class RhythmCompletions extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get rhythmId => text().references(Rhythms, #id)();
  DateTimeColumn get date => dateTime()();
  IntColumn get duration => integer().nullable()(); // in minutes
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Practice sessions table - detailed sessions for hobbies
@DataClassName('PracticeSessionEntity')
class PracticeSessions extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get rhythmId => text().references(Rhythms, #id)();
  DateTimeColumn get date => dateTime()();
  IntColumn get duration => integer()(); // in minutes
  TextColumn get practiceType => text().nullable()();
  IntColumn get quality => integer().nullable()(); // 1-5
  TextColumn get whatWorkedOn => text().nullable()();
  TextColumn get howItFelt => text().nullable()();
  TextColumn get attachments => text().nullable()(); // JSON array of paths
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Goals table - objectives and projects
@DataClassName('GoalEntity')
class Goals extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get title => text().withLength(min: 1, max: 200)();
  TextColumn get why => text().nullable()();
  DateTimeColumn get deadline => dateTime().nullable()();
  TextColumn get metric => text().nullable()();
  IntColumn get progress => integer().withDefault(const Constant(0))(); // 0-100
  TextColumn get nextStep => text().nullable()();
  TextColumn get status => textEnum<GoalStatus>().withDefault(Constant(GoalStatus.active.name))();
  TextColumn get abandonReason => text().nullable()();
  TextColumn get icon => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Milestones table - goal milestones
@DataClassName('MilestoneEntity')
class Milestones extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get goalId => text().references(Goals, #id)();
  TextColumn get title => text().withLength(min: 1, max: 200)();
  BoolColumn get completed => boolean().withDefault(const Constant(false))();
  IntColumn get order => integer().withDefault(const Constant(0))();
  DateTimeColumn get completedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// People table - relationships
@DataClassName('PersonEntity')
class People extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get circle => textEnum<CircleType>().nullable()();
  TextColumn get howWeMet => text().nullable()();
  TextColumn get whatMatters => text().nullable()();
  TextColumn get askNextTime => text().nullable()();
  IntColumn get desiredFrequency => integer().nullable()(); // days between contacts
  DateTimeColumn get lastInteraction => dateTime().nullable()();
  DateTimeColumn get birthday => dateTime().nullable()();
  TextColumn get status => textEnum<PersonStatus>().withDefault(Constant(PersonStatus.active.name))();
  BoolColumn get isSensitive => boolean().withDefault(const Constant(false))();
  BoolColumn get silenceSuggestions => boolean().withDefault(const Constant(false))();
  TextColumn get avatar => text().nullable()(); // path or initials
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Interactions table - contacts with people
@DataClassName('InteractionEntity')
class Interactions extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get personId => text().references(People, #id)();
  DateTimeColumn get date => dateTime()();
  TextColumn get type => textEnum<InteractionType>()();
  IntColumn get duration => integer().nullable()(); // in minutes
  TextColumn get note => text().nullable()();
  IntColumn get quality => integer().nullable()(); // 1-5
  DateTimeColumn get followUpDate => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Tags table
@DataClassName('TagEntity')
class Tags extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get name => text().withLength(min: 1, max: 50)();
  TextColumn get type => textEnum<TagType>().withDefault(Constant(TagType.user.name))();
  TextColumn get color => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Suggestions table
@DataClassName('SuggestionEntity')
class Suggestions extends Table {
  TextColumn get id => text().clientDefault(() => _uuid.v4())();
  TextColumn get type => textEnum<SuggestionType>()();
  TextColumn get message => text()();
  TextColumn get reason => text().nullable()();
  TextColumn get action => text().nullable()(); // JSON with action data
  TextColumn get status => textEnum<SuggestionStatus>().withDefault(Constant(SuggestionStatus.pending.name))();
  BoolColumn get noSuggestMore => boolean().withDefault(const Constant(false))();
  TextColumn get relatedObjectId => text().nullable()();
  TextColumn get relatedObjectType => text().nullable()(); // rhythm, person, area, goal
  DateTimeColumn get postponedUntil => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// User preferences table
@DataClassName('UserPreferencesEntity')
class UserPreferences extends Table {
  TextColumn get id => text().withDefault(const Constant('default'))();
  TextColumn get name => text().nullable()();
  TextColumn get notificationLevel => textEnum<NotificationLevel>().withDefault(Constant(NotificationLevel.moderate.name))();
  BoolColumn get appLockEnabled => boolean().withDefault(const Constant(false))();
  BoolColumn get biometricsEnabled => boolean().withDefault(const Constant(false))();
  TextColumn get pinHash => text().nullable()();
  BoolColumn get onboardingCompleted => boolean().withDefault(const Constant(false))();
  TextColumn get selectedTemplate => text().nullable()();
  BoolColumn get localBackupEnabled => boolean().withDefault(const Constant(true))();
  // AI Settings
  BoolColumn get copilotEnabled => boolean().withDefault(const Constant(false))();
  TextColumn get apiKey => text().nullable()();
  TextColumn get copilotStyle => textEnum<CopilotStyle>().withDefault(Constant(CopilotStyle.balanced.name))();
  BoolColumn get aiCanRead => boolean().withDefault(const Constant(true))();
  BoolColumn get aiCanSuggest => boolean().withDefault(const Constant(true))();
  BoolColumn get aiCanPropose => boolean().withDefault(const Constant(true))();
  BoolColumn get aiCanExecute => boolean().withDefault(const Constant(false))();
  TextColumn get aiLimits => text().nullable()(); // JSON array of limits
  TextColumn get historyPrivacy => textEnum<HistoryPrivacy>().withDefault(Constant(HistoryPrivacy.resultsOnly.name))();
  DateTimeColumn get lastAppOpen => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// ============================================
// JUNCTION TABLES (N:N relationships)
// ============================================

/// Entry-Area relationship
@DataClassName('EntryAreaEntity')
class EntryAreas extends Table {
  TextColumn get entryId => text().references(Entries, #id)();
  TextColumn get areaId => text().references(Areas, #id)();

  @override
  Set<Column> get primaryKey => {entryId, areaId};
}

/// Entry-Person relationship
@DataClassName('EntryPersonEntity')
class EntryPeople extends Table {
  TextColumn get entryId => text().references(Entries, #id)();
  TextColumn get personId => text().references(People, #id)();

  @override
  Set<Column> get primaryKey => {entryId, personId};
}

/// Entry-Rhythm relationship
@DataClassName('EntryRhythmEntity')
class EntryRhythms extends Table {
  TextColumn get entryId => text().references(Entries, #id)();
  TextColumn get rhythmId => text().references(Rhythms, #id)();

  @override
  Set<Column> get primaryKey => {entryId, rhythmId};
}

/// Entry-Goal relationship
@DataClassName('EntryGoalEntity')
class EntryGoals extends Table {
  TextColumn get entryId => text().references(Entries, #id)();
  TextColumn get goalId => text().references(Goals, #id)();

  @override
  Set<Column> get primaryKey => {entryId, goalId};
}

/// Entry-Tag relationship
@DataClassName('EntryTagEntity')
class EntryTags extends Table {
  TextColumn get entryId => text().references(Entries, #id)();
  TextColumn get tagId => text().references(Tags, #id)();

  @override
  Set<Column> get primaryKey => {entryId, tagId};
}

/// Rhythm-Area relationship
@DataClassName('RhythmAreaEntity')
class RhythmAreas extends Table {
  TextColumn get rhythmId => text().references(Rhythms, #id)();
  TextColumn get areaId => text().references(Areas, #id)();

  @override
  Set<Column> get primaryKey => {rhythmId, areaId};
}

/// Rhythm-Goal relationship
@DataClassName('RhythmGoalEntity')
class RhythmGoals extends Table {
  TextColumn get rhythmId => text().references(Rhythms, #id)();
  TextColumn get goalId => text().references(Goals, #id)();

  @override
  Set<Column> get primaryKey => {rhythmId, goalId};
}

/// Goal-Area relationship
@DataClassName('GoalAreaEntity')
class GoalAreas extends Table {
  TextColumn get goalId => text().references(Goals, #id)();
  TextColumn get areaId => text().references(Areas, #id)();

  @override
  Set<Column> get primaryKey => {goalId, areaId};
}

/// Goal-Person relationship
@DataClassName('GoalPersonEntity')
class GoalPeople extends Table {
  TextColumn get goalId => text().references(Goals, #id)();
  TextColumn get personId => text().references(People, #id)();

  @override
  Set<Column> get primaryKey => {goalId, personId};
}

/// Person-Area relationship
@DataClassName('PersonAreaEntity')
class PersonAreas extends Table {
  TextColumn get personId => text().references(People, #id)();
  TextColumn get areaId => text().references(Areas, #id)();

  @override
  Set<Column> get primaryKey => {personId, areaId};
}

// ============================================
// DATABASE
// ============================================

@DriftDatabase(
  tables: [
    Areas,
    Entries,
    Rhythms,
    RhythmCompletions,
    PracticeSessions,
    Goals,
    Milestones,
    People,
    Interactions,
    Tags,
    Suggestions,
    UserPreferences,
    // Junction tables
    EntryAreas,
    EntryPeople,
    EntryRhythms,
    EntryGoals,
    EntryTags,
    RhythmAreas,
    RhythmGoals,
    GoalAreas,
    GoalPeople,
    PersonAreas,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (Migrator m) async {
      await m.createAll();
      // Insert default preferences
      await into(userPreferences).insert(UserPreferencesCompanion.insert());
    },
    onUpgrade: (Migrator m, int from, int to) async {
      // Handle migrations here
    },
  );
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'life_copilot.db'));
    return NativeDatabase.createInBackground(file);
  });
}
