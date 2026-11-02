<?php
namespace App\Models;

class Vehicle {
    public ?int $id = null;
    public ?int $category_id = null;
    public string $slug = '';
    public string $name = '';
    public string $brand = 'General Motors';
    public string $model = 'Executive';
    public int $year = 2024;
    public ?string $vin = null;
    public ?string $license_plate = null;
    public string $color = 'Onyx Black';
    public float $daily_rate = 195.00;
    public float $weekly_rate = 1250.00;
    public float $monthly_rate = 4200.00;
    public float $deposit_amount = 500.00;
    public int $horsepower = 300;
    public int $seating = 5;
    public string $powertrain = 'Gasoline';
    public string $transmission = 'Automatic';
    public int $is_electric = 0;
    public string $status = 'available';
    public int $featured = 0;
    public ?string $primary_image = null;
    public ?string $three_d_model_code = null;
    public ?string $created_at = null;
}
