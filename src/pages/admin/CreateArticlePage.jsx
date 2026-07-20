// หน้า Create article — ฟอร์มสร้างบทความใหม่ใน admin panel
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createPost } from '@/services/postsApi'
import { setPostStatus } from '@/services/adminPosts'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

const categoryOptions = ['Cat', 'Inspiration', 'General']
const DEFAULT_AUTHOR = 'Thompson P.'
const INTRO_MAX_LENGTH = 120

export function CreateArticlePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [thumbnail, setThumbnail] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      const post = await createPost({
        title: title.trim(),
        description: introduction.trim(),
        content: content.trim(),
        category,
        author: DEFAULT_AUTHOR,
        image: thumbnail || undefined,
      })

      setPostStatus(post.id, status)

      toast.success(status === 'draft' ? 'Saved as draft' : 'Article published', {
        description:
          status === 'draft'
            ? 'Your article has been saved as a draft.'
            : 'Your article is now live.',
      })
      navigate('/admin/articles')
    } catch (error) {
      console.error('Failed to create article:', error)
      toast.error('Failed to save article', {
        description: 'Please try again later.',
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
          <div>
            <p className="text-sm font-medium text-foreground">Thumbnail image</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-40 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#DAD6D1] bg-[#F9F8F6]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Article thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-[#DAD6D1]" strokeWidth={1.5} />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  className="rounded-full border-[#75716B] px-6 py-5 text-sm font-medium"
                >
                  Upload thumbnail image
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <div className="relative mt-2">
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`${inputClassName} appearance-none pr-10 text-[#43403B]`}
              >
                <option value="">Select category</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#75716B]" />
            </div>
          </div>

          <div>
            <label htmlFor="author" className="text-sm font-medium text-foreground">
              Author name
            </label>
            <input
              id="author"
              type="text"
              value={DEFAULT_AUTHOR}
              readOnly
              className={`mt-2 ${inputClassName} bg-[#F9F8F6] text-[#75716B]`}
            />
          </div>

          <div>
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Article title"
              className={`mt-2 ${inputClassName}`}
            />
          </div>

          <div>
            <label htmlFor="introduction" className="text-sm font-medium text-foreground">
              Introduction (max 120 letters)
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(event) => setIntroduction(event.target.value.slice(0, INTRO_MAX_LENGTH))}
              placeholder="Introduction"
              rows={4}
              maxLength={INTRO_MAX_LENGTH}
              className={`mt-2 ${inputClassName} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-[#75716B]">
              {introduction.length}/{INTRO_MAX_LENGTH}
            </p>
          </div>

          <div>
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Content"
              rows={12}
              className={`mt-2 ${inputClassName} resize-y`}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
