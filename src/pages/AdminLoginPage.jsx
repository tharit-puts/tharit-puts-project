// หน้า Log in สำหรับ admin — เข้าจาก NavBar > Admin panel
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { toast } from 'sonner'
import { AuthInput } from '@/components/AuthForm'
import { Button } from '@/components/ui/button'
import {
  ADMIN_INVALID_CREDENTIALS_DESCRIPTION,
  ADMIN_INVALID_CREDENTIALS_TITLE,
  loginAdmin,
} from '@/services/adminApi'

const adminErrorToastClassNames = {
  toast: 'cn-toast !rounded-xl !border-red-500 !bg-red-500 !text-white',
  title: '!text-white !font-semibold',
  description: '!text-white/90',
  closeButton:
    '!absolute !right-3 !top-3 !left-auto !border-white/30 !bg-transparent !text-white hover:!bg-white/10',
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [hasLoginError, setHasLoginError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function clearLoginError() {
    setHasLoginError(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      loginAdmin({ emailOrUsername, password })
      navigate('/admin/articles')
    } catch (error) {
      if (
        error.code === 'ADMIN_INVALID_CREDENTIALS' ||
        error.message === ADMIN_INVALID_CREDENTIALS_TITLE
      ) {
        setHasLoginError(true)
        toast.error(ADMIN_INVALID_CREDENTIALS_TITLE, {
          description: ADMIN_INVALID_CREDENTIALS_DESCRIPTION,
          classNames: adminErrorToastClassNames,
        })
        return
      }

      console.error('Failed to log in as admin:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-[#EFEEEB] px-8 py-10">
          <p className="text-center text-sm font-medium text-[#EB6B47]">Admin panel</p>
          <h1 className="mt-2 text-center text-3xl font-bold text-foreground">Log in</h1>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="admin-email"
              label="Email or Username"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(event) => {
                setEmailOrUsername(event.target.value)
                if (hasLoginError) clearLoginError()
              }}
              invalid={hasLoginError}
            />
            <AuthInput
              id="admin-password"
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (hasLoginError) clearLoginError()
              }}
              invalid={hasLoginError}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-full text-base font-medium"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
