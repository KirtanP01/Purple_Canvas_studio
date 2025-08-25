import { pool } from '../db/index';

export interface ArtClass {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    enroll_date: Date;
    number_of_guests: number;
    class_level?: string;
    additional_notes?: string;
    status?: string;
    created_at?: Date;
    age?: number;
}

export class ArtClassModel {
    static async create(data: ArtClass): Promise<ArtClass> {
        const query = `
            INSERT INTO art_classes (name, email, phone, class_level, additional_notes, status, enroll_date, age)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            data.name || '',
            data.email || '',
            data.phone || '',
            data.class_level || '',
            data.additional_notes || '',
            data.status || 'pending',
            data.enroll_date ? new Date(data.enroll_date) : new Date(),
            data.age || null
        ]);
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
