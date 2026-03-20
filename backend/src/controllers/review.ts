import { Request, Response } from 'express';
import { ReviewModel } from '../models/review.js';

export class ReviewController {
    async create(req: Request, res: Response) {
        try {
            const { name, email, rating, comment } = req.body;

            if (!name || !email || !comment) {
                return res.status(400).json({ error: 'Name, email, and comment are required' });
            }

            const numericRating = Number(rating);
            if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
                return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
            }

            const review = await ReviewModel.create({
                name: String(name).trim(),
                email: String(email).trim().toLowerCase(),
                rating: numericRating,
                comment: String(comment).trim()
            });

            res.status(201).json({
                message: 'Review submitted successfully and is pending approval',
                review
            });
        } catch (error) {
            console.error('ReviewController.create error:', error);
            res.status(500).json({ error: 'Failed to submit review' });
        }
    }

    async getApproved(req: Request, res: Response) {
        try {
            const reviews = await ReviewModel.findApproved();
            res.json(reviews);
        } catch (error) {
            console.error('ReviewController.getApproved error:', error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }

    async getPending(req: Request, res: Response) {
        try {
            const reviews = await ReviewModel.findPending();
            res.json(reviews);
        } catch (error) {
            console.error('ReviewController.getPending error:', error);
            res.status(500).json({ error: 'Failed to fetch pending reviews' });
        }
    }

    async approve(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ error: 'Invalid review id' });
            }

            const review = await ReviewModel.updateStatus(id, 'approved');
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json(review);
        } catch (error) {
            console.error('ReviewController.approve error:', error);
            res.status(500).json({ error: 'Failed to approve review' });
        }
    }

    async reject(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ error: 'Invalid review id' });
            }

            const review = await ReviewModel.updateStatus(id, 'rejected');
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json(review);
        } catch (error) {
            console.error('ReviewController.reject error:', error);
            res.status(500).json({ error: 'Failed to reject review' });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ error: 'Invalid review id' });
            }

            const success = await ReviewModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json({ success: true });
        } catch (error) {
            console.error('ReviewController.remove error:', error);
            res.status(500).json({ error: 'Failed to delete review' });
        }
    }
}
