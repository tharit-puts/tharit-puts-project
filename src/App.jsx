import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage } from '@/pages/HomePage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
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
        <Route path="/post/:id" element={<BlogDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
