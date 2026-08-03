// บริการจัดการบทความ — คุยกับ backend ของเราเอง (Express + PostgreSQL) โดยตรง
// เชื่อมกับ: ArticleSection, BlogDetailPage, Admin (Article management / Create / Edit)
import { apiClient, API_BASE_URL, getApiErrorMessage } from '@/lib/apiClient'

export { API_BASE_URL }

export const POSTS_PER_PAGE = 6 // จำนวนบทความต่อหน้า — ต้องตรงกับที่ backend ใช้เป็นค่า default

export const DEFAULT_POST_IMAGE =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg'

// --- date utility ------------------------------------------------------------

// แปลงวันที่ ISO จาก backend เป็นรูปแบบอ่านง่าย — BlogCard, BlogDetailPage ใช้
export function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// --- read --------------------------------------------------------------------

// ดึงรายการบทความแบบแบ่งหน้า — ArticleSection เรียกเมื่อเปลี่ยน category/search/page
// การกรองและแบ่งหน้าทำที่ backend ทั้งหมด (เมื่อก่อนโหลดมาทั้งก้อนแล้วกรองในเบราว์เซอร์)
export async function fetchPosts({ page = 1, category, keyword } = {}) {
  const params = { page, limit: POSTS_PER_PAGE }

  // 'Highlight' หมายถึงดูทั้งหมด backend เข้าใจค่านี้อยู่แล้ว แต่ไม่ส่งไปเลยก็ได้
  if (category && category !== 'Highlight') {
    params.category = category
  }

  const trimmedKeyword = keyword?.trim()
  if (trimmedKeyword) {
    params.keyword = trimmedKeyword
  }

  const { data } = await apiClient.get('/posts', { params })

  return {
    posts: data.posts,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    totalPosts: data.totalPosts,
  }
}

// ดึงบทความทั้งหมดรวม draft — หน้า Article management ของ admin ใช้
// ต้องส่ง status=all ซึ่ง backend จะยอมให้เฉพาะ token ที่เป็น admin
export async function fetchAllPosts() {
  const posts = []
  let page = 1
  let totalPages = 1

  // ไล่เก็บทุกหน้าเพราะ backend จำกัด limit ไว้ที่ 100 ต่อครั้ง
  do {
    const { data } = await apiClient.get('/posts', {
      params: { page, limit: 100, status: 'all' },
    })
    posts.push(...data.posts)
    totalPages = data.totalPages
    page += 1
  } while (page <= totalPages)

  return posts
}

// ดึงบทความเดียวตาม id — BlogDetailPage / Edit article ใช้
export async function fetchPostById(id) {
  try {
    const { data } = await apiClient.get(`/posts/${id}`)
    return data
  } catch (error) {
    if (error.response?.status === 404) {
      const notFound = new Error('Post not found')
      notFound.code = 'POST_NOT_FOUND'
      throw notFound
    }
    throw error
  }
}

// --- write (ต้อง login เป็น admin — token แนบให้อัตโนมัติโดย apiClient) -------

// สร้างบทความใหม่ — Admin Create article ใช้
export async function createPost({
  title,
  description,
  content,
  category,
  author,
  image,
  status = 'draft',
}) {
  try {
    const { data } = await apiClient.post('/posts', {
      title,
      description,
      content,
      category,
      author,
      image: image || DEFAULT_POST_IMAGE,
      status,
    })
    return data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to create article'))
  }
}

// อัปเดตบทความ — Admin Edit article ใช้
export async function updatePost(
  id,
  { title, description, content, category, author, image, status },
) {
  try {
    const { data } = await apiClient.put(`/posts/${id}`, {
      title,
      description,
      content,
      category,
      author,
      image: image || DEFAULT_POST_IMAGE,
      ...(status ? { status } : {}),
    })
    return data
  } catch (error) {
    if (error.response?.status === 404) {
      const notFound = new Error('Post not found')
      notFound.code = 'POST_NOT_FOUND'
      throw notFound
    }
    throw new Error(getApiErrorMessage(error, 'Failed to save article'))
  }
}

// ลบบทความ — Admin Delete article ใช้
export async function deletePost(id) {
  try {
    await apiClient.delete(`/posts/${id}`)
    return { id }
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to delete article'))
  }
}

// --- content parsing ---------------------------------------------------------

// แปลง content (markdown) เป็น sections สำหรับ BlogContent
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
