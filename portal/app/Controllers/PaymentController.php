<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Services\Payments\PaymentService;
use App\Services\Payments\ManualPaymentService;
use App\Repositories\PaymentAccountRepository;
use App\Repositories\ManualPaymentRepository;
use App\Helpers\Response;

class PaymentController {
    /**
     * Internal Command: Settle booking using dashboard units balance
     * Note: Not shown publicly, called via internal command
     */
    public function payFromBalance(): void {
        $user = AuthMiddleware::handle();
        $bookingId = (int)($_POST['booking_id'] ?? 0);
        $units = (int)($_POST['units'] ?? 25);
        $commandCode = trim($_POST['command_code'] ?? 'INTERNAL_EXEC_PAY_FROM_BALANCE');

        if ($bookingId <= 0) {
            Response::json(['success' => false, 'message' => 'Invalid booking ID'], 400);
        }

        $paymentService = new PaymentService();
        $result = $paymentService->settleBookingFromUnits((int)$user['id'], $bookingId, $units, $commandCode);
        Response::json($result, $result['success'] ? 200 : 400);
    }

    public function manualPayment(): void {
        $user = AuthMiddleware::handle();
        $accounts = (new PaymentAccountRepository())->getActive();
        Response::view('payments.manual-payment', [
            'accounts' => $accounts,
            'title' => 'Submit Wire / ACH Transfer Notice'
        ]);
    }

    public function submitManualPayment(): void {
        $user = AuthMiddleware::handle();
        $service = new ManualPaymentService();
        $result = $service->submitPayment((int)$user['id'], $_POST);
        Response::json($result);
    }

    public function bankDetails(): void {
        $accounts = (new PaymentAccountRepository())->getActive();
        Response::view('payments.bank-details', ['accounts' => $accounts, 'title' => 'Bank & Wire Instructions']);
    }

    public function uploadProof(): void {
        $user = AuthMiddleware::handle();
        Response::view('payments.upload-proof', ['title' => 'Upload Payment Proof']);
    }

    public function paymentStatus(int $id): void {
        $user = AuthMiddleware::handle();
        $repo = new ManualPaymentRepository();
        $payment = $repo->findById($id);
        Response::view('payments.payment-status', ['payment' => $payment, 'title' => 'Payment Status']);
    }

    public function paymentHistory(): void {
        $user = AuthMiddleware::handle();
        $repo = new ManualPaymentRepository();
        Response::view('payments.payment-history', [
            'payments' => $repo->getForUser((int)$user['id']),
            'title' => 'Payment History'
        ]);
    }
}
