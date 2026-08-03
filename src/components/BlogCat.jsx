// แสดงรายการบทความแบบ grid 2 คอลัมน์ + ปุ่ม View more
import { BlogCard } from '@/components/BlogCard'
import { formatPostDate } from '@/services/postsApi'

export function BlogCat({
  posts,
  onViewMore,
  hasMore,
  isViewMoreLoading,
  onTagClick,
}) {
  return (
    <div className="mt-10">
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              image={post.image}
              tag={post.category}
              title={post.title}
              excerpt={post.description}
              author={post.author}
              authorAvatar={post.authorAvatar}
              date={formatPostDate(post.date)}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      ) : (
        // ถ้ากรองแล้วไม่เจอบทความ
        <p className="py-12 text-center text-[#75716B]">
          No articles found. Try a different search or category.
        </p>
      )}

      {/* แสดงปุ่ม View more เฉพาะตอนที่ยังมีบทความเหลือให้โหลด */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onViewMore}
            disabled={isViewMoreLoading}
            className="text-base font-medium text-foreground underline underline-offset-4 transition-colors hover:text-[#75716B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isViewMoreLoading ? 'Loading...' : 'View more'}
          </button>
        </div>
      )}
    </div>
  )
}
