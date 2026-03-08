import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { toApiError } from '../services/api'

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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card-surface w-full max-w-md p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a6e64]">AgroVenture</p>
        <h1 className="mt-2 font-display text-3xl text-[#2f2722]">Create account</h1>
        <p className="mt-2 text-sm text-[#5f554b]">Set up your profile and start organizing plantation knowledge.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="name">
              Full Name
            </label>
            <input id="name" className="agro-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
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
            {emailError ? <p className="mt-2 text-xs text-[#8a2f22]">{emailError}</p> : null}
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
              autoComplete="new-password"
              required
            />
          </div>

          {error ? <p className="rounded-xl bg-[#fce9e5] px-3 py-2 text-sm text-[#8a2f22]">{error}</p> : null}

          <button className="agro-btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-[#5f554b]">
          Already have an account?{' '}
          <Link className="font-semibold text-[#365d3d]" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
