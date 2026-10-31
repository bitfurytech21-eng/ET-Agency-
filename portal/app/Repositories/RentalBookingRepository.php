<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class RentalBookingRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO rental_bookings 
            (booking_reference, user_id, vehicle_id, pickup_date, return_date, pickup_location, return_location, total_days, daily_rate, subtotal, tax_and_fees, deposit_amount, total_amount, payment_method, payment_status, booking_status, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['booking_reference'],
            $data['user_id'],
            $data['vehicle_id'],
            $data['pickup_date'],
            $data['return_date'],
            $data['pickup_location'] ?? 'Executive Hub Terminal',
            $data['return_location'] ?? 'Executive Hub Terminal',
            $data['total_days'],
            $data['daily_rate'],
            $data['subtotal'],
            $data['tax_and_fees'] ?? 0.00,
            $data['deposit_amount'] ?? 0.00,
            $data['total_amount'],
            $data['payment_method'] ?? 'units_balance',
            $data['payment_status'] ?? 'paid',
            $data['booking_status'] ?? 'confirmed',
            $data['notes'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function findByUserId(int $userId): array {
        $stmt = $this->db->prepare("SELECT rb.*, v.name as vehicle_name, v.brand, v.model, v.primary_image 
            FROM rental_bookings rb 
            JOIN vehicles v ON rb.vehicle_id = v.id 
            WHERE rb.user_id = ? 
            ORDER BY rb.created_at DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll() ?: [];
    }

    public function findByReference(string $reference): ?array {
        $stmt = $this->db->prepare("SELECT rb.*, v.name as vehicle_name, v.brand, v.model, v.primary_image, v.horsepower, v.powertrain, u.name as customer_name, u.email as customer_email 
            FROM rental_bookings rb 
            JOIN vehicles v ON rb.vehicle_id = v.id 
            JOIN users u ON rb.user_id = u.id 
            WHERE rb.booking_reference = ?");
        $stmt->execute([$reference]);
        return $stmt->fetch() ?: null;
    }

    public function all(): array {
        $stmt = $this->db->query("SELECT rb.*, v.name as vehicle_name, u.name as customer_name, u.email as customer_email 
            FROM rental_bookings rb 
            JOIN vehicles v ON rb.vehicle_id = v.id 
            JOIN users u ON rb.user_id = u.id 
            ORDER BY rb.created_at DESC");
        return $stmt->fetchAll() ?: [];
    }

    public function updateStatus(int $id, string $status): bool {
        $stmt = $this->db->prepare("UPDATE rental_bookings SET booking_status = ? WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }
}
