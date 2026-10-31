<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\VehicleRepository;
use App\Helpers\Response;
class VehicleController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.vehicles.index', ['vehicles' => (new VehicleRepository())->all(), 'title' => 'Vehicle Fleet']);
    }
    public function create(): void {
        AdminMiddleware::handle();
        Response::view('admin.vehicles.create', ['title' => 'Add Vehicle']);
    }
    public function edit(int $id): void {
        AdminMiddleware::handle();
        Response::view('admin.vehicles.edit', ['title' => 'Edit Vehicle']);
    }
    public function availability(): void {
        AdminMiddleware::handle();
        Response::view('admin.vehicles.availability', ['title' => 'Fleet Availability']);
    }
}
