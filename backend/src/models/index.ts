import { pool } from '../db/index';

export interface User {
    id?: number;
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'customer';
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Booking {
    id?: number;
    user_id: number;
    activity_type: 'painting-parties' | 'birthday-parties' | 'art-classes';
    date: Date;
    participants: number;
    special_requests?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at?: Date;
    updated_at?: Date;
}

export interface ContactMessage {
    id?: number;
    name: string;
    email: string;
    subject?: string;
    message: string;
    created_at?: Date;
}

export class UserModel {
    static async create(user: User): Promise<User> {
        const query = `
            INSERT INTO users (email, name, password, role, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(query, [user.email, user.name, user.password, user.role, user.phone]);
        return result.rows[0];
    }

    static async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }

    static async findAll(): Promise<User[]> {
        const query = 'SELECT * FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
}

export class BookingModel {
    static async create(booking: Booking): Promise<Booking> {
        const query = `
            INSERT INTO bookings (user_id, activity_type, date, participants, special_requests, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            booking.user_id,
            booking.activity_type,
            booking.date,
            booking.participants,
            booking.special_requests,
            booking.status || 'pending'
        ]);
        return result.rows[0];
    }

    static async findByUserId(userId: number): Promise<Booking[]> {
        const query = 'SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async findAll(): Promise<Booking[]> {
        const query = 'SELECT * FROM bookings ORDER BY date DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async updateStatus(id: number, status: string): Promise<Booking | null> {
        const query = `
            UPDATE bookings 
            SET status = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0] || null;
    }
}

export class ContactMessageModel {
    static async create(message: ContactMessage): Promise<ContactMessage> {
        const query = `
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            message.name,
            message.email,
            message.subject,
            message.message
        ]);
        return result.rows[0];
    }

    static async findAll(): Promise<ContactMessage[]> {
        const query = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }
}