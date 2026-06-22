import linkedInIcon from '@/assets/LinkedIN_black.png'
import githubIcon from '@/assets/Github_black.png'
import googleIcon from '@/assets/Google_black.png'

const socialLinks = [
  { href: '#', icon: linkedInIcon, label: 'LinkedIn' },
  { href: '#', icon: githubIcon, label: 'GitHub' },
  { href: '#', icon: googleIcon, label: 'Google' },
]

export function Footer() {
  return (
    <footer className="bg-[#EFEEEB]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 md:px-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground md:text-base">
            Get in touch
          </span>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex shrink-0 transition-opacity hover:opacity-70"
              >
                <img src={icon} alt="" className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        <a
          href="/"
          className="text-sm font-medium text-foreground underline underline-offset-4 md:text-base"
        >
          Home page
        </a>
      </div>
    </footer>
  )
}
