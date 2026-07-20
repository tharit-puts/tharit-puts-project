// บริการ login สำหรับ admin — AdminLoginPage เรียกใช้
export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'admin'

export const ADMIN_INVALID_CREDENTIALS_TITLE =
  'Your password is incorrect or this email doesn\u2019t exist'

export const ADMIN_INVALID_CREDENTIALS_DESCRIPTION =
  'Please try another password or email'

const ADMIN_SESSION_KEY = 'hh_admin_session'
const ADMIN_PASSWORD_KEY = 'hh_admin_password'

export function getAdminSession() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

// รหัสผ่านปัจจุบัน — อ่านจาก localStorage ถ้ามี ไม่งั้นใช้ค่าเริ่มต้น
export function getAdminPassword() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) ?? ADMIN_PASSWORD
}

// เปลี่ยนรหัสผ่าน admin — Reset password ใช้
export function updateAdminPassword(newPassword) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
}

export function loginAdmin({ emailOrUsername, password }) {
  const identifier = emailOrUsername.trim().toLowerCase()
  const isValidIdentifier =
    identifier === ADMIN_EMAIL.toLowerCase() ||
    identifier === ADMIN_USERNAME.toLowerCase()
  const isValidPassword = password === getAdminPassword()

  if (isValidIdentifier && isValidPassword) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    return { email: ADMIN_EMAIL, username: ADMIN_USERNAME }
  }

  const error = new Error(ADMIN_INVALID_CREDENTIALS_TITLE)
  error.code = 'ADMIN_INVALID_CREDENTIALS'
  throw error
}
