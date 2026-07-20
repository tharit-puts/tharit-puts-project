// หน้า Admin panel หลัง login สำเร็จ
import { Navigate } from 'react-router-dom'
import { getAdminSession } from '@/services/adminApi'

export function AdminPage() {
  if (!getAdminSession()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-medium text-[#EB6B47]">Admin panel</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Welcome, Admin</h1>
        </div>
      </main>
    </div>
  )
}
