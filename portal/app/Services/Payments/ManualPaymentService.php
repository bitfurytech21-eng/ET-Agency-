<?php
namespace App\Services\Payments;

use App\Repositories\ManualPaymentRepository;
use App\Repositories\PaymentAccountRepository;

class ManualPaymentService {
    private ManualPaymentRepository $manualRepo;
    private PaymentAccountRepository $accountRepo;

    public function __construct() {
        $this->manualRepo = new ManualPaymentRepository();
        $this->accountRepo = new PaymentAccountRepository();
    }

    public function submitPayment(int $userId, array $data): array {
        $paymentId = $this->manualRepo->create([
            'user_id' => $userId,
            'booking_id' => $data['booking_id'] ?? null,
            'payment_account_id' => $data['payment_account_id'] ?? 1,
            'payment_method' => $data['payment_method'] ?? 'wire',
            'amount' => (float)$data['amount'],
            'sender_name' => $data['sender_name'] ?? '',
            'sender_bank' => $data['sender_bank'] ?? '',
            'transaction_number' => $data['transaction_number'] ?? '',
            'transfer_date' => $data['transfer_date'] ?? date('Y-m-d'),
            'notes' => $data['notes'] ?? ''
        ]);

        return [
            'success' => true,
            'manual_payment_id' => $paymentId,
            'message' => 'Manual payment notice submitted successfully. Our accounting team will verify the transfer.'
        ];
    }
}
