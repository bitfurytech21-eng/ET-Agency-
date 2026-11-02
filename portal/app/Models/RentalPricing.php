<?php
namespace App\Models;

class RentalPricing {
    public ?int $id = null;
    public ?int $vehicle_id = null;
    public string $season_name = 'Standard';
    public ?string $start_date = null;
    public ?string $end_date = null;
    public float $multiplier = 1.00;
    public ?string $created_at = null;
}
