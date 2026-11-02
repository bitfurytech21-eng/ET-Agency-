<?php
namespace App\Controllers\Auth;

use App\Repositories\UserRepository;
use App\Repositories\TransactionRepository;
use App\Helpers\Security;
use App\Helpers\Response;

class RegisterController {
    private UserRepository $userRepo;
    private TransactionRepository $txRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->txRepo = new TransactionRepository();
    }

    public function showRegistrationForm(): void {
        Response::view('auth.register', ['title' => 'Register Customer Account | Easy Travel Lodging']);
    }

    public function register(): void {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $company = trim($_POST['company'] ?? '');
        $role = trim($_POST['role'] ?? 'Traveling Professional');
        $phone = trim($_POST['phone'] ?? '');

        if (empty($name) || empty($email) || empty($password)) {
            Response::json(['success' => false, 'message' => 'Name, email, and password are required'], 400);
        }

        if ($this->userRepo->findByEmail($email)) {
            Response::json(['success' => false, 'message' => 'An account with this email already exists'], 400);
        }

        $userId = $this->userRepo->create([
            'name' => $name,
            'email' => $email,
            'password_hash' => Security::hashPassword($password),
            'company' => $company,
            'role' => $role,
            'phone' => $phone,
            'units_balance' => 25, // Welcome corporate bonus
            'balance_usd' => 2500.00
        ]);

        $this->txRepo->create([
            'user_id' => $userId,
            'type' => 'bonus',
            'units' => 25,
            'amount_usd' => 2500.00,
            'description' => 'Welcome Corporate Bonus Units Grant',
            'status' => 'completed'
        ]);

        $user = $this->userRepo->findById($userId);
        unset($user['password_hash']);

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user'] = $user;

        Response::json([
            'success' => true,
            'message' => 'Account registered successfully with 25 welcome units!',
            'user' => $user,
            'redirect' => '/portal/dashboard'
        ]);
    }
}
