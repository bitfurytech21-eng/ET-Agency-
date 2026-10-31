-- Migration 016: Vehicle Images
CREATE TABLE IF NOT EXISTS vehicle_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(150),
    is_primary TINYINT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
