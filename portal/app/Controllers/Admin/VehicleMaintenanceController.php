<?php
namespace App\Controllers\Admin;

class VehicleMaintenanceController {
    public function index(): void {
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/maintenance/index.php';
    }
}
