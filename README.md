# Task Management Application

A full-stack Task Management Web Application built with React.js (Vite), Material UI, Node.js/Express, and MongoDB.

## Features

- User Authentication (Sign Up, Sign In)
- User Roles (Admin and Normal User)
- Task Management (Create, Read, Update, Delete)
- Task Properties: Title, Description, Status (Pending/Completed), Created Date
- Pagination for task list
- Light/Dark Theme Toggle
- Responsive Design
- Role-based Access Control (Admin can delete tasks)

## Tech Stack

### Frontend

- React.js with Vite
- Material UI (MUI)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

## Installation Instructions

### Step 1: Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for both frontend and backend.

Alternatively, install separately:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasklist
JWT_SECRET=your_jwt_secret_key_here
```

**Important Notes:**

- Replace `MONGODB_URI` with your MongoDB connection string (use MongoDB Atlas connection string for cloud deployment)
- Replace `JWT_SECRET` with a secure random string for production
- For local MongoDB, ensure MongoDB is running on your system

### Step 3: Start Development Servers

From the root directory, run:

```bash
npm run dev
```

This will start both backend and frontend servers:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

To run servers separately:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Production Build Instructions

### Step 1: Build the Frontend

From the root directory:

```bash
npm run build
```

This will build the React application and place the output in `frontend/dist`.

### Step 2: Start the Production Server

```bash
npm start
```

The backend will serve the frontend statically. The application will be available on the port specified in your `.env` file (default: 5000).

## Deployment Instructions

### For Render.com

1. Connect your repository to Render
2. Create a new Web Service
3. Set the following:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `PORT` - (Optional, Render provides this automatically)
5. Deploy

## Usage

1. **Sign Up**: Create a new account. Check "Register as Admin" to create an admin account.
2. **Sign In**: Login with your credentials.
3. **Dashboard**: View and manage your tasks with pagination.
4. **Create Task**: Click "Add Task" to create a new task.
5. **Edit Task**: Click the edit icon on any task.
6. **Toggle Status**: Click the status chip to toggle between Pending/Completed.
7. **Delete Task**: Admin users can delete tasks using the delete icon.
8. **Theme Toggle**: Use the theme switcher icon to toggle between light and dark mode.

## User Roles

- **Normal User**: Can create, view, and edit their own tasks.
- **Admin User**: Can create, view, edit, and delete all tasks.

## License

ISC
