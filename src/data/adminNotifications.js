// ข้อมูลแจ้งเตือนตัวอย่างสำหรับ Admin (ยังไม่มีของจริง) — AdminNotificationPage ใช้
import defaultAvatar from '@/assets/defaultAvatar.png'

export const adminNotifications = [
  {
    id: 1,
    name: 'Jacob Lash',
    avatar: defaultAvatar,
    action: 'Commented on your article:',
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    quote:
      'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
    time: '4 hours ago',
  },
  {
    id: 2,
    name: 'Jacob Lash',
    avatar: defaultAvatar,
    action: 'liked your article:',
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    quote: '',
    time: '4 hours ago',
  },
]
