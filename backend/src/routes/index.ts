
import paypalClient from '../paypalClient';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { Router, Express } from 'express';
import { 
    IndexController, 
    UserController, 
    BookingController, 
    ContactController 
} from '../controllers/index';
import { BirthdayPartyController } from '../controllers/birthdayParty';
import { PaintingPartyController } from '../controllers/paintingParty';
import { ArtClassController } from '../controllers/artClass';

const router = Router();
const indexController = new IndexController();
const birthdayPartyController = new BirthdayPartyController();
const paintingPartyController = new PaintingPartyController();
const artClassController = new ArtClassController();
const userController = new UserController();
const bookingController = new BookingController();
const contactController = new ContactController();

export function setRoutes(app: Express) {
    app.use('/api', router);

    // API info
    router.get('/', indexController.getExample);

    // Birthday Parties CRUD
    router.post('/birthday-parties', birthdayPartyController.create);
    router.get('/birthday-parties', birthdayPartyController.getAll);
    router.get('/birthday-parties/:id', birthdayPartyController.getById);
    router.put('/birthday-parties/:id', birthdayPartyController.update);
    router.delete('/birthday-parties/:id', birthdayPartyController.delete);

    // Painting Parties CRUD
    router.post('/painting-parties', paintingPartyController.create);
    router.get('/painting-parties', paintingPartyController.getAll);
    router.get('/painting-parties/:id', paintingPartyController.getById);
    router.put('/painting-parties/:id', paintingPartyController.update);
    router.delete('/painting-parties/:id', paintingPartyController.delete);

    // Art Classes CRUD
    router.post('/art-classes', artClassController.create);
    router.get('/art-classes', artClassController.getAll);
    router.get('/art-classes/:id', artClassController.getById);
    router.put('/art-classes/:id', artClassController.update);
    router.delete('/art-classes/:id', artClassController.delete);

    // PayPal endpoints
    // Create PayPal order
    router.post('/paypal/create-order', async (req, res) => {
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: req.body.amount
                }
            }]
        });
            try {
                const order = await paypalClient.execute(request);
                console.log('PayPal order response:', order);
                res.json({ id: order && order.result && order.result.id ? order.result.id : null, raw: order });
            } catch (err) {
                console.error('PayPal create-order error:', err);
                res.status(500).json({ error: err });
        }
    });

    // Capture PayPal order
    router.post('/paypal/capture-order', async (req, res) => {
        const { orderID } = req.body;
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    // No request body needed for capture
        try {
            const capture = await paypalClient.execute(request);
            res.json(capture.result);
        } catch (err) {
            res.status(500).send('Error capturing PayPal order');
        }
    });
}