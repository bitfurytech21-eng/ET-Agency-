<?php
namespace App\Services\CarRental;

use App\Repositories\VehicleAvailabilityRepository;

class VehicleAvailabilityService {
    private VehicleAvailabilityRepository $availRepo;

    public function __construct() {
        $this->availRepo = new VehicleAvailabilityRepository();
    }

    public function isVehicleAvailable(int $vehicleId, string $pickupDate, string $returnDate): bool {
        return $this->availRepo->checkAvailability($vehicleId, $pickupDate, $returnDate);
    }

    public function reserveDates(int $vehicleId, string $pickupDate, string $returnDate, int $bookingId): void {
        $this->availRepo->blockDates($vehicleId, $pickupDate, $returnDate, 'booked', $bookingId);
    }
}
