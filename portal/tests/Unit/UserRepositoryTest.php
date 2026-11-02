<?php
require_once __DIR__ . '/../../bootstrap/app.php';

use App\Repositories\UserRepository;

echo "Running UserRepositoryTest... ";
$repo = new UserRepository();
$user = $repo->findByEmail('client@easytravellodging.com');
assert($user !== null, "User should be found by email");
assert($user['email'] === 'client@easytravellodging.com');
echo "PASSED\n";
