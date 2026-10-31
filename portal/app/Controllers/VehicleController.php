<?php
namespace App\Controllers;

use App\Repositories\VehicleRepository;
use App\Helpers\Response;

class VehicleController {
    public function index(): void {
        $repo = new VehicleRepository();
        Response::view('vehicles.index', [
            'vehicles' => $repo->all(),
            'title' => 'American Fleet & Vehicle Rentals (3D)'
        ]);
    }

    public function details(string $slug): void {
        $repo = new VehicleRepository();
        $vehicle = $repo->findBySlug($slug);
        Response::view('vehicles.details', [
            'vehicle' => $vehicle,
            'title' => $vehicle ? $vehicle['name'] . ' | 3D Rental Details' : 'Vehicle Not Found'
        ]);
    }

    public function booking(string $slug): void {
        $repo = new VehicleRepository();
        $vehicle = $repo->findBySlug($slug);
        Response::view('vehicles.booking', [
            'vehicle' => $vehicle,
            'title' => 'Reserve ' . ($vehicle['name'] ?? 'Vehicle')
        ]);
    }
}
