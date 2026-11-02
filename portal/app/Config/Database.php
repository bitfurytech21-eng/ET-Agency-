<?php
namespace App\Config;

use PDO;
use Exception;

class Database {
    private static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection === null) {
            $config = require __DIR__ . '/../../config/database.php';
            $driver = $config['default'] ?? 'sqlite';

            if ($driver === 'sqlite') {
                $dbPath = $config['connections']['sqlite']['database'];
                $dir = dirname($dbPath);
                if (!is_dir($dir)) {
                    mkdir($dir, 0777, true);
                }
                self::$connection = new PDO("sqlite:" . $dbPath);
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                self::$connection->exec("PRAGMA foreign_keys = ON;");
            } else {
                $my = $config['connections']['mysql'];
                $dsn = "mysql:host={$my['host']};port={$my['port']};dbname={$my['database']};charset={$my['charset']}";
                self::$connection = new PDO($dsn, $my['username'], $my['password'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            }
        }
        return self::$connection;
    }
}
