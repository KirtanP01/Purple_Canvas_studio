import { Request, Response } from 'express';
import { BirthdayPartyModel } from '../models/birthdayParty.js';

export class BirthdayPartyController {
    async create(req: Request, res: Response) {
        try {
            const party = await BirthdayPartyModel.create(req.body);
            res.status(201).json(party);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create birthday party', details: error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const parties = await BirthdayPartyModel.findAll();
            res.json(parties);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch birthday parties', details: error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const party = await BirthdayPartyModel.findById(Number(req.params.id));
            if (!party) return res.status(404).json({ error: 'Not found' });
            res.json(party);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch birthday party', details: error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const party = await BirthdayPartyModel.update(Number(req.params.id), req.body);
            if (!party) return res.status(404).json({ error: 'Not found or no changes' });
            res.json(party);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update birthday party', details: error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const success = await BirthdayPartyModel.delete(Number(req.params.id));
            if (!success) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete birthday party', details: error });
        }
    }

    async updatePayment(req: Request, res: Response) {
        try {
            const { paypalOrderId, paypalCaptureId, paymentAmount } = req.body;
            const id = Number(req.params.id);
            const existing = await BirthdayPartyModel.findById(id);
            if (!existing) return res.status(404).json({ error: 'Booking not found' });

            const paymentNotes: string[] = [];
            if (paypalOrderId) paymentNotes.push(`PayPal order: ${paypalOrderId}`);
            if (paypalCaptureId) paymentNotes.push(`PayPal capture: ${paypalCaptureId}`);
            if (typeof paymentAmount === 'number') paymentNotes.push(`Amount: $${paymentAmount}`);

            const existingNotes = existing.special_requests ? `${existing.special_requests} | ` : '';
            const mergedNotes = paymentNotes.length > 0
                ? `${existingNotes}Payment completed (${paymentNotes.join(', ')})`
                : existing.special_requests;

            const party = await BirthdayPartyModel.update(id, {
                status: 'confirmed',
                special_requests: mergedNotes
            });

            res.json(party);
        } catch (error) {
            console.error('BirthdayPartyController.updatePayment error:', error);
            res.status(500).json({ error: 'Failed to update payment', details: error });
        }
    }
}
