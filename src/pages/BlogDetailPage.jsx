// หน้าอ่านบทความเต็ม — ดึงข้อมูลจาก id ใน URL แล้วแสดงเนื้อหา + comment
import { Navigate, useParams } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { AuthorCard } from '@/components/AuthorCard'
import { BlogContent } from '@/components/BlogContent'
import { BlogInteraction } from '@/components/BlogInteraction'
import { CommentSection } from '@/components/CommentSection'
import { Loading } from '@/components/Loading'
import { getBlogById } from '@/data/blogs'
import { getBlogDetail } from '@/data/blogDetails'
import { usePageLoading } from '@/hooks/usePageLoading'

export function BlogDetailPage() {
  // อ่านเลข id จาก URL เช่น /post/3 -> id = "3"
  const { id } = useParams()

  // หาข้อมูลบทความจากไฟล์ข้อมูลตาม id
  const blog = getBlogById(id)

  // แสดง Loading ชั่วคราวตอนเข้าหน้านี้หรือเปลี่ยน id
  const isLoading = usePageLoading([id])

  // ถ้าไม่เจอบทความ ส่งกลับหน้าแรก
  if (!blog) {
    return <Navigate to="/" replace />
  }

  // ดึงเนื้อหาเต็ม comment ตัวอย่าง และยอด emotion
  const detail = getBlogDetail(blog)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {isLoading ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
          {/* layout 2 คอลัมน์: เนื้อหาหลัก + author card ด้านขวา */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            <article>
              <img
                src={blog.image}
                alt=""
                className="aspect-4/3 w-full rounded-2xl object-cover"
              />

              <div className="mt-6 flex items-center gap-4">
                <span className="rounded-full bg-[#D7F2E9] px-3 py-1 text-xs font-medium text-[#128279]">
                  {blog.tag}
                </span>
                <time className="text-sm text-[#75716B]" dateTime={blog.date}>
                  {blog.date}
                </time>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {blog.title}
              </h1>

              {/* มือถือ: แสดง author card ใต้หัวข้อ */}
              <div className="mt-8 lg:hidden">
                <AuthorCard />
              </div>

              <BlogContent
                intro={detail.intro}
                sectionsBeforeImage={detail.sectionsBeforeImage}
                sectionsAfterImage={detail.sectionsAfterImage}
                image={blog.image}
              />

              <BlogInteraction initialCount={detail.emotionCount} />
              <CommentSection initialComments={detail.comments} />
            </article>

            {/* desktop: author card ติดขวาและเลื่อนตามจอ */}
            <aside className="hidden lg:block">
              <AuthorCard className="sticky top-24" />
            </aside>
          </div>
        </main>
      )}

      <Footer />
    </div>
  )
}
