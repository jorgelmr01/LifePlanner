import 'package:flutter/material.dart';

/// App router configuration
/// Routes will be added as screens are implemented
abstract final class AppRouter {
  // Route names
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String home = '/home';
  static const String today = '/today';
  static const String entries = '/entries';
  static const String areas = '/areas';
  static const String people = '/people';
  static const String copilot = '/copilot';
  static const String settings = '/settings';

  /// Main router configuration
  /// TODO: Implement with go_router when screens are ready
  static RouterConfig<Object> get router => MaterialApp.router(
    routerDelegate: _routerDelegate,
    routeInformationParser: _routeInformationParser,
  ).routerConfig!;

  static final _routerDelegate = _PlaceholderRouterDelegate();
  static final _routeInformationParser = _PlaceholderRouteInformationParser();
}

// Placeholder implementations until screens are ready
class _PlaceholderRouterDelegate extends RouterDelegate<Object>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<Object> {
  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: const [
        MaterialPage(child: _PlaceholderHomePage()),
      ],
      onPopPage: (route, result) {
        if (!route.didPop(result)) return false;
        return true;
      },
    );
  }

  @override
  GlobalKey<NavigatorState>? get navigatorKey => GlobalKey<NavigatorState>();

  @override
  Future<void> setNewRoutePath(Object configuration) async {}
}

class _PlaceholderRouteInformationParser
    extends RouteInformationParser<Object> {
  @override
  Future<Object> parseRouteInformation(
    RouteInformation routeInformation,
  ) async {
    return Object();
  }
}

/// Placeholder home page - will be replaced with actual implementation
class _PlaceholderHomePage extends StatelessWidget {
  const _PlaceholderHomePage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Life Copilot'),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.auto_awesome,
              size: 64,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 24),
            Text(
              'Life Copilot',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Tu copiloto de vida',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 48),
            Text(
              'Proyecto configurado correctamente ✓',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
