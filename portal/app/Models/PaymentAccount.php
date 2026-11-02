<?php
namespace App\Models;

class PaymentAccount {
    public ?int $id = null;
    public string $bank_name = '';
    public string $account_name = '';
    public string $account_number = '';
    public string $routing_number = '';
    public ?string $swift_code = null;
    public ?string $zelle_identifier = null;
    public ?string $notes = null;
    public int $is_active = 1;
    public ?string $created_at = null;
}
