import { createContext, useState } from 'react'
import { loginUser, registerUser, setAuthToken } from '../services/api.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'agronotes_auth'

const getInitialAuth = () => {
  const persisted = sessionStorage.getItem(STORAGE_KEY)
  if (!persisted) return { token: null, user: null }

  try {
    const parsed = JSON.parse(persisted)
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return { token: null, user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const initialAuth = getInitialAuth()
    setAuthToken(initialAuth.token)
    return initialAuth
  })

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth)
    setAuthToken(nextAuth.token)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
  }

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    saveAuth({ token: data.token, user: data.user })
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    return data
  }

  const logout = () => {
    setAuth({ token: null, user: null })
    setAuthToken(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    token: auth.token,
    user: auth.user,
    isAuthenticated: Boolean(auth.token),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
