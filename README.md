# CollabNote

**CollabNote** is a collaborative note-taking web application built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It allows users to **create, manage, search, and share notes with collaborators** through a clean and responsive web interface.

This project demonstrates **full-stack web development**, including authentication, REST APIs, and database integration.

---

## Tech Stack

### Frontend
- **React** – UI library
- **Vite** – Development server and build tool
- **Tailwind CSS** – Utility-first CSS framework
- **React Router** – Client-side routing
- **Axios** – HTTP client for API requests

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Backend web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **JWT** – Authentication tokens
- **bcryptjs** – Password hashing

---

## Features

- User registration and login
- JWT authentication
- Create, edit, and delete notes
- Share notes with collaborators
- Search notes
- Responsive dashboard
- Protected routes
- Rich text note editing

---

## Project Structure

CollabNote
│
├── client                      # React frontend
│   ├── public
│   │   └── vite.svg
│   │
│   ├── src
│   │   ├── assets
│   │   │   ├── images
│   │   │   └── icons
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── NoteDetails.jsx
│   │   │   └── SharedNotes.jsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── utils
│   │   │   └── helpers.js
│   │   │
│   │   ├── styles
│   │   │   └── index.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server                      # Node.js backend
    │
    ├── config
    │   └── db.js               # MongoDB connection
    │
    ├── controllers
    │   └── authController.js   # Authentication logic
    │
    ├── middleware
    │   └── authMiddleware.js   # JWT route protection
    │
    ├── models
    │   └── User.js             # User schema
    │
    ├── routes
    │   └── authRoutes.js       # Authentication API routes
    │
    ├── utils
    │   └── generateToken.js    # JWT helper
    │
    ├── .env
    ├── package.json
    └── server.js               # Express server entry point

---

## Prerequisites

Before running this project, make sure you have installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd CollabNote
```

---

## Backend Setup

Install backend dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the **server** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on:

```
http://localhost:5000
```

---

## Frontend Setup

Install frontend dependencies:

```bash
cd client
npm install
```

(Optional) create `.env` in the client folder:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

### Notes

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/notes | Get all notes |
| POST | /api/notes | Create a note |
| GET | /api/notes/:id | Get a specific note |
| PUT | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |

---

## Security

- Password hashing using **bcrypt**
- Authentication handled with **JWT tokens**
- Protected API routes
- Environment variables for sensitive configuration

---

## Future Improvements

Possible improvements for the application:

- Real-time collaboration
- Note categories and tags
- Notifications for shared notes
- Dark mode support

---

## License

This project is licensed under the **MIT License**.

---

## Author

This project was developed as a **MERN stack full-stack web application** demonstrating collaborative note management functionality.
