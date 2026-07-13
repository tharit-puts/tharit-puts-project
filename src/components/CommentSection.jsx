// ส่วน comment — กดช่องพิมพ์แล้วเปิด modal ให้สมัคร/เข้าสู่ระบบก่อน
import { useState } from 'react'
import { AuthModal } from '@/components/AuthModal'

// สีพื้นหลัง avatar ตามตัวอักษรแรกของชื่อ
const avatarColors = [
  'bg-[#D7F2E9] text-[#128279]',
  'bg-[#FFE8D6] text-[#C45C00]',
  'bg-[#E8E0FF] text-[#5B3FA0]',
  'bg-[#D6EEFF] text-[#0066AA]',
  'bg-[#FFD6E0] text-[#AA0044]',
]

// วงกลมแสดงตัวอักษรแรกของชื่อคอมเมนต์
function CommentAvatar({ name }) {
  const colorIndex = name.charCodeAt(0) % avatarColors.length
  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColors[colorIndex]}`}
    >
      {initial}
    </div>
  )
}

// คอมเมนต์ 1 รายการ
function CommentItem({ name, text, date }) {
  return (
    <div className="flex gap-4 border-b border-[#DAD6D1] py-6 last:border-b-0">
      <CommentAvatar name={name} />
      <div>
        <p className="font-bold text-foreground">{name}</p>
        <p className="mt-0.5 text-xs text-[#75716B]">{date}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#43403B]">{text}</p>
      </div>
    </div>
  )
}

export function CommentSection({ initialComments }) {
  // เปิด/ปิด modal สมัครสมาชิก
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="mt-10">
      <div>
        <label htmlFor="comment" className="text-sm font-medium text-[#75716B]">
          Comment
        </label>

        {/* ไม่ให้พิมพ์ได้ทันที — กดแล้วเด้ง modal ให้ login/signup */}
        <button
          type="button"
          id="comment"
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-2 flex w-full cursor-pointer rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-left text-sm text-[#75716B] outline-none transition-colors hover:border-[#75716B] focus:border-[#75716B]"
        >
          What are your thoughts?
        </button>
      </div>

      {/* แสดงคอมเมนต์ตัวอย่างที่เตรียมไว้ */}
      <div className="mt-6">
        {initialComments.map((comment) => (
          <CommentItem
            key={`${comment.name}-${comment.date}`}
            name={comment.name}
            text={comment.text}
            date={comment.date}
          />
        ))}
      </div>

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
