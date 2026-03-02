import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Life Copilot typography system
/// Based on DESIGN_SYSTEM.md Section 3
abstract final class AppTypography {
  // ============================================
  // FONT FAMILIES
  // ============================================
  
  /// Primary font family
  static const String fontFamily = 'Inter';
  
  /// Fallback fonts for primary
  static const List<String> fontFamilyFallback = [
    'SF Pro',
    'Roboto',
    'system-ui',
    '-apple-system',
    'sans-serif',
  ];
  
  /// Monospace font family (for code, counters, metrics)
  static const String monoFontFamily = 'JetBrainsMono';
  
  /// Fallback fonts for monospace
  static const List<String> monoFontFamilyFallback = [
    'SF Mono',
    'Consolas',
    'monospace',
  ];

  // ============================================
  // DISPLAY STYLES
  // ============================================
  
  /// Display Large - 36px, Bold
  /// Used for: Splash screens
  static TextStyle get displayLarge => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 36,
    fontWeight: FontWeight.w700,
    height: 44 / 36, // Line height
    letterSpacing: -0.5,
    color: AppColors.gray900,
  );
  
  /// Display Medium - 32px, Bold
  /// Used for: Main titles
  static TextStyle get displayMedium => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 40 / 32,
    letterSpacing: -0.5,
    color: AppColors.gray900,
  );

  // ============================================
  // HEADING STYLES
  // ============================================
  
  /// Heading 1 - 28px, SemiBold
  /// Used for: Screen titles
  static TextStyle get heading1 => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 28,
    fontWeight: FontWeight.w600,
    height: 36 / 28,
    letterSpacing: -0.25,
    color: AppColors.gray900,
  );
  
  /// Heading 2 - 24px, SemiBold
  /// Used for: Main sections
  static TextStyle get heading2 => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 32 / 24,
    letterSpacing: -0.25,
    color: AppColors.gray900,
  );
  
  /// Heading 3 - 20px, SemiBold
  /// Used for: Subsections
  static TextStyle get heading3 => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 28 / 20,
    letterSpacing: 0,
    color: AppColors.gray900,
  );
  
  /// Heading 4 - 18px, SemiBold
  /// Used for: Cards, elements
  static TextStyle get heading4 => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 24 / 18,
    letterSpacing: 0,
    color: AppColors.gray900,
  );

  // ============================================
  // BODY STYLES
  // ============================================
  
  /// Body Large - 17px, Regular
  /// Used for: Main text (iOS style)
  static TextStyle get bodyLarge => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 17,
    fontWeight: FontWeight.w400,
    height: 26 / 17,
    letterSpacing: 0,
    color: AppColors.gray700,
  );
  
  /// Body - 16px, Regular
  /// Used for: General body text
  static TextStyle get body => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 24 / 16,
    letterSpacing: 0,
    color: AppColors.gray700,
  );
  
  /// Body Small - 14px, Regular
  /// Used for: Secondary text
  static TextStyle get bodySmall => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 20 / 14,
    letterSpacing: 0,
    color: AppColors.gray600,
  );

  // ============================================
  // UTILITY STYLES
  // ============================================
  
  /// Caption - 12px, Regular
  /// Used for: Labels, timestamps
  static TextStyle get caption => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 16 / 12,
    letterSpacing: 0.25,
    color: AppColors.gray500,
  );
  
  /// Overline - 11px, Medium
  /// Used for: Categories, tags
  static TextStyle get overline => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 11,
    fontWeight: FontWeight.w500,
    height: 16 / 11,
    letterSpacing: 0.5,
    color: AppColors.gray500,
  );
  
  /// Button - 15px, SemiBold
  /// Used for: Button text
  static TextStyle get button => const TextStyle(
    fontFamily: fontFamily,
    fontFamilyFallback: fontFamilyFallback,
    fontSize: 15,
    fontWeight: FontWeight.w600,
    height: 20 / 15,
    letterSpacing: 0.25,
    color: AppColors.white,
  );

  // ============================================
  // MONOSPACE STYLES
  // ============================================
  
  /// Monospace body - for metrics and counters
  static TextStyle get mono => const TextStyle(
    fontFamily: monoFontFamily,
    fontFamilyFallback: monoFontFamilyFallback,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 20 / 14,
    letterSpacing: 0,
    color: AppColors.gray700,
  );

  // ============================================
  // DARK MODE VARIANTS
  // ============================================
  
  /// Apply dark mode colors to a text style
  static TextStyle darkMode(TextStyle style) {
    final color = style.color;
    if (color == AppColors.gray900 || color == AppColors.gray800) {
      return style.copyWith(color: AppColors.darkTextPrimary);
    }
    if (color == AppColors.gray700 || color == AppColors.gray600) {
      return style.copyWith(color: AppColors.gray300);
    }
    if (color == AppColors.gray500) {
      return style.copyWith(color: AppColors.darkTextSecondary);
    }
    return style;
  }

  // ============================================
  // TEXT THEME FOR MATERIAL
  // ============================================
  
  /// Get TextTheme for Material Design
  static TextTheme get textTheme => TextTheme(
    displayLarge: displayLarge,
    displayMedium: displayMedium,
    displaySmall: heading1,
    headlineLarge: heading1,
    headlineMedium: heading2,
    headlineSmall: heading3,
    titleLarge: heading3,
    titleMedium: heading4,
    titleSmall: bodyLarge.copyWith(fontWeight: FontWeight.w600),
    bodyLarge: bodyLarge,
    bodyMedium: body,
    bodySmall: bodySmall,
    labelLarge: button,
    labelMedium: caption,
    labelSmall: overline,
  );
  
  /// Get dark mode TextTheme
  static TextTheme get darkTextTheme => TextTheme(
    displayLarge: darkMode(displayLarge),
    displayMedium: darkMode(displayMedium),
    displaySmall: darkMode(heading1),
    headlineLarge: darkMode(heading1),
    headlineMedium: darkMode(heading2),
    headlineSmall: darkMode(heading3),
    titleLarge: darkMode(heading3),
    titleMedium: darkMode(heading4),
    titleSmall: darkMode(bodyLarge.copyWith(fontWeight: FontWeight.w600)),
    bodyLarge: darkMode(bodyLarge),
    bodyMedium: darkMode(body),
    bodySmall: darkMode(bodySmall),
    labelLarge: darkMode(button),
    labelMedium: darkMode(caption),
    labelSmall: darkMode(overline),
  );
}
