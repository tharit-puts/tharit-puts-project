// ข้อความ Loading กลางหน้า — ใช้ตอนรอข้อมูลหรือเปลี่ยนหน้า
export function Loading({ className = '' }) {
  return (
    <p
      className={`animate-pulse text-center text-base font-medium text-[#75716B] ${className}`}
    >
      Loading...
    </p>
  )
}
