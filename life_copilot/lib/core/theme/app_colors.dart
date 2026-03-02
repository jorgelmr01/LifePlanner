import 'package:flutter/material.dart';

/// Life Copilot color system
/// Based on DESIGN_SYSTEM.md Section 2
abstract final class AppColors {
  // ============================================
  // PRIMARY COLORS
  // ============================================
  
  /// Primary brand color - used for main actions and interactive elements
  static const Color primary = Color(0xFF6366F1);
  
  /// Lighter variant for hover states and soft backgrounds
  static const Color primaryLight = Color(0xFF818CF8);
  
  /// Darker variant for pressed states and accents
  static const Color primaryDark = Color(0xFF4F46E5);
  
  /// Very light primary tint for surfaces
  static const Color primarySurface = Color(0xFFEEF2FF);

  // ============================================
  // SECONDARY COLORS
  // ============================================
  
  /// Secondary color - used for success states and progress
  static const Color secondary = Color(0xFF14B8A6);
  
  /// Lighter variant for badges and positive indicators
  static const Color secondaryLight = Color(0xFF5EEAD4);
  
  /// Darker variant for secondary accents
  static const Color secondaryDark = Color(0xFF0F766E);
  
  /// Very light secondary tint for positive state backgrounds
  static const Color secondarySurface = Color(0xFFF0FDFA);

  // ============================================
  // NEUTRAL / GRAY SCALE
  // ============================================
  
  /// Lightest gray - page backgrounds
  static const Color gray50 = Color(0xFFF9FAFB);
  
  /// Card backgrounds
  static const Color gray100 = Color(0xFFF3F4F6);
  
  /// Borders, dividers
  static const Color gray200 = Color(0xFFE5E7EB);
  
  /// Border hover, inactive icons
  static const Color gray300 = Color(0xFFD1D5DB);
  
  /// Placeholder text
  static const Color gray400 = Color(0xFF9CA3AF);
  
  /// Secondary text
  static const Color gray500 = Color(0xFF6B7280);
  
  /// Body text
  static const Color gray600 = Color(0xFF4B5563);
  
  /// Heading text
  static const Color gray700 = Color(0xFF374151);
  
  /// Primary text
  static const Color gray800 = Color(0xFF1F2937);
  
  /// Highest emphasis text
  static const Color gray900 = Color(0xFF111827);

  // ============================================
  // SEMANTIC COLORS
  // ============================================
  
  /// Success state - completed, success
  static const Color success = Color(0xFF10B981);
  
  /// Success background
  static const Color successLight = Color(0xFFD1FAE5);
  
  /// Warning state - attention needed
  static const Color warning = Color(0xFFF59E0B);
  
  /// Warning background
  static const Color warningLight = Color(0xFFFEF3C7);
  
  /// Error state - errors, destructive actions
  static const Color error = Color(0xFFEF4444);
  
  /// Error background
  static const Color errorLight = Color(0xFFFEE2E2);
  
  /// Info state - information, tooltips
  static const Color info = Color(0xFF3B82F6);
  
  /// Info background
  static const Color infoLight = Color(0xFFDBEAFE);

  // ============================================
  // AREA HEALTH INDICATORS
  // Note: No red used to avoid anxiety
  // ============================================
  
  /// High attention - area with recent activity
  static const Color areaHigh = Color(0xFF22C55E);
  
  /// Medium attention - some activity
  static const Color areaMedium = Color(0xFFEAB308);
  
  /// Low attention - needs attention (NOT red)
  static const Color areaLow = Color(0xFFF97316);

  // ============================================
  // MOOD COLORS
  // ============================================
  
  /// Mood level 1 - lowest
  static const Color mood1 = Color(0xFFF87171);
  
  /// Mood level 2
  static const Color mood2 = Color(0xFFFB923C);
  
  /// Mood level 3 - neutral
  static const Color mood3 = Color(0xFFFBBF24);
  
  /// Mood level 4
  static const Color mood4 = Color(0xFF4ADE80);
  
  /// Mood level 5 - highest
  static const Color mood5 = Color(0xFF22C55E);
  
  /// Get mood color by level (1-5)
  static Color getMoodColor(int level) {
    return switch (level) {
      1 => mood1,
      2 => mood2,
      3 => mood3,
      4 => mood4,
      5 => mood5,
      _ => mood3,
    };
  }

  // ============================================
  // PREDEFINED AREA COLORS
  // ============================================
  
  /// Health area color
  static const Color areaSalud = Color(0xFF22C55E);
  
  /// Work area color
  static const Color areaTrabajo = Color(0xFF3B82F6);
  
  /// Relationships area color
  static const Color areaRelaciones = Color(0xFFEC4899);
  
  /// Finances area color
  static const Color areaFinanzas = Color(0xFFEAB308);
  
  /// Faith/Spirituality area color
  static const Color areaFe = Color(0xFFA855F7);
  
  /// Learning area color
  static const Color areaAprendizaje = Color(0xFF6366F1);
  
  /// Creativity area color
  static const Color areaCreatividad = Color(0xFFF97316);
  
  /// Service area color
  static const Color areaServicio = Color(0xFF14B8A6);
  
  /// Partner/Couple area color
  static const Color areaPareja = Color(0xFFEF4444);

  // ============================================
  // DARK MODE COLORS
  // ============================================
  
  /// Dark mode background
  static const Color darkBackground = Color(0xFF111827);
  
  /// Dark mode surface (elevated)
  static const Color darkSurface = Color(0xFF1F2937);
  
  /// Dark mode card
  static const Color darkCard = Color(0xFF374151);
  
  /// Dark mode border
  static const Color darkBorder = Color(0xFF4B5563);
  
  /// Dark mode primary text
  static const Color darkTextPrimary = Color(0xFFF9FAFB);
  
  /// Dark mode secondary text
  static const Color darkTextSecondary = Color(0xFF9CA3AF);

  // ============================================
  // UTILITY
  // ============================================
  
  /// Transparent color
  static const Color transparent = Colors.transparent;
  
  /// White
  static const Color white = Colors.white;
  
  /// Black
  static const Color black = Colors.black;
  
  /// Overlay color for modals/dialogs
  static Color get overlay => black.withOpacity(0.5);
  
  /// Scrim color for bottom sheets
  static Color get scrim => black.withOpacity(0.3);
}
