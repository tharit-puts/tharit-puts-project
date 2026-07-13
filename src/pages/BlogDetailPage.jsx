import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { AuthorCard } from '@/components/AuthorCard'
import { BlogContent } from '@/components/BlogContent'
import { BlogInteraction } from '@/components/BlogInteraction'
import { CommentSection } from '@/components/CommentSection'
import { Loading } from '@/components/Loading'
import { pickComments } from '@/data/blogDetails'
import {
  fetchPostById,
  formatPostDate,
  parsePostContent,
} from '@/services/postsApi'

export function BlogDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true)
      setIsNotFound(false)

      try {
        const data = await fetchPostById(id)
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch post:', error)
        setPost(null)
        setIsNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id])

  if (isNotFound) {
    return <Navigate to="/" replace />
  }

  const detail = post ? parsePostContent(post.description, post.content) : null
  const comments = post ? pickComments(post.id) : []

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {isLoading || !post || !detail ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            <article>
              <img
                src={post.image}
                alt=""
                className="aspect-4/3 w-full rounded-2xl object-cover"
              />

              <div className="mt-6 flex items-center gap-4">
                <span className="rounded-full bg-[#D7F2E9] px-3 py-1 text-xs font-medium text-[#128279]">
                  {post.category}
                </span>
                <time className="text-sm text-[#75716B]" dateTime={post.date}>
                  {formatPostDate(post.date)}
                </time>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {post.title}
              </h1>

              <div className="mt-8 lg:hidden">
                <AuthorCard />
              </div>

              <BlogContent
                intro={detail.intro}
                sectionsBeforeImage={detail.sectionsBeforeImage}
                sectionsAfterImage={detail.sectionsAfterImage}
                image={post.image}
              />

              <BlogInteraction initialCount={post.likes} />
              <CommentSection initialComments={comments} />
            </article>

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
