// บริการดึงข้อมูลบทความจาก API ภายนอก
// เชื่อมกับ: ArticleSection, BlogDetailPage, authApi (ใช้ API_BASE_URL ร่วมกัน)
import axios from 'axios'

export const API_BASE_URL = 'https://blog-post-project-api.vercel.app'
export const POSTS_PER_PAGE = 6 // จำนวนบทความต่อหน้า — ArticleSection ใช้ตอน search

// แปลงวันที่จาก API เป็นรูปแบบอ่านง่าย — BlogCard, BlogDetailPage ใช้
export function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ดึงรายการบทความแบบแบ่งหน้า — ArticleSection เรียกเมื่อเปลี่ยน category/search/page
export async function fetchPosts({ page, category, keyword }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(POSTS_PER_PAGE),
  })

  if (category && category !== 'Highlight') {
    params.append('category', category)
  }

  if (keyword?.trim()) {
    params.append('keyword', keyword.trim())
  }

  const response = await axios.get(`${API_BASE_URL}/posts?${params}`)
  return response.data
}

// ดึงบทความทั้งหมด — Admin Article management ใช้
export async function fetchAllPosts() {
  let page = 1
  let totalPages = 1
  const allPosts = []

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

  return allPosts
}

// ดึงบทความเดียวตาม id — BlogDetailPage เรียกจาก URL /post/:id
export async function fetchPostById(id) {
  const response = await axios.get(`${API_BASE_URL}/posts/${id}`)
  return response.data
}

export const DEFAULT_POST_IMAGE =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg'

// สร้างบทความใหม่ — Admin Create article ใช้
export async function createPost({ title, description, content, category, author, image }) {
  const response = await axios.post(`${API_BASE_URL}/posts`, {
    title,
    description,
    content,
    category,
    author,
    image: image || DEFAULT_POST_IMAGE,
  })
  return response.data
}

// อัปเดตบทความ — Admin Edit article ใช้
export async function updatePost(id, { title, description, content, category, author, image }) {
  const response = await axios.put(`${API_BASE_URL}/posts/${id}`, {
    title,
    description,
    content,
    category,
    author,
    image: image || DEFAULT_POST_IMAGE,
  })
  return response.data
}

// ลบบทความ — Admin Delete article ใช้
export async function deletePost(id) {
  const response = await axios.delete(`${API_BASE_URL}/posts/${id}`)
  return response.data
}

// แปลง content จาก API (markdown) เป็น sections สำหรับ BlogContent
// แบ่งเป็น intro, หัวข้อก่อนรูป, หัวข้อหลังรูป
export function parsePostContent(description, content) {
  const sectionBlocks = content
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
