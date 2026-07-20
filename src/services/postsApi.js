// บริการจัดการบทความ — seed ข้อมูลจาก API ครั้งแรก แล้วเก็บ/แก้ไขใน localStorage
// เชื่อมกับ: ArticleSection, BlogDetailPage, Admin (Article management / Create / Edit)
import axios from 'axios'

export const API_BASE_URL = 'https://blog-post-project-api.vercel.app'
export const POSTS_PER_PAGE = 6 // จำนวนบทความต่อหน้า — ArticleSection ใช้ตอน search

export const DEFAULT_POST_IMAGE =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg'

const POSTS_STORAGE_KEY = 'hh_posts_store'

// กันการ seed ซ้ำเมื่อหลาย component เรียกพร้อมกัน
let seedPromise = null

// --- store helpers -----------------------------------------------------------

function readStore() {
  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeStore(posts) {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
}

// ดึงทุกหน้าจาก API มาเก็บลง localStorage (ทำครั้งเดียวตอนยังไม่มีข้อมูล)
async function seedFromApi() {
  let page = 1
  let totalPages = 1
  const allPosts = []

  try {
    while (page <= totalPages) {
      const params = new URLSearchParams({
        page: String(page),
        limit: '30',
      })

      const response = await axios.get(`${API_BASE_URL}/posts?${params}`)
      const data = response.data

      allPosts.push(...data.posts)
      totalPages = data.totalPages
      page += 1
    }
  } catch (error) {
    // offline หรือ API ล่ม — เริ่มด้วย store ว่าง (admin ยังสร้างบทความใหม่ได้)
    console.error('Failed to seed posts from API:', error)
  }

  writeStore(allPosts)
  return allPosts
}

// คืนบทความทั้งหมดจาก store — seed อัตโนมัติถ้ายังไม่มี
async function ensureStore() {
  const existing = readStore()
  if (existing) return existing

  if (!seedPromise) {
    seedPromise = seedFromApi().finally(() => {
      seedPromise = null
    })
  }

  return seedPromise
}

// --- date utility ------------------------------------------------------------

// แปลงวันที่จาก API เป็นรูปแบบอ่านง่าย — BlogCard, BlogDetailPage ใช้
export function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// --- read --------------------------------------------------------------------

// ดึงรายการบทความแบบแบ่งหน้า — ArticleSection เรียกเมื่อเปลี่ยน category/search/page
export async function fetchPosts({ page, category, keyword }) {
  const allPosts = await ensureStore()

  let filtered = allPosts

  if (category && category !== 'Highlight') {
    filtered = filtered.filter((post) => post.category === category)
  }

  const trimmedKeyword = keyword?.trim().toLowerCase()
  if (trimmedKeyword) {
    filtered = filtered.filter((post) => {
      const title = (post.title ?? '').toLowerCase()
      const description = (post.description ?? '').toLowerCase()
      return title.includes(trimmedKeyword) || description.includes(trimmedKeyword)
    })
  }

  const totalPosts = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const posts = filtered.slice(start, start + POSTS_PER_PAGE)

  return { posts, currentPage, totalPages, totalPosts }
}

// ดึงบทความทั้งหมด — Admin Article management ใช้
export async function fetchAllPosts() {
  const allPosts = await ensureStore()
  return [...allPosts]
}

// ดึงบทความเดียวตาม id — BlogDetailPage / Edit article ใช้
export async function fetchPostById(id) {
  const allPosts = await ensureStore()
  const post = allPosts.find((item) => String(item.id) === String(id))

  if (!post) {
    const error = new Error('Post not found')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  return post
}

// --- write -------------------------------------------------------------------

// สร้างบทความใหม่ — Admin Create article ใช้
export async function createPost({ title, description, content, category, author, image }) {
  const allPosts = await ensureStore()

  const newPost = {
    id: Date.now(),
    title,
    description,
    content,
    category,
    author,
    image: image || DEFAULT_POST_IMAGE,
    date: new Date().toISOString(),
    likes: 0,
  }

  writeStore([newPost, ...allPosts])
  return newPost
}

// อัปเดตบทความ — Admin Edit article ใช้
export async function updatePost(id, { title, description, content, category, author, image }) {
  const allPosts = await ensureStore()

  let updatedPost = null
  const nextPosts = allPosts.map((post) => {
    if (String(post.id) !== String(id)) return post

    updatedPost = {
      ...post,
      title,
      description,
      content,
      category,
      author,
      image: image || DEFAULT_POST_IMAGE,
    }
    return updatedPost
  })

  if (!updatedPost) {
    const error = new Error('Post not found')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  writeStore(nextPosts)
  return updatedPost
}

// ลบบทความ — Admin Delete article ใช้
export async function deletePost(id) {
  const allPosts = await ensureStore()
  const nextPosts = allPosts.filter((post) => String(post.id) !== String(id))
  writeStore(nextPosts)
  return { id }
}

// --- content parsing ---------------------------------------------------------

// แปลง content จาก API (markdown) เป็น sections สำหรับ BlogContent
// แบ่งเป็น intro, หัวข้อก่อนรูป, หัวข้อหลังรูป
export function parsePostContent(description, content) {
  const sectionBlocks = (content ?? '')
    .split(/## \d+\.\s/)
    .map((block) => block.trim())
    .filter(Boolean)

  const sections = sectionBlocks.map((block) => {
    const [titleLine, ...paragraphs] = block.split('\n\n')

    return {
      title: titleLine.trim(),
      paragraphs: paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
    }
  })

  const splitIndex = Math.min(3, sections.length)

  return {
    intro: description,
    sectionsBeforeImage: sections.slice(0, splitIndex),
    sectionsAfterImage: sections.slice(splitIndex),
  }
}
