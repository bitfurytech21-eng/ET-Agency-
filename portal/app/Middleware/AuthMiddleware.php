<?php
namespace App\Middleware;

use App\Helpers\Response;

class AuthMiddleware {
    public static function handle(): ?array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $user = $_SESSION['user'] ?? null;
        if (!$user) {
            if (!empty($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json')) {
                Response::json(['success' => false, 'message' => 'Unauthorized - Sign-in required'], 401);
            }
            Response::redirect('/portal/login');
            return null;
        }
        return $user;
    }
}
