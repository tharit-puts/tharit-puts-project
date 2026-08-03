// หน้า Edit article — แก้ไข/ลบบทความใน admin panel
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/Loading'
import { ArticleFormFields, INTRO_MAX_LENGTH } from '@/components/admin/ArticleFormFields'
import { DeleteArticleModal } from '@/components/admin/DeleteArticleModal'
import { deletePost, fetchPostById, updatePost } from '@/services/postsApi'
import { getCategoryNames } from '@/services/adminCategories'

export function EditArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [categoryOptions, setCategoryOptions] = useState([])
  const [thumbnail, setThumbnail] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true)

      try {
        // โหลดบทความและรายชื่อหมวดหมู่พร้อมกัน เร็วกว่าโหลดต่อกันทีละอย่าง
        const [post, names] = await Promise.all([
          fetchPostById(id),
          getCategoryNames(),
        ])
        setCategoryOptions(names)
        setThumbnail(post.image ?? '')
        setCategory(post.category ?? '')
        // ผู้เขียนเดิมของบทความ ไม่ใช่ชื่อ admin ที่กำลังแก้ ไม่งั้นแก้บทความคนอื่นแล้วชื่อจะเปลี่ยน
        setAuthor(post.author ?? '')
        setTitle(post.title ?? '')
        setIntroduction(post.description ?? '')
        setContent(post.content ?? '')
      } catch (error) {
        console.error('Failed to fetch article:', error)
        toast.error('Failed to load article', { description: error.message })
        navigate('/admin/articles')
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id, navigate])

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

  function validateForm() {
    if (!category) {
      toast.error('Please select a category')
      return false
    }

    if (!title.trim()) {
      toast.error('Please enter an article title')
      return false
    }

    if (!introduction.trim()) {
      toast.error('Please enter an introduction')
      return false
    }

    if (!content.trim()) {
      toast.error('Please enter article content')
      return false
    }

    return true
  }

  async function handleSave(status) {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await updatePost(id, {
        title: title.trim(),
        description: introduction.trim(),
        content: content.trim(),
        category,
        author,
        image: thumbnail,
        status,
      })

      toast.success(status === 'draft' ? 'Saved as draft' : 'Article saved', {
        description:
          status === 'draft'
            ? 'Your changes have been saved as a draft.'
            : 'Your article has been updated.',
      })
      navigate('/admin/articles')
    } catch (error) {
      console.error('Failed to update article:', error)
      toast.error('Failed to save article', {
        description: error.message || 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true)

    try {
      await deletePost(id)
      toast.success('Article deleted')
      navigate('/admin/articles')
    } catch (error) {
      console.error('Failed to delete article:', error)
      toast.error('Failed to delete article', {
        description: error.message || 'Please try again later.',
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-8 py-10">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className="px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">Edit article</h1>
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
              {isSubmitting ? 'Saving...' : 'Save'}
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
              author={author}
              title={title}
              onTitleChange={(event) => setTitle(event.target.value)}
              introduction={introduction}
              onIntroductionChange={(event) =>
                setIntroduction(event.target.value.slice(0, INTRO_MAX_LENGTH))
              }
              content={content}
              onContentChange={(event) => setContent(event.target.value)}
            />

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-[#75716B] transition-colors hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Delete article
            </button>
          </form>
        </div>
      </div>

      <DeleteArticleModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
      />
    </>
  )
}
