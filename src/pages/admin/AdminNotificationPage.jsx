// หน้า Notification (admin) — แสดงแจ้งเตือนจริงของบัญชีที่ login อยู่
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import defaultAvatar from '@/assets/defaultAvatar.png'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchNotifications,
  formatNotificationTime,
} from '@/services/notificationsApi'

export function AdminNotificationPage() {
  const navigate = useNavigate()
  const { markNotificationsRead } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchNotifications()
        if (!isActive) return
        setItems(data)
        await markNotificationsRead()
      } catch (error) {
        console.error('Failed to load notifications:', error)
        if (isActive) toast.error('Failed to load notifications')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [markNotificationsRead])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#EFEEEB] px-8 py-6">
        <h1 className="text-2xl font-bold text-foreground">Notification</h1>
      </div>

      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : items.length === 0 ? (
          <p className="py-10 text-sm text-[#75716B]">No notifications yet.</p>
        ) : (
          items.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 border-b border-[#EFEEEB] py-6"
            >
              <img
                src={notification.avatar || defaultAvatar}
                alt={notification.name || 'User'}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-[#43403B]">
                  <span className="font-semibold text-foreground">
                    {notification.name || 'Someone'}
                  </span>{' '}
                  {notification.message}
                </p>

                {notification.quote ? (
                  <p className="mt-1 text-sm leading-relaxed text-[#43403B]">
                    &ldquo;{notification.quote}&rdquo;
                  </p>
                ) : null}

                <p className="mt-2 text-xs text-[#EB6B47]">
                  {formatNotificationTime(notification.time)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (notification.postId) {
                    navigate(`/post/${notification.postId}`)
                  } else {
                    navigate('/admin/articles')
                  }
                }}
                className="shrink-0 text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-[#75716B]"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
