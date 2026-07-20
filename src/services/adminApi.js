// บริการ login สำหรับ admin — AdminLoginPage เรียกใช้
export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'admin'

export const ADMIN_INVALID_CREDENTIALS_TITLE =
  'Your password is incorrect or this email doesn\u2019t exist'

export const ADMIN_INVALID_CREDENTIALS_DESCRIPTION =
  'Please try another password or email'

const ADMIN_SESSION_KEY = 'hh_admin_session'

export function getAdminSession() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function loginAdmin({ emailOrUsername, password }) {
  const identifier = emailOrUsername.trim().toLowerCase()
  const isValidIdentifier =
    identifier === ADMIN_EMAIL.toLowerCase() ||
    identifier === ADMIN_USERNAME.toLowerCase()
  const isValidPassword = password === ADMIN_PASSWORD

  if (isValidIdentifier && isValidPassword) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    return { email: ADMIN_EMAIL, username: ADMIN_USERNAME }
  }

  const error = new Error(ADMIN_INVALID_CREDENTIALS_TITLE)
  error.code = 'ADMIN_INVALID_CREDENTIALS'
  throw error
}
