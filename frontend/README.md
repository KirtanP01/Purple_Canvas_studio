# Purple Canvas Studio

Welcome to the Purple Canvas Studio project! This project is a responsive web application built using Angular for the frontend, Node.js for the backend, and PostgreSQL as the database.

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

The frontend is developed using Angular and contains the following key files:

- **src/app/app.component.ts**: Main application component logic.
- **src/app/app.module.ts**: Root module of the Angular application.
- **src/app/app.component.html**: HTML template for the main application component.
- **src/assets**: Directory for static assets like images and styles.
- **src/environments**: Contains environment-specific settings for development and production.
- **angular.json**: Angular CLI configuration file.
- **package.json**: Lists dependencies and scripts for the frontend.
- **tsconfig.json**: TypeScript configuration file for the frontend.

### Backend

The backend is built with Node.js and Express, and it includes:

- **src/app.ts**: Entry point of the backend application.
- **src/controllers/index.ts**: Contains the IndexController for handling API endpoints.
- **src/routes/index.ts**: Defines the routes for the application.
- **src/models/index.ts**: Exports data models for the application.
- **src/db/index.ts**: Handles database connection and configuration.
- **package.json**: Lists dependencies and scripts for the backend.
- **tsconfig.json**: TypeScript configuration file for the backend.

## Getting Started

### Prerequisites

- Node.js (version X.X.X)
- PostgreSQL (version X.X.X)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Purple_Canvas_studio
   ```

2. Install dependencies for the backend:
   ```
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd ../frontend
   ng serve
   ```

Visit `http://localhost:4200` in your browser to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.