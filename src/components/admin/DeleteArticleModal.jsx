// Modal ยืนยันลบบทความ — Article management / Edit article ใช้
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteArticleModal({ open, onClose, onConfirm, isSubmitting }) {
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
        aria-labelledby="delete-article-modal-title"
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
          id="delete-article-modal-title"
          className="text-center text-2xl font-bold text-foreground md:text-3xl"
        >
          Delete article
        </h2>

        <p className="mt-4 text-center text-sm text-[#75716B] md:text-base">
          Do you want to delete this article?
        </p>

        <div className="mt-8 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-full border-[#75716B] text-base font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-full text-base font-medium"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
