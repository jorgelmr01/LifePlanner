import 'package:freezed_annotation/freezed_annotation.dart';
import '../database/app_database.dart';

part 'entry.freezed.dart';
part 'entry.g.dart';

/// Entry model - represents a journal entry, check-in, or note
@freezed
class Entry with _$Entry {
  const Entry._();

  const factory Entry({
    required String id,
    required DateTime date,
    String? content,
    String? audioPath,
    String? transcription,
    int? mood, // 1-5
    int? energy, // 1-5
    int? focus, // 1-5
    @Default(PrivacyLevel.normal) PrivacyLevel privacyLevel,
    @Default([]) List<String> photos,
    String? location,
    @Default('journal') String entryType, // journal, checkin_morning, checkin_night, note
    required DateTime createdAt,
    required DateTime updatedAt,
    // Relationships (loaded separately)
    @Default([]) List<String> areaIds,
    @Default([]) List<String> personIds,
    @Default([]) List<String> rhythmIds,
    @Default([]) List<String> goalIds,
    @Default([]) List<String> tagIds,
  }) = _Entry;

  factory Entry.fromJson(Map<String, dynamic> json) => _$EntryFromJson(json);

  factory Entry.fromEntity(EntryEntity entity) => Entry(
    id: entity.id,
    date: entity.date,
    content: entity.content,
    audioPath: entity.audioPath,
    transcription: entity.transcription,
    mood: entity.mood,
    energy: entity.energy,
    focus: entity.focus,
    privacyLevel: PrivacyLevel.values.firstWhere(
      (e) => e.name == entity.privacyLevel,
      orElse: () => PrivacyLevel.normal,
    ),
    photos: entity.photos?.split('|||').where((s) => s.isNotEmpty).toList() ?? [],
    location: entity.location,
    entryType: entity.entryType,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  );

  EntriesCompanion toCompanion() => EntriesCompanion.insert(
    id: Value(id),
    date: date,
    content: Value(content),
    audioPath: Value(audioPath),
    transcription: Value(transcription),
    mood: Value(mood),
    energy: Value(energy),
    focus: Value(focus),
    privacyLevel: Value(privacyLevel.name),
    photos: Value(photos.join('|||')),
    location: Value(location),
    entryType: Value(entryType),
    createdAt: Value(createdAt),
    updatedAt: Value(updatedAt),
  );

  bool get isCheckIn => entryType.startsWith('checkin');
  bool get isMorningCheckIn => entryType == 'checkin_morning';
  bool get isNightCheckIn => entryType == 'checkin_night';
  bool get hasAudio => audioPath != null && audioPath!.isNotEmpty;
  bool get hasPhotos => photos.isNotEmpty;
}

/// Entry type constants
class EntryTypes {
  static const String journal = 'journal';
  static const String checkinMorning = 'checkin_morning';
  static const String checkinNight = 'checkin_night';
  static const String note = 'note';
  static const String practiceSession = 'practice_session';
  static const String weeklyReview = 'weekly_review';
}
