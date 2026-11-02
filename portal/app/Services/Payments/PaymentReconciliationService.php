<?php
namespace App\Services\Payments;

use App\Config\Database;

class PaymentReconciliationService {
    public static function getReconciliationSummary(): array {
        $db = Database::getConnection();

        $manualTotal = $db->query("SELECT SUM(amount) as total, COUNT(*) as count FROM manual_payments WHERE status = 'verified'")->fetch();
        $unitPurchases = $db->query("SELECT SUM(amount_usd) as total, SUM(units) as total_units FROM unit_transactions WHERE type = 'purchase'")->fetch();
        $unitSettlements = $db->query("SELECT SUM(abs(amount_usd)) as total, SUM(abs(units)) as total_units FROM unit_transactions WHERE type = 'settlement'")->fetch();

        return [
            'verified_manual_revenue' => (float)($manualTotal['total'] ?? 0),
            'verified_manual_count' => (int)($manualTotal['count'] ?? 0),
            'total_units_purchased' => (int)($unitPurchases['total_units'] ?? 0),
            'total_units_settled' => (int)($unitSettlements['total_units'] ?? 0),
            'outstanding_units_liability' => ((int)($unitPurchases['total_units'] ?? 0) - (int)($unitSettlements['total_units'] ?? 0)) * 100.00
        ];
    }
}
