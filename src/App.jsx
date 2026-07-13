// ไฟล์หลักของแอป — กำหนดว่าแต่ละ URL จะแสดงหน้าไหน
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage } from '@/pages/HomePage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'

function App() {
  return (
    // BrowserRouter = เปิดระบบเปลี่ยนหน้าแบบไม่ reload ทั้งเว็บ
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
