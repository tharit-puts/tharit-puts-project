// เมนู sidebar ร่วม — ใช้ในหน้า Profile และ Reset password
import { Link, useLocation } from 'react-router-dom'
import { RotateCcw, User } from 'lucide-react'

const sidebarItemClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#43403B]'

export function AccountSidebar() {
  const { pathname } = useLocation()
  const isProfile = pathname === '/profile'
  const isResetPassword = pathname === '/reset-password'

  return (
    <nav className="flex flex-col gap-1">
      <Link
        to="/profile"
        className={`${sidebarItemClassName} ${
          isProfile ? 'font-semibold text-foreground' : 'text-[#75716B]'
        }`}
      >
        <User className="h-4 w-4" />
        Profile
      </Link>
      <Link
        to="/reset-password"
        className={`${sidebarItemClassName} ${
          isResetPassword ? 'font-semibold text-foreground' : 'text-[#75716B]'
        }`}
      >
        <RotateCcw className="h-4 w-4" />
        Reset password
      </Link>
    </nav>
  )
}
