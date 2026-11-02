<?php
require_once __DIR__ . '/../../bootstrap/app.php';

use App\Services\Payments\PaymentService;
use App\Repositories\UserRepository;

echo "Running PaymentServiceTest... ";
$paymentService = new PaymentService();
$userRepo = new UserRepository();

$user = $userRepo->findByEmail('client@easytravellodging.com');
assert($user !== null, "Demo user should exist");
assert($user['units_balance'] >= 0, "Units balance should be non-negative");

echo "PASSED\n";
