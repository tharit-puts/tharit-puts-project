// ส่วนรายการบทความบนหน้าแรก — filter, search, pagination
// เชื่อมกับ: HomePage → ArticleSearch, BlogCat, postsApi
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ArticleSearch } from '@/components/ArticleSearch'
import { BlogCat } from '@/components/BlogCat'
import { Loading } from '@/components/Loading'
import { fetchPosts, POSTS_PER_PAGE } from '@/services/postsApi'
import { getCategoryNames } from '@/services/adminCategories'

// 'Highlight' ไม่ใช่หมวดหมู่จริงในฐานข้อมูล เป็นแท็บ "ดูทั้งหมด"
const ALL_CATEGORIES_TAB = 'Highlight'

const SEARCH_DEBOUNCE_MS = 500

export function ArticleSection() {
  // โหลดหมวดหมู่จาก backend เพื่อให้หมวดที่ admin เพิ่มใหม่โผล่มาที่หน้าแรกด้วย
  const [categories, setCategories] = useState([ALL_CATEGORIES_TAB])
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState(ALL_CATEGORIES_TAB)
  const [searchQuery, setSearchQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    getCategoryNames()
      .then((names) => setCategories([ALL_CATEGORIES_TAB, ...names]))
      .catch((error) => {
        // ถ้าโหลดไม่ได้ก็ยังเหลือแท็บ Highlight ให้ดูบทความทั้งหมดได้
        console.error('Failed to load categories:', error)
      })
  }, [])

  // debounce การค้นหา 500ms — ลดจำนวน request ไป API
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // โหลดบทความเมื่อ page, category หรือ keyword เปลี่ยน
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

  function handleSearchClear() {
    setSearchQuery('')
    setKeyword('')
    setPage(1)
    setPosts([])
  }

  const isViewMoreLoading = isLoading && page > 1
  const searchResults = keyword.trim() ? posts.slice(0, POSTS_PER_PAGE) : []

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
            <ArticleSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchClear={handleSearchClear}
              results={searchResults}
              isLoading={isLoading && page === 1}
              hasKeyword={Boolean(keyword.trim())}
            />

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

            <div className="w-full max-w-xs shrink-0">
              <ArticleSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchClear={handleSearchClear}
                results={searchResults}
                isLoading={isLoading && page === 1}
                hasKeyword={Boolean(keyword.trim())}
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
