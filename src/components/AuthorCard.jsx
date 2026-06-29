import authorAvatar from '@/assets/man-with-cat.jpg'

export function AuthorCard({ className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-[#EFEEEB] p-6 ${className}`}
    >
      <img
        src={authorAvatar}
        alt="Thompson P."
        className="h-12 w-12 rounded-full object-cover"
      />
      <p className="mt-4 text-xs font-medium text-[#75716B]">Author</p>
      <h3 className="mt-1 text-xl font-bold text-foreground">Thompson P.</h3>
      <p className="mt-4 text-sm leading-relaxed text-[#75716B]">
        I am a pet enthusiast and freelance writer who specializes in animal
        behavior and care. With a deep love for cats, I enjoy sharing insights
        on feline companionship and wellness.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[#75716B]">
        When I&apos;m not writing, I spend time volunteering at my local animal
        shelter, helping cats find loving homes.
      </p>
    </div>
  )
}
