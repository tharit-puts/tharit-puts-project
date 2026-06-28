import authorAvatar from '@/assets/man-with-cat.jpg'

export function BlogCard({ image, tag, title, excerpt, author, date, onTagClick }) {
  return (
    <article className="flex flex-col gap-4">
      <img
        src={image}
        alt=""
        className="aspect-4/3 w-full rounded-2xl object-cover"
      />

      <button
        type="button"
        onClick={() => onTagClick?.(tag)}
        className="w-fit rounded-full bg-[#D7F2E9] px-3 py-1 text-xs font-medium text-[#128279] transition-colors hover:bg-[#B8E8DC]"
      >
        {tag}
      </button>

      <h3 className="text-xl font-bold leading-snug text-foreground">{title}</h3>

      <p className="line-clamp-3 text-sm leading-relaxed text-[#75716B]">
        {excerpt}
      </p>

      <div className="mt-auto flex items-center gap-3">
        <img
          src={authorAvatar}
          alt={author}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-foreground">{author}</span>
        <span className="h-4 w-px bg-[#DAD6D1]" aria-hidden="true" />
        <time className="text-sm text-[#75716B]" dateTime={date}>
          {date}
        </time>
      </div>
    </article>
  )
}
