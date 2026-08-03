// หน้าแจ้งสมัครสมาชิกสำเร็จ — SignUpPage navigate มาหลัง register สำเร็จ
import { Link, useLocation } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'

export function RegistrationSuccessPage() {
  const location = useLocation()
  const isLoading = usePageLoading([location.pathname])

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {isLoading ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto flex max-w-6xl justify-center px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-[#EFEEEB] px-8 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]">
              <CircleCheck className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-foreground">
              Registration success
            </h1>

            <Link to="/" className="mt-8 inline-block w-full">
              <Button className="h-12 w-full rounded-full text-base font-medium">
                Continue
              </Button>
            </Link>
          </div>
        </main>
      )}
    </div>
  )
}
