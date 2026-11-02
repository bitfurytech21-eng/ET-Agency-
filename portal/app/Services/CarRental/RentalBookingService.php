<?php
namespace App\Services\CarRental;

use App\Repositories\RentalBookingRepository;
use App\Repositories\VehicleRepository;

class RentalBookingService {
    private RentalBookingRepository $bookingRepo;
    private VehicleRepository $vehicleRepo;
    private RentalPricingService $pricingService;
    private VehicleAvailabilityService $availService;
    private RentalPaymentService $paymentService;

    public function __construct() {
        $this->bookingRepo = new RentalBookingRepository();
        $this->vehicleRepo = new VehicleRepository();
        $this->pricingService = new RentalPricingService();
        $this->availService = new VehicleAvailabilityService();
        $this->paymentService = new RentalPaymentService();
    }

    public function createBooking(int $userId, int $vehicleId, string $pickupDate, string $returnDate, string $pickupLocation, string $returnLocation, string $notes = ''): array {
        $vehicle = $this->vehicleRepo->findById($vehicleId);
        if (!$vehicle) {
            return ['success' => false, 'message' => 'Selected vehicle does not exist.'];
        }

        if (!$this->availService->isVehicleAvailable($vehicleId, $pickupDate, $returnDate)) {
            return ['success' => false, 'message' => 'Vehicle is not available for the requested dates.'];
        }

        $calc = $this->pricingService->calculatePricing((float)$vehicle['daily_rate'], $pickupDate, $returnDate);

        // Process unit balance deduction
        $paid = $this->paymentService->processUnitsPayment($userId, $calc['total_amount']);
        if (!$paid) {
            return ['success' => false, 'message' => 'Insufficient Corporate Units balance for this reservation.'];
        }

        $bookingRef = 'VR-' . strtoupper(substr(md5(uniqid()), 0, 8));

        $bookingId = $this->bookingRepo->create([
            'booking_reference' => $bookingRef,
            'user_id' => $userId,
            'vehicle_id' => $vehicleId,
            'pickup_date' => $pickupDate,
            'return_date' => $returnDate,
            'pickup_location' => $pickupLocation,
            'return_location' => $returnLocation,
            'total_days' => $calc['days'],
            'daily_rate' => $calc['daily_rate'],
            'subtotal' => $calc['subtotal'],
            'tax_and_fees' => $calc['tax_and_fees'],
            'deposit_amount' => $calc['deposit_amount'],
            'total_amount' => $calc['total_amount'],
            'payment_method' => 'units_balance',
            'payment_status' => 'paid',
            'booking_status' => 'confirmed',
            'notes' => $notes
        ]);

        $this->availService->reserveDates($vehicleId, $pickupDate, $returnDate, $bookingId);

        return [
            'success' => true,
            'booking_reference' => $bookingRef,
            'booking_id' => $bookingId,
            'message' => 'Vehicle reservation confirmed successfully!'
        ];
    }

    public function getUserBookings(int $userId): array {
        return $this->bookingRepo->findByUserId($userId);
    }

    public function getBookingDetails(string $reference): ?array {
        return $this->bookingRepo->findByReference($reference);
    }
}
