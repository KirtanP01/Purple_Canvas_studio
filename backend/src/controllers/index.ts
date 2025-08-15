import { Request, Response } from 'express';
import { UserModel, BookingModel, ContactMessageModel, User, Booking, ContactMessage } from '../models/index';

export class IndexController {
    public async getExample(req: Request, res: Response) {
        try {
            res.status(200).json({ 
                message: "Purple Canvas Studio API is running!",
                version: "1.0.0",
                endpoints: [
                    "GET /api - API info",
                    "POST /api/users - Create user",
                    "POST /api/bookings - Create booking",
                    "GET /api/bookings - Get all bookings",
                    "POST /api/contact - Send contact message"
                ]
            });
        } catch (error) {
            res.status(500).json({ error: "An error occurred" });
        }
    }
}

export class UserController {
    public async createUser(req: Request, res: Response) {
        try {
            const { email, name, phone }: User = req.body;

            if (!email || !name) {
                return res.status(400).json({ error: "Email and name are required" });
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: "User with this email already exists" });
            }

            const user = await UserModel.create({ email, name, phone });
            res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: "Failed to create user" });
        }
    }

    public async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(parseInt(id));
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: "Failed to fetch user" });
        }
    }
}

export class BookingController {
    public async createBooking(req: Request, res: Response) {
        try {
            const { user_id, activity_type, date, participants, special_requests }: Booking = req.body;

            if (!user_id || !activity_type || !date || !participants) {
                return res.status(400).json({ 
                    error: "User ID, activity type, date, and participants are required" 
                });
            }

            // Validate activity type
            const validActivities = ['painting-parties', 'birthday-parties', 'art-classes'];
            if (!validActivities.includes(activity_type)) {
                return res.status(400).json({ 
                    error: "Invalid activity type. Must be one of: " + validActivities.join(', ')
                });
            }

            const booking = await BookingModel.create({
                user_id,
                activity_type,
                date: new Date(date),
                participants,
                special_requests,
                status: 'pending'
            });

            res.status(201).json({ message: "Booking created successfully", booking });
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ error: "Failed to create booking" });
        }
    }

    public async getAllBookings(req: Request, res: Response) {
        try {
            const bookings = await BookingModel.findAll();
            res.status(200).json({ bookings });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: "Failed to fetch bookings" });
        }
    }

    public async getUserBookings(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const bookings = await BookingModel.findByUserId(parseInt(userId));
            res.status(200).json({ bookings });
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            res.status(500).json({ error: "Failed to fetch user bookings" });
        }
    }

    public async updateBookingStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    error: "Invalid status. Must be one of: " + validStatuses.join(', ')
                });
            }

            const booking = await BookingModel.updateStatus(parseInt(id), status);
            if (!booking) {
                return res.status(404).json({ error: "Booking not found" });
            }

            res.status(200).json({ message: "Booking status updated", booking });
        } catch (error) {
            console.error('Error updating booking status:', error);
            res.status(500).json({ error: "Failed to update booking status" });
        }
    }
}

export class ContactController {
    public async createMessage(req: Request, res: Response) {
        try {
            const { name, email, subject, message }: ContactMessage = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: "Name, email, and message are required" });
            }

            const contactMessage = await ContactMessageModel.create({
                name,
                email,
                subject,
                message
            });

            res.status(201).json({ 
                message: "Contact message sent successfully", 
                contactMessage 
            });
        } catch (error) {
            console.error('Error creating contact message:', error);
            res.status(500).json({ error: "Failed to send contact message" });
        }
    }

    public async getAllMessages(req: Request, res: Response) {
        try {
            const messages = await ContactMessageModel.findAll();
            res.status(200).json({ messages });
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            res.status(500).json({ error: "Failed to fetch contact messages" });
        }
    }
}