// Toast แจ้งเตือนมุมขวาล่าง — App.jsx mount ไว้, BlogInteraction เรียก toast.success
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast: 'cn-toast !rounded-xl !border-green-500 !bg-green-500 !text-white',
          title: '!text-white !font-semibold',
          description: '!text-white/90',
          closeButton:
            '!absolute !right-3 !top-3 !left-auto !border-white/30 !bg-transparent !text-white hover:!bg-white/10',
        },
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)',
      }}
      {...props}
    />
  )
}

export { Toaster }
