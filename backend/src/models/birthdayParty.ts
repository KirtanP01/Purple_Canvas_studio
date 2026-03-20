import { pool } from '../db/index.js';

export interface BirthdayParty {
    id?: number;
    parent_name: string;
    email: string;
    phone: string;
    child_name: string;
    child_age: number;
    party_date: string;
    party_time: string;
    guest_count: number;
    package: string;
    theme: string;
    custom_theme?: string;
    venue_address: string;
    city: string;
    zip_code: string;
    special_requests?: string;
    status?: string;
    created_at?: Date;
}

export class BirthdayPartyModel {
    static async create(data: any): Promise<BirthdayParty> {
        const query = `
            INSERT INTO birthday_parties (
                parent_name, email, phone, child_name, child_age,
                party_date, party_time, guest_count, package, theme,
                custom_theme, venue_address, city, zip_code, special_requests, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;
        `;
        const values = [
            data.parentName || '',
            data.email || '',
            data.phone || '',
            data.childName || '',
            data.childAge || 5,
            data.partyDate || new Date().toISOString().split('T')[0],
            data.partyTime || '00:00',
            data.guestCount || 8,
            data.package || '',
            data.theme || '',
            data.customTheme || null,
            data.venueAddress || '',
            data.city || '',
            data.zipCode || '',
            data.specialRequests || null,
            data.status || 'pending'
        ];
        const result = await pool.query(query, values);
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
