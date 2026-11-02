<?php
namespace App\Services\Payments;

use App\Repositories\UserRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\BookingRepository;

class PaymentService {
    private UserRepository $userRepo;
    private TransactionRepository $txRepo;
    private BookingRepository $bookingRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->txRepo = new TransactionRepository();
        $this->bookingRepo = new BookingRepository();
    }

    /**
     * Internal Command: Settle booking directly using customer units balance
     */
    public function settleBookingFromUnits(int $userId, int $bookingId, int $unitsToDeduct, string $commandCode = 'INTERNAL_SETTLE_UNITS'): array {
        $user = $this->userRepo->findById($userId);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        if (($user['units_balance'] ?? 0) < $unitsToDeduct) {
            return [
                'success' => false,
                'message' => "Insufficient unit balance: User has {$user['units_balance']} units, but {$unitsToDeduct} units are required."
            ];
        }

        $booking = $this->bookingRepo->findById($bookingId);
        if (!$booking) {
            return ['success' => false, 'message' => 'Booking record not found'];
        }

        $costUsd = $unitsToDeduct * 100.00;

        // Deduct from balance
        $this->userRepo->updateBalance($userId, -$unitsToDeduct, -$costUsd);

        // Update booking status
        $this->bookingRepo->updateStatus($bookingId, 'confirmed', $unitsToDeduct);

        // Record audit transaction
        $txId = $this->txRepo->create([
            'user_id' => $userId,
            'type' => 'settlement',
            'units' => -$unitsToDeduct,
            'amount_usd' => -$costUsd,
            'booking_id' => $bookingId,
            'description' => "Internal Command: Settle Booking #{$booking['booking_reference']} with {$unitsToDeduct} Units",
            'command_code' => $commandCode,
            'status' => 'completed'
        ]);

        return [
            'success' => true,
            'message' => "Internal command executed: {$unitsToDeduct} units deducted to settle booking #{$booking['booking_reference']}",
            'transaction_id' => $txId,
            'remaining_units' => $user['units_balance'] - $unitsToDeduct,
            'remaining_balance_usd' => $user['balance_usd'] - $costUsd,
            'command_code' => $commandCode
        ];
    }

    public function purchaseUnits(int $userId, int $units, string $paymentMethod = 'wire'): array {
        $totalUsd = $units * 100.00;
        $this->userRepo->updateBalance($userId, $units, $totalUsd);

        $txId = $this->txRepo->create([
            'user_id' => $userId,
            'type' => 'purchase',
            'units' => $units,
            'amount_usd' => $totalUsd,
            'description' => "Purchased {$units} Units via {$paymentMethod}",
            'status' => 'completed'
        ]);

        return [
            'success' => true,
            'message' => "Successfully purchased {$units} units",
            'transaction_id' => $txId,
            'units' => $units,
            'amount_usd' => $totalUsd
        ];
    }
}
