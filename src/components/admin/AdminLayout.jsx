// Layout ร่วมของ admin panel — มี sidebar ด้านซ้าย
import { Navigate, Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getAdminSession } from '@/services/adminApi'

export function AdminLayout() {
  if (!getAdminSession()) {
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
