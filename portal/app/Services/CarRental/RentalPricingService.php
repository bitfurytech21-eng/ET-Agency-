<?php
namespace App\Services\CarRental;

class RentalPricingService {
    public function calculatePricing(float $dailyRate, string $pickupDate, string $returnDate): array {
        $pDate = new \DateTime($pickupDate);
        $rDate = new \DateTime($returnDate);
        $diff = $pDate->diff($rDate);
        $days = max(1, $diff->days);

        $subtotal = $dailyRate * $days;
        $taxAndFees = round($subtotal * 0.12, 2); // 12% airport & luxury concierge fee
        $deposit = 500.00;
        $totalAmount = $subtotal + $taxAndFees;

        return [
            'days' => $days,
            'daily_rate' => $dailyRate,
            'subtotal' => $subtotal,
            'tax_and_fees' => $taxAndFees,
            'deposit_amount' => $deposit,
            'total_amount' => $totalAmount
        ];
    }
}
