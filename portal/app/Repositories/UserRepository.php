<?php
namespace App\Repositories;

use App\Config\Database;
use App\Models\User;
use PDO;

class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password_hash, company, role, phone, units_balance, balance_usd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            strtolower($data['email']),
            $data['password_hash'],
            $data['company'] ?? '',
            $data['role'] ?? 'Client',
            $data['phone'] ?? '',
            $data['units_balance'] ?? 0,
            $data['balance_usd'] ?? 0.00
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function updateBalance(int $userId, int $unitsDelta, float $amountDelta): bool {
        $stmt = $this->db->prepare("UPDATE users SET units_balance = units_balance + ?, balance_usd = balance_usd + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        return $stmt->execute([$unitsDelta, $amountDelta, $userId]);
    }

    public function all(int $limit = 100): array {
        $stmt = $this->db->query("SELECT id, name, email, company, role, phone, units_balance, balance_usd, status, created_at FROM users ORDER BY id DESC LIMIT {$limit}");
        return $stmt->fetchAll();
    }
}
