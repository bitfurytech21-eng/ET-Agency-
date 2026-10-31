<?php
namespace App\Services\CarRental;

use App\Repositories\VehicleRepository;

class VehicleManagementService {
    private VehicleRepository $vehicleRepo;

    public function __construct() {
        $this->vehicleRepo = new VehicleRepository();
    }

    public function getAllVehicles(): array {
        return $this->vehicleRepo->all();
    }

    public function addVehicle(array $data): int {
        return $this->vehicleRepo->create($data);
    }

    public function updateVehicle(int $id, array $data): bool {
        return $this->vehicleRepo->update($id, $data);
    }

    public function removeVehicle(int $id): bool {
        return $this->vehicleRepo->delete($id);
    }
}
