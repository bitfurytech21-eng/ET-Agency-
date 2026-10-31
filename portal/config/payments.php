<?php
return [
    'bank_name' => getenv('PAYMENT_BANK_NAME') ?: 'Chase Bank, N.A.',
    'account_name' => getenv('PAYMENT_ACCOUNT_NAME') ?: 'Easy Travel Lodging LLC',
    'account_number' => getenv('PAYMENT_ACCOUNT_NUMBER') ?: '7890123456',
    'routing_number' => getenv('PAYMENT_ROUTING_NUMBER') ?: '121000358',
    'swift' => getenv('PAYMENT_WIRE_SWIFT') ?: 'CHASUS33',
    'zelle' => getenv('PAYMENT_ZELLE') ?: 'billing@easytravellodging.com',
    'allowed_methods' => ['wire', 'ach', 'zelle', 'balance_units'],
    'unit_rate' => 100.00,
];
