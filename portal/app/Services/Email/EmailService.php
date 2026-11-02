<?php
namespace App\Services\Email;

class EmailService {
    public static function send(string $to, string $subject, string $body): bool {
        // Log to storage/logs/mail.log for testability and reliable auditing
        $logPath = __DIR__ . '/../../../storage/logs/mail.log';
        $entry = "[" . date('Y-m-d H:i:s') . "] TO: {$to} | SUBJECT: {$subject} | BODY: {$body}\n";
        file_put_contents($logPath, $entry, FILE_APPEND);
        return true;
    }
}
