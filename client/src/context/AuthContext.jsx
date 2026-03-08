import { createContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../services/api.js'

const STORAGE_KEY = 'agronotes_auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null })

  useEffect(() => {
    const persisted = localStorage.getItem(STORAGE_KEY)
    if (!persisted) return

    try {
      const parsed = JSON.parse(persisted)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuth({
        token: parsed?.token || null,
        user: parsed?.user || null,
      })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
  }

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    saveAuth({ token: data.token, user: data.user })
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    saveAuth({ token: data.token, user: data.user })
    return data
  }

  const logout = () => {
    setAuth({ token: null, user: null })
    localStorage.removeItem(STORAGE_KEY)
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
