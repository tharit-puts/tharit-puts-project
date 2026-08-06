// หน้า Reset password (admin) — เปลี่ยนรหัสผ่านของบัญชี admin ที่ login อยู่
// ใช้ endpoint เดียวกับฝั่งผู้ใช้ทั่วไป (PUT /auth/reset-password)
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ResetPasswordModal } from '@/components/ResetPasswordModal'
import { WRONG_PASSWORD_MESSAGE, resetUserPassword } from '@/services/authApi'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white py-3 pr-11 pl-4 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

function PasswordField({ id, label, placeholder, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false)
  const hasValue = value.length > 0

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative mt-2 max-w-md">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClassName}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#75716B] transition-colors hover:text-foreground"
          >
            {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function AdminResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateForm() {
    if (!currentPassword) {
      toast.error('Please enter your current password')
      return false
    }

    if (!newPassword) {
      toast.error('Please enter a new password')
      return false
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return false
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from the current password')
      return false
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match')
      return false
    }

    return true
  }

  function handleOpenModal() {
    if (!validateForm()) return
    setIsModalOpen(true)
  }

  async function handleConfirmReset() {
    setIsSubmitting(true)

    try {
      // backend เป็นคนตรวจรหัสผ่านเดิม (ตอบ 401 ถ้าผิด)
      await resetUserPassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password reset', {
        description: 'Your password has been successfully updated.',
      })
    } catch (error) {
      console.error('Failed to reset admin password:', error)
      if (error.code === 'WRONG_PASSWORD') {
        toast.error(WRONG_PASSWORD_MESSAGE)
      } else {
        toast.error('Failed to reset password', { description: error.message })
      }
    } finally {
      setIsSubmitting(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex shrink-0 flex-col gap-4 border-b border-[#EFEEEB] px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6">
        <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
        <Button
          type="button"
          onClick={handleOpenModal}
          className="h-11 w-full rounded-full px-6 text-sm font-medium sm:w-auto"
        >
          Reset password
        </Button>
      </div>

      <div className="px-4 py-8 md:px-8 md:py-10">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            handleOpenModal()
          }}
        >
          <PasswordField
            id="current-password"
            label="Current password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />

          <PasswordField
            id="new-password"
            label="New password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </form>
      </div>

      <ResetPasswordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReset}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
