import { pool } from '../db/index.js';

export interface ArtClass {
    id?: number;
    parent_name: string;
    email: string;
    phone: string;
    child_name: string;
    child_age: number;
    preferred_day: string;
    preferred_time: string;
    session_type: string;
    special_requests?: string;
    status?: string;
    created_at?: Date;
    payment_status?: string;
    payment_amount?: number;
    paypal_order_id?: string;
    paypal_capture_id?: string;
    payment_date?: Date;
}

export class ArtClassModel {
    static async create(data: any): Promise<ArtClass> {
        const query = `
            INSERT INTO art_classes (
                parent_name, email, phone, child_name, child_age,
                preferred_day, preferred_time, session_type, special_requests, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [
            data.parentName || '',
            data.email || '',
            data.phone || '',
            data.childName || data.studentName || '',
            data.childAge || data.studentAge || 8,
            data.preferredDay || '',
            data.preferredTime || '',
            data.sessionType || data.classType || '',
            data.specialRequests || null,
            data.status || 'pending'
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll(): Promise<ArtClass[]> {
        const result = await pool.query('SELECT * FROM art_classes ORDER BY enroll_date DESC');
        return result.rows;
    }

    static async findById(id: number): Promise<ArtClass | null> {
        const result = await pool.query('SELECT * FROM art_classes WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    static async update(id: number, data: Partial<ArtClass>): Promise<ArtClass | null> {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key in data) {
            fields.push(`${key} = $${idx}`);
            values.push((data as any)[key]);
            idx++;
        }
        if (fields.length === 0) return null;
        values.push(id);
        const query = `UPDATE art_classes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM art_classes WHERE id = $1', [id]);
        return !!result.rowCount;
    }
}
