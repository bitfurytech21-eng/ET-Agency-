<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\ManualPaymentRepository;
use App\Services\Payments\PaymentVerificationService;
use App\Helpers\Response;
class ManualPaymentController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.manual-payments', ['payments' => (new ManualPaymentRepository())->all(), 'title' => 'Wire & ACH Notices']);
    }
    public function pending(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.pending-verification', ['payments' => (new ManualPaymentRepository())->allPending(), 'title' => 'Pending Verification']);
    }
    public function details(int $id): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.payment-details', ['payment' => (new ManualPaymentRepository())->findById($id), 'title' => 'Payment Details']);
    }
    public function verify(): void {
        $admin = AdminMiddleware::handle();
        $id = (int)($_POST['id'] ?? 0);
        $decision = $_POST['decision'] ?? 'approve';
        $notes = $_POST['notes'] ?? null;
        $service = new PaymentVerificationService();
        $result = $service->verifyPayment($id, (int)$admin['id'], $decision, $notes);
        Response::json($result);
    }
    public function verified(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.verified-payments', ['title' => 'Verified Payments']);
    }
    public function rejected(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.rejected-payments', ['title' => 'Rejected Payments']);
    }
}
