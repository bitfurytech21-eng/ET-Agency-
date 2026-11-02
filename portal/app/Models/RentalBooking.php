<?php
namespace App\Models;

class RentalBooking {
    public ?int $id = null;
    public string $booking_reference = '';
    public int $user_id;
    public int $vehicle_id;
    public string $pickup_date = '';
    public string $return_date = '';
    public string $pickup_location = 'Executive Hub Terminal';
    public string $return_location = 'Executive Hub Terminal';
    public int $total_days = 1;
    public float $daily_rate = 0.00;
    public float $subtotal = 0.00;
    public float $tax_and_fees = 0.00;
    public float $deposit_amount = 0.00;
    public float $total_amount = 0.00;
    public string $payment_method = 'units_balance';
    public string $payment_status = 'paid';
    public string $booking_status = 'confirmed';
    public ?string $notes = null;
    public ?string $created_at = null;
}
