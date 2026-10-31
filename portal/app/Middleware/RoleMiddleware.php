<?php
namespace App\Middleware;

use App\Helpers\Response;

class RoleMiddleware {
    public static function requireRole(string $requiredRole): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $admin = $_SESSION['admin'] ?? null;
        if (!$admin || ($admin['role'] !== 'superadmin' && $admin['role'] !== $requiredRole)) {
            Response::json(['success' => false, 'message' => "Forbidden - Requires role {$requiredRole}"], 403);
        }
    }
}
