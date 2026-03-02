import 'package:flutter/material.dart';

/// Life Copilot animation system
/// Based on DESIGN_SYSTEM.md Section 8
abstract final class AppAnimations {
  // ============================================
  // EASING CURVES
  // ============================================
  
  /// Default easing - standard transitions
  static const Curve easeDefault = Curves.easeInOut;
  
  /// Ease in - elements exiting
  static const Curve easeIn = Curves.easeIn;
  
  /// Ease out - elements entering
  static const Curve easeOut = Curves.easeOut;
  
  /// Bounce - subtle celebrations
  static const Curve easeBounce = Curves.elasticOut;
  
  /// Fast out slow in - Material standard
  static const Curve fastOutSlowIn = Curves.fastOutSlowIn;

  // ============================================
  // DURATIONS
  // ============================================
  
  /// Instant - 0ms (immediate changes)
  static const Duration instant = Duration.zero;
  
  /// Fast - 100ms (hovers, micro-interactions)
  static const Duration fast = Duration(milliseconds: 100);
  
  /// Normal - 200ms (standard transitions)
  static const Duration normal = Duration(milliseconds: 200);
  
  /// Slow - 300ms (modals, sheets)
  static const Duration slow = Duration(milliseconds: 300);
  
  /// Slower - 400ms (complex animations)
  static const Duration slower = Duration(milliseconds: 400);

  // ============================================
  // SEMANTIC DURATIONS
  // ============================================
  
  /// Button press feedback
  static const Duration buttonPress = fast;
  
  /// Tab change transition
  static const Duration tabChange = normal;
  
  /// Page transition
  static const Duration pageTransition = slow;
  
  /// Modal opening
  static const Duration modalOpen = slow;
  
  /// FAB expansion
  static const Duration fabExpand = normal;
  
  /// Slider feedback
  static const Duration sliderFeedback = fast;
  
  /// Check animation
  static const Duration checkAnimation = normal;
  
  /// Celebration animation
  static const Duration celebration = slower;

  // ============================================
  // ANIMATION PRESETS
  // ============================================
  
  /// Fade in animation preset
  static const fadeIn = _AnimationPreset(
    duration: normal,
    curve: easeOut,
  );
  
  /// Slide up animation preset (modals)
  static const slideUp = _AnimationPreset(
    duration: slow,
    curve: easeOut,
  );
  
  /// Scale in animation preset (FAB menu)
  static const scaleIn = _AnimationPreset(
    duration: normal,
    curve: easeOut,
  );
  
  /// Pulse animation preset (recording)
  static const pulse = _AnimationPreset(
    duration: slower,
    curve: easeDefault,
  );

  // ============================================
  // PAGE TRANSITIONS
  // ============================================
  
  /// Standard page transition
  static PageRouteBuilder<T> pageTransitionBuilder<T>({
    required Widget page,
    RouteSettings? settings,
  }) {
    return PageRouteBuilder<T>(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: animation.drive(
            Tween(begin: 0.0, end: 1.0).chain(
              CurveTween(curve: easeOut),
            ),
          ),
          child: child,
        );
      },
      transitionDuration: pageTransition,
    );
  }
  
  /// Slide up transition (for modals/sheets)
  static PageRouteBuilder<T> slideUpTransitionBuilder<T>({
    required Widget page,
    RouteSettings? settings,
  }) {
    return PageRouteBuilder<T>(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return SlideTransition(
          position: animation.drive(
            Tween(
              begin: const Offset(0, 1),
              end: Offset.zero,
            ).chain(CurveTween(curve: easeOut)),
          ),
          child: child,
        );
      },
      transitionDuration: modalOpen,
    );
  }
}

/// Animation preset helper class
class _AnimationPreset {
  final Duration duration;
  final Curve curve;
  
  const _AnimationPreset({
    required this.duration,
    required this.curve,
  });
}

/// Extension for easier animation building
extension AnimationPresetExtension on _AnimationPreset {
  /// Create an AnimationController preset
  AnimationController createController(TickerProvider vsync) {
    return AnimationController(
      vsync: vsync,
      duration: duration,
    );
  }
  
  /// Create a curved animation
  CurvedAnimation createCurvedAnimation(Animation<double> parent) {
    return CurvedAnimation(
      parent: parent,
      curve: curve,
    );
  }
}
