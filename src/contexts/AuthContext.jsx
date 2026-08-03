// Context จัดการสถานะ login ทั้งแอป — ใช้ร่วมกับ NavBar, LoginPage, SignUpPage, Admin
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  clearNotifications,
  clearSession,
  fetchCurrentUser,
  getCurrentUser,
  getHasNotifications,
  hasToken,
  saveSession,
  updateUserProfile,
} from '@/services/authApi'

const AuthContext = createContext(null)

// ครอบแอปใน App.jsx — ให้ทุก component เรียก useAuth() ได้
export function AuthProvider({ children }) {
  // เริ่มจากข้อมูลใน localStorage เพื่อให้หน้าเว็บวาดได้ทันทีไม่กระพริบ
  const [user, setUser] = useState(getCurrentUser)
  const [hasNotifications, setHasNotifications] = useState(getHasNotifications)
  // true จนกว่าจะยืนยัน token กับ backend เสร็จ — หน้า admin ใช้กันการเด้งออกก่อนเวลา
  const [isLoading, setIsLoading] = useState(hasToken)

  // ตอนเปิดแอป ถ้ามี token อยู่ให้ถาม backend ว่ายังใช้ได้ไหมและข้อมูลล่าสุดเป็นอะไร
  // จำเป็นเพราะ token อาจหมดอายุ หรือ role อาจถูกเปลี่ยนหลังจากที่ login ไว้
  useEffect(() => {
    if (!hasToken()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    let isActive = true

    fetchCurrentUser()
      .then((freshUser) => {
        if (!isActive) return
        setUser(freshUser)
      })
      .catch((error) => {
        // เช่น backend ล่มหรือเน็ตหลุด — ใช้ข้อมูลเดิมใน localStorage ต่อไป ไม่เตะผู้ใช้ออก
        console.error('Failed to verify session:', error)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  // เรียกหลัง login/signup สำเร็จ — รับ { token, user } จาก authApi
  const login = useCallback(({ token, user: userData }) => {
    saveSession({ token, user: userData })
    setUser(userData)
    setHasNotifications(true)
    setIsLoading(false)
  }, [])

  // เรียกจาก NavBar เมื่อกด Log out — ลบ token + session แล้วกลับเป็น guest
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setHasNotifications(false)
  }, [])

  // อัปเดต profile — ProfilePage เรียกหลังกด Save (ตอนนี้เป็น async เพราะยิงไป backend)
  const updateProfile = useCallback(async (updates) => {
    const updatedUser = await updateUserProfile(updates)
    setUser(updatedUser)
    return updatedUser
  }, [])

  // ลบจุดแดงแจ้งเตือน — NotificationDropdown เรียกเมื่อเปิด dropdown
  const markNotificationsRead = useCallback(() => {
    clearNotifications()
    setHasNotifications(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      updateProfile,
      hasNotifications,
      markNotificationsRead,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      updateProfile,
      hasNotifications,
      markNotificationsRead,
    ],
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
