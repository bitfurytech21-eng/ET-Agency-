<?php
require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/../routes/web.php';
require_once __DIR__ . '/../routes/admin.php';
require_once __DIR__ . '/../routes/api.php';
require_once __DIR__ . '/../routes/payments.php';
require_once __DIR__ . '/../routes/car-rentals.php';

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

Router::dispatch($uri, $method);
