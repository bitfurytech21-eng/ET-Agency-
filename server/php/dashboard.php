<?php
/**
 * Easy Travel Lodging - PHP Customer Dashboard Service
 * Usage: php dashboard.php <action> <json_payload>
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

$token = $payload['token'] ?? '';
$db = get_customer_db();

if (!$token || !isset($db['sessions'][$token])) {
    send_json(['success' => false, 'message' => 'Unauthorized - Valid PHP session token required'], 401);
}

$customerId = $db['sessions'][$token]['customer_id'];
$customerIndex = -1;
$customer = null;

foreach ($db['customers'] as $idx => $c) {
    if ($c['id'] === $customerId) {
        $customer = $c;
        $customerIndex = $idx;
        break;
    }
}

if (!$customer) {
    send_json(['success' => false, 'message' => 'Customer profile not found'], 404);
}

if ($action === 'get') {
    // Pull bookings from main db matching this customer's email
    $mainDb = get_main_db();
    $customerBookings = [];
    $customerEmail = strtolower($customer['email']);

    if (isset($mainDb['bookings']) && is_array($mainDb['bookings'])) {
        foreach ($mainDb['bookings'] as $b) {
            if (isset($b['guestEmail']) && strtolower($b['guestEmail']) === $customerEmail) {
                $customerBookings[] = $b;
            }
        }
    }

    // Default sample booking if none yet for display
    if (empty($customerBookings)) {
        $customerBookings = [
            [
                'id' => 'bk_rec_910',
                'propertyId' => 'unit-173',
                'guestName' => $customer['name'],
                'guestEmail' => $customer['email'],
                'guestPhone' => $customer['phone'] ?? '(916) 426-3655',
                'checkIn' => date('Y-m-d', strtotime('+7 days')),
                'checkOut' => date('Y-m-d', strtotime('+37 days')),
                'totalNights' => 30,
                'adults' => 1,
                'children' => 0,
                'status' => 'confirmed',
                'unitCostUnits' => 25,
                'unitCostUsd' => 2500,
                'notes' => 'Reserved for visiting executive assignment',
                'paymentProvider' => 'manual',
                'createdAt' => date('c', strtotime('-3 days')),
            ]
        ];
    }

    unset($customer['password_hash']);

    send_json([
        'success' => true,
        'customer' => $customer,
        'bookings' => $customerBookings,
        'purchases' => $customer['purchases'] ?? [],
        'transactions' => $customer['transactions'] ?? [],
        'units_balance' => $customer['units_balance'] ?? 0,
        'balance_usd' => $customer['balance_usd'] ?? 0.00,
        'engine' => 'PHP 8.2 Customer Portal Engine'
    ]);
}

if ($action === 'buy_units') {
    $units = intval($payload['units'] ?? 0);
    $packageType = trim($payload['package_type'] ?? 'Standard Unit Credit Pack');
    $paymentMethod = trim($payload['payment_method'] ?? 'Invoice / ACH');

    if ($units <= 0) {
        send_json(['success' => false, 'message' => 'Units to purchase must be greater than 0'], 400);
    }

    $costPerUnit = 100.00; // 1 Unit = $100
    $totalCost = $units * $costPerUnit;

    $purchaseRecord = [
        'id' => 'pch_' . time() . '_' . rand(10, 99),
        'description' => "Purchased {$units} Lodging Units ({$packageType})",
        'unit_number' => 'Flex Unit Credits',
        'units_purchased' => $units,
        'amount_usd' => $totalCost,
        'status' => 'active',
        'purchased_at' => date('c'),
        'payment_method' => $paymentMethod,
    ];

    $transactionRecord = [
        'id' => 'tx_' . time() . '_' . rand(10, 99),
        'type' => 'unit_purchase',
        'units' => $units,
        'amount_usd' => $totalCost,
        'description' => "Purchased {$units} Units via {$paymentMethod}",
        'date' => date('c'),
    ];

    $db['customers'][$customerIndex]['units_balance'] = ($db['customers'][$customerIndex]['units_balance'] ?? 0) + $units;
    $db['customers'][$customerIndex]['balance_usd'] = ($db['customers'][$customerIndex]['balance_usd'] ?? 0) + $totalCost;
    $db['customers'][$customerIndex]['purchases'][] = $purchaseRecord;
    $db['customers'][$customerIndex]['transactions'][] = $transactionRecord;

    save_customer_db($db);

    send_json([
        'success' => true,
        'message' => "Successfully purchased {$units} units! Balance updated.",
        'purchase' => $purchaseRecord,
        'new_units_balance' => $db['customers'][$customerIndex]['units_balance'],
        'new_balance_usd' => $db['customers'][$customerIndex]['balance_usd'],
    ]);
}

send_json(['success' => false, 'message' => 'Invalid dashboard action'], 400);
