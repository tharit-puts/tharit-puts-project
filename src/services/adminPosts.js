// สถานะบทความใน admin — API ไม่มี status จึง default เป็น published
const STATUS_STORAGE_KEY = 'hh_admin_post_status'

export function getPostStatus(postId) {
  try {
    const map = JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) ?? '{}')
    return map[postId] ?? 'published'
  } catch {
    return 'published'
  }
}

export function getStatusLabel(status) {
  return status === 'draft' ? 'Draft' : 'Published'
}

export function setPostStatus(postId, status) {
  try {
    const map = JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) ?? '{}')
    map[postId] = status
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map))
  } catch (error) {
    console.error('Failed to save post status:', error)
  }
}
