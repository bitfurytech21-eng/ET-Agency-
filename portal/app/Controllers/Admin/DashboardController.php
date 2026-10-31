<?php
namespace App\Controllers\Admin;

use App\Middleware\AdminMiddleware;
use App\Repositories\UserRepository;
use App\Repositories\BookingRepository;
use App\Repositories\ManualPaymentRepository;
use App\Services\Payments\PaymentReconciliationService;
use App\Helpers\Response;
use App\Config\Database;

class DashboardController {
    public function showLoginForm(): void {
        Response::view('admin.login', ['title' => 'Staff & Admin Login | Easy Travel Lodging']);
    }

    public function login(): void {
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM admins WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            Response::json(['success' => false, 'message' => 'Invalid admin credentials'], 401);
        }

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($admin['password_hash']);
        $_SESSION['admin'] = $admin;

        Response::json([
            'success' => true,
            'message' => 'Admin signed in successfully',
            'admin' => $admin,
            'redirect' => '/portal/admin/dashboard'
        ]);
    }

    public function index(): void {
        $admin = AdminMiddleware::handle();
        $users = (new UserRepository())->all(10);
        $bookings = (new BookingRepository())->all(10);
        $pendingPayments = (new ManualPaymentRepository())->allPending();
        $reconciliation = PaymentReconciliationService::getReconciliationSummary();

        Response::view('admin.dashboard', [
            'admin' => $admin,
            'users' => $users,
            'bookings' => $bookings,
            'pendingPayments' => $pendingPayments,
            'reconciliation' => $reconciliation,
            'title' => 'Admin Portal Control Center'
        ]);
    }

    public function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($_SESSION['admin']);
        session_destroy();
        Response::redirect('/portal/admin/login');
    }
}
