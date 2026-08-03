// หน้า Edit category — แก้ไข/ลบหมวดหมู่ที่เลือก
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DeleteCategoryModal } from '@/components/admin/DeleteCategoryModal'
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/services/adminCategories'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

export function EditCategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isActive = true

    getCategoryById(id)
      .then((category) => {
        if (!isActive) return
        if (!category) {
          toast.error('Category not found')
          navigate('/admin/categories')
          return
        }
        setName(category.name)
      })
      .catch((error) => {
        console.error('Failed to load category:', error)
        if (!isActive) return
        toast.error('Failed to load category')
        navigate('/admin/categories')
      })

    return () => {
      isActive = false
    }
  }, [id, navigate])

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsSubmitting(true)

    try {
      await updateCategory(id, name)
      toast.success('Category saved')
      navigate('/admin/categories')
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error(error.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true)

    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      navigate('/admin/categories')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category', { description: error.message })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      <div className="px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">Edit category</h1>
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

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="mt-6 flex items-center gap-2 text-sm font-medium text-[#75716B] transition-colors hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Delete category
          </button>
        </form>
      </div>

      <DeleteCategoryModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
      />
    </>
  )
}
