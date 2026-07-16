import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  clearSession,
  getCurrentUser,
  getHasNotifications,
  saveSession,
} from '@/services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)
  const [hasNotifications, setHasNotifications] = useState(getHasNotifications)

  const login = useCallback((userData) => {
    saveSession(userData)
    setUser(getCurrentUser())
    setHasNotifications(true)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setHasNotifications(false)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout, hasNotifications }),
    [user, login, logout, hasNotifications],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
