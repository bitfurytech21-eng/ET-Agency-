<?php
namespace App\Helpers;

class Response {
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit(0);
    }

    public static function redirect(string $url): void {
        header("Location: " . $url);
        exit(0);
    }

    public static function view(string $viewPath, array $data = []): void {
        extract($data);
        $fullPath = __DIR__ . '/../../resources/views/' . str_replace('.', '/', $viewPath) . '.php';
        if (!file_exists($fullPath)) {
            http_response_code(404);
            echo "View [{$viewPath}] not found at {$fullPath}";
            exit(1);
        }
        require $fullPath;
        exit(0);
    }
}
