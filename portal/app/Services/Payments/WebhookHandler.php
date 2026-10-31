<?php
namespace App\Services\Payments;

class WebhookHandler {
    public static function handle(string $provider, array $payload): array {
        return [
            'received' => true,
            'provider' => $provider,
            'timestamp' => time()
        ];
    }
}
