// แถบปุ่มโต้ตอบใต้บทความ — emotion, copy link, แชร์โซเชียล
import { useState } from 'react'
import { Copy, Smile } from 'lucide-react'
import { toast } from 'sonner'
import twitterIcon from '@/assets/colorTwitter.png'
import linkedinIcon from '@/assets/colorLinkedin.png'
import facebookIcon from '@/assets/colorFacebook.png'

// ลิงก์ไอคอนโซเชียลสำหรับแชร์บทความ
const socialLinks = [
  { href: 'https://twitter.com', icon: twitterIcon, label: 'Share on Twitter' },
  { href: 'https://linkedin.com', icon: linkedinIcon, label: 'Share on LinkedIn' },
  { href: 'https://facebook.com', icon: facebookIcon, label: 'Share on Facebook' },
]

export function BlogInteraction({ initialCount }) {
  // ยอดกด emotion เริ่มจากค่าที่ส่งเข้ามา
  const [emotionCount, setEmotionCount] = useState(initialCount)

  // กันกด emotion ซ้ำได้แค่ครั้งเดียวต่อการเข้าหน้า
  const [hasReacted, setHasReacted] = useState(false)

  function handleEmotionClick() {
    if (!hasReacted) {
      setEmotionCount((count) => count + 1)
      setHasReacted(true)
    }
  }

  // คัดลอก URL ปัจจุบันไปยัง clipboard แล้วแจ้งเตือนด้านขวาล่าง
  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Copied!', {
      description: 'This article has been copied to your clipboard.',
      icon: null,
    })
  }

  return (
    <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleEmotionClick}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#43403B] transition-colors hover:bg-[#F9F8F6]"
        >
          <Smile className="h-5 w-5" />
          {emotionCount}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#43403B] transition-colors hover:bg-[#F9F8F6]"
        >
          <Copy className="h-4 w-4" />
          Copy link
        </button>
      </div>

      <div className="flex items-center gap-3">
        {socialLinks.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="transition-opacity hover:opacity-80"
          >
            <img src={icon} alt="" className="h-9 w-9" />
          </a>
        ))}
      </div>
    </div>
  )
}
