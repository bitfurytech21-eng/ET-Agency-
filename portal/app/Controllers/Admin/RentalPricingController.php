<?php
namespace App\Controllers\Admin;

class RentalPricingController {
    public function index(): void {
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/pricing/index.php';
    }
}
