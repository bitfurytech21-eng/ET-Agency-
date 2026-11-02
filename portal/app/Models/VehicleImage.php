<?php
namespace App\Models;

class VehicleImage {
    public ?int $id = null;
    public int $vehicle_id;
    public string $image_path;
    public ?string $caption = null;
    public int $is_primary = 0;
    public int $sort_order = 0;
    public ?string $created_at = null;
}
