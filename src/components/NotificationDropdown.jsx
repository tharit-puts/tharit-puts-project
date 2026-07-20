// Dropdown แจ้งเตือน — กดเปิด/ปิดได้ จุดแดงหายเมื่อเปิด
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { notifications } from '@/data/notifications'

export function NotificationDropdown({ hasNotifications, onOpen }) {
  function handleOpenChange(open) {
    if (open) {
      onOpen()
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DAD6D1] bg-white text-[#75716B] outline-none transition-colors hover:bg-[#F9F8F6]"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {hasNotifications ? (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[min(100vw-3rem,22rem)] overflow-hidden rounded-2xl border border-[#DAD6D1] bg-white p-0 shadow-[0_8px_24px_rgba(38,35,30,0.12)]"
      >
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`flex gap-3 px-4 py-4 ${
              index < notifications.length - 1 ? 'border-b border-[#EFEEEB]' : ''
            }`}
          >
            <img
              src={notification.avatar}
              alt={notification.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm leading-snug text-[#43403B]">
                <span className="font-bold text-foreground">{notification.name}</span>{' '}
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-[#EB6B47]">{notification.time}</p>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
