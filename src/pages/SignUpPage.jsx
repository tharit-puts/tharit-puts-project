// หน้า Sign up — แสดงฟอร์มสมัครสมาชิก พร้อมลิงก์ไป Log in
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { AuthFormCard, AuthInput } from '@/components/AuthForm'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useAuth } from '@/contexts/AuthContext'
import { EMAIL_TAKEN_MESSAGE, registerUser } from '@/services/authApi'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(value) {
  if (!value.trim() || !EMAIL_PATTERN.test(value.trim())) {
    return 'Email must be a valid email'
  }

  return ''
}

function validatePassword(value) {
  if (!value || value.length < 6) {
    return 'Password must be at least 6 characters'
  }

  return ''
}

export function SignUpPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const isLoading = usePageLoading([location.pathname])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function shouldValidateField(field) {
    return touched[field] || errors[field] || submitAttempted
  }

  function handleEmailChange(event) {
    const { value } = event.target
    setEmail(value)

    if (shouldValidateField('email')) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }))
    }
  }

  function handlePasswordChange(event) {
    const { value } = event.target
    setPassword(value)

    if (shouldValidateField('password')) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }))
    }
  }

  function handleEmailBlur() {
    setTouched((prev) => ({ ...prev, email: true }))
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
  }

  function handlePasswordBlur() {
    setTouched((prev) => ({ ...prev, password: true }))
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitAttempted(true)
    setTouched({ email: true, password: true })

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setErrors({ email: emailError, password: passwordError })

    if (emailError || passwordError) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const username = String(formData.get('username') ?? '').trim()

    setIsSubmitting(true)

    try {
      const user = await registerUser({ name, username, email, password })
      login(user)
      navigate('/registration-success')
    } catch (error) {
      if (error.code === 'EMAIL_TAKEN' || error.message === EMAIL_TAKEN_MESSAGE) {
        setErrors((prev) => ({ ...prev, email: EMAIL_TAKEN_MESSAGE }))
        return
      }

      console.error('Failed to register user:', error)
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
          <AuthFormCard title="Sign up">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <AuthInput id="name" label="Name" placeholder="Display name" />
              <AuthInput id="username" label="Username" placeholder="Username" />
              <AuthInput
                id="email"
                label="Email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={errors.email}
              />
              <AuthInput
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={errors.password}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-full text-base font-medium"
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </Button>

              <p className="pt-2 text-center text-sm text-[#75716B]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Log in
                </Link>
              </p>
            </form>
          </AuthFormCard>
        </main>
      )}
    </div>
  )
}
