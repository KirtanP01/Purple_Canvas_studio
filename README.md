# Purple Canvas Studio

Purple Canvas Studio is a responsive web application built using Angular for the frontend, Node.js for the backend, and PostgreSQL as the database. This project aims to provide a seamless user experience with a modern design.

## Project Structure

```
Purple_Canvas_studio
├── backend
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── index.ts
│   │   ├── routes
│   │   │   └── index.ts
│   │   ├── models
│   │   │   └── index.ts
│   │   └── db
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app.component.html
│   │   ├── assets
│   │   └── environments
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- Angular CLI (version 12 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Purple_Canvas_studio.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd Purple_Canvas_studio/backend
   npm install
   ```

3. Set up the PostgreSQL database and update the database configuration in `backend/src/db/index.ts`.

4. Navigate to the frontend directory and install dependencies:
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

2. In a new terminal, start the frontend application:
   ```
   cd frontend
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.