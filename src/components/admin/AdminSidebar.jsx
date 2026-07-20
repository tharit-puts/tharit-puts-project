// Sidebar ของ admin panel
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  FileText,
  FolderOpen,
  LogOut,
  Bell,
  RotateCcw,
  User,
} from 'lucide-react'
import hhLogo from '@/assets/hh..png'
import { clearAdminSession } from '@/services/adminApi'

const navItemClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#43403B]'

const navItems = [
  { label: 'Article management', path: '/admin/articles', icon: FileText },
  { label: 'Category management', path: '/admin/categories', icon: FolderOpen },
  { label: 'Profile', path: '/admin/profile', icon: User },
  { label: 'Notification', path: '/admin/notifications', icon: Bell },
  { label: 'Reset password', path: '/admin/reset-password', icon: RotateCcw },
]

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    clearAdminSession()
    navigate('/admin/login')
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#EFEEEB] bg-[#F9F8F6] px-4 py-6">
      <div className="px-3">
        <img src={hhLogo} alt="hh." className="h-5 w-auto" />
        <p className="mt-3 text-sm font-medium text-[#EB6B47]">Admin panel</p>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive =
            path === '/admin/articles' || path === '/admin/categories'
              ? location.pathname.startsWith(path)
              : location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={`${navItemClassName} ${
                isActive ? 'bg-[#EFEEEB] font-semibold text-foreground' : 'text-[#75716B]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-[#EFEEEB] pt-4">
        <Link
          to="/"
          className={`${navItemClassName} text-[#75716B] hover:text-foreground`}
        >
          <ExternalLink className="h-4 w-4" />
          hh. website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`${navItemClassName} text-left text-[#75716B] hover:text-foreground`}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
