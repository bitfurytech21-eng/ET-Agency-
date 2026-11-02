<?php
namespace App\Controllers\Admin;

class VehicleCategoryController {
    public function index(): void {
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/categories/index.php';
    }
}
