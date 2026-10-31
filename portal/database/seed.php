<?php
require_once __DIR__ . '/../app/Config/Database.php';
require_once __DIR__ . '/../app/Helpers/Security.php';
require_once __DIR__ . '/seeders/AdminSeeder.php';
require_once __DIR__ . '/seeders/SettingsSeeder.php';

use Database\Seeders\AdminSeeder;
use Database\Seeders\SettingsSeeder;

echo "Running seeders...\n";
AdminSeeder::run();
SettingsSeeder::run();
echo "All seeders executed successfully.\n";
