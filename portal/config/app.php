<?php
return [
    'name' => getenv('APP_NAME') ?: 'Easy Travel Lodging Portal',
    'env' => getenv('APP_ENV') ?: 'production',
    'debug' => (bool)(getenv('APP_DEBUG') ?: true),
    'url' => getenv('APP_URL') ?: 'http://localhost:3000/portal',
    'timezone' => 'America/Los_Angeles',
    'unit_price_usd' => (float)(getenv('UNIT_PRICE_USD') ?: 100),
    'currency' => getenv('CURRENCY') ?: 'USD',
];
