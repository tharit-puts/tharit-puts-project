// Context จัดการสถานะ login ทั้งแอป — ใช้ร่วมกับ NavBar, LoginPage, SignUpPage
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  clearNotifications,
  clearSession,
  getCurrentUser,
  getHasNotifications,
  saveSession,
  updateUserProfile,
} from '@/services/authApi' // อ่าน/เขียน session ใน localStorage

const AuthContext = createContext(null)

// ครอบแอปใน App.jsx — ให้ทุก component เรียก useAuth() ได้
export function AuthProvider({ children }) {
  // โหลด user จาก localStorage ตอนเปิดแอป (ถ้าเคย login ไว้)
  const [user, setUser] = useState(getCurrentUser)
  const [hasNotifications, setHasNotifications] = useState(getHasNotifications)

  // เรียกหลัง login/signup สำเร็จ — บันทึก session แล้วอัปเดต state
  const login = useCallback((userData) => {
    saveSession(userData)
    setUser(getCurrentUser())
    setHasNotifications(true)
  }, [])

  // เรียกจาก NavBar เมื่อกด Log out — ลบ session แล้วกลับเป็น guest
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setHasNotifications(false)
  }, [])

  // อัปเดต profile — ProfilePage เรียกหลังกด Save
  const updateProfile = useCallback((updates) => {
    updateUserProfile(updates)
    setUser(getCurrentUser())
  }, [])

  // ลบจุดแดงแจ้งเตือน — NotificationDropdown เรียกเมื่อเปิด dropdown
  const markNotificationsRead = useCallback(() => {
    clearNotifications()
    setHasNotifications(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateProfile,
      hasNotifications,
      markNotificationsRead,
    }),
    [user, login, logout, updateProfile, hasNotifications, markNotificationsRead],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook สำหรับ component อื่น — ต้องอยู่ภายใต้ AuthProvider เท่านั้น
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
