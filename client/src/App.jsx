import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/useAuth.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NoteEditor from './pages/NoteEditor.jsx'
import NoteDetails from './pages/NoteDetails.jsx'
import SharedNotes from './pages/SharedNotes.jsx'
import NotFound from './pages/NotFound.jsx'


const PublicOnly = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

const PrivateLayout = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6] lg:flex-row">
      <Navbar />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <div className="grain-overlay min-h-screen">
      <div className="content-layer">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />

          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes/new" element={<NoteEditor mode="create" />} />
            <Route path="/notes/:id" element={<NoteDetails />} />
            <Route path="/notes/:id/edit" element={<NoteEditor mode="edit" />} />
            <Route path="/shared" element={<SharedNotes />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
