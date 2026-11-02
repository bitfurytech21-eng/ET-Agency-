<?php
namespace App\Controllers\Admin;

class RentalReportController {
    public function index(): void {
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/reports/index.php';
    }
}
