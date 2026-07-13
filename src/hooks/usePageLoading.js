// Hook สำหรับแสดง Loading ชั่วคราวตอนเข้าหน้าใหม่
import { useEffect, useState } from 'react'
import { LOADING_DELAY } from '@/lib/loading'

export function usePageLoading(deps = [], delay = LOADING_DELAY.page) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // เริ่มโหลดทุกครั้งที่ dependency เปลี่ยน (เช่น pathname หรือ blog id)
    setIsLoading(true)

    const timer = setTimeout(() => setIsLoading(false), delay)

    // ยกเลิก timer ถ้า component ถูก unmount ก่อนครบเวลา
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return isLoading
}
