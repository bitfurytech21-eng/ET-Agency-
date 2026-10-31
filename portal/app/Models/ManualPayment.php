<?php
namespace App\Models;

class ManualPayment {
    public ?int $id = null;
    public string $reference_code = '';
    public int $user_id = 0;
    public ?int $booking_id = null;
    public ?int $payment_account_id = null;
    public string $payment_method = 'wire';
    public float $amount = 0.00;
    public ?string $sender_name = null;
    public ?string $sender_bank = null;
    public ?string $transaction_number = null;
    public ?string $transfer_date = null;
    public string $status = 'pending_verification';
    public ?string $notes = null;
    public ?string $created_at = null;
    public ?string $verified_at = null;
    public ?int $verified_by = null;
}
