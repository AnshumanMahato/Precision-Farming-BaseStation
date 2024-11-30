CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY,
    temperature DECIMAL(4, 2) NOT NULL,
    humidity DECIMAL(4, 2) NOT NULL,
    moisture DECIMAL(4, 2) NOT NULL,
    created_at INTEGER NOT NULL
);