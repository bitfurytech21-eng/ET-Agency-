<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class TransactionRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int {
        $ref = 'TX-' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 10));
        $stmt = $this->db->prepare("INSERT INTO unit_transactions (transaction_ref, user_id, type, units, amount_usd, booking_id, description, command_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $ref,
            $data['user_id'],
            $data['type'],
            $data['units'],
            $data['amount_usd'],
            $data['booking_id'] ?? null,
            $data['description'] ?? '',
            $data['command_code'] ?? null,
            $data['status'] ?? 'completed'
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function getForUser(int $userId): array {
        $stmt = $this->db->prepare("SELECT * FROM unit_transactions WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function all(int $limit = 100): array {
        $stmt = $this->db->query("SELECT t.*, u.name as user_name, u.email as user_email FROM unit_transactions t JOIN users u ON t.user_id = u.id ORDER BY t.id DESC LIMIT {$limit}");
        return $stmt->fetchAll();
    }
}
