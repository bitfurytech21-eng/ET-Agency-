<?php
require_once __DIR__ . '/../../bootstrap/app.php';

use App\Repositories\VehicleRepository;
use App\Repositories\UnitRepository;

echo "Running CustomerPortalTest... ";
$vehicles = (new VehicleRepository())->all();
assert(count($vehicles) >= 5, "Should have at least 5 American rental vehicles");

$units = (new UnitRepository())->all();
assert(count($units) >= 5, "Should have 5 lodging units (#A to #E)");

echo "PASSED\n";
