import { useState } from 'react'
import { Copy, Smile } from 'lucide-react'
import twitterIcon from '@/assets/colorTwitter.png'
import linkedinIcon from '@/assets/colorLinkedin.png'
import facebookIcon from '@/assets/colorFacebook.png'

const socialLinks = [
  { href: 'https://twitter.com', icon: twitterIcon, label: 'Share on Twitter' },
  { href: 'https://linkedin.com', icon: linkedinIcon, label: 'Share on LinkedIn' },
  { href: 'https://facebook.com', icon: facebookIcon, label: 'Share on Facebook' },
]

export function BlogInteraction({ initialCount }) {
  const [emotionCount, setEmotionCount] = useState(initialCount)
  const [hasReacted, setHasReacted] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleEmotionClick() {
    if (!hasReacted) {
      setEmotionCount((count) => count + 1)
      setHasReacted(true)
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#EFEEEB] px-6 py-4">
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
        {copied ? 'Copied!' : 'Copy link'}
      </button>

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
