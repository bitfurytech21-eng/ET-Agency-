<?php
/**
 * Easy Travel Lodging - PHP Customer Authentication Service
 * Usage: php auth.php <action> <json_payload>
 */

require_once __DIR__ . '/db.php';

$action = $argv[1] ?? '';
$inputJson = $argv[2] ?? '{}';
$payload = json_decode($inputJson, true) ?: [];

header('Content-Type: application/json');

function send_json($data, $status = 200) {
    echo json_encode($data);
    exit($status === 200 ? 0 : 1);
}

$db = get_customer_db();

if ($action === 'login') {
    $email = strtolower(trim($payload['email'] ?? ''));
    $password = $payload['password'] ?? '';

    if (!$email || !$password) {
        send_json(['success' => false, 'message' => 'Email and password are required'], 400);
    }

    $customer = null;
    foreach ($db['customers'] as $c) {
        if (strtolower($c['email']) === $email) {
            $customer = $c;
            break;
        }
    }

    if (!$customer || !password_verify($password, $customer['password_hash'])) {
        send_json(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    // Generate token
    $token = bin2hex(random_bytes(24));
    $db['sessions'][$token] = [
        'customer_id' => $customer['id'],
        'created_at' => date('c'),
        'expires_at' => date('c', strtotime('+7 days'))
    ];
    save_customer_db($db);

    unset($customer['password_hash']);
    send_json([
        'success' => true,
        'token' => $token,
        'customer' => $customer,
        'message' => 'Signed in successfully via PHP auth engine'
    ]);
}

if ($action === 'register') {
    $name = trim($payload['name'] ?? '');
    $email = strtolower(trim($payload['email'] ?? ''));
    $password = $payload['password'] ?? '';
    $company = trim($payload['company'] ?? 'Independent Professional');
    $role = trim($payload['role'] ?? 'Traveling Professional');
    $phone = trim($payload['phone'] ?? '(916) 426-3655');

    if (!$name || !$email || strlen($password) < 6) {
        send_json(['success' => false, 'message' => 'Please provide valid name, email, and at least 6-character password.'], 400);
    }

    foreach ($db['customers'] as $c) {
        if (strtolower($c['email']) === $email) {
            send_json(['success' => false, 'message' => 'An account with this email address already exists.'], 409);
        }
    }

    $customerId = 'cust_' . time() . '_' . rand(100, 999);
    $initialUnits = 25; // 25 Units ($2,500 value) complimentary welcome allocation
    $initialBalance = $initialUnits * 100.00;

    $newCustomer = [
        'id' => $customerId,
        'name' => $name,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        'company' => $company,
        'role' => $role,
        'phone' => $phone,
        'balance_usd' => $initialBalance,
        'units_balance' => $initialUnits,
        'created_at' => date('c'),
        'purchases' => [
            [
                'id' => 'pch_' . time(),
                'description' => 'Account Activation Welcome Allotment (25 Units)',
                'unit_number' => 'Sacramento Flex Allotment',
                'units_purchased' => $initialUnits,
                'amount_usd' => $initialBalance,
                'status' => 'active',
                'purchased_at' => date('c'),
                'payment_method' => 'Welcome Credit Tier',
            ]
        ],
        'transactions' => [
            [
                'id' => 'tx_' . time(),
                'type' => 'welcome_credit',
                'units' => $initialUnits,
                'amount_usd' => $initialBalance,
                'description' => 'Welcome Account Activation Allotment',
                'date' => date('c'),
            ]
        ]
    ];

    $db['customers'][] = $newCustomer;
    $token = bin2hex(random_bytes(24));
    $db['sessions'][$token] = [
        'customer_id' => $customerId,
        'created_at' => date('c'),
        'expires_at' => date('c', strtotime('+7 days'))
    ];
    save_customer_db($db);

    unset($newCustomer['password_hash']);
    send_json([
        'success' => true,
        'token' => $token,
        'customer' => $newCustomer,
        'message' => 'Account created and authenticated via PHP engine'
    ]);
}

if ($action === 'verify') {
    $token = $payload['token'] ?? '';
    if (!$token || !isset($db['sessions'][$token])) {
        send_json(['success' => false, 'message' => 'Session expired or invalid'], 401);
    }

    $session = $db['sessions'][$token];
    $customer = null;
    foreach ($db['customers'] as $c) {
        if ($c['id'] === $session['customer_id']) {
            $customer = $c;
            break;
        }
    }

    if (!$customer) {
        send_json(['success' => false, 'message' => 'Customer profile not found'], 404);
    }

    unset($customer['password_hash']);
    send_json([
        'success' => true,
        'customer' => $customer
    ]);
}

send_json(['success' => false, 'message' => 'Invalid action'], 400);
