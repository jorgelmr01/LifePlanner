import 'package:freezed_annotation/freezed_annotation.dart';
import '../database/app_database.dart';

part 'area.freezed.dart';
part 'area.g.dart';

/// Area model - represents a dimension of life
@freezed
class Area with _$Area {
  const Area._();

  const factory Area({
    required String id,
    required String name,
    String? icon,
    @Default(true) bool visible,
    @Default(0) int order,
    String? color,
    @Default([]) List<String> journalPrompts,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Area;

  factory Area.fromJson(Map<String, dynamic> json) => _$AreaFromJson(json);

  factory Area.fromEntity(AreaEntity entity) => Area(
    id: entity.id,
    name: entity.name,
    icon: entity.icon,
    visible: entity.visible,
    order: entity.order,
    color: entity.color,
    journalPrompts: entity.journalPrompts != null 
      ? (List<String>.from(
          (entity.journalPrompts as String).isNotEmpty 
            ? (entity.journalPrompts as String).split('|||') 
            : []
        ))
      : [],
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  );

  AreasCompanion toCompanion() => AreasCompanion.insert(
    id: Value(id),
    name: name,
    icon: Value(icon),
    visible: Value(visible),
    order: Value(order),
    color: Value(color),
    journalPrompts: Value(journalPrompts.join('|||')),
    createdAt: Value(createdAt),
    updatedAt: Value(updatedAt),
  );
}

/// Default areas available in the app
class DefaultAreas {
  static const List<Map<String, dynamic>> areas = [
    {'name': 'Salud', 'icon': '💪', 'color': '#22C55E'},
    {'name': 'Trabajo', 'icon': '💼', 'color': '#3B82F6'},
    {'name': 'Relaciones', 'icon': '👥', 'color': '#EC4899'},
    {'name': 'Finanzas', 'icon': '💰', 'color': '#EAB308'},
    {'name': 'Fe / Espiritualidad', 'icon': '🙏', 'color': '#A855F7'},
    {'name': 'Aprendizaje', 'icon': '📚', 'color': '#6366F1'},
    {'name': 'Creatividad', 'icon': '🎨', 'color': '#F97316'},
    {'name': 'Servicio', 'icon': '🤝', 'color': '#14B8A6'},
    {'name': 'Pareja', 'icon': '❤️', 'color': '#EF4444'},
  ];

  static List<Area> getDefaults() {
    final now = DateTime.now();
    return areas.asMap().entries.map((entry) {
      return Area(
        id: 'default_${entry.key}',
        name: entry.value['name'] as String,
        icon: entry.value['icon'] as String,
        color: entry.value['color'] as String,
        order: entry.key,
        createdAt: now,
        updatedAt: now,
      );
    }).toList();
  }
}
