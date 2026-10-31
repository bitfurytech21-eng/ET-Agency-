<?php
return [
    'mailer' => getenv('MAIL_MAILER') ?: 'smtp',
    'host' => getenv('MAIL_HOST') ?: 'smtp.gmail.com',
    'port' => (int)(getenv('MAIL_PORT') ?: 587),
    'username' => getenv('MAIL_USERNAME') ?: 'reservations@easytravellodging.com',
    'password' => getenv('MAIL_PASSWORD') ?: '',
    'encryption' => getenv('MAIL_ENCRYPTION') ?: 'tls',
    'from' => [
        'address' => getenv('MAIL_FROM_ADDRESS') ?: 'reservations@easytravellodging.com',
        'name' => getenv('MAIL_FROM_NAME') ?: 'Easy Travel Lodging',
    ],
];
