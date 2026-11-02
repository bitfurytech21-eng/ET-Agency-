<?php
namespace App\Config;

class MailConfig {
    public static function getConfig(): array {
        return require __DIR__ . '/../../config/email.php';
    }
}
