import { Router, Express } from 'express';
import { 
    IndexController, 
    UserController, 
    BookingController, 
    ContactController 
} from '../controllers/index';

const router = Router();
const indexController = new IndexController();
const userController = new UserController();
const bookingController = new BookingController();
const contactController = new ContactController();

export function setRoutes(app: Express) {
    app.use('/api', router);

    // API info
    router.get('/', indexController.getExample);

    // User routes
    router.post('/users', userController.createUser);
    router.get('/users/:id', userController.getUser);

    // Booking routes
    router.post('/bookings', bookingController.createBooking);
    router.get('/bookings', bookingController.getAllBookings);
    router.get('/bookings/user/:userId', bookingController.getUserBookings);
    router.patch('/bookings/:id/status', bookingController.updateBookingStatus);

    // Contact routes
    router.post('/contact', contactController.createMessage);
    router.get('/contact/messages', contactController.getAllMessages);
}