// ข้อมูลโปรไฟล์ admin — เก็บใน localStorage (API ไม่มีส่วนนี้)
const PROFILE_STORAGE_KEY = 'hh_admin_profile'

const DEFAULT_PROFILE = {
  name: 'Thompson P.',
  username: 'thompson',
  email: 'thompson.p@gmail.com',
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care.',
  avatar: '',
}

function readProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function writeProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

// ดึงข้อมูลโปรไฟล์ — seed ค่าเริ่มต้นถ้ายังไม่มี
export function getProfile() {
  const stored = readProfile()
  if (stored) return { ...DEFAULT_PROFILE, ...stored }

  writeProfile(DEFAULT_PROFILE)
  return { ...DEFAULT_PROFILE }
}

// อัปเดตโปรไฟล์ — merge กับของเดิม
export function updateProfile(data) {
  const next = { ...getProfile(), ...data }
  writeProfile(next)
  return next
}

// ชื่อผู้เขียน — ใช้เป็น Author name ตอนสร้าง/แก้บทความ
export function getAuthorName() {
  return getProfile().name
}
