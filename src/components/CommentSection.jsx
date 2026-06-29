import { useState } from 'react'
import authorAvatar from '@/assets/man-with-cat.jpg'

const avatarColors = [
  'bg-[#D7F2E9] text-[#128279]',
  'bg-[#FFE8D6] text-[#C45C00]',
  'bg-[#E8E0FF] text-[#5B3FA0]',
  'bg-[#D6EEFF] text-[#0066AA]',
  'bg-[#FFD6E0] text-[#AA0044]',
]

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
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(initialComments)

  function handleSubmit(event) {
    event.preventDefault()
    if (!commentText.trim()) return

    setComments((current) => [
      {
        name: 'You',
        text: commentText.trim(),
        date: new Date().toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: authorAvatar,
      },
      ...current,
    ])
    setCommentText('')
  }

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" className="text-sm font-medium text-[#75716B]">
          Comment
        </label>
        <textarea
          id="comment"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="What are your thoughts?"
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Send
          </button>
        </div>
      </form>

      <div className="mt-6">
        {comments.map((comment) => (
          <CommentItem
            key={`${comment.name}-${comment.date}`}
            name={comment.name}
            text={comment.text}
            date={comment.date}
          />
        ))}
      </div>
    </div>
  )
}
