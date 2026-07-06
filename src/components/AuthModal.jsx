import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AuthModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-[#75716B] transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="auth-modal-title"
          className="pr-8 text-2xl font-bold leading-snug text-foreground md:text-3xl"
        >
          Create an account to continue
        </h2>

        <Link to="/signup" onClick={onClose}>
          <Button
            type="button"
            className="mt-8 h-12 w-full rounded-full text-base font-medium"
          >
            Create account
          </Button>
        </Link>

        <p className="mt-6 text-center text-sm text-[#75716B]">
          Already have an account?{' '}
          <Link
            to="/login"
            onClick={onClose}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
