import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_colors.dart';
import 'app_typography.dart';
import 'app_radius.dart';
import 'app_spacing.dart';

/// Life Copilot theme configuration
/// Combines all design system elements into Material ThemeData
abstract final class AppTheme {
  // ============================================
  // LIGHT THEME
  // ============================================
  
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    
    // Colors
    colorScheme: _lightColorScheme,
    scaffoldBackgroundColor: AppColors.gray50,
    canvasColor: AppColors.white,
    cardColor: AppColors.white,
    dividerColor: AppColors.gray200,
    
    // Typography
    textTheme: AppTypography.textTheme,
    fontFamily: AppTypography.fontFamily,
    
    // AppBar
    appBarTheme: _lightAppBarTheme,
    
    // Bottom Navigation
    bottomNavigationBarTheme: _lightBottomNavTheme,
    
    // Cards
    cardTheme: _cardTheme,
    
    // Buttons
    elevatedButtonTheme: _elevatedButtonTheme,
    outlinedButtonTheme: _outlinedButtonTheme,
    textButtonTheme: _textButtonTheme,
    iconButtonTheme: _iconButtonTheme,
    floatingActionButtonTheme: _fabTheme,
    
    // Inputs
    inputDecorationTheme: _inputDecorationTheme,
    
    // Chips
    chipTheme: _chipTheme,
    
    // Dialogs & Sheets
    dialogTheme: _dialogTheme,
    bottomSheetTheme: _bottomSheetTheme,
    
    // Lists
    listTileTheme: _listTileTheme,
    
    // Checkbox & Switch
    checkboxTheme: _checkboxTheme,
    switchTheme: _switchTheme,
    
    // Slider
    sliderTheme: _sliderTheme,
    
    // Tab Bar
    tabBarTheme: _tabBarTheme,
    
    // Snackbar
    snackBarTheme: _snackBarTheme,
    
    // Progress Indicators
    progressIndicatorTheme: _progressIndicatorTheme,
    
    // Splash
    splashColor: AppColors.primary.withOpacity(0.1),
    highlightColor: AppColors.primary.withOpacity(0.05),
  );

  // ============================================
  // DARK THEME
  // ============================================
  
  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    
    // Colors
    colorScheme: _darkColorScheme,
    scaffoldBackgroundColor: AppColors.darkBackground,
    canvasColor: AppColors.darkSurface,
    cardColor: AppColors.darkCard,
    dividerColor: AppColors.darkBorder,
    
    // Typography
    textTheme: AppTypography.darkTextTheme,
    fontFamily: AppTypography.fontFamily,
    
    // AppBar
    appBarTheme: _darkAppBarTheme,
    
    // Bottom Navigation
    bottomNavigationBarTheme: _darkBottomNavTheme,
    
    // Cards
    cardTheme: _darkCardTheme,
    
    // Buttons
    elevatedButtonTheme: _elevatedButtonTheme,
    outlinedButtonTheme: _darkOutlinedButtonTheme,
    textButtonTheme: _textButtonTheme,
    iconButtonTheme: _darkIconButtonTheme,
    floatingActionButtonTheme: _fabTheme,
    
    // Inputs
    inputDecorationTheme: _darkInputDecorationTheme,
    
    // Chips
    chipTheme: _darkChipTheme,
    
    // Dialogs & Sheets
    dialogTheme: _darkDialogTheme,
    bottomSheetTheme: _darkBottomSheetTheme,
    
    // Lists
    listTileTheme: _darkListTileTheme,
    
    // Checkbox & Switch
    checkboxTheme: _checkboxTheme,
    switchTheme: _switchTheme,
    
    // Slider
    sliderTheme: _sliderTheme,
    
    // Tab Bar
    tabBarTheme: _darkTabBarTheme,
    
    // Snackbar
    snackBarTheme: _darkSnackBarTheme,
    
    // Progress Indicators
    progressIndicatorTheme: _progressIndicatorTheme,
    
    // Splash
    splashColor: AppColors.primary.withOpacity(0.2),
    highlightColor: AppColors.primary.withOpacity(0.1),
  );

  // ============================================
  // COLOR SCHEMES
  // ============================================
  
  static ColorScheme get _lightColorScheme => ColorScheme.light(
    primary: AppColors.primary,
    onPrimary: AppColors.white,
    primaryContainer: AppColors.primarySurface,
    onPrimaryContainer: AppColors.primaryDark,
    secondary: AppColors.secondary,
    onSecondary: AppColors.white,
    secondaryContainer: AppColors.secondarySurface,
    onSecondaryContainer: AppColors.secondaryDark,
    surface: AppColors.white,
    onSurface: AppColors.gray900,
    surfaceContainerHighest: AppColors.gray100,
    onSurfaceVariant: AppColors.gray600,
    error: AppColors.error,
    onError: AppColors.white,
    errorContainer: AppColors.errorLight,
    onErrorContainer: AppColors.error,
    outline: AppColors.gray300,
    outlineVariant: AppColors.gray200,
  );
  
  static ColorScheme get _darkColorScheme => ColorScheme.dark(
    primary: AppColors.primary,
    onPrimary: AppColors.white,
    primaryContainer: AppColors.primaryDark,
    onPrimaryContainer: AppColors.primaryLight,
    secondary: AppColors.secondary,
    onSecondary: AppColors.white,
    secondaryContainer: AppColors.secondaryDark,
    onSecondaryContainer: AppColors.secondaryLight,
    surface: AppColors.darkSurface,
    onSurface: AppColors.darkTextPrimary,
    surfaceContainerHighest: AppColors.darkCard,
    onSurfaceVariant: AppColors.gray400,
    error: AppColors.error,
    onError: AppColors.white,
    errorContainer: AppColors.error.withOpacity(0.3),
    onErrorContainer: AppColors.errorLight,
    outline: AppColors.gray600,
    outlineVariant: AppColors.darkBorder,
  );

  // ============================================
  // APP BAR THEMES
  // ============================================
  
  static AppBarTheme get _lightAppBarTheme => AppBarTheme(
    backgroundColor: AppColors.white,
    foregroundColor: AppColors.gray900,
    elevation: 0,
    scrolledUnderElevation: 1,
    centerTitle: true,
    titleTextStyle: AppTypography.heading4,
    systemOverlayStyle: SystemUiOverlayStyle.dark,
    iconTheme: const IconThemeData(
      color: AppColors.gray700,
      size: 24,
    ),
  );
  
  static AppBarTheme get _darkAppBarTheme => AppBarTheme(
    backgroundColor: AppColors.darkSurface,
    foregroundColor: AppColors.darkTextPrimary,
    elevation: 0,
    scrolledUnderElevation: 1,
    centerTitle: true,
    titleTextStyle: AppTypography.darkMode(AppTypography.heading4),
    systemOverlayStyle: SystemUiOverlayStyle.light,
    iconTheme: const IconThemeData(
      color: AppColors.gray300,
      size: 24,
    ),
  );

  // ============================================
  // BOTTOM NAVIGATION THEMES
  // ============================================
  
  static BottomNavigationBarThemeData get _lightBottomNavTheme =>
      BottomNavigationBarThemeData(
    backgroundColor: AppColors.white,
    selectedItemColor: AppColors.primary,
    unselectedItemColor: AppColors.gray400,
    type: BottomNavigationBarType.fixed,
    elevation: 8,
    selectedLabelStyle: AppTypography.caption.copyWith(
      fontWeight: FontWeight.w600,
    ),
    unselectedLabelStyle: AppTypography.caption,
  );
  
  static BottomNavigationBarThemeData get _darkBottomNavTheme =>
      BottomNavigationBarThemeData(
    backgroundColor: AppColors.darkSurface,
    selectedItemColor: AppColors.primary,
    unselectedItemColor: AppColors.gray500,
    type: BottomNavigationBarType.fixed,
    elevation: 8,
    selectedLabelStyle: AppTypography.caption.copyWith(
      fontWeight: FontWeight.w600,
      color: AppColors.primary,
    ),
    unselectedLabelStyle: AppTypography.caption.copyWith(
      color: AppColors.gray500,
    ),
  );

  // ============================================
  // CARD THEMES
  // ============================================
  
  static CardTheme get _cardTheme => CardTheme(
    color: AppColors.white,
    elevation: 0,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.card,
      side: const BorderSide(color: AppColors.gray200),
    ),
    margin: const EdgeInsets.symmetric(vertical: AppSpacing.space2),
  );
  
  static CardTheme get _darkCardTheme => CardTheme(
    color: AppColors.darkCard,
    elevation: 0,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.card,
      side: const BorderSide(color: AppColors.darkBorder),
    ),
    margin: const EdgeInsets.symmetric(vertical: AppSpacing.space2),
  );

  // ============================================
  // BUTTON THEMES
  // ============================================
  
  static ElevatedButtonThemeData get _elevatedButtonTheme =>
      ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.white,
      elevation: 0,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space5,
        vertical: AppSpacing.space3,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.button,
      ),
      textStyle: AppTypography.button,
      minimumSize: const Size(0, 48),
    ),
  );
  
  static OutlinedButtonThemeData get _outlinedButtonTheme =>
      OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: AppColors.primary,
      side: const BorderSide(color: AppColors.primary),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space5,
        vertical: AppSpacing.space3,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.button,
      ),
      textStyle: AppTypography.button.copyWith(color: AppColors.primary),
      minimumSize: const Size(0, 48),
    ),
  );
  
  static OutlinedButtonThemeData get _darkOutlinedButtonTheme =>
      OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: AppColors.primaryLight,
      side: const BorderSide(color: AppColors.primaryLight),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space5,
        vertical: AppSpacing.space3,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.button,
      ),
      textStyle: AppTypography.button.copyWith(color: AppColors.primaryLight),
      minimumSize: const Size(0, 48),
    ),
  );
  
  static TextButtonThemeData get _textButtonTheme => TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: AppColors.primary,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space4,
        vertical: AppSpacing.space2,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.button,
      ),
      textStyle: AppTypography.button.copyWith(color: AppColors.primary),
    ),
  );
  
  static IconButtonThemeData get _iconButtonTheme => IconButtonThemeData(
    style: IconButton.styleFrom(
      foregroundColor: AppColors.gray700,
    ),
  );
  
  static IconButtonThemeData get _darkIconButtonTheme => IconButtonThemeData(
    style: IconButton.styleFrom(
      foregroundColor: AppColors.gray300,
    ),
  );
  
  static FloatingActionButtonThemeData get _fabTheme =>
      FloatingActionButtonThemeData(
    backgroundColor: AppColors.primary,
    foregroundColor: AppColors.white,
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.fab,
    ),
  );

  // ============================================
  // INPUT THEMES
  // ============================================
  
  static InputDecorationTheme get _inputDecorationTheme => InputDecorationTheme(
    filled: true,
    fillColor: AppColors.gray50,
    contentPadding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.space4,
      vertical: AppSpacing.space3,
    ),
    border: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.gray200),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.gray200),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.primary, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.error),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.error, width: 2),
    ),
    hintStyle: AppTypography.body.copyWith(color: AppColors.gray400),
    labelStyle: AppTypography.bodySmall.copyWith(color: AppColors.gray600),
    errorStyle: AppTypography.caption.copyWith(color: AppColors.error),
  );
  
  static InputDecorationTheme get _darkInputDecorationTheme =>
      InputDecorationTheme(
    filled: true,
    fillColor: AppColors.darkCard,
    contentPadding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.space4,
      vertical: AppSpacing.space3,
    ),
    border: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.darkBorder),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.darkBorder),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.primary, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.error),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: AppRadius.input,
      borderSide: const BorderSide(color: AppColors.error, width: 2),
    ),
    hintStyle: AppTypography.body.copyWith(color: AppColors.gray500),
    labelStyle: AppTypography.bodySmall.copyWith(color: AppColors.gray400),
    errorStyle: AppTypography.caption.copyWith(color: AppColors.error),
  );

  // ============================================
  // CHIP THEME
  // ============================================
  
  static ChipThemeData get _chipTheme => ChipThemeData(
    backgroundColor: AppColors.gray100,
    selectedColor: AppColors.primarySurface,
    labelStyle: AppTypography.bodySmall,
    padding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.space3,
      vertical: AppSpacing.space1,
    ),
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.chip,
    ),
  );
  
  static ChipThemeData get _darkChipTheme => ChipThemeData(
    backgroundColor: AppColors.darkCard,
    selectedColor: AppColors.primaryDark,
    labelStyle: AppTypography.bodySmall.copyWith(color: AppColors.gray300),
    padding: const EdgeInsets.symmetric(
      horizontal: AppSpacing.space3,
      vertical: AppSpacing.space1,
    ),
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.chip,
    ),
  );

  // ============================================
  // DIALOG & SHEET THEMES
  // ============================================
  
  static DialogTheme get _dialogTheme => DialogTheme(
    backgroundColor: AppColors.white,
    elevation: 8,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.xlRadius,
    ),
    titleTextStyle: AppTypography.heading4,
    contentTextStyle: AppTypography.body,
  );
  
  static DialogTheme get _darkDialogTheme => DialogTheme(
    backgroundColor: AppColors.darkCard,
    elevation: 8,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.xlRadius,
    ),
    titleTextStyle: AppTypography.darkMode(AppTypography.heading4),
    contentTextStyle: AppTypography.darkMode(AppTypography.body),
  );
  
  static BottomSheetThemeData get _bottomSheetTheme => BottomSheetThemeData(
    backgroundColor: AppColors.white,
    elevation: 8,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.sheet,
    ),
    modalElevation: 8,
    modalBackgroundColor: AppColors.white,
  );
  
  static BottomSheetThemeData get _darkBottomSheetTheme => BottomSheetThemeData(
    backgroundColor: AppColors.darkSurface,
    elevation: 8,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.sheet,
    ),
    modalElevation: 8,
    modalBackgroundColor: AppColors.darkSurface,
  );

  // ============================================
  // LIST TILE THEME
  // ============================================
  
  static ListTileThemeData get _listTileTheme => ListTileThemeData(
    contentPadding: AppSpacing.listItemInsets,
    titleTextStyle: AppTypography.body,
    subtitleTextStyle: AppTypography.bodySmall,
    iconColor: AppColors.gray600,
  );
  
  static ListTileThemeData get _darkListTileTheme => ListTileThemeData(
    contentPadding: AppSpacing.listItemInsets,
    titleTextStyle: AppTypography.darkMode(AppTypography.body),
    subtitleTextStyle: AppTypography.darkMode(AppTypography.bodySmall),
    iconColor: AppColors.gray400,
  );

  // ============================================
  // CHECKBOX & SWITCH THEMES
  // ============================================
  
  static CheckboxThemeData get _checkboxTheme => CheckboxThemeData(
    fillColor: WidgetStateProperty.resolveWith((states) {
      if (states.contains(WidgetState.selected)) {
        return AppColors.primary;
      }
      return AppColors.transparent;
    }),
    checkColor: WidgetStateProperty.all(AppColors.white),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(4),
    ),
    side: const BorderSide(color: AppColors.gray400, width: 2),
  );
  
  static SwitchThemeData get _switchTheme => SwitchThemeData(
    thumbColor: WidgetStateProperty.resolveWith((states) {
      if (states.contains(WidgetState.selected)) {
        return AppColors.white;
      }
      return AppColors.gray400;
    }),
    trackColor: WidgetStateProperty.resolveWith((states) {
      if (states.contains(WidgetState.selected)) {
        return AppColors.primary;
      }
      return AppColors.gray200;
    }),
  );

  // ============================================
  // SLIDER THEME
  // ============================================
  
  static SliderThemeData get _sliderTheme => SliderThemeData(
    activeTrackColor: AppColors.primary,
    inactiveTrackColor: AppColors.gray200,
    thumbColor: AppColors.primary,
    overlayColor: AppColors.primary.withOpacity(0.2),
    trackHeight: 4,
  );

  // ============================================
  // TAB BAR THEME
  // ============================================
  
  static TabBarTheme get _tabBarTheme => TabBarTheme(
    labelColor: AppColors.primary,
    unselectedLabelColor: AppColors.gray500,
    labelStyle: AppTypography.button,
    unselectedLabelStyle: AppTypography.button.copyWith(
      fontWeight: FontWeight.w400,
    ),
    indicator: const UnderlineTabIndicator(
      borderSide: BorderSide(color: AppColors.primary, width: 2),
    ),
  );
  
  static TabBarTheme get _darkTabBarTheme => TabBarTheme(
    labelColor: AppColors.primary,
    unselectedLabelColor: AppColors.gray400,
    labelStyle: AppTypography.button,
    unselectedLabelStyle: AppTypography.button.copyWith(
      fontWeight: FontWeight.w400,
      color: AppColors.gray400,
    ),
    indicator: const UnderlineTabIndicator(
      borderSide: BorderSide(color: AppColors.primary, width: 2),
    ),
  );

  // ============================================
  // SNACKBAR THEME
  // ============================================
  
  static SnackBarThemeData get _snackBarTheme => SnackBarThemeData(
    backgroundColor: AppColors.gray800,
    contentTextStyle: AppTypography.body.copyWith(color: AppColors.white),
    behavior: SnackBarBehavior.floating,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.mdRadius,
    ),
  );
  
  static SnackBarThemeData get _darkSnackBarTheme => SnackBarThemeData(
    backgroundColor: AppColors.gray700,
    contentTextStyle: AppTypography.body.copyWith(color: AppColors.white),
    behavior: SnackBarBehavior.floating,
    shape: RoundedRectangleBorder(
      borderRadius: AppRadius.mdRadius,
    ),
  );

  // ============================================
  // PROGRESS INDICATOR THEME
  // ============================================
  
  static ProgressIndicatorThemeData get _progressIndicatorTheme =>
      const ProgressIndicatorThemeData(
    color: AppColors.primary,
    linearTrackColor: AppColors.gray200,
    circularTrackColor: AppColors.gray200,
  );
}
