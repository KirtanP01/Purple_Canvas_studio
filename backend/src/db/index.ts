import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Determine SSL setting: use SSL only if in production AND not using localhost
const useSSL = process.env.NODE_ENV === 'production' && 
               process.env.DB_HOST !== 'localhost' && 
               process.env.DB_HOST !== '127.0.0.1';

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'purple_canvas_studio',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL database connected successfully');
        console.log(`📊 Database: ${process.env.DB_NAME || 'purple_canvas_studio'}`);
        console.log(`🔗 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
        
        // Test the connection
        await client.query('SELECT NOW()');
        client.release();
        
        // Create tables if they don't exist
        await initializeTables();
    } catch (error) {
        console.warn('⚠️  Database connection failed (PostgreSQL may not be running):', error);
        console.log('💡 To fix this:');
        console.log('   1. Install PostgreSQL: https://www.postgresql.org/download/');
        console.log('   2. Create database: purple_canvas_studio');
        console.log('   3. Update .env file with your credentials');
        // Don't exit the process in development when DB is not available
    }
};

const initializeTables = async () => {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create bookings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                activity_type VARCHAR(100) NOT NULL,
                date TIMESTAMP NOT NULL,
                participants INTEGER DEFAULT 1,
                special_requests TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create contact_messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create reviews table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(255) NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                approved_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create admin_users table for secure admin authentication.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'admin',
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            ALTER TABLE admin_users
            ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'admin',
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);

        // Create art_classes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS art_classes (
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
                payment_status VARCHAR(20) DEFAULT 'pending',
                payment_amount NUMERIC(10,2),
                paypal_order_id VARCHAR(100),
                paypal_capture_id VARCHAR(100),
                payment_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create painting_parties table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS painting_parties (
                id SERIAL PRIMARY KEY,
                parent_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                party_date DATE NOT NULL,
                party_time VARCHAR(20) NOT NULL,
                guest_count INTEGER NOT NULL,
                child_age VARCHAR(20) NOT NULL,
                theme VARCHAR(100) NOT NULL,
                custom_theme VARCHAR(200),
                venue_address VARCHAR(200) NOT NULL,
                city VARCHAR(100) NOT NULL,
                zip_code VARCHAR(10) NOT NULL,
                special_requests TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                payment_status VARCHAR(20) DEFAULT 'pending',
                payment_amount NUMERIC(10,2),
                paypal_order_id VARCHAR(100),
                paypal_capture_id VARCHAR(100),
                payment_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Normalize legacy environments where painting_parties.child_age may still be INTEGER.
        await pool.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = 'painting_parties'
                      AND column_name = 'child_age'
                      AND data_type <> 'character varying'
                ) THEN
                    ALTER TABLE painting_parties
                    ALTER COLUMN child_age TYPE VARCHAR(20)
                    USING child_age::text;
                END IF;
            END
            $$;
        `);

        // Create birthday_parties table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS birthday_parties (
                id SERIAL PRIMARY KEY,
                parent_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                child_name VARCHAR(100) NOT NULL,
                child_age INTEGER NOT NULL,
                party_date DATE NOT NULL,
                party_time VARCHAR(20) NOT NULL,
                guest_count INTEGER NOT NULL,
                package VARCHAR(50) NOT NULL,
                theme VARCHAR(100) NOT NULL,
                custom_theme VARCHAR(200),
                venue_address VARCHAR(200) NOT NULL,
                city VARCHAR(100) NOT NULL,
                zip_code VARCHAR(10) NOT NULL,
                special_requests TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                payment_status VARCHAR(20) DEFAULT 'pending',
                payment_amount NUMERIC(10,2),
                paypal_order_id VARCHAR(100),
                paypal_capture_id VARCHAR(100),
                payment_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Backfill payment columns when tables already existed before payment tracking was added.
        await pool.query(`
            ALTER TABLE art_classes
            ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
            ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS paypal_capture_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
        `);

        await pool.query(`
            ALTER TABLE painting_parties
            ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
            ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS paypal_capture_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
        `);

        await pool.query(`
            ALTER TABLE birthday_parties
            ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
            ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS paypal_capture_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
        `);

        await pool.query(`
            ALTER TABLE reviews
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);

        // One-time bootstrap: seed admin_users with a hashed password when env vars are provided.
        const bootstrapAdminUsername = process.env.ADMIN_USERNAME?.trim();
        const bootstrapAdminPassword = process.env.ADMIN_PASSWORD;

        if (bootstrapAdminUsername && bootstrapAdminPassword) {
            const existingAdmin = await pool.query(
                'SELECT id FROM admin_users WHERE username = $1 LIMIT 1',
                [bootstrapAdminUsername]
            );

            if (existingAdmin.rowCount === 0) {
                const passwordHash = await bcrypt.hash(bootstrapAdminPassword, 12);
                await pool.query(
                    `INSERT INTO admin_users (username, password_hash, role, is_active)
                     VALUES ($1, $2, 'admin', TRUE)`,
                    [bootstrapAdminUsername, passwordHash]
                );
                console.log(`🔐 Seeded admin user "${bootstrapAdminUsername}" with hashed password`);
            }
        }

        console.log('📋 Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize tables:', error);
    }
};

export { connectDB, pool };