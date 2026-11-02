<?php
namespace App\Services\Email;

use App\Config\Database;

class NotificationService {
    public static function create(int $userId, string $title, string $message, string $type = 'info'): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $message, $type]);
    }
}
