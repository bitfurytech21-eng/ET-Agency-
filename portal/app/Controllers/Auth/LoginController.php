<?php
namespace App\Controllers\Auth;

use App\Repositories\UserRepository;
use App\Helpers\Security;
use App\Helpers\Response;

class LoginController {
    private UserRepository $userRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
    }

    public function showLoginForm(): void {
        Response::view('auth.login', ['title' => 'Client Sign In | Easy Travel Lodging']);
    }

    public function login(): void {
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($email) || empty($password)) {
            Response::json(['success' => false, 'message' => 'Email and password are required'], 400);
        }

        $user = $this->userRepo->findByEmail($email);
        if (!$user || !Security::verifyPassword($password, $user['password_hash'])) {
            Response::json(['success' => false, 'message' => 'Invalid email or password credentials'], 401);
        }

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($user['password_hash']);
        $_SESSION['user'] = $user;

        Response::json([
            'success' => true,
            'message' => 'Signed in successfully',
            'user' => $user,
            'redirect' => '/portal/dashboard'
        ]);
    }

    public function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($_SESSION['user']);
        session_destroy();
        Response::redirect('/portal/login');
    }
}
