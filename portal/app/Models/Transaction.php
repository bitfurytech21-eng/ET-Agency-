<?php
namespace App\Models;

class Transaction {
    public ?int $id = null;
    public string $transaction_ref = '';
    public int $user_id = 0;
    public string $type = 'purchase';
    public int $units = 0;
    public float $amount_usd = 0.00;
    public ?int $booking_id = null;
    public ?string $description = null;
    public ?string $command_code = null;
    public string $status = 'completed';
    public ?string $created_at = null;
}
