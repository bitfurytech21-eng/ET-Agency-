<?php
// Simple PSR-4 Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Load Helpers
require_once __DIR__ . '/../app/Helpers/Security.php';
require_once __DIR__ . '/../app/Helpers/Response.php';
require_once __DIR__ . '/../app/Helpers/Validator.php';

// Simple Router Dispatcher
class Router {
    private static array $routes = [];

    public static function get(string $path, $handler): void {
        self::$routes['GET'][$path] = $handler;
    }

    public static function post(string $path, $handler): void {
        self::$routes['POST'][$path] = $handler;
    }

    public static function dispatch(string $uri, string $method): void {
        $parsedUri = parse_url($uri, PHP_URL_PATH);
        // Normalize trailing slash and remove /portal base if present
        $clean = rtrim($parsedUri, '/');
        if ($clean === '' || $clean === '/portal') {
            $clean = '/';
        } elseif (str_starts_with($clean, '/portal/')) {
            $clean = substr($clean, 7); // Strip '/portal'
        }

        $routes = self::$routes[$method] ?? [];

        // Exact match
        if (isset($routes[$clean])) {
            self::callHandler($routes[$clean]);
            return;
        }

        // Parameterized match (e.g., /bookings/12, /vehicles/ford-mustang)
        foreach ($routes as $routePattern => $handler) {
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $routePattern);
            $pattern = '#^' . $pattern . '$#';
            if (preg_match($pattern, $clean, $matches)) {
                array_shift($matches);
                self::callHandler($handler, $matches);
                return;
            }
        }

        // 404
        if (!empty($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json')) {
            \App\Helpers\Response::json(['success' => false, 'message' => "Route [{$method} {$clean}] not found"], 404);
        } else {
            http_response_code(404);
            echo "<h1>404 - Page Not Found</h1><p>The requested route <code>{$clean}</code> does not exist in the portal.</p><p><a href='/portal/dashboard'>Return to Dashboard</a></p>";
            exit(0);
        }
    }

    private static function callHandler($handler, array $params = []): void {
        if (is_callable($handler)) {
            call_user_func_array($handler, $params);
            return;
        }
        if (is_array($handler) && count($handler) === 2) {
            [$class, $method] = $handler;
            $controller = new $class();
            call_user_func_array([$controller, $method], $params);
            return;
        }
        throw new Exception("Invalid route handler");
    }
}
