import { pool } from '../db/index.js';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
    id?: number;
    name: string;
    email: string;
    rating: number;
    comment: string;
    status?: ReviewStatus;
    approved_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

export class ReviewModel {
    static async create(data: Pick<Review, 'name' | 'email' | 'rating' | 'comment'>): Promise<Review> {
        const query = `
            INSERT INTO reviews (name, email, rating, comment, status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *;
        `;
        const values = [data.name, data.email, data.rating, data.comment];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findApproved(): Promise<Review[]> {
        const result = await pool.query(
            `SELECT * FROM reviews WHERE status = 'approved' ORDER BY approved_at DESC NULLS LAST, created_at DESC`
        );
        return result.rows;
    }

    static async findPending(): Promise<Review[]> {
        const result = await pool.query(
            `SELECT * FROM reviews WHERE status = 'pending' ORDER BY created_at DESC`
        );
        return result.rows;
    }

    static async updateStatus(id: number, status: ReviewStatus): Promise<Review | null> {
        const isApproved = status === 'approved';
        const query = `
            UPDATE reviews
            SET status = $1,
                approved_at = CASE WHEN $2 THEN CURRENT_TIMESTAMP ELSE NULL END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *;
        `;
        const result = await pool.query(query, [status, isApproved, id]);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
