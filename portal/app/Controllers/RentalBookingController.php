<?php
namespace App\Controllers;

use App\Services\CarRental\RentalBookingService;
use App\Services\CarRental\VehicleSearchService;

class RentalBookingController {
    private RentalBookingService $bookingService;
    private VehicleSearchService $searchService;

    public function __construct() {
        $this->bookingService = new RentalBookingService();
        $this->searchService = new VehicleSearchService();
    }

    public function createForm(): void {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /portal/login');
            exit;
        }

        $slug = $_GET['vehicle'] ?? '';
        $vehicle = $this->searchService->getVehicleBySlug($slug);
        if (!$vehicle) {
            header('Location: /portal/car-rentals');
            exit;
        }

        require_once __DIR__ . '/../../resources/views/car-rentals/booking.php';
    }

    public function store(): void {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /portal/login');
            exit;
        }

        $userId = $_SESSION['user_id'];
        $vehicleId = (int)($_POST['vehicle_id'] ?? 0);
        $pickupDate = $_POST['pickup_date'] ?? date('Y-m-d');
        $returnDate = $_POST['return_date'] ?? date('Y-m-d', strtotime('+3 days'));
        $pickupLocation = $_POST['pickup_location'] ?? 'Executive Hub Terminal';
        $returnLocation = $_POST['return_location'] ?? 'Executive Hub Terminal';
        $notes = $_POST['notes'] ?? '';

        $result = $this->bookingService->createBooking($userId, $vehicleId, $pickupDate, $returnDate, $pickupLocation, $returnLocation, $notes);

        if ($result['success']) {
            header('Location: /portal/car-rentals/confirmation?ref=' . $result['booking_reference']);
            exit;
        } else {
            $_SESSION['error'] = $result['message'];
            header('Location: ' . $_SERVER['HTTP_REFERER']);
            exit;
        }
    }

    public function confirmation(): void {
        $ref = $_GET['ref'] ?? '';
        $booking = $this->bookingService->getBookingDetails($ref);

        if (!$booking) {
            header('Location: /portal/car-rentals');
            exit;
        }

        require_once __DIR__ . '/../../resources/views/car-rentals/confirmation.php';
    }

    public function myRentals(): void {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /portal/login');
            exit;
        }

        $userId = $_SESSION['user_id'];
        $rentals = $this->bookingService->getUserBookings($userId);

        require_once __DIR__ . '/../../resources/views/car-rentals/my-rentals.php';
    }
}
