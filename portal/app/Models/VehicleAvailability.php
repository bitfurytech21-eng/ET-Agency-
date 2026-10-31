<?php
namespace App\Models;

class VehicleAvailability {
    public ?int $id = null;
    public int $vehicle_id;
    public string $blocked_date;
    public string $reason = 'booked';
    public ?int $rental_booking_id = null;
}
