import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { toApiError } from '../services/api'
import registerImage from '../assets/images/register.png'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const COMMON_TYPO_DOMAINS = new Set(['gmil.com', 'gmai.com', 'gmial.com', 'hotnail.com', 'yaho.com', 'outlok.com'])

const validateEmail = (value) => {
  const email = String(value || '').trim().toLowerCase()
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email format (example: name@gmail.com).'
  }

  const domain = email.split('@')[1] || ''
  if (COMMON_TYPO_DOMAINS.has(domain)) {
    return `The email domain "${domain}" looks incorrect. Please check it.`
  }

  return ''
}

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'email') {
      setEmailError(validateEmail(value))
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const nextEmailError = validateEmail(formData.email)
    setEmailError(nextEmailError)
    if (nextEmailError) {
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)
      await register(formData)
      navigate('/login', { replace: true })
    } catch (apiError) {
      setError(toApiError(apiError, 'Unable to register.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#f3f4f6]">
      <div className="flex min-h-dvh bg-white">
        <div className="hidden w-1/2 items-end justify-center bg-[#f8faf8] p-8 lg:flex">
          <img
            src={registerImage}
            alt="Register illustration"
            className="h-auto max-h-[85%] w-full object-contain"
          />
        </div>

        <div className="flex w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:w-1/2 lg:px-14">
          <div className="w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7a6e64]">
              CollabNote
            </p>

            <h1 className="text-center mt-4 text-4xl font-bold leading-tight text-[#238f32] sm:text-5xl">
              Register
            </h1>


            <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="email">
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
                {emailError ? (
                  <p className="mt-2 rounded-xl border border-[#f3c7bf] bg-[#fce9e5] px-3 py-2 text-xs text-[#8a2f22]">
                    {emailError}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2722]" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="w-full rounded-2xl border border-[#dedede] bg-white px-5 py-4 text-base text-[#2f2722] outline-none transition placeholder:text-[#9b938b] focus:border-[#2f7d32] focus:ring-4 focus:ring-[#2f7d32]/10"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="text-center mt-8 text-base text-[#5f554b]">
              Already have an account?{' '}
              <Link className="font-semibold text-[#2f7d4f] hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register