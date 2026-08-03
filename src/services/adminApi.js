// บริการ login สำหรับ admin — ใช้ระบบ auth จริงของ backend
// เมื่อก่อนรหัสผ่าน admin ถูก hardcode ไว้ในไฟล์นี้ ซึ่งใครเปิดดูโค้ดก็เห็น
// ตอนนี้ตรวจกับ database และเช็คว่า role = 'admin' จริงหรือไม่
import { loginUser } from '@/services/authApi'

export const ADMIN_INVALID_CREDENTIALS_TITLE =
  'Your password is incorrect or this email doesn\u2019t exist'

export const ADMIN_INVALID_CREDENTIALS_DESCRIPTION =
  'Please try another password or email'

export const NOT_ADMIN_TITLE = 'This account does not have admin access'

export const NOT_ADMIN_DESCRIPTION =
  'Please log in with an administrator account'

/**
 * login สำหรับ admin — คืน { token, user } ให้หน้า AdminLoginPage ส่งต่อให้ AuthContext
 *
 * ถ้ารหัสผ่านถูกแต่ไม่ใช่ admin จะโยน error คนละแบบ เพื่อให้แสดงข้อความที่ตรงกับปัญหา
 */
export async function loginAdmin({ emailOrUsername, password }) {
  let result

  try {
    // backend รับทั้งอีเมลและ username ในช่อง email
    result = await loginUser({ email: emailOrUsername, password })
  } catch (error) {
    const adminError = new Error(ADMIN_INVALID_CREDENTIALS_TITLE)
    adminError.code = 'ADMIN_INVALID_CREDENTIALS'
    adminError.cause = error
    throw adminError
  }

  if (result.user?.role !== 'admin') {
    const notAdmin = new Error(NOT_ADMIN_TITLE)
    notAdmin.code = 'NOT_ADMIN'
    throw notAdmin
  }

  return result
}
