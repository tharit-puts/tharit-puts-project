// Layout ร่วมของ admin panel — มี sidebar ด้านซ้าย
import { Navigate, Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'

export function AdminLayout() {
  const { isAdmin, isLoading } = useAuth()

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
      <AdminSidebar />
      <main className="min-w-0 flex-1 bg-white">
        <Outlet />
      </main>
    </div>
  )
}
