-- Migration 015: Vehicles Schema Update & Initial American Fleet
CREATE TABLE IF NOT EXISTS vehicles_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES vehicle_categories(id),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    vin VARCHAR(50),
    license_plate VARCHAR(50),
    color VARCHAR(50) DEFAULT 'Onyx Black',
    seating INT DEFAULT 5,
    horsepower INT DEFAULT 300,
    powertrain VARCHAR(50) DEFAULT 'Gasoline',
    transmission VARCHAR(50) DEFAULT 'Automatic',
    is_electric TINYINT DEFAULT 0,
    daily_rate DECIMAL(10,2) NOT NULL DEFAULT 150.00,
    weekly_rate DECIMAL(10,2) DEFAULT 950.00,
    monthly_rate DECIMAL(10,2) DEFAULT 3500.00,
    deposit_amount DECIMAL(10,2) DEFAULT 500.00,
    status VARCHAR(30) DEFAULT 'available',
    featured TINYINT DEFAULT 0,
    primary_image VARCHAR(255),
    three_d_model_code VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS vehicles;
ALTER TABLE vehicles_new RENAME TO vehicles;

INSERT OR IGNORE INTO vehicles (id, category_id, name, slug, brand, model, year, seating, horsepower, powertrain, transmission, is_electric, daily_rate, weekly_rate, monthly_rate, deposit_amount, status, featured, primary_image, three_d_model_code) VALUES 
(1, 1, 'Cadillac Escalade ESV V-Series', 'cadillac-escalade-esv', 'Cadillac', 'Escalade ESV', 2024, 7, 682, '6.2L Supercharged V8', '10-Speed Automatic', 0, 295.00, 1850.00, 6200.00, 1000.00, 'available', 1, '/assets/images/escalade.jpg', 'cadillac-escalade'),
(2, 2, 'Tesla Model S Plaid', 'tesla-model-s-plaid', 'Tesla', 'Model S Plaid', 2024, 5, 1020, 'Tri-Motor AWD', 'Direct Drive Single-Speed', 1, 245.00, 1550.00, 5100.00, 750.00, 'available', 1, '/assets/images/models.jpg', 'tesla-model-s'),
(3, 1, 'Lincoln Navigator Black Label', 'lincoln-navigator-black-label', 'Lincoln', 'Navigator', 2024, 7, 440, '3.5L Twin-Turbo V6', '10-Speed Automatic', 0, 265.00, 1680.00, 5600.00, 800.00, 'available', 1, '/assets/images/navigator.jpg', 'lincoln-navigator'),
(4, 4, 'Ford F-150 Lightning Platinum', 'ford-f150-lightning', 'Ford', 'F-150 Lightning', 2024, 5, 580, 'Dual Motor Extended Range', 'Single-Speed', 1, 195.00, 1250.00, 4200.00, 600.00, 'available', 0, '/assets/images/f150.jpg', 'ford-f150'),
(5, 1, 'Chevrolet Tahoe High Country', 'chevrolet-tahoe-high-country', 'Chevrolet', 'Tahoe', 2024, 8, 420, '6.2L EcoTec3 V8', '10-Speed Automatic', 0, 210.00, 1350.00, 4500.00, 600.00, 'available', 0, '/assets/images/tahoe.jpg', 'chevy-tahoe');
