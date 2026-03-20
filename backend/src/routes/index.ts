
import paypalClient from '../paypalClient.js';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { Router, Express } from 'express';
import { 
    IndexController, 
    UserController, 
    BookingController, 
    ContactController 
} from '../controllers/index.js';
import { BirthdayPartyController } from '../controllers/birthdayParty.js';
import { PaintingPartyController } from '../controllers/paintingParty.js';
import { ArtClassController } from '../controllers/artClass.js';
import { PaymentController } from '../controllers/payment.js';
import { ReviewController } from '../controllers/review.js';
import * as AdminController from '../controllers/admin.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();
const indexController = new IndexController();
const birthdayPartyController = new BirthdayPartyController();
const paintingPartyController = new PaintingPartyController();
const artClassController = new ArtClassController();
const paymentController = new PaymentController();
const reviewController = new ReviewController();
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
    router.post('/birthday-parties/:id/payment', birthdayPartyController.updatePayment.bind(birthdayPartyController));

    // Painting Parties CRUD
    router.post('/painting-parties', paintingPartyController.create);
    router.get('/painting-parties', paintingPartyController.getAll);
    router.get('/painting-parties/:id', paintingPartyController.getById);
    router.put('/painting-parties/:id', paintingPartyController.update);
    router.delete('/painting-parties/:id', paintingPartyController.delete);
    router.post('/painting-parties/:id/payment', paintingPartyController.updatePayment.bind(paintingPartyController));

    // Art Classes CRUD
    router.post('/art-classes', artClassController.create);
    router.get('/art-classes', artClassController.getAll);
    router.get('/art-classes/:id', artClassController.getById);
    router.put('/art-classes/:id', artClassController.update);
    router.delete('/art-classes/:id', artClassController.delete);
    router.post('/art-classes/:id/payment', artClassController.updatePayment.bind(artClassController));

    // PayPal Payment endpoints
    router.post('/payments/create-order', paymentController.createOrder.bind(paymentController));
    router.post('/payments/capture-order', paymentController.captureOrder.bind(paymentController));
    router.get('/payments/order/:orderID', paymentController.getOrder.bind(paymentController));

    // Reviews (public)
    router.get('/reviews', reviewController.getApproved.bind(reviewController));
    router.post('/reviews', reviewController.create.bind(reviewController));

    // Admin routes
    router.post('/admin/login', AdminController.login);
    router.get('/admin/bookings', authenticateAdmin, AdminController.getAllBookings);
    router.get('/admin/painting-parties', authenticateAdmin, AdminController.getPaintingPartyBookings);
    router.get('/admin/birthday-parties', authenticateAdmin, AdminController.getBirthdayPartyBookings);
    router.get('/admin/art-classes', authenticateAdmin, AdminController.getArtClassBookings);
    router.get('/admin/reviews/pending', authenticateAdmin, reviewController.getPending.bind(reviewController));
    router.post('/admin/reviews/:id/approve', authenticateAdmin, reviewController.approve.bind(reviewController));
    router.post('/admin/reviews/:id/reject', authenticateAdmin, reviewController.reject.bind(reviewController));
    router.delete('/admin/reviews/:id', authenticateAdmin, reviewController.remove.bind(reviewController));
}