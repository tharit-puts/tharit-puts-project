// หน้า Notification (admin) — แสดงรายการแจ้งเตือนตัวอย่าง
import { useNavigate } from 'react-router-dom'
import { adminNotifications } from '@/data/adminNotifications'

export function AdminNotificationPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#EFEEEB] px-8 py-6">
        <h1 className="text-2xl font-bold text-foreground">Notification</h1>
      </div>

      <div className="px-8 py-4">
        {adminNotifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-4 border-b border-[#EFEEEB] py-6"
          >
            <img
              src={notification.avatar}
              alt={notification.name}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed text-[#43403B]">
                <span className="font-semibold text-foreground">
                  {notification.name}
                </span>{' '}
                {notification.action} {notification.articleTitle}
              </p>

              {notification.quote ? (
                <p className="mt-1 text-sm leading-relaxed text-[#43403B]">
                  &ldquo;{notification.quote}&rdquo;
                </p>
              ) : null}

              <p className="mt-2 text-xs text-[#EB6B47]">{notification.time}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="shrink-0 text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-[#75716B]"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
