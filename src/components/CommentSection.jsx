// ส่วน comment — login แล้วพิมพ์ได้จริง ไม่ login จะเปิด modal ให้สมัคร/เข้าสู่ระบบก่อน
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AuthModal } from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import defaultAvatar from '@/assets/defaultAvatar.png'
import {
  createComment,
  fetchComments,
  formatCommentDate,
} from '@/services/commentsApi'

// สีพื้นหลัง avatar สำรอง ตามตัวอักษรแรกของชื่อ (ใช้เมื่อยังไม่มีรูปโปรไฟล์)
const avatarColors = [
  'bg-[#D7F2E9] text-[#128279]',
  'bg-[#FFE8D6] text-[#C45C00]',
  'bg-[#E8E0FF] text-[#5B3FA0]',
  'bg-[#D6EEFF] text-[#0066AA]',
  'bg-[#FFD6E0] text-[#AA0044]',
]

function CommentAvatar({ name, avatar }) {
  // มีรูปโปรไฟล์จริง → แสดงรูป / ไม่มี → แสดงตัวอักษรแรก
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
        onError={(event) => {
          // ถ้ารูปเสีย ให้สลับไปใช้ defaultAvatar แทน
          event.currentTarget.onerror = null
          event.currentTarget.src = defaultAvatar
        }}
      />
    )
  }

  const safeName = name?.trim() || 'U'
  const colorIndex = safeName.charCodeAt(0) % avatarColors.length
  const initial = safeName.charAt(0).toUpperCase()

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColors[colorIndex]}`}
    >
      {initial}
    </div>
  )
}

// คอมเมนต์ 1 รายการ
function CommentItem({ name, text, date, avatar }) {
  return (
    <div className="flex gap-4 border-b border-[#DAD6D1] py-6 last:border-b-0">
      <CommentAvatar name={name} avatar={avatar} />
      <div>
        <p className="font-bold text-foreground">{name}</p>
        <p className="mt-0.5 text-xs text-[#75716B]">{date}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#43403B]">{text}</p>
      </div>
    </div>
  )
}

export function CommentSection({ postId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // โหลดคอมเมนต์จริงจาก backend ทุกครั้งที่เปลี่ยนบทความ
  useEffect(() => {
    let isActive = true

    async function loadComments() {
      setIsLoading(true)

      try {
        const data = await fetchComments(postId)
        if (isActive) setComments(data)
      } catch (error) {
        console.error('Failed to fetch comments:', error)
        if (isActive) {
          setComments([])
          toast.error('Failed to load comments')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadComments()

    return () => {
      isActive = false
    }
  }, [postId])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    const content = draft.trim()
    if (!content) {
      toast.error('Please write a comment first')
      return
    }

    setIsSubmitting(true)

    try {
      const created = await createComment(postId, content)
      // ใส่คอมเมนต์ใหม่ไว้บนสุด เพราะ backend เรียง created_at DESC
      setComments((prev) => [created, ...prev])
      setDraft('')
      toast.success('Comment posted')
    } catch (error) {
      console.error('Failed to create comment:', error)
      toast.error(error.message || 'Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-10">
      <div>
        <label htmlFor="comment" className="text-sm font-medium text-[#75716B]">
          Comment
        </label>

        {user ? (
          <form onSubmit={handleSubmit} className="mt-2">
            <textarea
              id="comment"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What are your thoughts?"
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-y rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-[#43403B] outline-none transition-colors placeholder:text-[#75716B] hover:border-[#75716B] focus:border-[#75716B] disabled:opacity-60"
            />
            <div className="mt-3 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !draft.trim()}
                className="h-10 rounded-full px-5 text-sm font-medium"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        ) : (
          // ยังไม่ login — กดแล้วเด้ง modal ให้ login/signup
          <button
            type="button"
            id="comment"
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-2 flex w-full cursor-pointer rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-left text-sm text-[#75716B] outline-none transition-colors hover:border-[#75716B] focus:border-[#75716B]"
          >
            What are your thoughts?
          </button>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="py-6 text-sm text-[#75716B]">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="py-6 text-sm text-[#75716B]">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              name={comment.name}
              text={comment.text}
              avatar={comment.avatar}
              date={formatCommentDate(comment.date)}
            />
          ))
        )}
      </div>

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
