<?php
namespace App\Controllers\Admin;

use App\Repositories\VehicleRepository;
use App\Repositories\RentalBookingRepository;

class CarRentalController {
    private VehicleRepository $vehicleRepo;
    private RentalBookingRepository $bookingRepo;

    public function __construct() {
        $this->vehicleRepo = new VehicleRepository();
        $this->bookingRepo = new RentalBookingRepository();
    }

    public function index(): void {
        if (!isset($_SESSION['admin_id'])) {
            header('Location: /portal/admin/login');
            exit;
        }

        $vehicles = $this->vehicleRepo->all();
        $bookings = $this->bookingRepo->all();

        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/dashboard.php';
    }
}
