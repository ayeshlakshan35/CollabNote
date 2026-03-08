import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { toApiError } from '../services/api'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.')
      return
    }

    try {
      setLoading(true)
      await login(formData)
      navigate(redirectTo, { replace: true })
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to log in.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card-surface w-full max-w-md p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a6e64]">AgroVenture</p>
        <h1 className="mt-2 font-display text-3xl text-[#2f2722]">Sign in to AgroNotes</h1>
        <p className="mt-2 text-sm text-[#5f554b]">
          Track plantation operations, share field notes, and stay aligned with your team.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="agro-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="agro-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? <p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

          <button className="agro-btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-[#5f554b]">
          No account yet?{' '}
          <Link className="font-semibold text-[#365d3d]" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
