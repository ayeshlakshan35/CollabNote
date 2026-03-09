# CollabNote

CollabNote is a collaborative note management web application built using the MERN stack.

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
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
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server                      # Node.js backend
    │
    ├── config
    │   └── db.js               # MongoDB connection setup
    │
    ├── controllers
    │   └── authController.js   # Authentication logic (register, login)
    │
    ├── middleware
    │   └── authMiddleware.js   # JWT verification & route protection
    │
    ├── models
    │   └── User.js             # User schema (Mongoose model)
    │
    ├── routes
    │   └── authRoutes.js       # Authentication API endpoints
    │
    ├── utils
    │   └── generateToken.js    # JWT token generation helper
    │
    ├── .env                    # Environment variables (not committed)
    ├── package.json            # Server dependencies
    └── server.js               # Express app entry point
```

## Features
- 🔐 User authentication (Register/Login with JWT)
- 📝 Create, edit, and delete notes
- 🤝 Share notes with collaborators
- 🔍 Search and filter notes
- 📱 Responsive dashboard
- 🎨 Rich text editor
- 🔒 Protected routes
- ⚡ Real-time updates

## Prerequisites

Before running this project, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd CollabNote
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Run the server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory (if needed):
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - **Body**: `{ name, email, password }`
  - **Response**: `{ token, user: { id, name, email } }`
  - **Status Codes**: 
    - `201` - User created successfully
    - `400` - Missing required fields
    - `409` - Email already registered
    - `500` - Server error

- `POST /api/auth/login` - Login user
  - **Body**: `{ email, password }`
  - **Response**: `{ token, user: { id, name, email } }`
  - **Status Codes**:
    - `200` - Login successful
    - `400` - Missing credentials
    - `401` - Invalid credentials
    - `500` - Server error

### Notes (Coming soon)
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `POST /api/notes/:id/share` - Share a note with collaborators

## Project Structure Details

### Client Components
- **Navbar.jsx** - Navigation bar component
- **ProtectedRoute.jsx** - Route protection wrapper
- **NoteCard.jsx** - Note display card
- **Loader.jsx** - Loading spinner component

### Client Pages
- **Login.jsx** - User login page
- **Register.jsx** - User registration page
- **Dashboard.jsx** - Main dashboard with notes overview
- **NoteEditor.jsx** - Note creation and editing interface
- **NoteDetails.jsx** - Detailed note view
- **SharedNotes.jsx** - View notes shared with the user

### Server Structure
- **config/**
  - `db.js` - MongoDB connection configuration using Mongoose
  
- **controllers/**
  - `authController.js` - Handles user registration and login logic
    - `register()` - Creates new user with hashed password
    - `login()` - Validates credentials and returns JWT token
    
- **middleware/**
  - `authMiddleware.js` - JWT token verification for protected routes
  
- **models/**
  - `User.js` - User schema defining name, email, password fields
  
- **routes/**
  - `authRoutes.js` - Authentication API routes
    - `POST /register` - User registration endpoint
    - `POST /login` - User login endpoint
    
- **utils/**
  - `generateToken.js` - Helper function to generate JWT tokens with 7-day expiry
  
- **server.js** - Main Express application entry point
  - Configures middleware (CORS, JSON parsing)
  - Connects to MongoDB
  - Mounts API routes
  - Starts the server

## Backend Implementation Details

### Database Schema

**User Model** (`models/User.js`)
```javascript
{
  name: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, hashed with bcrypt)
  timestamps: true (createdAt, updatedAt)
}
```

### Authentication Flow

1. **Registration** (`authController.register`)
   - Validates required fields (name, email, password)
   - Checks if email already exists (409 if duplicate)
   - Hashes password using bcrypt with salt rounds
   - Creates new user in database
   - Generates JWT token with 7-day expiry
   - Returns token and user data (excluding password)

2. **Login** (`authController.login`)
   - Validates email and password presence
   - Finds user by email (case-insensitive)
   - Compares provided password with hashed password
   - Generates JWT token on successful authentication
   - Returns token and user data

3. **Token Generation** (`utils/generateToken.js`)
   - Signs JWT with user ID as payload
   - Uses JWT_SECRET from environment variables
   - Sets 7-day expiration
   - Returns signed token

4. **Authentication Middleware** (`middleware/authMiddleware.js`)
   - Verifies JWT token from Authorization header
   - Decodes token and attaches user to request
   - Protects routes requiring authentication

### Security Features
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Email uniqueness validation
- ✅ Case-insensitive email handling
- ✅ Environment variable protection
- ✅ CORS enabled for cross-origin requests
- ✅ Input validation and error handling

### Environment Variables Required
```env
PORT=5000                          # Server port
MONGO_URI=mongodb://...            # MongoDB connection string
JWT_SECRET=your_secret_key         # JWT signing secret (use strong random string)
NODE_ENV=development               # Environment mode
```

## Scripts

### Client
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Server
```bash
npm start          # Start server with node
npm run dev        # Start server with nodemon (auto-restart)
```

## Backend Dependencies

### Production Dependencies
- **express** - Fast, minimalist web framework for Node.js
- **mongoose** - MongoDB object modeling tool
- **jsonwebtoken** - JWT token generation and verification
- **bcryptjs** - Password hashing library
- **cors** - Enable Cross-Origin Resource Sharing
- **dotenv** - Load environment variables from .env file

### Development Dependencies
- **nodemon** - Auto-restart server on file changes during development

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.