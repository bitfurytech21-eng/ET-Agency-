<?php
namespace App\Helpers;

class Security {
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    public static function generateToken(int $length = 32): string {
        return bin2hex(random_bytes($length));
    }

    public static function sanitize(string $data): string {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }

    public static function csrfToken(): string {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrf(?string $token): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return !empty($token) && hash_equals($_SESSION['csrf_token'] ?? '', $token);
    }
}
