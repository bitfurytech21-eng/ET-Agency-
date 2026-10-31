<?php
namespace App\Middleware;

use App\Helpers\Response;

class AdminMiddleware {
    public static function handle(): ?array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $admin = $_SESSION['admin'] ?? null;
        if (!$admin) {
            if (!empty($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json')) {
                Response::json(['success' => false, 'message' => 'Unauthorized - Admin privileges required'], 403);
            }
            Response::redirect('/portal/admin/login');
            return null;
        }
        return $admin;
    }
}
