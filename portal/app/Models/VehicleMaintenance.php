<?php
namespace App\Models;

class VehicleMaintenance {
    public ?int $id = null;
    public int $vehicle_id;
    public string $service_type;
    public ?string $description = null;
    public float $cost = 0.00;
    public string $scheduled_date;
    public ?string $completed_date = null;
    public string $status = 'pending';
    public ?string $created_at = null;
}
