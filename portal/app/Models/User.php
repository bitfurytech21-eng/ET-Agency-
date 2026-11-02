<?php
namespace App\Models;

class User {
    public ?int $id = null;
    public string $name = '';
    public string $email = '';
    public string $password_hash = '';
    public string $company = '';
    public string $role = 'Guest';
    public string $phone = '';
    public int $units_balance = 0;
    public float $balance_usd = 0.00;
    public string $status = 'active';
    public ?string $created_at = null;
}
