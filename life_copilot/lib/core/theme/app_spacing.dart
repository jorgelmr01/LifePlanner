import 'package:flutter/material.dart';

/// Life Copilot spacing system
/// Based on DESIGN_SYSTEM.md Section 4
abstract final class AppSpacing {
  // ============================================
  // BASE SPACING SCALE
  // ============================================
  
  /// 0px - Reset
  static const double space0 = 0;
  
  /// 4px - Micro spacing (icon/text gaps)
  static const double space1 = 4;
  
  /// 8px - Small internal padding
  static const double space2 = 8;
  
  /// 12px - Compact component spacing
  static const double space3 = 12;
  
  /// 16px - Standard padding
  static const double space4 = 16;
  
  /// 20px - Card padding
  static const double space5 = 20;
  
  /// 24px - Section margin
  static const double space6 = 24;
  
  /// 32px - Group margin
  static const double space8 = 32;
  
  /// 40px - Screen spacing
  static const double space10 = 40;
  
  /// 48px - Large spacing
  static const double space12 = 48;
  
  /// 64px - Extra large spacing
  static const double space16 = 64;

  // ============================================
  // SEMANTIC SPACING
  // ============================================
  
  /// Screen horizontal padding (16px)
  static const double screenPaddingH = space4;
  
  /// Screen top padding (below header)
  static const double screenPaddingTop = space4;
  
  /// Screen bottom padding (above tab bar)
  static const double screenPaddingBottom = 100;
  
  /// Section gap (24px)
  static const double sectionGap = space6;
  
  /// Title to content gap (12px)
  static const double titleToContent = space3;
  
  /// Card internal padding (16px)
  static const double cardPadding = space4;
  
  /// Card margin / gap between cards (12px)
  static const double cardGap = space3;
  
  /// List item vertical padding (12px)
  static const double listItemPaddingV = space3;
  
  /// List item horizontal padding (16px)
  static const double listItemPaddingH = space4;
  
  /// Form label to input gap (8px)
  static const double labelToInput = space2;
  
  /// Form fields gap (16px)
  static const double formFieldGap = space4;
  
  /// Error text gap from input (4px)
  static const double errorTextGap = space1;

  // ============================================
  // EDGE INSETS HELPERS
  // ============================================
  
  /// No padding
  static const EdgeInsets none = EdgeInsets.zero;
  
  /// Screen padding (horizontal + top, large bottom)
  static const EdgeInsets screenPadding = EdgeInsets.fromLTRB(
    screenPaddingH,
    screenPaddingTop,
    screenPaddingH,
    screenPaddingBottom,
  );
  
  /// Screen padding without bottom (for scrollable content)
  static const EdgeInsets screenPaddingNoBottom = EdgeInsets.fromLTRB(
    screenPaddingH,
    screenPaddingTop,
    screenPaddingH,
    space4,
  );
  
  /// Card padding (all sides)
  static const EdgeInsets cardInsets = EdgeInsets.all(cardPadding);
  
  /// List item padding
  static const EdgeInsets listItemInsets = EdgeInsets.symmetric(
    horizontal: listItemPaddingH,
    vertical: listItemPaddingV,
  );
  
  /// Horizontal padding only (16px)
  static const EdgeInsets horizontalInsets = EdgeInsets.symmetric(
    horizontal: space4,
  );
  
  /// Small padding all around (8px)
  static const EdgeInsets smallInsets = EdgeInsets.all(space2);
  
  /// Medium padding all around (16px)
  static const EdgeInsets mediumInsets = EdgeInsets.all(space4);
  
  /// Large padding all around (24px)
  static const EdgeInsets largeInsets = EdgeInsets.all(space6);

  // ============================================
  // SIZED BOX HELPERS
  // ============================================
  
  /// Horizontal spacer 4px
  static const SizedBox h1 = SizedBox(width: space1);
  
  /// Horizontal spacer 8px
  static const SizedBox h2 = SizedBox(width: space2);
  
  /// Horizontal spacer 12px
  static const SizedBox h3 = SizedBox(width: space3);
  
  /// Horizontal spacer 16px
  static const SizedBox h4 = SizedBox(width: space4);
  
  /// Horizontal spacer 24px
  static const SizedBox h6 = SizedBox(width: space6);
  
  /// Vertical spacer 4px
  static const SizedBox v1 = SizedBox(height: space1);
  
  /// Vertical spacer 8px
  static const SizedBox v2 = SizedBox(height: space2);
  
  /// Vertical spacer 12px
  static const SizedBox v3 = SizedBox(height: space3);
  
  /// Vertical spacer 16px
  static const SizedBox v4 = SizedBox(height: space4);
  
  /// Vertical spacer 20px
  static const SizedBox v5 = SizedBox(height: space5);
  
  /// Vertical spacer 24px
  static const SizedBox v6 = SizedBox(height: space6);
  
  /// Vertical spacer 32px
  static const SizedBox v8 = SizedBox(height: space8);
  
  /// Vertical spacer 48px
  static const SizedBox v12 = SizedBox(height: space12);
}
