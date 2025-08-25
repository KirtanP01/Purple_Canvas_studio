import { pool } from '../db/index';

export interface PaintingParty {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    date: Date;
    number_of_guests: number;
    package?: string;
    theme?: string;
    additional_notes?: string;
    status?: string;
    created_at?: Date;
}

export class PaintingPartyModel {
    static async create(data: PaintingParty): Promise<PaintingParty> {
        const query = `
            INSERT INTO painting_parties (name, email, phone, date, number_of_guests, theme, additional_notes, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        // Ensure all fields are present and date is a Date object
        const values = [
            data.name || '',
            data.email || '',
            data.phone || '',
            data.date ? new Date(data.date) : new Date(),
            data.number_of_guests || 1,
            data.theme || '',
            data.additional_notes || '',
            data.status || 'pending'
        ];
        console.log('Preparing to execute SQL for painting party:', query, values);
        try {
            const result = await pool.query(query, values);
            console.log('SQL execution result:', result);
            return result.rows[0];
        } catch (error) {
            console.error('Error in PaintingPartyModel.create:', error);
            if (error instanceof Error) {
                console.error(error.stack);
            }
            throw error;
        }
    }

    static async findAll(): Promise<PaintingParty[]> {
        const result = await pool.query('SELECT * FROM painting_parties ORDER BY date DESC');
        return result.rows;
    }

    static async findById(id: number): Promise<PaintingParty | null> {
        const result = await pool.query('SELECT * FROM painting_parties WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    static async update(id: number, data: Partial<PaintingParty>): Promise<PaintingParty | null> {
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
        const query = `UPDATE painting_parties SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM painting_parties WHERE id = $1', [id]);
        return !!result.rowCount;
    }
}
