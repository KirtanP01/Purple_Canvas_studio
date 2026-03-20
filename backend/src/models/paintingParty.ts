import { pool } from '../db/index.js';

export interface PaintingParty {
    id?: number;
    parent_name: string;
    email: string;
    phone: string;
    party_date: string;
    party_time: string;
    guest_count: number;
    child_age: string;
    theme: string;
    custom_theme?: string;
    venue_address: string;
    city: string;
    zip_code: string;
    special_requests?: string;
    status?: string;
    payment_status?: string;
    payment_amount?: number;
    paypal_order_id?: string;
    paypal_capture_id?: string;
    payment_date?: Date;
    created_at?: Date;
}

export class PaintingPartyModel {
    static async create(data: any): Promise<PaintingParty> {
        const query = `
            INSERT INTO painting_parties (
                parent_name, email, phone, party_date, party_time, 
                guest_count, child_age, theme, custom_theme, 
                venue_address, city, zip_code, special_requests, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;
        
        const normalizedChildAge = data.childAge !== undefined && data.childAge !== null
            ? String(data.childAge)
            : '';

        const values = [
            data.parentName || '',
            data.email || '',
            data.phone || '',
            data.partyDate || new Date().toISOString().split('T')[0],
            data.partyTime || '00:00',
            data.guestCount || 6,
            normalizedChildAge,
            data.theme || '',
            data.customTheme || null,
            data.venueAddress || '',
            data.city || '',
            data.zipCode || '',
            data.specialRequests || null,
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
        const result = await pool.query('SELECT * FROM painting_parties ORDER BY party_date DESC, created_at DESC');
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
