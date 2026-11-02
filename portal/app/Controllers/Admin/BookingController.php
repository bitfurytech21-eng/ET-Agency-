<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\BookingRepository;
use App\Helpers\Response;
class BookingController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.bookings.index', ['bookings' => (new BookingRepository())->all(), 'title' => 'All Reservations']);
    }
    public function pending(): void {
        AdminMiddleware::handle();
        Response::view('admin.bookings.pending', ['title' => 'Pending Inquiries']);
    }
    public function details(int $id): void {
        AdminMiddleware::handle();
        Response::view('admin.bookings.details', ['booking' => (new BookingRepository())->findById($id), 'title' => 'Booking Details']);
    }
}
