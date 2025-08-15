# Purple Canvas Studio Backend Setup

## Prerequisites

### 1. Install PostgreSQL
- Download and install PostgreSQL from: https://www.postgresql.org/download/
- During installation, remember your postgres user password
- PostgreSQL should run on default port 5432

### 2. Create Database
Open pgAdmin or psql command line and run:
```sql
CREATE DATABASE purple_canvas_studio;
```

## Environment Setup

### 1. Configure Environment Variables
Update the `.env` file in the backend directory with your database credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=purple_canvas_studio
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start the Backend Server
```bash
npm run dev
```

The server will:
- ✅ Connect to PostgreSQL database
- ✅ Automatically create necessary tables (users, bookings, contact_messages)
- ✅ Start API server on http://localhost:3000
- ✅ Enable CORS for Angular frontend

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/user/:userId` - Get bookings for specific user
- `PATCH /api/bookings/:id/status` - Update booking status

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact/messages` - Get all contact messages

### Health Check
- `GET /health` - Server health status

## Database Schema

### Users Table
```sql
id SERIAL PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
name VARCHAR(255) NOT NULL
phone VARCHAR(20)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Bookings Table
```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
activity_type VARCHAR(100) NOT NULL
date TIMESTAMP NOT NULL
participants INTEGER DEFAULT 1
special_requests TEXT
status VARCHAR(50) DEFAULT 'pending'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Contact Messages Table
```sql
id SERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL
email VARCHAR(255) NOT NULL
subject VARCHAR(255)
message TEXT NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Testing the API

You can test the API using tools like Postman or curl:

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"555-1234"}'
```

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"activity_type":"painting-parties","date":"2025-08-15T14:00:00Z","participants":4,"special_requests":"Birthday party theme"}'
```

### Send Contact Message
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","subject":"Inquiry","message":"I would like to book a painting party."}'
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `.env` file
3. Verify database `purple_canvas_studio` exists
4. Check firewall settings for port 5432

### Port Already in Use
If port 3000 is already in use, change the PORT in `.env` file to another port like 3001.

## Next Steps

1. ✅ Backend API is ready
2. 🔄 Connect Angular frontend to backend APIs
3. 🔄 Implement authentication (JWT tokens)
4. 🔄 Add input validation and sanitization
5. 🔄 Set up email notifications for bookings
6. 🔄 Add image upload for portfolio
7. 🔄 Deploy to production
