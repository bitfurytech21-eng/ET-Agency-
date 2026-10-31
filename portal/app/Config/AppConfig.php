<?php
namespace App\Config;

class AppConfig {
    private static ?array $config = null;

    public static function get(string $key, $default = null) {
        if (self::$config === null) {
            self::$config = require __DIR__ . '/../../config/app.php';
        }
        return self::$config[$key] ?? $default;
    }
}
