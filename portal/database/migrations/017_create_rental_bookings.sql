-- Migration 017: Rental Bookings
CREATE TABLE IF NOT EXISTS rental_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_location VARCHAR(200) DEFAULT 'Executive Hub Terminal (SFO/JFK/LAX)',
    return_location VARCHAR(200) DEFAULT 'Executive Hub Terminal (SFO/JFK/LAX)',
    total_days INT NOT NULL DEFAULT 1,
    daily_rate DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_and_fees DECIMAL(10,2) DEFAULT 0.00,
    deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'units_balance',
    payment_status VARCHAR(30) DEFAULT 'paid',
    booking_status VARCHAR(30) DEFAULT 'confirmed',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migration 018: Rental Pricing
CREATE TABLE IF NOT EXISTS rental_pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    season_name VARCHAR(100) DEFAULT 'Standard',
    start_date DATE,
    end_date DATE,
    multiplier DECIMAL(4,2) DEFAULT 1.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migration 019: Vehicle Availability
CREATE TABLE IF NOT EXISTS vehicle_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason VARCHAR(100) DEFAULT 'booked',
    rental_booking_id INTEGER REFERENCES rental_bookings(id)
);

-- Migration 020: Vehicle Maintenance
CREATE TABLE IF NOT EXISTS vehicle_maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) DEFAULT 0.00,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(30) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
