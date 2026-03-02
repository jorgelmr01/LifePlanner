import 'package:flutter/material.dart';

/// Life Copilot border radius system
/// Based on DESIGN_SYSTEM.md Section 5
abstract final class AppRadius {
  // ============================================
  // BASE RADIUS VALUES
  // ============================================
  
  /// No radius
  static const double none = 0;
  
  /// 4px - Small radius (badges, small chips)
  static const double sm = 4;
  
  /// 8px - Medium radius (inputs, small buttons)
  static const double md = 8;
  
  /// 12px - Large radius (cards, main buttons)
  static const double lg = 12;
  
  /// 16px - Extra large radius (modals, sheets)
  static const double xl = 16;
  
  /// 24px - 2XL radius (FAB, highlighted elements)
  static const double xxl = 24;
  
  /// Full radius (pills, avatars)
  static const double full = 9999;

  // ============================================
  // BORDER RADIUS HELPERS
  // ============================================
  
  /// No border radius
  static const BorderRadius noneRadius = BorderRadius.zero;
  
  /// Small border radius (4px)
  static BorderRadius get smRadius => BorderRadius.circular(sm);
  
  /// Medium border radius (8px)
  static BorderRadius get mdRadius => BorderRadius.circular(md);
  
  /// Large border radius (12px)
  static BorderRadius get lgRadius => BorderRadius.circular(lg);
  
  /// Extra large border radius (16px)
  static BorderRadius get xlRadius => BorderRadius.circular(xl);
  
  /// 2XL border radius (24px)
  static BorderRadius get xxlRadius => BorderRadius.circular(xxl);
  
  /// Full/circular border radius
  static BorderRadius get fullRadius => BorderRadius.circular(full);

  // ============================================
  // SPECIFIC USE CASES
  // ============================================
  
  /// Card radius
  static BorderRadius get card => lgRadius;
  
  /// Button radius
  static BorderRadius get button => lgRadius;
  
  /// Input field radius
  static BorderRadius get input => mdRadius;
  
  /// Modal/bottom sheet radius (top only)
  static BorderRadius get sheet => const BorderRadius.vertical(
    top: Radius.circular(xl),
  );
  
  /// Chip/badge radius
  static BorderRadius get chip => smRadius;
  
  /// Avatar radius (circular)
  static BorderRadius get avatar => fullRadius;
  
  /// FAB radius
  static BorderRadius get fab => xxlRadius;
}
