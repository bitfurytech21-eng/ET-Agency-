<?php
namespace App\Controllers\Admin;

use App\Repositories\RentalBookingRepository;

class RentalBookingController {
    private RentalBookingRepository $bookingRepo;

    public function __construct() {
        $this->bookingRepo = new RentalBookingRepository();
    }

    public function index(): void {
        $bookings = $this->bookingRepo->all();
        require_once __DIR__ . '/../../../resources/views/admin/car-rentals/bookings/index.php';
    }

    public function updateStatus(): void {
        $id = (int)($_POST['id'] ?? 0);
        $status = $_POST['status'] ?? 'confirmed';
        $this->bookingRepo->updateStatus($id, $status);
        header('Location: /portal/admin/car-rentals/bookings');
        exit;
    }
}
