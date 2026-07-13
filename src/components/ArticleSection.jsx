import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import searchIcon from '@/assets/Search_light.png'
import { BlogCat } from '@/components/BlogCat'
import { Loading } from '@/components/Loading'
import { fetchPosts } from '@/services/postsApi'

// รายชื่อหมวดหมู่ที่ให้ผู้ใช้เลือกกรอง
const categories = ['Highlight', 'Cat', 'Inspiration', 'General']

// class สำหรับช่องค้นหา ใช้ร่วมกันทั้งมือถือและ desktop
const searchInputClassName =
  'w-full rounded-full border border-[#DAD6D1] bg-[#FFFFFF] py-2.5 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B] md:py-3 md:text-base'

const SEARCH_DEBOUNCE_MS = 500

export function ArticleSection() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('Highlight')
  const [searchQuery, setSearchQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)

      try {
        const data = await fetchPosts({ page, category, keyword })

        setPosts((prev) =>
          page === 1 ? data.posts : [...prev, ...data.posts],
        )

        setHasMore(data.currentPage < data.totalPages)
      } catch (error) {
        console.error('Failed to fetch posts:', error)

        if (page === 1) {
          setPosts([])
        }

        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [page, category, keyword])

  function handleViewMore() {
    setPage((prev) => prev + 1)
  }

  function handleCategoryChange(newCategory) {
    if (newCategory === category) return

    setCategory(newCategory)
    setPage(1)
    setPosts([])
  }

  function handleTagClick(tag) {
    setSearchQuery('')
    setKeyword('')
    handleCategoryChange(tag)
  }

  function handleSearchChange(value) {
    setSearchQuery(value)
    setPage(1)
    setPosts([])
  }

  const isViewMoreLoading = isLoading && page > 1

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Latest articles
        </h2>

        {/* แถบ filter + search */}
        <div className="mt-6 rounded-2xl bg-[#EFEEEB] p-4 md:p-3">
          {/* เวอร์ชันมือถือ: ช่องค้นหาอยู่บน dropdown หมวด */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                className={searchInputClassName}
              />
              <img
                src={searchIcon}
                alt=""
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="category-select"
                className="text-sm font-medium text-[#75716B]"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category-select"
                  value={category}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  disabled={isLoading && page === 1}
                  className="w-full appearance-none rounded-full border border-[#DAD6D1] bg-[#FFFFFF] py-2.5 pr-10 pl-4 text-sm font-medium text-[#43403B] outline-none focus:border-[#75716B] disabled:opacity-60"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#75716B]"
                />
              </div>
            </div>
          </div>

          {/* เวอร์ชัน desktop: ปุ่มหมวดอยู่ซ้าย ช่องค้นหาอยู่ขวา */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
            <div className="flex flex-wrap items-center gap-1">
              {categories.map((item) => {
                const isSelected = category === item

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCategoryChange(item)}
                    disabled={isLoading && page === 1}
                    className={`rounded-full px-5 py-2.5 text-base font-medium transition-colors disabled:opacity-60 ${
                      isSelected
                        ? 'bg-[#DAD6D1] text-[#43403B]'
                        : 'text-[#75716B] hover:text-[#43403B]'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>

            <div className="relative w-full max-w-xs shrink-0">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                className={searchInputClassName}
              />
              <img
                src={searchIcon}
                alt=""
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        {isLoading && page === 1 ? (
          <Loading className="py-24" />
        ) : (
          <BlogCat
            posts={posts}
            hasMore={hasMore}
            isViewMoreLoading={isViewMoreLoading}
            onViewMore={handleViewMore}
            onTagClick={handleTagClick}
          />
        )}
      </div>
    </section>
  )
}
