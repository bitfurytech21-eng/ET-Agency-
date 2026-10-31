<?php
/**
 * Easy Travel Lodging - Internal Balance Settlement (Checkout with Units)
 * Note: Internal command execution for paying bookings from customer units balance.
 * Usage: php checkout_balance.php <action> <json_payload>
 */

require_once __DIR__ . '/db.php';

$action = $argv[1] ?? 'pay';
$inputJson = $argv[2] ?? '{}';
$payload = json_decode($inputJson, true) ?: [];

header('Content-Type: application/json');

function send_json($data, $status = 200) {
    echo json_encode($data);
    exit($status === 200 ? 0 : 1);
}

$token = $payload['token'] ?? '';
$bookingId = trim($payload['booking_id'] ?? '');
$unitsRequired = intval($payload['units'] ?? 0);
$commandCode = trim($payload['command_code'] ?? 'INTERNAL_EXEC_PAY_FROM_BALANCE');

$db = get_customer_db();

if (!$token || !isset($db['sessions'][$token])) {
    send_json(['success' => false, 'message' => 'Unauthorized: Valid session token required for internal command execution.'], 401);
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

$currentUnits = intval($customer['units_balance'] ?? 0);

// If units not specified, calculate standard 25 units for a 30-day unit reservation ($2,500)
if ($unitsRequired <= 0) {
    $unitsRequired = 25;
}

if ($currentUnits < $unitsRequired) {
    send_json([
        'success' => false,
        'message' => "Insufficient unit balance. Customer has {$currentUnits} units available, but {$unitsRequired} units are required for this booking settlement.",
        'current_units' => $currentUnits,
        'required_units' => $unitsRequired
    ], 400);
}

// Perform deduction
$newUnits = $currentUnits - $unitsRequired;
$amountUsdDeducted = $unitsRequired * 100.00;
$newBalanceUsd = max(0, ($customer['balance_usd'] ?? 0) - $amountUsdDeducted);

$db['customers'][$customerIndex]['units_balance'] = $newUnits;
$db['customers'][$customerIndex]['balance_usd'] = $newBalanceUsd;

// Add transaction to ledger
$txId = 'tx_pay_' . time() . '_' . rand(100, 999);
$settlementTx = [
    'id' => $txId,
    'type' => 'balance_settlement',
    'units' => -$unitsRequired,
    'amount_usd' => -$amountUsdDeducted,
    'booking_id' => $bookingId ?: 'Direct_Unit_Settlement',
    'description' => "Internal Command: Settled Booking {$bookingId} using {$unitsRequired} dashboard units",
    'command_code' => $commandCode,
    'date' => date('c'),
    'status' => 'settled'
];
$db['customers'][$customerIndex]['transactions'][] = $settlementTx;
save_customer_db($db);

// Update booking in main db if bookingId provided
$mainDb = get_main_db();
$updatedBooking = null;
if (isset($mainDb['bookings']) && is_array($mainDb['bookings'])) {
    foreach ($mainDb['bookings'] as &$b) {
        if ($b['id'] === $bookingId || (isset($b['propertyId']) && $b['propertyId'] === $bookingId)) {
            $b['status'] = 'confirmed';
            $b['paymentProvider'] = 'unit_balance';
            $b['paymentReference'] = $txId;
            $b['notes'] = ($b['notes'] ? $b['notes'] . ' | ' : '') . "[Internal Settlement: Paid with {$unitsRequired} units from {$customer['name']} balance]";
            $updatedBooking = $b;
            break;
        }
    }
    save_main_db($mainDb);
}

send_json([
    'success' => true,
    'message' => "Internal command executed successfully: {$unitsRequired} units deducted from balance to settle booking {$bookingId}.",
    'internal_command' => $commandCode,
    'booking_id' => $bookingId,
    'units_deducted' => $unitsRequired,
    'amount_usd_deducted' => $amountUsdDeducted,
    'remaining_units' => $newUnits,
    'remaining_balance_usd' => $newBalanceUsd,
    'transaction' => $settlementTx,
    'booking' => $updatedBooking,
    'timestamp' => date('c')
]);
