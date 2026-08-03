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
  clearSession,
  fetchCurrentUser,
  getCurrentUser,
  hasToken,
  saveSession,
  updateUserProfile,
} from '@/services/authApi'
import {
  fetchUnreadNotificationCount,
  markNotificationsAsRead,
} from '@/services/notificationsApi'

const AuthContext = createContext(null)

// ครอบแอปใน App.jsx — ให้ทุก component เรียก useAuth() ได้
export function AuthProvider({ children }) {
  // เริ่มจากข้อมูลใน localStorage เพื่อให้หน้าเว็บวาดได้ทันทีไม่กระพริบ
  const [user, setUser] = useState(getCurrentUser)
  const [hasNotifications, setHasNotifications] = useState(false)
  // true จนกว่าจะยืนยัน token กับ backend เสร็จ — หน้า admin ใช้กันการเด้งออกก่อนเวลา
  const [isLoading, setIsLoading] = useState(hasToken)

  const refreshUnreadCount = useCallback(async () => {
    if (!hasToken()) {
      setHasNotifications(false)
      return 0
    }

    const count = await fetchUnreadNotificationCount()
    setHasNotifications(count > 0)
    return count
  }, [])

  // ตอนเปิดแอป ถ้ามี token อยู่ให้ถาม backend ว่ายังใช้ได้ไหมและข้อมูลล่าสุดเป็นอะไร
  useEffect(() => {
    if (!hasToken()) {
      setUser(null)
      setHasNotifications(false)
      setIsLoading(false)
      return
    }

    let isActive = true

    Promise.all([fetchCurrentUser(), fetchUnreadNotificationCount()])
      .then(([freshUser, unreadCount]) => {
        if (!isActive) return
        setUser(freshUser)
        setHasNotifications(unreadCount > 0)
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

  // กลับมาโฟกัสแท็บแล้วรีเฟรชจุดแดง — เผื่อมีคนมา comment ตอนเปิดเว็บทิ้งไว้
  useEffect(() => {
    function handleFocus() {
      if (hasToken()) {
        refreshUnreadCount()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshUnreadCount])

  // เรียกหลัง login/signup สำเร็จ — รับ { token, user } จาก authApi
  const login = useCallback(
    async ({ token, user: userData }) => {
      saveSession({ token, user: userData })
      setUser(userData)
      setIsLoading(false)
      await refreshUnreadCount()
    },
    [refreshUnreadCount],
  )

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
  const markNotificationsRead = useCallback(async () => {
    setHasNotifications(false)
    try {
      await markNotificationsAsRead()
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
      // ถ้า API พลาด ให้รีเฟรชสถานะจริงจาก backend อีกครั้ง
      await refreshUnreadCount()
    }
  }, [refreshUnreadCount])

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
      refreshUnreadCount,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      updateProfile,
      hasNotifications,
      markNotificationsRead,
      refreshUnreadCount,
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
