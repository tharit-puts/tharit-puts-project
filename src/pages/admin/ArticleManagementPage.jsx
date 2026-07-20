// หน้า Article management — แสดง/ค้นหา/กรองบทความจาก API
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/Loading'
import { fetchAllPosts } from '@/services/postsApi'
import { getPostStatus, getStatusLabel } from '@/services/adminPosts'
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
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)

      try {
        const data = await fetchAllPosts()
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch admin posts:', error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const categories = useMemo(() => {
    const unique = [...new Set(posts.map((post) => post.category).filter(Boolean))]
    return unique.sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const status = getPostStatus(post.id)
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesCategory =
        categoryFilter === 'all' || post.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [posts, searchQuery, statusFilter, categoryFilter])

  return (
    <div className="px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Article management</h1>
        <Button
          type="button"
          onClick={() => navigate('/admin/articles/new')}
          className="h-11 rounded-full px-5 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Create article
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#EFEEEB]">
        <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_88px] gap-4 border-b border-[#EFEEEB] bg-[#F9F8F6] px-6 py-4 text-sm font-medium text-[#75716B]">
          <span>Article title</span>
          <span>Category</span>
          <span>Status</span>
          <span className="sr-only">Actions</span>
        </div>

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
              <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
              <p className="text-sm text-[#43403B]">{post.category}</p>
              <StatusBadge status={getPostStatus(post.id)} />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Edit ${post.title}`}
                  className="text-[#75716B] transition-colors hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${post.title}`}
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
  )
}
