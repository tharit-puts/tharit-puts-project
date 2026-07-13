// แถบเมนูด้านบน — แสดงโลโก้และปุ่ม Log in / Sign up
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import hhLogo from '@/assets/hh..png'

const loginButtonClassName =
  'w-full rounded-full border-[#75716B] px-8 py-5'
const signUpButtonClassName = 'w-full rounded-full px-8 py-5 font-light'

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        {/* กดโลโก้แล้วกลับหน้าแรก */}
        <Link to="/" className="inline-flex items-center">
          <img src={hhLogo} alt="hh." className="h-5 w-auto" />
        </Link>

        {/* Mobile: hamburger menu */}
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

        {/* Desktop: ปุ่ม Log in / Sign up */}
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
      </div>
    </header>
  )
}
