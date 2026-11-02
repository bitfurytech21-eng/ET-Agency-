<?php
namespace App\Services\Inventory;

use App\Repositories\VehicleRepository;

class VehicleInventoryService {
    private VehicleRepository $repo;

    public function __construct() {
        $this->repo = new VehicleRepository();
    }

    public function getAvailableFleet(): array {
        return $this->repo->all();
    }
}
