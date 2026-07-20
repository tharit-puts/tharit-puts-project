// หน้า Create category — ฟอร์มสร้างหมวดหมู่ใหม่
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createCategory } from '@/services/adminCategories'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

export function CreateCategoryPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSave() {
    if (!name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsSubmitting(true)

    try {
      createCategory(name)
      toast.success('Category created')
      navigate('/admin/categories')
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error(error.message || 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Create category</h1>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSave}
          className="h-11 rounded-full px-6 text-sm font-medium"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <form
        className="mt-8 max-w-xl"
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
      >
        <label htmlFor="category-name" className="text-sm font-medium text-foreground">
          Category name
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name"
          className={`mt-2 ${inputClassName}`}
          autoFocus
        />
      </form>
    </div>
  )
}
