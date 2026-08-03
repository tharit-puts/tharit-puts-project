// axios instance กลางที่ทุก service ใช้ร่วมกัน
// หน้าที่: ชี้ไป backend ที่ถูกต้อง และแนบ JWT ไปกับทุก request อัตโนมัติ
import axios from 'axios'

// อ่านจาก .env — ตัด / ท้ายสุดออกกัน URL กลายเป็น //posts
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
).replace(/\/+$/, '')

const TOKEN_KEY = 'hh_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const apiClient = axios.create({ baseURL: API_BASE_URL })

// แนบ Authorization header ให้ทุก request ที่ออกจากแอป
// ทำที่นี่ที่เดียว แต่ละ service จึงไม่ต้องจำว่าต้องส่ง token เอง
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// backend ตอบ error เป็น { message: "..." } เสมอ ฟังก์ชันนี้ดึงข้อความนั้นออกมา
export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message ?? error?.message ?? fallback
}

export function getApiErrorStatus(error) {
  return error?.response?.status ?? null
}

// หมายเหตุ: ตั้งใจ "ไม่" ใส่ response interceptor ที่ logout อัตโนมัติเมื่อเจอ 401
// เพราะ 401 ไม่ได้หมายถึง token หมดอายุเสมอไป เช่นกรอกรหัสผ่านเดิมผิดตอนเปลี่ยนรหัส
// ก็ได้ 401 ด้วย ถ้า logout ทันทีผู้ใช้จะหลุดออกจากระบบเพราะพิมพ์ผิดแค่ครั้งเดียว
