CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT '',
    role VARCHAR(100) DEFAULT 'Guest',
    phone VARCHAR(50) DEFAULT '',
    units_balance INTEGER DEFAULT 0,
    balance_usd DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'superadmin', 'manager', 'accountant'
    permissions TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER,
    property_id VARCHAR(50) NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_nights INTEGER NOT NULL,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    units_cost INTEGER DEFAULT 0,
    total_amount_usd DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'settled', 'cancelled'
    payment_method VARCHAR(50) DEFAULT 'wire',
    settled_from_units INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    beds INTEGER NOT NULL,
    baths INTEGER NOT NULL,
    monthly_rate DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unit_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'purchase', 'settlement', 'refund', 'bonus'
    units INTEGER NOT NULL,
    amount_usd DECIMAL(10,2) NOT NULL,
    booking_id INTEGER,
    description TEXT,
    command_code VARCHAR(100) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2) NOT NULL,
    monthly_rate DECIMAL(10,2) NOT NULL,
    horsepower INTEGER DEFAULT 300,
    seating INTEGER DEFAULT 5,
    powertrain VARCHAR(100) DEFAULT 'Gasoline',
    transmission VARCHAR(100) DEFAULT '10-Speed Automatic',
    is_electric INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_ref VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    booking_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    method VARCHAR(50) NOT NULL, -- 'wire', 'ach', 'zelle', 'balance_units', 'card'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    admin_id INTEGER,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_type VARCHAR(50) NOT NULL, -- 'user', 'admin', 'system'
    actor_id INTEGER,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manual_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    booking_id INTEGER,
    payment_account_id INTEGER,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    sender_name VARCHAR(255),
    sender_bank VARCHAR(255),
    transaction_number VARCHAR(100),
    transfer_date DATE,
    status VARCHAR(50) DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'rejected'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    verified_by INTEGER NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_proofs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manual_payment_id INTEGER NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manual_payment_id) REFERENCES manual_payments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_name VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    routing_number VARCHAR(100) NOT NULL,
    swift_code VARCHAR(100),
    zelle_identifier VARCHAR(255),
    notes TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_verification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manual_payment_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manual_payment_id) REFERENCES manual_payments(id) ON DELETE CASCADE
);
