-- Migration script to update art_classes table with new comprehensive fields
-- Run this to update your existing database

-- First, backup existing data if any
CREATE TABLE IF NOT EXISTS art_classes_backup AS SELECT * FROM art_classes;

-- Drop the old table
DROP TABLE IF EXISTS art_classes CASCADE;

-- Recreate with new schema
CREATE TABLE art_classes
(
    id SERIAL PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_age INTEGER NOT NULL,
    enroll_date DATE NOT NULL,
    class_type VARCHAR(50) NOT NULL,
    preferred_day VARCHAR(50) NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions
GRANT ALL ON TABLE art_classes TO postgres;
GRANT ALL ON TABLE art_classes TO admin;
GRANT ALL ON SEQUENCE art_classes_id_seq TO postgres;
GRANT ALL ON SEQUENCE art_classes_id_seq TO admin;

-- If you had old data and want to migrate it (optional - uncomment if needed):
-- INSERT INTO art_classes (parent_name, email, phone, student_name, student_age, enroll_date, class_type, preferred_day, special_requests, status, created_at)
-- SELECT 
--     name as parent_name,
--     email,
--     COALESCE(phone, '') as phone,
--     'Student' as student_name,
--     COALESCE(age, 8) as student_age,
--     COALESCE(enroll_date::date, CURRENT_DATE) as enroll_date,
--     COALESCE(class_level, 'beginner') as class_type,
--     'weekday' as preferred_day,
--     additional_notes as special_requests,
--     status,
--     COALESCE(enroll_date, CURRENT_TIMESTAMP) as created_at
-- FROM art_classes_backup;
