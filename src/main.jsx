// จุดเริ่มต้นของแอป React — mount แอปเข้า DOM ที่ element #root ใน index.html
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // โหลด Tailwind + สี/ฟอนต์ global
import App from './App.jsx' // คอมโพเนนต์หลักที่กำหนด routing ทั้งหมด

createRoot(document.getElementById('root')).render(
  // StrictMode ช่วยเตือน side effect ที่อาจมีปัญหา (ใช้เฉพาะตอน dev)
  <StrictMode>
    <App />
  </StrictMode>,
)
