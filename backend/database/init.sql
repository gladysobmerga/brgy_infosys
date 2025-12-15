-- Create tables for Barangay Information System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Residents table
CREATE TABLE IF NOT EXISTS residents (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    suffix VARCHAR(10),
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(100),
    gender VARCHAR(10) NOT NULL,
    civil_status VARCHAR(20) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Filipino',
    occupation VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    house_number VARCHAR(20),
    street VARCHAR(100),
    purok VARCHAR(50),
    voter_status BOOLEAN DEFAULT false,
    pwd_status BOOLEAN DEFAULT false,
    senior_citizen BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Officials table
CREATE TABLE IF NOT EXISTS officials (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER REFERENCES residents(id),
    position VARCHAR(100) NOT NULL,
    term_start DATE NOT NULL,
    term_end DATE,
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate types table
CREATE TABLE IF NOT EXISTS certificate_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates issued table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    certificate_type_id INTEGER REFERENCES certificate_types(id),
    resident_id INTEGER REFERENCES residents(id),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    purpose TEXT NOT NULL,
    issued_by INTEGER REFERENCES users(id),
    issued_date DATE NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    or_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'issued',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER REFERENCES residents(id),
    request_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by INTEGER REFERENCES users(id),
    processed_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default certificate types
INSERT INTO certificate_types (name, description, fee) VALUES
('Barangay Clearance', 'Certificate of Barangay Clearance', 50.00),
('Certificate of Residency', 'Certificate of Residency', 30.00),
('Certificate of Indigency', 'Certificate of Indigency', 0.00),
('Business Permit', 'Barangay Business Permit', 100.00),
('Barangay ID', 'Barangay Identification Card', 50.00)
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('admin', 'admin@barangay.local', '$2a$10$rqYvHPq8l5xP5bZxE5FxzO7K.gVxJ8J4YhXQzN.5gKJxMZvY8QJ7G', 'admin', 'Admin', 'User')
ON CONFLICT (username) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_residents_name ON residents(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_certificates_resident ON certificates(resident_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_resident ON requests(resident_id);
