-- Migration script to update birthday_parties table with new comprehensive fields
-- Run this to update your existing database

-- First, backup existing data if any
CREATE TABLE IF NOT EXISTS birthday_parties_backup AS SELECT * FROM birthday_parties;

-- Drop the old table
DROP TABLE IF EXISTS birthday_parties CASCADE;

-- Recreate with new schema
CREATE TABLE birthday_parties
(
    id SERIAL PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    child_age INTEGER NOT NULL,
    party_date DATE NOT NULL,
    party_time TIME NOT NULL,
    guest_count INTEGER NOT NULL,
    package VARCHAR(50) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    custom_theme VARCHAR(200),
    venue_address VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions
GRANT ALL ON TABLE birthday_parties TO postgres;
GRANT ALL ON TABLE birthday_parties TO admin;
GRANT ALL ON SEQUENCE birthday_parties_id_seq TO postgres;
GRANT ALL ON SEQUENCE birthday_parties_id_seq TO admin;

-- If you had old data and want to migrate it (optional - uncomment if needed):
-- INSERT INTO birthday_parties (parent_name, email, phone, child_name, child_age, party_date, party_time, guest_count, package, theme, venue_address, city, zip_code, special_requests, status, created_at)
-- SELECT 
--     name as parent_name,
--     email,
--     COALESCE(phone, '') as phone,
--     'Birthday Child' as child_name,
--     8 as child_age,
--     date::date as party_date,
--     date::time as party_time,
--     COALESCE(number_of_guests, 8) as guest_count,
--     'basic' as package,
--     COALESCE(theme, '') as theme,
--     '' as venue_address,
--     '' as city,
--     '' as zip_code,
--     additional_notes as special_requests,
--     status,
--     created_at
-- FROM birthday_parties_backup;
