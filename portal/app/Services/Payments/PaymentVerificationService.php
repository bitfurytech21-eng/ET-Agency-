<?php
namespace App\Services\Payments;

use App\Repositories\ManualPaymentRepository;
use App\Repositories\UserRepository;
use App\Repositories\BookingRepository;

class PaymentVerificationService {
    private ManualPaymentRepository $manualRepo;
    private UserRepository $userRepo;
    private BookingRepository $bookingRepo;

    public function __construct() {
        $this->manualRepo = new ManualPaymentRepository();
        $this->userRepo = new UserRepository();
        $this->bookingRepo = new BookingRepository();
    }

    public function verifyPayment(int $manualPaymentId, int $adminId, string $decision, ?string $notes = null): array {
        $payment = $this->manualRepo->findById($manualPaymentId);
        if (!$payment) {
            return ['success' => false, 'message' => 'Payment record not found'];
        }

        $newStatus = ($decision === 'approve') ? 'verified' : 'rejected';
        $this->manualRepo->updateStatus($manualPaymentId, $newStatus, $adminId, $notes);

        if ($newStatus === 'verified') {
            // Credit units if this was a unit purchase, or confirm booking
            if (!empty($payment['booking_id'])) {
                $this->bookingRepo->updateStatus((int)$payment['booking_id'], 'confirmed');
            } else {
                $units = (int)floor($payment['amount'] / 100.00);
                if ($units > 0) {
                    $this->userRepo->updateBalance((int)$payment['user_id'], $units, (float)$payment['amount']);
                }
            }
        }

        return [
            'success' => true,
            'status' => $newStatus,
            'message' => "Payment has been {$newStatus}."
        ];
    }
}
