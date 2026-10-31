<?php
namespace App\Services\BookingService;

use App\Repositories\BookingRepository;

class BookingService {
    private BookingRepository $repo;

    public function __construct() {
        $this->repo = new BookingRepository();
    }

    public function createBooking(array $data): int {
        return $this->repo->create($data);
    }
}
