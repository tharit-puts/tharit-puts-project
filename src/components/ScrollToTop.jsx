// เลื่อนหน้าขึ้นบนสุดทุกครั้งที่เปลี่ยน URL
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  // อ่าน path ปัจจุบัน เช่น /, /login, /post/2
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // component นี้ไม่แสดง UI มีหน้าที่แค่ scroll
  return null
}
