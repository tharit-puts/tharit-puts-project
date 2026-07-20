// หน้า Category management — แสดง/ค้นหา/สร้าง/แก้ไข/ลบหมวดหมู่
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DeleteCategoryModal } from '@/components/admin/DeleteCategoryModal'
import { deleteCategory, getCategories } from '@/services/adminCategories'
import searchIcon from '@/assets/Search_light.png'

export function CategoryManagementPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(() => getCategories())
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredCategories = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) return categories
    return categories.filter((category) =>
      category.name.toLowerCase().includes(keyword),
    )
  }, [categories, searchQuery])

  function handleDeleteConfirm() {
    if (!deleteTarget) return

    setIsDeleting(true)

    try {
      deleteCategory(deleteTarget.id)
      setCategories(getCategories())
      toast.success('Category deleted')
      setDeleteTarget(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">Category management</h1>
          <Button
            type="button"
            onClick={() => navigate('/admin/categories/new')}
            className="h-11 rounded-full px-5 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Create category
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-[#DAD6D1] bg-white py-3 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]"
            />
            <img
              src={searchIcon}
              alt=""
              className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#EFEEEB]">
          <div className="border-b border-[#EFEEEB] bg-[#F9F8F6] px-6 py-4 text-sm font-medium text-[#75716B]">
            Category
          </div>

          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className={`flex items-center justify-between gap-4 px-6 py-4 ${
                  index % 2 === 1 ? 'bg-[#FCFBFA]' : 'bg-white'
                }`}
              >
                <p className="text-sm font-medium text-foreground">{category.name}</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                    className="text-[#75716B] transition-colors hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${category.name}`}
                    onClick={() => setDeleteTarget(category)}
                    className="text-[#75716B] transition-colors hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-6 py-16 text-center text-sm text-[#75716B]">
              No categories found.
            </p>
          )}
        </div>
      </div>

      <DeleteCategoryModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
      />
    </>
  )
}
