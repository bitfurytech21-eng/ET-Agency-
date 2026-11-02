<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Repositories\UserRepository;
use App\Repositories\BookingRepository;
use App\Repositories\TransactionRepository;
use App\Helpers\Response;

class DashboardController {
    public function index(): void {
        $user = AuthMiddleware::handle();
        $userRepo = new UserRepository();
        $bookingRepo = new BookingRepository();
        $txRepo = new TransactionRepository();

        $freshUser = $userRepo->findById((int)$user['id']);
        $bookings = $bookingRepo->getForUser((int)$user['id']);
        $transactions = $txRepo->getForUser((int)$user['id']);

        Response::view('dashboard.index', [
            'user' => $freshUser,
            'bookings' => $bookings,
            'transactions' => $transactions,
            'title' => 'Client Portal Dashboard'
        ]);
    }

    public function profile(): void {
        $user = AuthMiddleware::handle();
        $userRepo = new UserRepository();
        $freshUser = $userRepo->findById((int)$user['id']);
        Response::view('dashboard.profile', ['user' => $freshUser, 'title' => 'My Account Profile']);
    }

    public function bookings(): void {
        $user = AuthMiddleware::handle();
        $bookingRepo = new BookingRepository();
        $bookings = $bookingRepo->getForUser((int)$user['id']);
        Response::view('dashboard.bookings', ['bookings' => $bookings, 'title' => 'My Reservation Records']);
    }

    public function transactions(): void {
        $user = AuthMiddleware::handle();
        $txRepo = new TransactionRepository();
        $transactions = $txRepo->getForUser((int)$user['id']);
        Response::view('dashboard.transactions', ['transactions' => $transactions, 'title' => 'Unit Transactions & Purchases']);
    }

    public function notifications(): void {
        $user = AuthMiddleware::handle();
        Response::view('dashboard.notifications', ['title' => 'Notifications']);
    }
}
