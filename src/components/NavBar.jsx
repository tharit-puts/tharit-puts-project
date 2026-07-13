// แถบเมนูด้านบน — แสดงโลโก้และปุ่ม Log in / Sign up
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import hhLogo from '@/assets/hh..png'

export function NavBar() {
  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        {/* กดโลโก้แล้วกลับหน้าแรก */}
        <Link to="/" className="inline-flex items-center">
          <img src={hhLogo} alt="hh." className="h-5 w-auto" />
        </Link>

        <nav className="flex items-center gap-3">
          {/* ปุ่มไปหน้า Log in */}
          <Link to="/login">
            <Button variant="outline" className="rounded-full border-[#75716B] px-8 py-5">
              Log in
            </Button>
          </Link>

          {/* ปุ่มไปหน้า Sign up */}
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
