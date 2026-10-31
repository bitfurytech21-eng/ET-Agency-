<?php
namespace App\Middleware;

use App\Helpers\Security;
use App\Helpers\Response;

class CsrfMiddleware {
    public static function handle(): void {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
            if (!Security::verifyCsrf($token)) {
                Response::json(['success' => false, 'message' => 'Invalid or expired CSRF token'], 419);
            }
        }
    }
}
