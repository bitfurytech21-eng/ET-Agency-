<?php
namespace App\Services\CarRental;

use App\Repositories\VehicleRepository;

class VehicleSearchService {
    private VehicleRepository $vehicleRepo;

    public function __construct() {
        $this->vehicleRepo = new VehicleRepository();
    }

    public function searchVehicles(array $criteria): array {
        return $this->vehicleRepo->search($criteria);
    }

    public function getFeaturedVehicles(): array {
        return $this->vehicleRepo->all(null, null);
    }

    public function getVehicleBySlug(string $slug): ?array {
        return $this->vehicleRepo->findBySlug($slug);
    }
}
