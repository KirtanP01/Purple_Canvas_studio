import { pool } from '../db/index';

export interface BirthdayParty {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    party_date: Date;
    number_of_guests: number;
    package?: string;
    theme?: string;
    additional_notes?: string;
    status?: string;
    created_at?: Date;
}

export class BirthdayPartyModel {
    static async create(data: BirthdayParty): Promise<BirthdayParty> {
        const query = `
            INSERT INTO birthday_parties (name, email, phone, party_date, number_of_guests, package, theme, additional_notes, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            data.name,
            data.email,
            data.phone,
            data.party_date,
            data.number_of_guests,
            data.package,
            data.theme,
            data.additional_notes,
            data.status || 'pending'
        ]);
        return result.rows[0];
    }

    static async findAll(): Promise<BirthdayParty[]> {
        const result = await pool.query('SELECT * FROM birthday_parties ORDER BY party_date DESC');
        return result.rows;
    }

    static async findById(id: number): Promise<BirthdayParty | null> {
        const result = await pool.query('SELECT * FROM birthday_parties WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    static async update(id: number, data: Partial<BirthdayParty>): Promise<BirthdayParty | null> {
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
        const query = `UPDATE birthday_parties SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM birthday_parties WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
    }
}
