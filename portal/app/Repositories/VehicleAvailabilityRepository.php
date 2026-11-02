<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class VehicleAvailabilityRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function checkAvailability(int $vehicleId, string $pickupDate, string $returnDate): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM vehicle_availability 
            WHERE vehicle_id = ? AND blocked_date BETWEEN ? AND ?");
        $stmt->execute([$vehicleId, $pickupDate, $returnDate]);
        $row = $stmt->fetch();
        return ($row['count'] ?? 0) == 0;
    }

    public function blockDates(int $vehicleId, string $startDate, string $endDate, string $reason = 'booked', ?int $bookingId = null): void {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $interval = new \DateInterval('P1D');
        $daterange = new \DatePeriod($start, $interval, $end);

        $stmt = $this->db->prepare("INSERT INTO vehicle_availability (vehicle_id, blocked_date, reason, rental_booking_id) VALUES (?, ?, ?, ?)");
        foreach ($daterange as $date) {
            $stmt->execute([$vehicleId, $date->format('Y-m-d'), $reason, $bookingId]);
        }
    }
}
