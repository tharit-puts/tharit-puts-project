// แถบเมนูด้านบน — แสดงโลโก้และปุ่ม Log in / Sign up หรือข้อมูล member
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  Menu,
  RotateCcw,
  SquareArrowOutUpRight,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import hhLogo from '@/assets/hh..png'
import defaultAvatar from '@/assets/defaultAvatar.png'

const loginButtonClassName =
  'w-full rounded-full border-[#75716B] px-8 py-5'
const signUpButtonClassName = 'w-full rounded-full px-8 py-5 font-light'

const menuItemClassName =
  'cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-[#43403B]'

// เมนูสำหรับ guest (ยังไม่ login) — แสดงปุ่ม Log in / Sign up
function GuestNav({ isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground outline-none transition-colors hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={16}
          className="w-[calc(100vw-3rem)] rounded-none border-0 border-t-2 border-border bg-background p-6 shadow-none ring-0 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className={loginButtonClassName}>
                Log in
              </Button>
            </Link>

            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className={signUpButtonClassName}>Sign up</Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <nav className="hidden items-center gap-3 md:flex">
        <Link to="/login">
          <Button variant="outline" className="rounded-full border-[#75716B] px-8 py-5">
            Log in
          </Button>
        </Link>

        <Link to="/signup">
          <Button className="rounded-full px-8 py-5 font-light">
            Sign up
          </Button>
        </Link>
      </nav>
    </>
  )
}

// เมนูสำหรับ member (login แล้ว) — แสดง avatar, แจ้งเตือน, dropdown profile
function MemberNav({
  user,
  hasNotifications,
  onLogout,
  onProfileClick,
  onResetPasswordClick,
  onAdminPanelClick,
  onNotificationsOpen,
}) {
  const displayName = user.name || user.username || 'Member'
  const avatarSrc = user.avatar || defaultAvatar

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <NotificationDropdown
        hasNotifications={hasNotifications}
        onOpen={onNotificationsOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full py-1 pr-1 outline-none transition-colors hover:opacity-80 md:gap-3">
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:inline">
            {displayName}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-[#75716B] sm:inline" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-48 rounded-xl border border-[#DAD6D1] bg-white p-2 shadow-[0_8px_24px_rgba(38,35,30,0.12)]"
        >
          <DropdownMenuItem className={menuItemClassName} onClick={onProfileClick}>
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className={menuItemClassName} onClick={onResetPasswordClick}>
            <RotateCcw className="h-4 w-4" />
            Reset password
          </DropdownMenuItem>

          <DropdownMenuItem className={menuItemClassName} onClick={onAdminPanelClick}>
            <SquareArrowOutUpRight className="h-4 w-4" />
            Admin panel
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#DAD6D1]" />

          <DropdownMenuItem
            className={menuItemClassName}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function NavBar() {
  const navigate = useNavigate()
  // อ่านสถานะ login จาก AuthContext — แสดง GuestNav หรือ MemberNav ตาม user
  const { user, logout, hasNotifications, markNotificationsRead } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleProfileClick() {
    navigate('/profile')
  }

  function handleResetPasswordClick() {
    navigate('/reset-password')
  }

  function handleAdminPanelClick() {
    navigate('/admin/login')
  }

  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="inline-flex items-center">
          <img src={hhLogo} alt="hh." className="h-5 w-auto" />
        </Link>

        {user ? (
          <MemberNav
            user={user}
            hasNotifications={hasNotifications}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onResetPasswordClick={handleResetPasswordClick}
            onAdminPanelClick={handleAdminPanelClick}
            onNotificationsOpen={markNotificationsRead}
          />
        ) : (
          <GuestNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        )}
      </div>
    </header>
  )
}
