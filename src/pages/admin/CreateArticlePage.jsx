// หน้า Create article — ฟอร์มสร้างบทความใหม่ใน admin panel
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArticleFormFields, INTRO_MAX_LENGTH } from '@/components/admin/ArticleFormFields'
import { createPost } from '@/services/postsApi'
import { getCategoryNames } from '@/services/adminCategories'
import { useAuth } from '@/contexts/AuthContext'

export function CreateArticlePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  // ชื่อผู้เขียนมาจากบัญชี admin ที่ login อยู่
  const authorName = user?.name ?? ''

  const [categoryOptions, setCategoryOptions] = useState([])
  const [thumbnail, setThumbnail] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // โหลดรายชื่อหมวดหมู่จาก backend มาใส่ dropdown
  useEffect(() => {
    getCategoryNames()
      .then(setCategoryOptions)
      .catch((error) => {
        console.error('Failed to load categories:', error)
        toast.error('Failed to load categories')
      })
  }, [])

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnail(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSave(status) {
    if (!category) {
      toast.error('Please select a category')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter an article title')
      return
    }

    if (!introduction.trim()) {
      toast.error('Please enter an introduction')
      return
    }

    if (!content.trim()) {
      toast.error('Please enter article content')
      return
    }

    setIsSubmitting(true)

    try {
      await createPost({
        title: title.trim(),
        description: introduction.trim(),
        content: content.trim(),
        category,
        author: authorName,
        image: thumbnail || undefined,
        status,
      })

      toast.success(status === 'draft' ? 'Saved as draft' : 'Article published', {
        description:
          status === 'draft'
            ? 'Your article has been saved as a draft.'
            : 'Your article is now live.',
      })
      navigate('/admin/articles')
    } catch (error) {
      console.error('Failed to create article:', error)
      // แสดงข้อความจริงจาก backend เช่น เตือนว่า content ไม่มีหัวข้อ "## 1. "
      toast.error('Failed to save article', {
        description: error.message || 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Create article</h1>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleSave('draft')}
            className="h-11 rounded-full border-[#75716B] px-5 text-sm font-medium"
          >
            Save as draft
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave('published')}
            className="h-11 rounded-full px-5 text-sm font-medium"
          >
            {isSubmitting ? 'Saving...' : 'Save and publish'}
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-[#EFEEEB] px-6 py-8 md:px-10 md:py-10">
        <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
          <ArticleFormFields
            fileInputRef={fileInputRef}
            thumbnail={thumbnail}
            onUploadClick={handleUploadClick}
            onFileChange={handleFileChange}
            category={category}
            onCategoryChange={(event) => setCategory(event.target.value)}
            categoryOptions={categoryOptions}
            author={authorName}
            title={title}
            onTitleChange={(event) => setTitle(event.target.value)}
            introduction={introduction}
            onIntroductionChange={(event) =>
              setIntroduction(event.target.value.slice(0, INTRO_MAX_LENGTH))
            }
            content={content}
            onContentChange={(event) => setContent(event.target.value)}
          />
        </form>
      </div>
    </div>
  )
}
