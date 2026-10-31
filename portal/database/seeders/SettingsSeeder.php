<?php
namespace Database\Seeders;

use App\Config\Database;

class SettingsSeeder {
    public static function run(): void {
        $db = Database::getConnection();

        // Seed Payment Account
        $stmt = $db->query("SELECT COUNT(*) as count FROM payment_accounts");
        if ($stmt->fetch()['count'] == 0) {
            $insert = $db->prepare("INSERT INTO payment_accounts (bank_name, account_name, account_number, routing_number, swift_code, zelle_identifier, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insert->execute([
                'Chase Bank, N.A.',
                'Easy Travel Lodging LLC',
                '7890123456',
                '121000358',
                'CHASUS33',
                'billing@easytravellodging.com',
                'Primary Operating Account for Corporate Wires and Midterm Invoices'
            ]);
            echo "SettingsSeeder: Default payment account seeded\n";
        }

        // Seed Units
        $units = [
            ['Unit 91 (#A)', 'Unit 91', '1 Bed / 1 Bath Executive Suite', 1, 1, 2500.00, 110.00],
            ['Unit 173 (#B)', 'Unit 173', '1 Bed / 1 Bath Garden Level Suite', 1, 1, 2500.00, 110.00],
            ['Unit 250 (#C)', 'Unit 250', '2 Bed / 2 Bath Deluxe Dual Suite', 2, 2, 2800.00, 130.00],
            ['Unit 333 (#D)', 'Unit 333', '2 Bed / 2 Bath Upper Level Retreat', 2, 2, 2800.00, 130.00],
            ['Unit 335 (#E)', 'Unit 335', '2 Bed / 2 Bath Executive Penthouse View', 2, 2, 2800.00, 130.00],
        ];

        foreach ($units as $u) {
            $check = $db->prepare("SELECT id FROM units WHERE unit_code = ?");
            $check->execute([$u[1]]);
            if (!$check->fetch()) {
                $ins = $db->prepare("INSERT INTO units (title, unit_code, category, beds, baths, monthly_rate, daily_rate) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $ins->execute($u);
            }
        }

        // Seed Vehicles
        $vehicles = [
            ['ford-mustang-gt', 'Ford Mustang GT Convertible', 'Muscle / Convertible', 145.00, 920.00, 3200.00, 486, 4, '5.0L Coyote V8', '10-Speed SelectShift Automatic', 0],
            ['tesla-model-y', 'Tesla Model Y Long Range', 'Electric Crossover AWD', 130.00, 840.00, 2900.00, 384, 5, 'Dual Motor All-Wheel Drive', 'Single-Speed Fixed Gear', 1],
            ['chevrolet-suburban', 'Chevrolet Suburban High Country', 'Full-Size Luxury SUV', 175.00, 1100.00, 3900.00, 420, 7, '6.2L EcoTec3 V8', '10-Speed Hydra-Matic Automatic', 0],
            ['cadillac-escalade', 'Cadillac Escalade ESV Platinum', 'Executive Ultra-Luxury SUV', 225.00, 1450.00, 4950.00, 420, 7, '6.2L V8 with Dynamic Fuel Management', '10-Speed Automatic with Electronic Precision Shift', 0],
            ['jeep-wrangler-rubicon', 'Jeep Wrangler Rubicon 4xe', 'Trail-Rated PHEV 4x4', 155.00, 990.00, 3450.00, 375, 5, '2.0L Turbo Plug-in Hybrid', '8-Speed Automatic 4x4', 0],
        ];

        foreach ($vehicles as $v) {
            $check = $db->prepare("SELECT id FROM vehicles WHERE slug = ?");
            $check->execute([$v[0]]);
            if (!$check->fetch()) {
                $ins = $db->prepare("INSERT INTO vehicles (slug, name, category, daily_rate, weekly_rate, monthly_rate, horsepower, seating, powertrain, transmission, is_electric) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $ins->execute($v);
            }
        }
    }
}
