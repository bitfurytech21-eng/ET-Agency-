<?php
namespace App\Models;

class Unit {
    public ?int $id = null;
    public string $unit_code = '';
    public string $title = '';
    public string $category = '';
    public int $beds = 1;
    public int $baths = 1;
    public float $monthly_rate = 2500.00;
    public float $daily_rate = 110.00;
    public string $status = 'available';
    public ?string $created_at = null;
}
