-- Migration 014: Vehicle Categories
CREATE TABLE IF NOT EXISTS vehicle_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'car',
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO vehicle_categories (id, name, slug, description, icon, display_order) VALUES 
(1, 'Luxury SUV', 'luxury-suv', 'Full-size American executive luxury SUVs with maximum passenger comfort.', 'shield-check', 1),
(2, 'Executive Sedan', 'executive-sedan', 'High-performance flagship electric and executive sedans.', 'zap', 2),
(3, 'Electric Performance', 'electric-performance', 'Next-gen long range zero-emission luxury electric vehicles.', 'battery-charging', 3),
(4, 'Heavy Duty Pickup', 'heavy-duty-pickup', 'Full-size electric and hybrid high-torque utility trucks.', 'truck', 4);
