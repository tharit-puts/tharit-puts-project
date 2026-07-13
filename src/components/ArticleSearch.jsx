import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import searchIcon from '@/assets/Search_light.png'

const searchInputClassName =
  'w-full rounded-full border border-[#DAD6D1] bg-[#FFFFFF] py-2.5 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B] md:py-3 md:text-base'

export function ArticleSearch({
  searchQuery,
  onSearchChange,
  onSearchClear,
  results,
  isLoading,
  hasKeyword,
}) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const showDropdown =
    isOpen &&
    searchQuery.trim().length > 0 &&
    hasKeyword &&
    !isLoading &&
    results.length > 0

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(value) {
    onSearchChange(value)
    setIsOpen(true)
  }

  function handleResultClick(id) {
    setIsOpen(false)
    onSearchClear()
    navigate(`/post/${id}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => {
          if (searchQuery.trim()) {
            setIsOpen(true)
          }
        }}
        className={searchInputClassName}
      />
      <img
        src={searchIcon}
        alt=""
        className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
      />

      {showDropdown && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#DAD6D1] bg-white shadow-[0_8px_24px_rgba(38,35,30,0.12)]">
          <ul>
            {results.map((post) => (
              <li key={post.id}>
                <button
                  type="button"
                  onClick={() => handleResultClick(post.id)}
                  className="w-full px-4 py-3 text-left text-sm leading-snug text-[#43403B] transition-colors hover:bg-[#EFEEEB] md:text-base"
                >
                  {post.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
