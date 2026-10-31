<?php
namespace App\Models;

class VehicleCategory {
    public ?int $id = null;
    public string $name = '';
    public string $slug = '';
    public ?string $description = null;
    public string $icon = 'car';
    public int $display_order = 0;
    public ?string $created_at = null;
}
