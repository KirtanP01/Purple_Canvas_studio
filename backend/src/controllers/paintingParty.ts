import { Request, Response } from 'express';
import { PaintingPartyModel } from '../models/paintingParty.js';

export class PaintingPartyController {
    async create(req: Request, res: Response) {
        try {
            console.log('Received POST /api/painting-parties request with body:', req.body);
            const party = await PaintingPartyModel.create(req.body);
            res.status(201).json(party);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof Error) {
                console.error(error.stack);
            }
            const details = error instanceof Error ? error.message : String(error);
            res.status(500).json({ error: 'Failed to create painting party', details });
        }
    }

    async getAll(req: Request, res: Response) {
    console.log('Received GET /api/painting-parties request');
        try {
            const parties = await PaintingPartyModel.findAll();
            res.json(parties);
        } catch (error) {
                console.error('Error in getAll:', error);
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                const details = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: 'Failed to fetch painting parties', details });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const party = await PaintingPartyModel.findById(Number(req.params.id));
            if (!party) return res.status(404).json({ error: 'Not found' });
            res.json(party);
        } catch (error) {
                console.error('Error in getById:', error);
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                const details = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: 'Failed to fetch painting party', details });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const party = await PaintingPartyModel.update(Number(req.params.id), req.body);
            if (!party) return res.status(404).json({ error: 'Not found or no changes' });
            res.json(party);
        } catch (error) {
                console.error('Error in update:', error);
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                const details = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: 'Failed to update painting party', details });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const success = await PaintingPartyModel.delete(Number(req.params.id));
            if (!success) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (error) {
                console.error('Error in delete:', error);
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                const details = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: 'Failed to delete painting party', details });
        }
    }

    async updatePayment(req: Request, res: Response) {
        try {
            const { paypalOrderId, paypalCaptureId, paymentAmount } = req.body;
            const id = Number(req.params.id);
            const existing = await PaintingPartyModel.findById(id);
            if (!existing) return res.status(404).json({ error: 'Booking not found' });

            const paymentNotes: string[] = [];
            if (paypalOrderId) paymentNotes.push(`PayPal order: ${paypalOrderId}`);
            if (paypalCaptureId) paymentNotes.push(`PayPal capture: ${paypalCaptureId}`);
            if (typeof paymentAmount === 'number') paymentNotes.push(`Amount: $${paymentAmount}`);

            const existingNotes = existing.special_requests ? `${existing.special_requests} | ` : '';
            const mergedNotes = paymentNotes.length > 0
                ? `${existingNotes}Payment completed (${paymentNotes.join(', ')})`
                : existing.special_requests;

            const party = await PaintingPartyModel.update(id, {
                status: 'confirmed',
                special_requests: mergedNotes
            });

            res.json(party);
        } catch (error) {
            console.error('PaintingPartyController.updatePayment error:', error);
            res.status(500).json({ error: 'Failed to update payment', details: error });
        }
    }
}
