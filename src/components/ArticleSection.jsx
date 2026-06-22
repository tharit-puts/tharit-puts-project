import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import searchIcon from '@/assets/Search_light.png'

const categories = ['Highlight', 'Cat', 'Inspiration', 'Ganeral']

const searchInputClassName =
  'w-full rounded-full border border-[#DAD6D1] bg-[#FFFFFF] py-2.5 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B] md:py-3 md:text-base'

export function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState('Highlight')

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Latest articles
        </h2>

        <div className="mt-6 rounded-2xl bg-[#EFEEEB] p-4 md:p-3">
          <div className="flex flex-col gap-4 md:hidden">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
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
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full appearance-none rounded-full border border-[#DAD6D1] bg-[#FFFFFF] py-2.5 pr-10 pl-4 text-sm font-medium text-[#43403B] outline-none focus:border-[#75716B]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
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

          <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
            <div className="flex flex-wrap items-center gap-1">
              {categories.map((category) => {
                const isSelected = selectedCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-2.5 text-base font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#DAD6D1] text-[#43403B]'
                        : 'text-[#75716B] hover:text-[#43403B]'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <div className="relative w-full max-w-xs shrink-0">
              <input
                type="search"
                placeholder="Search"
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
      </div>
    </section>
  )
}
