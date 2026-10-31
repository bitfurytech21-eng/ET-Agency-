<?php
namespace App\Controllers\Admin;

use App\Repositories\VehicleRepository;

class VehicleInventoryController {
    private VehicleRepository $vehicleRepo;

    public function __construct() {
        $this->vehicleRepo = new VehicleRepository();
    }

    public function index(): void {
        $vehicles = $this->vehicleRepo->all();
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/vehicles/index.php';
    }

    public function create(): void {
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/vehicles/create.php';
    }

    public function store(): void {
        $data = [
            'name' => $_POST['name'] ?? 'US Executive Fleet',
            'slug' => strtolower(str_replace(' ', '-', $_POST['name'] ?? 'vehicle-' . time())),
            'brand' => $_POST['brand'] ?? 'Cadillac',
            'model' => $_POST['model'] ?? 'V-Series',
            'daily_rate' => (float)($_POST['daily_rate'] ?? 195.00),
            'horsepower' => (int)($_POST['horsepower'] ?? 400),
            'status' => $_POST['status'] ?? 'available',
            'featured' => isset($_POST['featured']) ? 1 : 0
        ];

        $this->vehicleRepo->create($data);
        header('Location: /portal/admin/car-rentals/vehicles');
        exit;
    }
}
