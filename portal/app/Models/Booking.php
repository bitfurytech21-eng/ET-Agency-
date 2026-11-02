<?php
namespace App\Models;

class Booking {
    public ?int $id = null;
    public string $booking_reference = '';
    public ?int $user_id = null;
    public string $property_id = '';
    public string $guest_name = '';
    public string $guest_email = '';
    public string $guest_phone = '';
    public string $check_in = '';
    public string $check_out = '';
    public int $total_nights = 30;
    public int $adults = 1;
    public int $children = 0;
    public int $units_cost = 0;
    public float $total_amount_usd = 0.00;
    public string $status = 'pending';
    public string $payment_method = 'wire';
    public int $settled_from_units = 0;
    public ?string $notes = null;
    public ?string $created_at = null;
}
