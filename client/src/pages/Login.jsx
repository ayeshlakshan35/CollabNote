import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { toApiError } from '../services/api'
import loginImage from '../assets/images/login.png'

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
    <div className="h-screen overflow-hidden bg-[#f7f5f1]">
      <div className="grid h-full lg:grid-cols-2">
        <div className="hidden h-full overflow-hidden lg:block">
          <img
            src={loginImage}
            alt="AgroNotes login illustration"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="rounded-[28px] border border-[#e7e0d7] bg-[#f7f5f1] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a6e64]">
                CollabNote
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#caa893] text-center">
                SignIn
              </h1>


              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-[#2f2722]"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="w-full rounded-2xl border border-[#d9d1c7] bg-white px-4 py-3 text-sm text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-[#2f2722]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    className="w-full rounded-2xl border border-[#d9d1c7] bg-white px-4 py-3 text-sm text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error ? (
                  <p className="rounded-2xl border border-[#f3c7bf] bg-[#fce9e5] px-4 py-3 text-sm text-[#8a2f22]">
                    {error}
                  </p>
                ) : null}

                <button
                  className="w-full rounded-2xl bg-[#1f6b3b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#17562f] disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <p className="mt-6 text-sm text-[#5f554b] text-center">
                No account yet?{' '}
                <Link className="font-semibold text-[#365d3d] hover:underline" to="/register">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login