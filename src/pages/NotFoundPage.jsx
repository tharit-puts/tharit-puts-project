// หน้า 404 — App.jsx จับ URL ที่ไม่ตรง route ใดๆ ด้วย path="*"
import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <CircleAlert
          className="h-16 w-16 text-foreground"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <h1 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">
          Page Not Found
        </h1>

        <Link to="/" className="mt-8">
          <Button className="rounded-full px-8 py-6 text-base font-medium">
            Go To Homepage
          </Button>
        </Link>
      </main>

      <Footer />
    </div>
  )
}
