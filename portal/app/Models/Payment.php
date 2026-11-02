<?php
namespace App\Models;

class Payment {
    public ?int $id = null;
    public string $payment_ref = '';
    public int $user_id = 0;
    public ?int $booking_id = null;
    public float $amount = 0.00;
    public string $currency = 'USD';
    public string $method = 'wire';
    public string $status = 'pending';
    public ?string $notes = null;
    public ?string $created_at = null;
}
