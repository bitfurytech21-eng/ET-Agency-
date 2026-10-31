<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class ManualPaymentRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int {
        $ref = 'PAY-WIRE-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        $stmt = $this->db->prepare("INSERT INTO manual_payments (reference_code, user_id, booking_id, payment_account_id, payment_method, amount, sender_name, sender_bank, transaction_number, transfer_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $ref,
            $data['user_id'],
            $data['booking_id'] ?? null,
            $data['payment_account_id'] ?? 1,
            $data['payment_method'] ?? 'wire',
            $data['amount'],
            $data['sender_name'] ?? '',
            $data['sender_bank'] ?? '',
            $data['transaction_number'] ?? '',
            $data['transfer_date'] ?? date('Y-m-d'),
            'pending_verification',
            $data['notes'] ?? ''
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function getForUser(int $userId): array {
        $stmt = $this->db->prepare("SELECT mp.*, pa.bank_name, pa.account_number FROM manual_payments mp LEFT JOIN payment_accounts pa ON mp.payment_account_id = pa.id WHERE mp.user_id = ? ORDER BY mp.id DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT mp.*, u.name as user_name, u.email as user_email FROM manual_payments mp JOIN users u ON mp.user_id = u.id WHERE mp.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateStatus(int $id, string $status, int $adminId, ?string $notes = null): bool {
        $stmt = $this->db->prepare("UPDATE manual_payments SET status = ?, verified_at = CURRENT_TIMESTAMP, verified_by = ?, notes = coalesce(?, notes) WHERE id = ?");
        return $stmt->execute([$status, $adminId, $notes, $id]);
    }

    public function allPending(): array {
        $stmt = $this->db->query("SELECT mp.*, u.name as user_name, u.email as user_email FROM manual_payments mp JOIN users u ON mp.user_id = u.id WHERE mp.status = 'pending_verification' ORDER BY mp.id DESC");
        return $stmt->fetchAll();
    }

    public function all(): array {
        $stmt = $this->db->query("SELECT mp.*, u.name as user_name, u.email as user_email FROM manual_payments mp JOIN users u ON mp.user_id = u.id ORDER BY mp.id DESC");
        return $stmt->fetchAll();
    }
}
