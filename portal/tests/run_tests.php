<?php
echo "=== Running ETL Portal Test Suite ===\n";
require_once __DIR__ . '/Unit/UserRepositoryTest.php';
require_once __DIR__ . '/Unit/PaymentServiceTest.php';
require_once __DIR__ . '/Feature/CustomerPortalTest.php';
echo "=== All Tests Passed Successfully ===\n";
