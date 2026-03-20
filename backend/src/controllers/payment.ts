import { Request, Response } from 'express';
import paypalClient from '../paypalClient.js';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

export class PaymentController {
    /**
     * Create a PayPal order for a booking
     * Expects: { amount: number, currency: 'USD', bookingType: string, bookingData: any }
     */
    async createOrder(req: Request, res: Response) {
        try {
            const { amount, currency = 'USD', bookingType, bookingData } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Invalid amount' });
            }

            const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2)
                    },
                    description: `${bookingType} booking - Purple Canvas Studio`
                }],
                application_context: {
                    brand_name: 'Purple Canvas Studio',
                    landing_page: 'NO_PREFERENCE',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment-success`,
                    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment-cancel`
                }
            });

            const order = await paypalClient.execute(request);
            
            res.json({
                orderID: order.result.id,
                status: order.result.status
            });
        } catch (error) {
            console.error('PayPal order creation error:', error);
            res.status(500).json({ 
                error: 'Failed to create PayPal order', 
                details: error instanceof Error ? error.message : error 
            });
        }
    }

    /**
     * Capture payment after customer approves
     * Expects: { orderID: string }
     */
    async captureOrder(req: Request, res: Response) {
        try {
            const { orderID } = req.body;

            if (!orderID) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
            // Empty request body for capture
            request.requestBody({} as any);

            const capture = await paypalClient.execute(request);
            
            res.json({
                orderID: capture.result.id,
                status: capture.result.status,
                payerEmail: capture.result.payer?.email_address,
                captureID: capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.id,
                amount: capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount
            });
        } catch (error) {
            console.error('PayPal capture error:', error);
            res.status(500).json({ 
                error: 'Failed to capture PayPal payment', 
                details: error instanceof Error ? error.message : error 
            });
        }
    }

    /**
     * Get order details
     */
    async getOrder(req: Request, res: Response) {
        try {
            const { orderID } = req.params;

            if (!orderID) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
            const order = await paypalClient.execute(request);
            
            res.json({
                orderID: order.result.id,
                status: order.result.status,
                amount: order.result.purchase_units?.[0]?.amount,
                payer: order.result.payer
            });
        } catch (error) {
            console.error('PayPal get order error:', error);
            res.status(500).json({ 
                error: 'Failed to get PayPal order', 
                details: error instanceof Error ? error.message : error 
            });
        }
    }
}
