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
    <div className="h-screen overflow-hidden bg-[#f3f4f6]">
      <div className="flex h-full overflow-hidden bg-white">
        <div className="hidden w-1/2 items-end justify-center bg-[#f8faf8] p-8 lg:flex">
          <img
            src={loginImage}
            alt="AgroNotes login illustration"
            className="h-auto max-h-[85%] w-full object-contain"
          />
        </div>

        <div className="flex w-full items-center justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:w-1/2 lg:px-14">
          <div className="w-full max-w-120">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7a6e64]">
              CollabNote
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-center text-[#238f32] sm:text-5xl">
              Login
            
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#5f554b]">
              Start writing, sharing, and managing notes with ease.
            </p>

            <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-[#2f2722]"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
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
                    className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
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
                  className="mt-2 w-full rounded-2xl bg-[#2f7d4f] px-5 py-4 text-lg font-semibold text-white transition hover:bg-[#276943] disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Login in...' : 'Login'}
                </button>
              </form>

            <p className="text-center mt-8 text-base text-[#5f554b]">
              No account yet?{' '}
              <Link className="font-semibold text-[#2f7d4f] hover:underline" to="/register">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login