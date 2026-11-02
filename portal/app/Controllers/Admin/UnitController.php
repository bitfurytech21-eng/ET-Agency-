<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\UnitRepository;
use App\Repositories\TransactionRepository;
use App\Helpers\Response;
class UnitController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.units.index', ['units' => (new UnitRepository())->all(), 'title' => 'Lodging Units']);
    }
    public function purchases(): void {
        AdminMiddleware::handle();
        Response::view('admin.units.purchases', ['transactions' => (new TransactionRepository())->all(), 'title' => 'Unit Purchases']);
    }
    public function allocations(): void {
        AdminMiddleware::handle();
        Response::view('admin.units.allocations', ['title' => 'Unit Allocations']);
    }
}
