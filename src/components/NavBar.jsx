import { Button } from '@/components/ui/button'
import hhLogo from '@/assets/hh..png'

export function NavBar() {
    return (
      <header className="border-b-2 border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <a href="/" className="inline-flex items-center">
            <img src={hhLogo} alt="hh." className="h-5 w-auto" />
          </a>
  
          <nav className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full border-[#75716B] px-8 py-5">
              Log in
            </Button>
            <Button className="rounded-full px-8 py-5 font-light">
              Sign up
            </Button>
          </nav>
        </div>
      </header>
    )
  }
