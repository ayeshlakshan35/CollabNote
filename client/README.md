# CollabNote

CollabNote is a collaborative note management web application built using the MERN stack.

## Tech Stack
- React (Vite)
- Node.js
- Express.js
- MongoDB
- Tailwind CSS

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
    ├── config                  # Configuration files
    ├── controllers             # Route controllers
    ├── middleware              # Custom middleware
    ├── models                  # Database models
    ├── routes                  # API routes
    ├── package.json
    └── server.js
```

## Features
- User authentication
- Create and manage notes
- Share notes with collaborators
- Search and filter notes
- Responsive dashboard

## Setup

### Install client
cd client
npm install

### Run frontend
npm run dev

### Setup server
cd ../server
npm install

### Run backend
npm run dev