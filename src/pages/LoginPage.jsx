// หน้า Log in — แสดงฟอร์ม email/username + รหัสผ่าน พร้อมลิงก์ไป Sign up
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { AuthFormCard, AuthInput } from '@/components/AuthForm'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useAuth } from '@/contexts/AuthContext'
import { INVALID_CREDENTIALS_MESSAGE, loginUser } from '@/services/authApi'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  // แสดง loading สั้นๆ ตอนเข้าหน้า — ใช้ usePageLoading hook
  const isLoading = usePageLoading([location.pathname])

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [hasLoginError, setHasLoginError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function clearLoginError() {
    setPasswordError('')
    setHasLoginError(false)
  }

  function handleEmailOrUsernameChange(event) {
    setEmailOrUsername(event.target.value)
    if (hasLoginError) {
      clearLoginError()
    }
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
    if (hasLoginError) {
      clearLoginError()
    }
  }

  // ส่งข้อมูลไป authApi → login ใน AuthContext → กลับหน้าแรก
  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)

    try {
      // backend คืน { token, user } — ส่งทั้งก้อนให้ AuthContext เก็บ token ไว้ใช้กับ request ต่อไป
      const session = await loginUser({ email: emailOrUsername, password })
      await login(session)
      navigate('/')
    } catch (error) {
      if (
        error.code === 'INVALID_CREDENTIALS' ||
        error.message === INVALID_CREDENTIALS_MESSAGE
      ) {
        setHasLoginError(true)
        setPasswordError(INVALID_CREDENTIALS_MESSAGE)
        return
      }

      console.error('Failed to log in:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {isLoading ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto flex max-w-6xl justify-center px-6 py-16 md:px-10 md:py-24">
          <AuthFormCard title="Log in">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <AuthInput
                id="email-or-username"
                label="Email or Username"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={handleEmailOrUsernameChange}
                invalid={hasLoginError}
              />
              <AuthInput
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-full text-base font-medium"
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
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
            </form>
          </AuthFormCard>
        </main>
      )}
    </div>
  )
}
