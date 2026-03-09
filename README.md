# CollabNote

CollabNote is a collaborative note-taking web application built with the MERN stack.

It allows users to register, log in, create and manage notes, collaborate with other users, search and filter notes, and manage document notes with PDF upload support.

## Project Goal

This project was built to demonstrate full-stack MERN development skills for a technical assessment, including authentication, CRUD operations, file upload handling, rich text editing, collaborator management, and responsive UI design.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer (PDF upload handling)

## Current Features

- User registration and login
- JWT-based protected routes
- Create, edit, and delete notes
- Rich text note editor with formatting toolbar
- Document notes with PDF upload and view support
- Shared notes and collaborator management
- Search notes by text and category
- Notes statistics endpoint for dashboard and category insights
- Responsive dashboard with modern sidebar-based navigation

## Key Implementation Highlights

- Built protected authentication flow using JWT
- Implemented note CRUD operations with search and category filtering
- Added PDF upload support for document notes using Multer
- Created a rich text editor toolbar for formatted note content
- Added collaborator management for shared notes
- Designed a responsive dashboard with note statistics and category insights

## Project Structure

```text
CollabNote/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── NoteCollaboratorsPanel.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NoteDetails.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SharedNotes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── categories.js
│   │   │   └── richText.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── noteController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/
    │   ├── Note.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── noteRoutes.js
    ├── scripts/
    │   └── seed.js
    ├── utils/
    │   └── generateToken.js
    ├── package.json
    └── server.js

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js 18 or higher
- npm
- MongoDB (local installation or MongoDB Atlas)

## Installation and Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CollabNote

### 2. Backend Setup

    cd server
    npm install

Create a .env file inside the server folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

Run the backend server:

    npm run dev

The backend will run at:

    http://localhost:5000

### 3. Frontend Setup

    cd ../client
    npm install

Create a .env file inside the client folder (optional but recommended):

    VITE_API_URL=http://localhost:5000/api

Run the frontend server:

    npm run dev

The frontend will run at:

    http://localhost:5173

### API Endpoints

###Authentication

    POST /api/auth/register - Register a new user
    
    POST /api/auth/login - Log in a user

###Notes

    GET /api/notes - Get all accessible notes (owned and collaborated)
    
    GET /api/notes/search?q=&category= - Search notes by text or category
    
    GET /api/notes/stats - Get note statistics by category
    
    GET /api/notes/:id - Get a single note
    
    POST /api/notes - Create a note
    
    PUT /api/notes/:id - Update a note
    
    DELETE /api/notes/:id - Delete a note
    
    POST /api/notes/:id/collaborators - Add a collaborator by email
    
    DELETE /api/notes/:id/collaborators/:userId - Remove a collaborator

### Scripts
Client (client/package.json)
    npm run dev

Server (server/package.json)
    npm start

### Features

    User registration and login
    
    Create, edit, and delete notes
    
    Search notes by keyword or category
    
    Upload PDF files for document notes
    
    Share notes with collaborators
    
    Dashboard statistics for notes

### How to Test

    Register a new user account
    
    Log in with valid credentials
    
    Create a normal text note
    
    Create a document note with PDF upload
    
    Edit and delete notes
    
    Search notes by keyword or category
    
    Add collaborators to a shared note
    
    Verify dashboard statistics update correctly

### Future Improvements

    Real-time collaboration with WebSockets
    
    Note comments and activity history
    
    Better permission control for collaborators
    
    Notification system
    
    Profile settings and avatars
    
    Dark mode support

### Author

    Ayesha Lakshan
