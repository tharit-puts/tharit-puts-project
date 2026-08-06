// หน้า Article management — ใช้ทั้ง admin (/admin/articles) และ user (/my-articles)
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/Loading'
import { DeleteArticleModal } from '@/components/admin/DeleteArticleModal'
import { deletePost, fetchAllPosts, fetchMyPosts } from '@/services/postsApi'
import { getStatusLabel } from '@/services/adminPosts'
import searchIcon from '@/assets/Search_light.png'

const statusOptions = [
  { value: 'all', label: 'Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

function StatusBadge({ status }) {
  const isPublished = status === 'published'

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium ${
        isPublished ? 'text-[#22C55E]' : 'text-[#75716B]'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isPublished ? 'bg-[#22C55E]' : 'bg-[#75716B]'
        }`}
      />
      {getStatusLabel(status)}
    </span>
  )
}

export function ArticleManagementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // /my-articles = ดูเฉพาะของตัวเอง /admin/articles = admin ดูทั้งหมด
  const isMyArticles = location.pathname.startsWith('/my-articles')
  const basePath = isMyArticles ? '/my-articles' : '/admin/articles'
  const pageTitle = isMyArticles ? 'My articles' : 'Article management'

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)

      try {
        const data = isMyArticles ? await fetchMyPosts() : await fetchAllPosts()
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        toast.error('Failed to load articles', {
          description: error.message,
        })
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [isMyArticles])

  async function handleDeleteConfirm() {
    if (!deleteTarget) return

    setIsDeleting(true)

    try {
      await deletePost(deleteTarget.id)
      setPosts((current) => current.filter((post) => post.id !== deleteTarget.id))
      toast.success('Article deleted')
      setDeleteTarget(null)
    } catch (error) {
      console.error('Failed to delete article:', error)
      toast.error('Failed to delete article', {
        description: error.message || 'Please try again later.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const categories = useMemo(() => {
    const unique = [...new Set(posts.map((post) => post.category).filter(Boolean))]
    return unique.sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // status มาจากคอลัมน์ status ในตาราง posts แล้ว ไม่ต้องอ่านจาก localStorage
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      const matchesCategory =
        categoryFilter === 'all' || post.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [posts, searchQuery, statusFilter, categoryFilter])

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8 md:h-screen md:min-h-0 md:px-8 md:py-10">
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
          <Button
            type="button"
            onClick={() => navigate(`${basePath}/new`)}
            className="h-11 w-full rounded-full px-5 text-sm font-medium sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create article
          </Button>
        </div>

        <div className="mt-6 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
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

          <div className="relative w-full lg:w-44">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-[#DAD6D1] bg-white py-3 pr-10 pl-4 text-sm text-[#43403B] outline-none focus:border-[#75716B]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#75716B]" />
          </div>

          <div className="relative w-full lg:w-44">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-[#DAD6D1] bg-white py-3 pr-10 pl-4 text-sm text-[#43403B] outline-none focus:border-[#75716B]"
            >
              <option value="all">Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#75716B]" />
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3 md:hidden">
          {isLoading ? (
            <div className="py-16">
              <Loading />
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-[#EFEEEB] bg-white px-4 py-4"
              >
                <p className="text-sm font-medium wrap-break-word text-foreground">
                  {post.title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-sm text-[#43403B]">{post.category}</p>
                  <StatusBadge status={post.status} />
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-[#EFEEEB] pt-3">
                  <button
                    type="button"
                    aria-label={`Edit ${post.title}`}
                    onClick={() => navigate(`${basePath}/${post.id}/edit`)}
                    className="inline-flex items-center gap-2 text-sm text-[#75716B] transition-colors hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${post.title}`}
                    onClick={() => setDeleteTarget(post)}
                    className="inline-flex items-center gap-2 text-sm text-[#75716B] transition-colors hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-16 text-center text-sm text-[#75716B]">
              No articles found.
            </p>
          )}
        </div>

        {/* Desktop: table */}
        <div className="mt-6 hidden min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#EFEEEB] md:flex">
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_140px_140px_88px] gap-4 border-b border-[#EFEEEB] bg-[#F9F8F6] px-6 py-4 text-sm font-medium text-[#75716B]">
            <span>Article title</span>
            <span>Category</span>
            <span>Status</span>
            <span className="sr-only">Actions</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="px-6 py-16">
                <Loading />
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`grid grid-cols-[minmax(0,1fr)_140px_140px_88px] items-center gap-4 px-6 py-4 ${
                    index % 2 === 1 ? 'bg-[#FCFBFA]' : 'bg-white'
                  }`}
                >
                  <p className="truncate text-sm font-medium text-foreground">
                    {post.title}
                  </p>
                  <p className="text-sm text-[#43403B]">{post.category}</p>
                  <StatusBadge status={post.status} />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Edit ${post.title}`}
                      onClick={() => navigate(`${basePath}/${post.id}/edit`)}
                      className="text-[#75716B] transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${post.title}`}
                      onClick={() => setDeleteTarget(post)}
                      className="text-[#75716B] transition-colors hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 py-16 text-center text-sm text-[#75716B]">
                No articles found.
              </p>
            )}
          </div>
        </div>
      </div>

      <DeleteArticleModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
      />
    </>
  )
}
