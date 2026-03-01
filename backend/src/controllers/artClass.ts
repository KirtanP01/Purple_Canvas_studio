import { Request, Response } from 'express';
import { ArtClassModel } from '../models/artClass.js';

export class ArtClassController {
    async create(req: Request, res: Response) {
        try {
            const artClass = await ArtClassModel.create(req.body);
            res.status(201).json(artClass);
        } catch (error) {
            console.error('ArtClassController.create error:', error);
            res.status(500).json({ error: 'Failed to create art class', details: error });
        }
    }

    async updatePayment(req: Request, res: Response) {
        try {
            const { paypalOrderId, paypalCaptureId, paymentAmount } = req.body;
            const artClass = await ArtClassModel.update(Number(req.params.id), {
                payment_status: 'completed',
                paypal_order_id: paypalOrderId,
                paypal_capture_id: paypalCaptureId,
                payment_amount: paymentAmount,
                payment_date: new Date(),
                status: 'confirmed'
            });
            if (!artClass) return res.status(404).json({ error: 'Booking not found' });
            res.json(artClass);
        } catch (error) {
            console.error('ArtClassController.updatePayment error:', error);
            res.status(500).json({ error: 'Failed to update payment', details: error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const classes = await ArtClassModel.findAll();
            res.json(classes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch art classes', details: error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const artClass = await ArtClassModel.findById(Number(req.params.id));
            if (!artClass) return res.status(404).json({ error: 'Not found' });
            res.json(artClass);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch art class', details: error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const artClass = await ArtClassModel.update(Number(req.params.id), req.body);
            if (!artClass) return res.status(404).json({ error: 'Not found or no changes' });
            res.json(artClass);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update art class', details: error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const success = await ArtClassModel.delete(Number(req.params.id));
            if (!success) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete art class', details: error });
        }
    }
}
