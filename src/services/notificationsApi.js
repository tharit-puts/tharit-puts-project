// บริการแจ้งเตือนของแต่ละผู้ใช้ — คุยกับ backend ที่ /notifications
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'

// แปลงเวลาเป็นข้อความสั้น ๆ เช่น "2 hours ago" หรือวันที่เต็มถ้าเก่ากว่า
export function formatNotificationTime(dateString) {
  const date = new Date(dateString)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'Just now'
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute)
    return `${mins} minute${mins === 1 ? '' : 's'} ago`
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  if (diffMs < 7 * day) {
    const days = Math.floor(diffMs / day)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${datePart} at ${timePart}`
}

// ดึงแจ้งเตือนของคนที่ login อยู่
export async function fetchNotifications() {
  const { data } = await apiClient.get('/notifications')
  return data
}

// จำนวนที่ยังไม่อ่าน — ใช้โชว์จุดแดง
export async function fetchUnreadNotificationCount() {
  try {
    const { data } = await apiClient.get('/notifications/unread-count')
    return data.count ?? 0
  } catch (error) {
    console.error('Failed to fetch unread notification count:', error)
    return 0
  }
}

// ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
export async function markNotificationsAsRead() {
  try {
    await apiClient.patch('/notifications/read')
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to mark notifications as read'))
  }
}
