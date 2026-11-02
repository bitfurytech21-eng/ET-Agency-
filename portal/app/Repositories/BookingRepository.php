<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class BookingRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByReference(string $ref): ?array {
        $stmt = $this->db->prepare("SELECT * FROM bookings WHERE booking_reference = ?");
        $stmt->execute([$ref]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getForUser(int $userId): array {
        $stmt = $this->db->prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function create(array $data): int {
        $ref = 'BK-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        $stmt = $this->db->prepare("INSERT INTO bookings (booking_reference, user_id, property_id, guest_name, guest_email, guest_phone, check_in, check_out, total_nights, adults, children, units_cost, total_amount_usd, status, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $ref,
            $data['user_id'] ?? null,
            $data['property_id'],
            $data['guest_name'],
            $data['guest_email'],
            $data['guest_phone'],
            $data['check_in'],
            $data['check_out'],
            $data['total_nights'] ?? 30,
            $data['adults'] ?? 1,
            $data['children'] ?? 0,
            $data['units_cost'] ?? 25,
            $data['total_amount_usd'] ?? 2500.00,
            $data['status'] ?? 'pending',
            $data['payment_method'] ?? 'balance_units',
            $data['notes'] ?? ''
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status, int $settledUnits = 0): bool {
        $stmt = $this->db->prepare("UPDATE bookings SET status = ?, settled_from_units = ? WHERE id = ?");
        return $stmt->execute([$status, $settledUnits, $id]);
    }

    public function all(int $limit = 100): array {
        $stmt = $this->db->query("SELECT * FROM bookings ORDER BY id DESC LIMIT {$limit}");
        return $stmt->fetchAll();
    }
}
