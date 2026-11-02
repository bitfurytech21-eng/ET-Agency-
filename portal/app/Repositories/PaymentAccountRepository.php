<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

class PaymentAccountRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getActive(): array {
        $stmt = $this->db->query("SELECT * FROM payment_accounts WHERE is_active = 1 ORDER BY id ASC");
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM payment_accounts WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }
}
