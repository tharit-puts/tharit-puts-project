// ไฟล์หลักของแอป — กำหนดว่าแต่ละ URL จะแสดงหน้าไหน
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage } from '@/pages/HomePage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { RegistrationSuccessPage } from '@/pages/RegistrationSuccessPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ArticleManagementPage } from '@/pages/admin/ArticleManagementPage'
import { CreateArticlePage } from '@/pages/admin/CreateArticlePage'
import { AdminPlaceholderPage } from '@/pages/admin/AdminPlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    // BrowserRouter = เปิดระบบเปลี่ยนหน้าแบบไม่ reload ทั้งเว็บ
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
      {/* เลื่อนหน้าขึ้นบนสุดทุกครั้งที่เปลี่ยน route */}
      <ScrollToTop />

      <Routes>
        {/* หน้าแรก: แสดง Hero + รายการบทความ */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-background">
              <NavBar />
              <HomePage />
              <Footer />
            </div>
          }
        />

        {/* หน้าอ่านบทความเต็ม ตาม id ใน URL เช่น /post/2 */}
        <Route path="/post/:id" element={<BlogDetailPage />} />

        {/* หน้าเข้าสู่ระบบ */}
        <Route path="/login" element={<LoginPage />} />

        {/* หน้าสมัครสมาชิก */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* หน้าสมัครสำเร็จ */}
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />

        {/* หน้าแก้ไข profile — ต้อง login ก่อน */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* หน้าเปลี่ยนรหัสผ่าน — ต้อง login ก่อน */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* หน้า admin login + panel */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="articles" replace />} />
          <Route path="articles" element={<ArticleManagementPage />} />
          <Route path="articles/new" element={<CreateArticlePage />} />
          <Route
            path="categories"
            element={<AdminPlaceholderPage title="Category management" />}
          />
          <Route path="profile" element={<AdminPlaceholderPage title="Profile" />} />
          <Route
            path="notifications"
            element={<AdminPlaceholderPage title="Notification" />}
          />
          <Route
            path="reset-password"
            element={<AdminPlaceholderPage title="Reset password" />}
          />
        </Route>

        {/* หน้า 404 — จับ URL ที่ไม่มีใน Router */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
