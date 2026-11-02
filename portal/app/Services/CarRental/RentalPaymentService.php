<?php
namespace App\Services\CarRental;

use App\Repositories\UnitRepository;

class RentalPaymentService {
    private UnitRepository $unitRepo;

    public function __construct() {
        $this->unitRepo = new UnitRepository();
    }

    public function processUnitsPayment(int $userId, float $usdAmount): bool {
        // Exchange rate: 1 Corporate Unit = $100.00 USD
        $requiredUnits = ceil($usdAmount / 100.0);
        $userUnits = $this->unitRepo->getUserBalance($userId);

        if ($userUnits < $requiredUnits) {
            return false; // Insufficient corporate units
        }

        // Deduct units balance
        return $this->unitRepo->deductUnits($userId, $requiredUnits, "Vehicle Rental Booking Payment (\${$usdAmount} USD)");
    }
}
