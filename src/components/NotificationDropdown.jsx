// Dropdown แจ้งเตือน — แสดงของคนที่ login อยู่จริงจาก backend
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import defaultAvatar from '@/assets/defaultAvatar.png'
import {
  fetchNotifications,
  formatNotificationTime,
} from '@/services/notificationsApi'

export function NotificationDropdown({ hasNotifications, onOpen }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function handleOpenChange(open) {
    if (!open) return

    setIsLoading(true)
    onOpen()

    try {
      const data = await fetchNotifications()
      setItems(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      setItems([])
    } finally {
      setIsLoading(false)
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
        className="w-[min(100vw-3rem,22rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-[#DAD6D1] bg-white p-0 shadow-[0_8px_24px_rgba(38,35,30,0.12)]"
      >
        {isLoading ? (
          <p className="px-4 py-6 text-sm text-[#75716B]">Loading...</p>
        ) : items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[#75716B]">No notifications yet.</p>
        ) : (
          items.map((notification, index) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => {
                if (notification.postId) {
                  navigate(`/post/${notification.postId}`)
                }
              }}
              className={`flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-[#F9F8F6] ${
                index < items.length - 1 ? 'border-b border-[#EFEEEB]' : ''
              } ${notification.isRead ? '' : 'bg-[#FFF8F5]'}`}
            >
              <img
                src={notification.avatar || defaultAvatar}
                alt={notification.name || 'User'}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm leading-snug text-[#43403B]">
                  <span className="font-bold text-foreground">
                    {notification.name || 'Someone'}
                  </span>{' '}
                  {notification.message}
                </p>
                {notification.quote ? (
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#75716B]">
                    &ldquo;{notification.quote}&rdquo;
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-[#EB6B47]">
                  {formatNotificationTime(notification.time)}
                </p>
              </div>
            </button>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
