// หน้า Reset password — เปลี่ยนรหัสผ่าน (ต้อง login ก่อน)
// เชื่อมกับ: NavBar, ProfilePage sidebar, authApi
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { NavBar } from '@/components/NavBar'
import { AccountSidebar } from '@/components/AccountSidebar'
import { ResetPasswordModal } from '@/components/ResetPasswordModal'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useAuth } from '@/contexts/AuthContext'
import {
  PASSWORD_MISMATCH_MESSAGE,
  PASSWORD_TOO_SHORT_MESSAGE,
  WRONG_PASSWORD_MESSAGE,
  resetUserPassword,
  verifyCurrentPassword,
} from '@/services/authApi'
import defaultAvatar from '@/assets/defaultAvatar.png'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white py-3 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

function PasswordField({ id, label, placeholder, value, onChange, onBlur, error }) {
  const [isVisible, setIsVisible] = useState(false)
  const hasValue = value.length > 0

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`${inputClassName} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#75716B] transition-colors hover:text-foreground"
          >
            {isVisible ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}

export function ResetPasswordPage() {
  const location = useLocation()
  const { user } = useAuth()
  const isLoading = usePageLoading([location.pathname])

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const savedDisplayName = user.name || user.username || 'Member'
  const savedAvatarSrc = user.avatar || defaultAvatar

  function validateConfirmPassword(value = confirmPassword) {
    if (!value || value !== newPassword) {
      return PASSWORD_MISMATCH_MESSAGE
    }

    return ''
  }

  function handleConfirmBlur() {
    const confirmError = validateConfirmPassword()
    setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
  }

  function validateForm() {
    const nextErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    if (!currentPassword) {
      nextErrors.currentPassword = 'Please enter your current password.'
    } else if (!verifyCurrentPassword(currentPassword)) {
      nextErrors.currentPassword =
        'The current password you entered is incorrect. Please try again.'
    }

    if (!newPassword) {
      nextErrors.newPassword = 'New password is required.'
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = PASSWORD_TOO_SHORT_MESSAGE
    }

    nextErrors.confirmPassword = validateConfirmPassword()

    setErrors(nextErrors)
    return !Object.values(nextErrors).some(Boolean)
  }

  function handleOpenModal(event) {
    event.preventDefault()

    if (!validateForm()) return

    setIsModalOpen(true)
  }

  async function handleConfirmReset() {
    setIsSubmitting(true)

    try {
      await resetUserPassword({ currentPassword, newPassword })
      setIsModalOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password reset', {
        description: 'Your password has been successfully updated.',
      })
    } catch (error) {
      if (error.code === 'WRONG_PASSWORD' || error.message === WRONG_PASSWORD_MESSAGE) {
        setIsModalOpen(false)
        setErrors((prev) => ({
          ...prev,
          currentPassword: WRONG_PASSWORD_MESSAGE,
        }))
        return
      }

      console.error('Failed to reset password:', error)
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
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
          <div className="mb-8 flex items-center gap-3">
            <img
              src={savedAvatarSrc}
              alt={savedDisplayName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <h1 className="text-xl text-foreground md:text-2xl">
              <span className="font-normal">{savedDisplayName}</span>{' '}
              <span className="font-normal text-[#75716B]">|</span>{' '}
              <span className="font-bold">Reset password</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <aside>
              <AccountSidebar />
            </aside>

            <div>
              <div className="rounded-2xl bg-[#EFEEEB] px-6 py-8 md:px-10 md:py-10">
                <form className="space-y-6" onSubmit={handleOpenModal} noValidate>
                  <PasswordField
                    id="current-password"
                    label="Current password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value)
                      if (errors.currentPassword) {
                        setErrors((prev) => ({ ...prev, currentPassword: '' }))
                      }
                    }}
                    error={errors.currentPassword}
                  />

                  <PasswordField
                    id="new-password"
                    label="New password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value)
                      if (errors.newPassword) {
                        setErrors((prev) => ({ ...prev, newPassword: '' }))
                      }
                    }}
                    error={errors.newPassword}
                  />

                  <PasswordField
                    id="confirm-password"
                    label="Confirm new password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                      }
                    }}
                    onBlur={handleConfirmBlur}
                    error={errors.confirmPassword}
                  />

                  <Button
                    type="submit"
                    className="h-12 rounded-full px-8 text-base font-medium"
                  >
                    Reset password
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}

      <ResetPasswordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReset}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
