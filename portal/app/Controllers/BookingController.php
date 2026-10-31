<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Repositories\BookingRepository;
use App\Repositories\UnitRepository;
use App\Helpers\Response;

class BookingController {
    public function index(): void {
        $user = AuthMiddleware::handle();
        $repo = new BookingRepository();
        Response::view('bookings.index', [
            'bookings' => $repo->getForUser((int)$user['id']),
            'title' => 'My Bookings'
        ]);
    }

    public function create(): void {
        $user = AuthMiddleware::handle();
        $units = (new UnitRepository())->all();
        Response::view('bookings.create', [
            'units' => $units,
            'title' => 'New Reservation Inquiry'
        ]);
    }

    public function details(int $id): void {
        $user = AuthMiddleware::handle();
        $repo = new BookingRepository();
        $booking = $repo->findById($id);
        Response::view('bookings.details', [
            'booking' => $booking,
            'title' => 'Booking Details #' . ($booking['booking_reference'] ?? $id)
        ]);
    }
}
