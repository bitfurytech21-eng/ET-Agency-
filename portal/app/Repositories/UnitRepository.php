<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class UnitRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function all(): array {
        $stmt = $this->db->query("SELECT * FROM units ORDER BY unit_code ASC");
        return $stmt->fetchAll();
    }

    public function findByCode(string $code): ?array {
        $stmt = $this->db->prepare("SELECT * FROM units WHERE unit_code = ?");
        $stmt->execute([$code]);
        return $stmt->fetch() ?: null;
    }
}
