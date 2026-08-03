// บริการคอมเมนต์ใต้บทความ — คุยกับ backend ที่ /posts/:postId/comments
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'

// แปลงวันที่ ISO จาก backend เป็นรูปแบบที่ UI แสดง เช่น "15 September 2024 at 19:12"
export function formatCommentDate(dateString) {
  const date = new Date(dateString)
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

// ดึงคอมเมนต์ทั้งหมดของบทความ — เรียงใหม่สุดก่อน
export async function fetchComments(postId) {
  const { data } = await apiClient.get(`/posts/${postId}/comments`)
  return data
}

// เขียนคอมเมนต์ใหม่ (ต้อง login — token แนบให้อัตโนมัติโดย apiClient)
export async function createComment(postId, content) {
  try {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, {
      content,
    })
    return data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to post comment'))
  }
}
