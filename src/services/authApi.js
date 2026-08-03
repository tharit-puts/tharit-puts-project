// บริการ Auth — สมัคร/เข้าสู่ระบบผ่าน backend ของเราเอง (bcrypt + JWT)
// เชื่อมกับ: AuthContext, LoginPage, SignUpPage, ProfilePage, ResetPasswordPage
import {
  apiClient,
  clearToken,
  getApiErrorMessage,
  getApiErrorStatus,
  getToken,
  setToken,
} from '@/lib/apiClient'

// ข้อความ error ที่หน้า Login/SignUp แสดงให้ user เห็น
export const EMAIL_TAKEN_MESSAGE =
  'Email is already taken, Please try another email.'

export const INVALID_CREDENTIALS_MESSAGE =
  'Incorrect email, username, or password. Please try again.'

export const WRONG_PASSWORD_MESSAGE = 'Current password is incorrect.'

export const PASSWORD_MISMATCH_MESSAGE = 'New passwords do not match.'

export const PASSWORD_TOO_SHORT_MESSAGE = 'Password must be at least 6 characters.'

// เก็บ user ที่ login อยู่ไว้ใน localStorage ด้วย เพื่อให้หน้าเว็บวาดได้ทันทีตอนรีเฟรช
// ไม่ต้องรอ /auth/me ตอบก่อน (แต่ยังยิง /auth/me เพื่อยืนยันและอัปเดตข้อมูลล่าสุด)
const SESSION_KEY = 'hh_current_user'
const NOTIFICATIONS_KEY = 'hh_has_notifications'

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function getHasNotifications() {
  return localStorage.getItem(NOTIFICATIONS_KEY) === 'true'
}

// ลบจุดแดงแจ้งเตือน — NotificationDropdown เรียกเมื่อเปิด dropdown
export function clearNotifications() {
  localStorage.setItem(NOTIFICATIONS_KEY, 'false')
}

// บันทึก session หลัง login/signup — เก็บทั้ง token และข้อมูล user
export function saveSession({ token, user }) {
  if (token) setToken(token)
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  localStorage.setItem(NOTIFICATIONS_KEY, 'true')
}

// อัปเดตแค่ข้อมูล user ใน session (ไม่แตะ token) — ใช้หลังแก้โปรไฟล์
export function saveUserToSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

// ลบ session ตอน logout — ต้องลบ token ด้วย ไม่งั้นยังเรียก API ในนามคนเดิมได้
export function clearSession() {
  clearToken()
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(NOTIFICATIONS_KEY)
}

export function hasToken() {
  return Boolean(getToken())
}

// แสดงอีเมล 4 ตัวแรก ที่เหลือเป็น * — ใช้ในหน้า Profile (อีเมลแก้ไม่ได้)
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email

  const [localPart, domain] = email.split('@')
  const visible = localPart.slice(0, 4)

  return `${visible}****@${domain}`
}

// --- API calls ---------------------------------------------------------------

// สมัครสมาชิก — SignUpPage เรียกใช้ แล้วส่ง { token, user } ไป AuthContext.login
export async function registerUser({ name, username, email, password }) {
  try {
    const { data } = await apiClient.post('/auth/register', {
      name,
      username,
      email,
      password,
    })
    return { token: data.token, user: data.user }
  } catch (error) {
    // backend ตอบ 409 เมื่ออีเมลหรือ username ถูกใช้แล้ว
    if (getApiErrorStatus(error) === 409) {
      const takenError = new Error(getApiErrorMessage(error, EMAIL_TAKEN_MESSAGE))
      takenError.code = 'EMAIL_TAKEN'
      throw takenError
    }
    throw new Error(getApiErrorMessage(error, 'Failed to create account'))
  }
}

// เข้าสู่ระบบ — LoginPage เรียกใช้ แล้วส่ง { token, user } ไป AuthContext.login
// ช่อง email ส่งได้ทั้งอีเมลและ username (backend รับทั้งสองแบบ)
export async function loginUser({ email, password }) {
  try {
    const { data } = await apiClient.post('/auth/login', { email, password })
    return { token: data.token, user: data.user }
  } catch (error) {
    const status = getApiErrorStatus(error)
    if (status === 401 || status === 400) {
      const credentialsError = new Error(INVALID_CREDENTIALS_MESSAGE)
      credentialsError.code = 'INVALID_CREDENTIALS'
      throw credentialsError
    }
    throw new Error(getApiErrorMessage(error, 'Failed to log in'))
  }
}

// ดึงข้อมูลผู้ใช้ล่าสุดจาก token ที่มีอยู่ — AuthContext เรียกตอนเปิดแอป
// คืน null ถ้าไม่มี token หรือ token ใช้ไม่ได้แล้ว
export async function fetchCurrentUser() {
  if (!getToken()) return null

  try {
    const { data } = await apiClient.get('/auth/me')
    return data
  } catch (error) {
    if (getApiErrorStatus(error) === 401) {
      clearSession()
      return null
    }
    throw error
  }
}

// อัปเดต name, username, avatar — ProfilePage เรียกใช้
export async function updateUserProfile({ name, username, avatar }) {
  try {
    const { data } = await apiClient.put('/auth/profile', {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(username !== undefined ? { username: username.trim() } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    })
    saveUserToSession(data)
    return data
  } catch (error) {
    if (getApiErrorStatus(error) === 409) {
      throw new Error(getApiErrorMessage(error, 'Username is already taken'))
    }
    throw new Error(getApiErrorMessage(error, 'Failed to update profile'))
  }
}

// เปลี่ยนรหัสผ่าน — ResetPasswordPage เรียกใช้
// backend ตรวจรหัสผ่านเดิมให้ (ตอบ 401 ถ้าผิด) จึงไม่ต้องเก็บรหัสผ่านไว้ในเบราว์เซอร์อีก
export async function resetUserPassword({ currentPassword, newPassword }) {
  try {
    await apiClient.put('/auth/reset-password', { currentPassword, newPassword })
  } catch (error) {
    if (getApiErrorStatus(error) === 401) {
      const wrongError = new Error(WRONG_PASSWORD_MESSAGE)
      wrongError.code = 'WRONG_PASSWORD'
      throw wrongError
    }
    throw new Error(getApiErrorMessage(error, 'Failed to update password'))
  }
}
