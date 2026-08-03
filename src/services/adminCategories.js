// จัดการหมวดหมู่ — คุยกับ backend ที่ /categories
// ทุกฟังก์ชันเป็น async แล้ว (เมื่อก่อนอ่านจาก localStorage จึงทำแบบ sync ได้)
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'

// ดึงหมวดหมู่ทั้งหมด — คืน [{ id, name }]
export async function getCategories() {
  const { data } = await apiClient.get('/categories')
  return data
}

// ดึงหมวดหมู่เดียว — คืน null ถ้าไม่มี เพื่อให้หน้า Edit จัดการต่อได้ง่าย
export async function getCategoryById(id) {
  try {
    const { data } = await apiClient.get(`/categories/${id}`)
    return data
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

// ดึงเฉพาะชื่อหมวดหมู่ — dropdown ในฟอร์มบทความใช้ (ส่งชื่อไปให้ backend ไม่ใช่ id)
export async function getCategoryNames() {
  const categories = await getCategories()
  return categories.map((category) => category.name)
}

// สร้างหมวดหมู่ใหม่ (ต้องเป็น admin)
export async function createCategory(name) {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Category name is required')
  }

  try {
    const { data } = await apiClient.post('/categories', { name: trimmed })
    return data
  } catch (error) {
    // backend ตอบ 409 เมื่อชื่อซ้ำ (ตาราง categories ตั้ง UNIQUE ไว้)
    if (error.response?.status === 409) {
      throw new Error('This category already exists')
    }
    throw new Error(getApiErrorMessage(error, 'Failed to create category'))
  }
}

// แก้ไขชื่อหมวดหมู่ (ต้องเป็น admin)
export async function updateCategory(id, name) {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Category name is required')
  }

  try {
    const { data } = await apiClient.put(`/categories/${id}`, { name: trimmed })
    return data
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('This category already exists')
    }
    if (error.response?.status === 404) {
      throw new Error('Category not found')
    }
    throw new Error(getApiErrorMessage(error, 'Failed to save category'))
  }
}

// ลบหมวดหมู่ (ต้องเป็น admin)
export async function deleteCategory(id) {
  try {
    await apiClient.delete(`/categories/${id}`)
  } catch (error) {
    // 409 = ยังมีบทความใช้หมวดหมู่นี้อยู่ foreign key จึงไม่ให้ลบ
    if (error.response?.status === 409) {
      throw new Error(
        'This category still has articles. Move or delete them first.',
      )
    }
    throw new Error(getApiErrorMessage(error, 'Failed to delete category'))
  }
}
