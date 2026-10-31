<?php
namespace App\Controllers;

use App\Services\CarRental\VehicleSearchService;

class CarRentalController {
    private VehicleSearchService $searchService;

    public function __construct() {
        $this->searchService = new VehicleSearchService();
    }

    public function index(): void {
        $vehicles = $this->searchService->getFeaturedVehicles();
        require_once __DIR__ . '/../../resources/views/car-rentals/index.php';
    }

    public function search(): void {
        $query = $_GET['q'] ?? '';
        $category = $_GET['category'] ?? '';
        $electric = $_GET['electric'] ?? '';
        $minPrice = $_GET['min_price'] ?? '';
        $maxPrice = $_GET['max_price'] ?? '';

        $vehicles = $this->searchService->searchVehicles([
            'q' => $query,
            'category' => $category,
            'electric' => $electric,
            'min_price' => $minPrice,
            'max_price' => $maxPrice
        ]);

        require_once __DIR__ . '/../../resources/views/car-rentals/search.php';
    }

    public function show(string $slug): void {
        $vehicle = $this->searchService->getVehicleBySlug($slug);
        if (!$vehicle) {
            header('Location: /portal/car-rentals');
            exit;
        }

        require_once __DIR__ . '/../../resources/views/car-rentals/vehicle-details.php';
    }
}
