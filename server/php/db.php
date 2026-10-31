<?php
/**
 * Easy Travel Lodging - PHP Customer Data Storage Helper
 */

define('DATA_DIR', dirname(__DIR__, 2) . '/data');
define('CUSTOMERS_FILE', DATA_DIR . '/php_customers.json');
define('MAIN_DB_FILE', DATA_DIR . '/db.json');

function ensure_data_files() {
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }

    if (!file_exists(CUSTOMERS_FILE)) {
        // Seed initial demo customer with active balance and purchase records
        $defaultCustomers = [
            'customers' => [
                [
                    'id' => 'cust_demo_01',
                    'name' => 'Dr. Marcus Vance',
                    'email' => 'client@easytravellodging.com',
                    'password_hash' => password_hash('welcome123', PASSWORD_BCRYPT),
                    'company' => 'UC Davis Health Medical Center',
                    'role' => 'Visiting Surgery Fellow',
                    'phone' => '(916) 426-3655',
                    'balance_usd' => 8400.00,
                    'units_balance' => 84, // 1 Unit = $100 lodging credit
                    'created_at' => date('c', strtotime('-30 days')),
                    'purchases' => [
                        [
                            'id' => 'pch_101',
                            'description' => 'Corporate Lodging Package - Unit 173 (Q4)',
                            'unit_number' => 'Unit 173',
                            'units_purchased' => 50,
                            'amount_usd' => 5000.00,
                            'status' => 'active',
                            'purchased_at' => date('c', strtotime('-14 days')),
                            'payment_method' => 'Corporate Wire',
                        ],
                        [
                            'id' => 'pch_102',
                            'description' => 'Prepaid Executive Stays Credit (34 Units)',
                            'unit_number' => 'Flex Units',
                            'units_purchased' => 34,
                            'amount_usd' => 3400.00,
                            'status' => 'active',
                            'purchased_at' => date('c', strtotime('-5 days')),
                            'payment_method' => 'Direct ACH',
                        ]
                    ],
                    'transactions' => [
                        [
                            'id' => 'tx_901',
                            'type' => 'credit_purchase',
                            'units' => 50,
                            'amount_usd' => 5000.00,
                            'description' => 'Initial Unit Purchase - 50 Units',
                            'date' => date('c', strtotime('-14 days')),
                        ],
                        [
                            'id' => 'tx_902',
                            'type' => 'credit_purchase',
                            'units' => 34,
                            'amount_usd' => 3400.00,
                            'description' => 'Tier 2 Credit Recharge - 34 Units',
                            'date' => date('c', strtotime('-5 days')),
                        ]
                    ]
                ]
            ],
            'sessions' => []
        ];
        file_put_contents(CUSTOMERS_FILE, json_encode($defaultCustomers, JSON_PRETTY_PRINT));
    }
}

function get_customer_db() {
    ensure_data_files();
    $raw = file_get_contents(CUSTOMERS_FILE);
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $data = ['customers' => [], 'sessions' => []];
    }
    return $data;
}

function save_customer_db($data) {
    ensure_data_files();
    file_put_contents(CUSTOMERS_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function get_main_db() {
    if (file_exists(MAIN_DB_FILE)) {
        $raw = file_get_contents(MAIN_DB_FILE);
        $data = json_decode($raw, true);
        if (is_array($data)) return $data;
    }
    return ['bookings' => [], 'properties' => []];
}

function save_main_db($data) {
    if (file_exists(MAIN_DB_FILE)) {
        file_put_contents(MAIN_DB_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}
