<?php
use App\Services\Payments\WebhookHandler;
use App\Helpers\Response;

Router::post('/api/payments/webhook/{provider}', function($provider) {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    $res = WebhookHandler::handle($provider, $payload);
    Response::json($res);
});
