// กันหน้าที่ต้อง login — ยังไม่ login ให้ไปหน้า /login
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'

export function RequireAuth() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loading />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
