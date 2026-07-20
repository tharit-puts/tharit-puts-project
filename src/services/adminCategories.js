// จัดการหมวดหมู่ใน admin — เก็บใน localStorage เพราะ API ภายนอกไม่รองรับการเขียนหมวดหมู่
const CATEGORIES_STORAGE_KEY = 'hh_admin_categories'
const DEFAULT_CATEGORIES = ['Cat', 'General', 'Inspiration']

function readCategories() {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeCategories(categories) {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
}

function makeCategory(name) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
  }
}

// ดึงหมวดหมู่ทั้งหมด — สร้างค่าเริ่มต้นถ้ายังไม่มีใน storage
export function getCategories() {
  const stored = readCategories()
  if (stored) return stored

  const seeded = DEFAULT_CATEGORIES.map((name) => makeCategory(name))
  writeCategories(seeded)
  return seeded
}

export function getCategoryById(id) {
  return getCategories().find((category) => category.id === id) ?? null
}

function isDuplicateName(name, excludeId) {
  const normalized = name.trim().toLowerCase()
  return getCategories().some(
    (category) =>
      category.id !== excludeId && category.name.toLowerCase() === normalized,
  )
}

// สร้างหมวดหมู่ใหม่
export function createCategory(name) {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Category name is required')
  }
  if (isDuplicateName(trimmed)) {
    throw new Error('This category already exists')
  }

  const categories = getCategories()
  const newCategory = makeCategory(trimmed)
  writeCategories([...categories, newCategory])
  return newCategory
}

// แก้ไขชื่อหมวดหมู่
export function updateCategory(id, name) {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Category name is required')
  }
  if (isDuplicateName(trimmed, id)) {
    throw new Error('This category already exists')
  }

  const categories = getCategories().map((category) =>
    category.id === id ? { ...category, name: trimmed } : category,
  )
  writeCategories(categories)
  return categories.find((category) => category.id === id) ?? null
}

// ลบหมวดหมู่
export function deleteCategory(id) {
  const categories = getCategories().filter((category) => category.id !== id)
  writeCategories(categories)
}
