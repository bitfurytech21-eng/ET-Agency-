<?php
namespace Database\Seeders;

use App\Config\Database;
use App\Helpers\Security;

class AdminSeeder {
    public static function run(): void {
        $db = Database::getConnection();
        
        // Seed Superadmin
        $stmt = $db->prepare("SELECT id FROM admins WHERE email = ?");
        $stmt->execute(['admin@easytravellodging.com']);
        if (!$stmt->fetch()) {
            $insert = $db->prepare("INSERT INTO admins (name, email, password_hash, role, permissions) VALUES (?, ?, ?, ?, ?)");
            $insert->execute([
                'Bill & Marlena Administrator',
                'admin@easytravellodging.com',
                Security::hashPassword('admin12345'),
                'superadmin',
                'all'
            ]);
            echo "AdminSeeder: Default admin seeded (admin@easytravellodging.com / admin12345)\n";
        }

        // Seed Customer
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute(['client@easytravellodging.com']);
        if (!$stmt->fetch()) {
            $insert = $db->prepare("INSERT INTO users (name, email, password_hash, company, role, phone, units_balance, balance_usd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $insert->execute([
                'Dr. Marcus Vance',
                'client@easytravellodging.com',
                Security::hashPassword('welcome123'),
                'UC Davis Health Medical Center',
                'Visiting Surgery Fellow',
                '(916) 426-3655',
                50,
                5000.00
            ]);
            echo "AdminSeeder: Default demo client seeded (client@easytravellodging.com / welcome123)\n";
        }
    }
}
