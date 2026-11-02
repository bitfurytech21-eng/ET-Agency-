<?php
namespace App\Services\Payments;

class PaymentReferenceService {
    public static function generateReference(string $prefix = 'PAY'): string {
        return $prefix . '-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
    }
}
