<?php
namespace App\Services\Inventory;

use App\Repositories\UnitRepository;

class UnitAllocationService {
    private UnitRepository $repo;

    public function __construct() {
        $this->repo = new UnitRepository();
    }

    public function getAllUnits(): array {
        return $this->repo->all();
    }
}
