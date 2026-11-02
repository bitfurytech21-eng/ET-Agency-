<?php
require_once __DIR__ . '/../app/Config/Database.php';

use App\Config\Database;

echo "Running migrations...\n";
$db = Database::getConnection();

$files = glob(__DIR__ . '/migrations/*.sql');
sort($files);

foreach ($files as $file) {
    echo "Migrating: " . basename($file) . "... ";
    $sql = file_get_contents($file);
    $db->exec($sql);
    echo "DONE\n";
}

echo "All migrations completed successfully.\n";
