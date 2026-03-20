-- Migration script to update painting_parties table with new comprehensive fields
-- Run this to update your existing database

-- First, backup existing data if any
CREATE TABLE IF NOT EXISTS painting_parties_backup AS SELECT * FROM painting_parties;

-- Drop the old table
DROP TABLE IF EXISTS painting_parties CASCADE;

-- Recreate with new schema
CREATE TABLE painting_parties
(
    id SERIAL PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    party_date DATE NOT NULL,
    party_time TIME NOT NULL,
    guest_count INTEGER NOT NULL,
    child_age VARCHAR(20) NOT NULL,
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
GRANT ALL ON TABLE painting_parties TO postgres;
GRANT ALL ON TABLE painting_parties TO admin;
GRANT ALL ON SEQUENCE painting_parties_id_seq TO postgres;
GRANT ALL ON SEQUENCE painting_parties_id_seq TO admin;

-- If you had old data and want to migrate it (optional - uncomment if needed):
-- INSERT INTO painting_parties (parent_name, email, phone, party_date, party_time, guest_count, child_age, theme, special_requests, status, created_at)
-- SELECT 
--     name as parent_name,
--     email,
--     COALESCE(phone, '') as phone,
--     date::date as party_date,
--     date::time as party_time,
--     COALESCE(number_of_guests, 6) as guest_count,
--     'mixed' as child_age,
--     COALESCE(theme, '') as theme,
--     additional_notes as special_requests,
--     status,
--     created_at
-- FROM painting_parties_backup;
