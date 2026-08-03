// หน้า placeholder สำหรับเมนู admin ที่ยังไม่ได้ทำ
export function AdminPlaceholderPage({ title }) {
  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-4 text-sm text-[#75716B]">This section is coming soon.</p>
    </div>
  )
}
