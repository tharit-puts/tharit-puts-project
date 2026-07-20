// บริการ Auth — สมัคร/เข้าสู่ระบบผ่าน API หรือ localStorage (fallback)
// เชื่อมกับ: AuthContext, LoginPage, SignUpPage
import axios from 'axios'
import { API_BASE_URL } from '@/services/postsApi' // ใช้ URL เดียวกับ posts API

// ข้อความ error ที่หน้า Login/SignUp แสดงให้ user เห็น
export const EMAIL_TAKEN_MESSAGE =
  'Email is already taken, Please try another email.'

export const INVALID_CREDENTIALS_MESSAGE =
  'Incorrect email or password. Please try again.'

// key ใน localStorage สำหรับเก็บ user ที่สมัคร, session ปัจจุบัน, และสถานะแจ้งเตือน
const STORAGE_KEY = 'hh_registered_users'
const SESSION_KEY = 'hh_current_user'
const NOTIFICATIONS_KEY = 'hh_has_notifications'

// ตัด password ออกก่อนส่ง user กลับ — ไม่เก็บรหัสผ่านใน session
function sanitizeUser(user) {
  if (!user) return null

  const { password, ...safeUser } = user
  return safeUser
}

// อ่าน user ที่ login อยู่ — AuthContext เรียกตอน mount และหลัง login
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// ตรวจว่ามีจุดแดงแจ้งเตือนที่ NavBar หรือไม่
export function getHasNotifications() {
  return localStorage.getItem(NOTIFICATIONS_KEY) === 'true'
}

// บันทึก session หลัง login/signup — AuthContext.login เรียกใช้
export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sanitizeUser(user)))
  localStorage.setItem(NOTIFICATIONS_KEY, 'true')
}

// ลบ session ตอน logout — AuthContext.logout เรียกใช้
export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(NOTIFICATIONS_KEY)
}

// แสดงอีเมล 4 ตัวแรก ที่เหลือเป็น * — ใช้ในหน้า Profile (อีเมลแก้ไม่ได้)
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email

  const [localPart, domain] = email.split('@')
  const visible = localPart.slice(0, 4)

  return `${visible}****@${domain}`
}

// อัปเดต name, username, avatar — ProfilePage เรียกใช้
export function updateUserProfile({ name, username, avatar }) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('Not logged in')
  }

  const updatedUser = {
    ...currentUser,
    name: name.trim(),
    username: username.trim(),
    ...(avatar !== undefined ? { avatar } : {}),
  }

  saveSession(updatedUser)

  const normalizedEmail = currentUser.email?.trim().toLowerCase()
  const users = getStoredUsers()
  const index = users.findIndex((entry) => entry.email === normalizedEmail)

  if (index !== -1) {
    users[index] = {
      ...users[index],
      name: updatedUser.name,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }

  return sanitizeUser(updatedUser)
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

// fallback เมื่อ API ไม่มี endpoint register (404) — เก็บ user ใน localStorage แทน
function registerLocally({ name, username, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getStoredUsers()

  if (users.some((entry) => entry.email === normalizedEmail)) {
    const error = new Error(EMAIL_TAKEN_MESSAGE)
    error.code = 'EMAIL_TAKEN'
    throw error
  }

  users.push({ name, username, email: normalizedEmail, password })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

  return sanitizeUser({ name, username, email: normalizedEmail })
}

function isEmailTakenError(error) {
  const status = error.response?.status
  const data = error.response?.data
  const message =
    typeof data === 'string'
      ? data
      : data?.error ?? data?.message ?? data?.detail ?? ''

  return (
    status === 409 ||
    (status === 400 &&
      typeof message === 'string' &&
      message.toLowerCase().includes('email'))
  )
}

// สมัครสมาชิก — SignUpPage เรียกใช้ แล้วส่ง user ไป AuthContext.login
export async function registerUser({ name, username, email, password }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      username,
      email,
      password,
    })
    return sanitizeUser(response.data?.user ?? { name, username, email })
  } catch (error) {
    if (error.response?.status === 404) {
      return registerLocally({ name, username, email, password })
    }

    if (isEmailTakenError(error)) {
      const takenError = new Error(EMAIL_TAKEN_MESSAGE)
      takenError.code = 'EMAIL_TAKEN'
      throw takenError
    }

    throw error
  }
}

// fallback login จาก localStorage เมื่อ API ไม่มี endpoint login (404)
function loginLocally({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getStoredUsers().find((entry) => entry.email === normalizedEmail)

  if (!user || user.password !== password) {
    const error = new Error(INVALID_CREDENTIALS_MESSAGE)
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  return sanitizeUser(user)
}

function isInvalidCredentialsError(error) {
  const status = error.response?.status

  return status === 401 || status === 400
}

// เข้าสู่ระบบ — LoginPage เรียกใช้ แล้วส่ง user ไป AuthContext.login
export async function loginUser({ email, password }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    })
    return sanitizeUser(response.data?.user ?? response.data)
  } catch (error) {
    if (error.response?.status === 404) {
      return loginLocally({ email, password })
    }

    if (isInvalidCredentialsError(error)) {
      const credentialsError = new Error(INVALID_CREDENTIALS_MESSAGE)
      credentialsError.code = 'INVALID_CREDENTIALS'
      throw credentialsError
    }

    throw error
  }
}
