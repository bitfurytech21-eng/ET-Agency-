<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class VehicleRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function all(?string $categorySlug = null, ?bool $electricOnly = null): array {
        $sql = "SELECT v.*, c.name as category_name, c.slug as category_slug 
                FROM vehicles v 
                LEFT JOIN vehicle_categories c ON v.category_id = c.id 
                WHERE 1=1";
        $params = [];

        if ($categorySlug) {
            $sql .= " AND c.slug = ?";
            $params[] = $categorySlug;
        }

        if ($electricOnly !== null) {
            $sql .= " AND v.is_electric = ?";
            $params[] = $electricOnly ? 1 : 0;
        }

        $sql .= " ORDER BY v.featured DESC, v.id ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll() ?: [];
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT v.*, c.name as category_name FROM vehicles v LEFT JOIN vehicle_categories c ON v.category_id = c.id WHERE v.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function findBySlug(string $slug): ?array {
        $stmt = $this->db->prepare("SELECT v.*, c.name as category_name FROM vehicles v LEFT JOIN vehicle_categories c ON v.category_id = c.id WHERE v.slug = ?");
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    public function search(array $filters): array {
        $sql = "SELECT v.*, c.name as category_name FROM vehicles v LEFT JOIN vehicle_categories c ON v.category_id = c.id WHERE v.status = 'available'";
        $params = [];

        if (!empty($filters['q'])) {
            $sql .= " AND (v.name LIKE ? OR v.brand LIKE ? OR v.model LIKE ?)";
            $searchTerm = '%' . $filters['q'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($filters['category'])) {
            $sql .= " AND c.slug = ?";
            $params[] = $filters['category'];
        }

        if (isset($filters['electric']) && $filters['electric'] !== '') {
            $sql .= " AND v.is_electric = ?";
            $params[] = (int)$filters['electric'];
        }

        if (!empty($filters['min_price'])) {
            $sql .= " AND v.daily_rate >= ?";
            $params[] = (float)$filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $sql .= " AND v.daily_rate <= ?";
            $params[] = (float)$filters['max_price'];
        }

        $sql .= " ORDER BY v.daily_rate ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll() ?: [];
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO vehicles (category_id, name, slug, brand, model, year, vin, license_plate, color, seating, horsepower, powertrain, transmission, is_electric, daily_rate, weekly_rate, monthly_rate, deposit_amount, status, featured, primary_image, three_d_model_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['category_id'] ?? 1,
            $data['name'],
            $data['slug'],
            $data['brand'] ?? 'US Luxury',
            $data['model'] ?? 'Executive',
            $data['year'] ?? 2024,
            $data['vin'] ?? null,
            $data['license_plate'] ?? null,
            $data['color'] ?? 'Onyx Black',
            $data['seating'] ?? 5,
            $data['horsepower'] ?? 300,
            $data['powertrain'] ?? 'Gasoline',
            $data['transmission'] ?? 'Automatic',
            $data['is_electric'] ?? 0,
            $data['daily_rate'] ?? 195.00,
            $data['weekly_rate'] ?? 1250.00,
            $data['monthly_rate'] ?? 4200.00,
            $data['deposit_amount'] ?? 500.00,
            $data['status'] ?? 'available',
            $data['featured'] ?? 0,
            $data['primary_image'] ?? '/assets/images/placeholder-car.jpg',
            $data['three_d_model_code'] ?? 'cadillac-escalade'
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("UPDATE vehicles SET name = ?, daily_rate = ?, status = ?, featured = ?, horsepower = ? WHERE id = ?");
        return $stmt->execute([
            $data['name'],
            $data['daily_rate'],
            $data['status'] ?? 'available',
            $data['featured'] ?? 0,
            $data['horsepower'] ?? 300,
            $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM vehicles WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
