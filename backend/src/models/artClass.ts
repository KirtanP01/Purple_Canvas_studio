import { pool } from '../db/index.js';

export interface ArtClass {
    id?: number;
    parent_name: string;
    email: string;
    phone: string;
    student_name: string;
    student_age: number;
    enroll_date: string;
    preferred_day: string;
    class_type: string;
    special_requests?: string;
    status?: string;
    created_at?: Date;
}

export class ArtClassModel {
    static async create(data: any): Promise<ArtClass> {
        const query = `
            INSERT INTO art_classes (
                parent_name, email, phone, student_name, student_age,
                enroll_date, class_type, preferred_day, special_requests, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;

        const enrollDate = data.enrollDate || data.enroll_date || new Date().toISOString().split('T')[0];
        const specialRequestParts: string[] = [];
        if (data.preferredTime) {
            specialRequestParts.push(`Preferred time: ${data.preferredTime}`);
        }
        if (data.specialRequests) {
            specialRequestParts.push(data.specialRequests);
        }
        const specialRequests = specialRequestParts.length > 0 ? specialRequestParts.join(' | ') : null;

        const values = [
            data.parentName || '',
            data.email || '',
            data.phone || '',
            data.studentName || data.childName || '',
            data.studentAge || data.childAge || 8,
            enrollDate,
            data.classType || data.sessionType || '',
            data.preferredDay || '',
            specialRequests,
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
