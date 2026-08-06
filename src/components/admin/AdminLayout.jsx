// Layout ร่วมของ admin panel — มี sidebar ด้านซ้าย (desktop) / drawer (mobile)
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import hhLogo from '@/assets/hh..png'

export function AdminLayout() {
  const { isAdmin, isLoading } = useAuth()
  const location = useLocation()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // ปิด drawer เมื่อเปลี่ยนหน้า (กันค้างเปิดหลังกดลิงก์)
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  // กัน scroll พื้นหลังตอนเปิดเมนูมือถือ
  useEffect(() => {
    if (!isMobileNavOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileNavOpen])

  // ต้องรอให้ตรวจ token กับ backend เสร็จก่อน
  // ไม่งั้นตอนกดรีเฟรชหน้า admin จะถูกเด้งไปหน้า login ทั้งที่ยัง login อยู่
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loading />
      </div>
    )
  }

  // เช็คสิทธิ์จาก role จริงของผู้ใช้ (backend เป็นคนบอก) ไม่ใช่ flag ใน localStorage
  // หมายเหตุ: นี่เป็นเพียงการซ่อน UI ความปลอดภัยจริงอยู่ที่ backend ที่ตรวจ token ทุก request
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative flex h-full w-64 max-w-[85vw] flex-col shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute top-4 right-3 z-10 rounded-lg p-2 text-[#43403B] transition-colors hover:bg-[#EFEEEB]"
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar onNavigate={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex shrink-0 items-center gap-3 border-b border-[#EFEEEB] px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen(true)}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-[#EFEEEB]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img src={hhLogo} alt="hh." className="h-5 w-auto" />
          <span className="text-sm font-medium text-[#EB6B47]">Admin panel</span>
        </header>

        <main className="min-w-0 flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
