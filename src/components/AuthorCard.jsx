// กล่องข้อมูลผู้เขียน — ใช้ในหน้า blog detail ด้านขวา (sticky บน desktop)
// แสดงเฉพาะคนที่เป็นเจ้าของบทความนั้นจริง ไม่ hardcode ชื่อ/รูปอีกต่อไป
import defaultAvatar from '@/assets/defaultAvatar.png'

const DEFAULT_BIO =
  'This author has not added a bio yet.'

export function AuthorCard({
  name = 'Author',
  avatar,
  bio,
  className = '',
}) {
  const avatarSrc = avatar || defaultAvatar
  const bioText = bio?.trim() ? bio.trim() : DEFAULT_BIO

  return (
    <div className={`rounded-2xl bg-[#EFEEEB] p-6 ${className}`}>
      <img
        src={avatarSrc}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <p className="mt-4 text-xs font-medium text-[#75716B]">Author</p>
      <h3 className="mt-1 text-xl font-bold text-foreground">{name}</h3>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#75716B]">
        {bioText}
      </p>
    </div>
  )
}
