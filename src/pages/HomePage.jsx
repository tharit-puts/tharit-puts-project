// หน้าแรก — รวมส่วนหัวเว็บ (Hero) กับส่วนรายการบทความ
import { HeroSection } from '@/components/HeroSection'
import { ArticleSection } from '@/components/ArticleSection'

export function HomePage() {
  return (
    <>
      {/* ส่วนแนะนำตัวผู้เขียน + รูปใหญ่ด้านบน */}
      <HeroSection />

      {/* ส่วน Latest articles พร้อม filter, search, view more */}
      <ArticleSection />
    </>
  )
}
