# CollabNote

CollabNote is a collaborative note-taking web application built with the MERN stack.

It allows users to register/login, create and manage notes, collaborate with other users, search/filter notes, and manage document notes with PDF upload support.

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
- Create, edit, delete notes
- Rich text note editor (formatting toolbar)
- Document notes (PDF upload and view)
- Shared notes and collaborator management
- Search notes by text/category
- Notes statistics endpoint for dashboard/category insights
- Responsive modern dashboard/sidebar layout

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
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

## Installation and Run

### 1. Clone

```bash
git clone <repository-url>
cd CollabNote
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `client/.env` (optional but recommended):

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all accessible notes (owned + collaborated)
- `GET /api/notes/search?q=&category=` - Search notes
- `GET /api/notes/stats` - Notes statistics by category
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note (supports PDF for `Documents` category)
- `PUT /api/notes/:id` - Update note (owner update flow)
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/collaborators` - Add collaborator by email
- `DELETE /api/notes/:id/collaborators/:userId` - Remove collaborator

## Scripts

### Client (`client/package.json`)

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server (`server/package.json`)

```bash
npm run dev
npm start
npm run seed
```

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

## Security

- Password hashing with bcryptjs
- JWT authentication middleware for protected routes
- Environment variables for secrets
- Basic rich-text sanitization before persistence

## Roadmap

- Real-time collaborative editing
- Notifications for shared note activity
- Tagging and advanced filters
- Better media support in rich text

## License

MIT