import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'purple_canvas_studio',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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

        console.log('📋 Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize tables:', error);
    }
};

export { connectDB, pool };