import 'package:flutter/material.dart';

/// Life Copilot shadow/elevation system
/// Based on DESIGN_SYSTEM.md Section 6
abstract final class AppShadows {
  // ============================================
  // SHADOW DEFINITIONS
  // ============================================
  
  /// No shadow
  static const List<BoxShadow> none = [];
  
  /// Small shadow - subtle elements
  static const List<BoxShadow> sm = [
    BoxShadow(
      color: Color(0x0D000000), // rgba(0,0,0,0.05)
      offset: Offset(0, 1),
      blurRadius: 2,
    ),
  ];
  
  /// Medium shadow - standard cards
  static const List<BoxShadow> md = [
    BoxShadow(
      color: Color(0x12000000), // rgba(0,0,0,0.07)
      offset: Offset(0, 4),
      blurRadius: 6,
    ),
    BoxShadow(
      color: Color(0x0F000000), // rgba(0,0,0,0.06)
      offset: Offset(0, 2),
      blurRadius: 4,
    ),
  ];
  
  /// Large shadow - elevated cards, modals
  static const List<BoxShadow> lg = [
    BoxShadow(
      color: Color(0x1A000000), // rgba(0,0,0,0.1)
      offset: Offset(0, 10),
      blurRadius: 15,
    ),
    BoxShadow(
      color: Color(0x0D000000), // rgba(0,0,0,0.05)
      offset: Offset(0, 4),
      blurRadius: 6,
    ),
  ];
  
  /// Extra large shadow - bottom sheets, popovers
  static const List<BoxShadow> xl = [
    BoxShadow(
      color: Color(0x26000000), // rgba(0,0,0,0.15)
      offset: Offset(0, 20),
      blurRadius: 25,
    ),
    BoxShadow(
      color: Color(0x0A000000), // rgba(0,0,0,0.04)
      offset: Offset(0, 10),
      blurRadius: 10,
    ),
  ];

  // ============================================
  // SEMANTIC SHADOWS
  // ============================================
  
  /// Card shadow
  static List<BoxShadow> get card => md;
  
  /// Elevated card shadow
  static List<BoxShadow> get cardElevated => lg;
  
  /// FAB shadow
  static List<BoxShadow> get fab => lg;
  
  /// Bottom sheet shadow
  static List<BoxShadow> get sheet => xl;
  
  /// Dropdown/popup shadow
  static List<BoxShadow> get popup => lg;
  
  /// Button pressed shadow (reduced)
  static List<BoxShadow> get buttonPressed => sm;

  // ============================================
  // ELEVATION HELPERS (for Material widgets)
  // ============================================
  
  /// No elevation
  static const double elevationNone = 0;
  
  /// Small elevation
  static const double elevationSm = 1;
  
  /// Medium elevation
  static const double elevationMd = 4;
  
  /// Large elevation
  static const double elevationLg = 8;
  
  /// Extra large elevation
  static const double elevationXl = 16;
}
