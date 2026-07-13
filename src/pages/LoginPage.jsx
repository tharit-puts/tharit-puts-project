// หน้า Log in — แสดงฟอร์มอีเมล/รหัสผ่าน พร้อมลิงก์ไป Sign up
import { Link, useLocation } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { AuthFormCard, AuthInput } from '@/components/AuthForm'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'

export function LoginPage() {
  const location = useLocation()

  // แสดง Loading ชั่วคราวทุกครั้งที่เข้าหน้านี้
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
          {/* title คือ หัวข้อของฟอร์ม */}
          <AuthFormCard title="Log in"> 
            {/*children คือ ส่วนของฟอร์มที่จะถูกแสดงผล*/}
            <AuthInput id="email" label="Email" placeholder="Email" />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="Password"
            />

            <Button
              type="button"
              className="mt-2 h-12 w-full rounded-full text-base font-medium"
            >
              Log in
            </Button>

            <p className="pt-2 text-center text-sm text-[#75716B]">
              Don&apos;t have any account?{' '}
              <Link
                to="/signup"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </AuthFormCard>
        </main>
      )}  
    </div>
  )
}
