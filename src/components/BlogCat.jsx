import { BlogCard } from '@/components/BlogCard'

export function BlogCat({ blogs, onViewMore, hasMore, isViewMoreLoading, onTagClick }) {
  return (
    <div className="mt-10">
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.image}
              tag={blog.tag}
              title={blog.title}
              excerpt={blog.excerpt}
              author={blog.author}
              date={blog.date}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-[#75716B]">
          No articles found. Try a different search or category.
        </p>
      )}

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
