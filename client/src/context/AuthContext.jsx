import { createContext, useState } from 'react'
import { loginUser, registerUser, setAuthToken } from '../services/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null })

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth)
    setAuthToken(nextAuth.token)
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
