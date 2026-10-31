<?php
namespace App\Controllers\Auth;

use App\Helpers\Response;

class PasswordController {
    public function showForgotForm(): void {
        Response::view('auth.forgot-password', ['title' => 'Reset Password | Easy Travel Lodging']);
    }

    public function sendResetLink(): void {
        Response::json([
            'success' => true,
            'message' => 'If this email is registered, instructions to reset your password have been sent.'
        ]);
    }
}
