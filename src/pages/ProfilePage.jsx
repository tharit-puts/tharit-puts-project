// หน้า Profile — แก้ name, username, รูปโปรไฟล์ (อีเมลแก้ไม่ได้)
// เชื่อมกับ: NavBar (Profile menu), AuthContext, authApi
import { useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { RotateCcw, User } from 'lucide-react'
import { toast } from 'sonner'
import { NavBar } from '@/components/NavBar'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useAuth } from '@/contexts/AuthContext'
import { maskEmail } from '@/services/authApi'
import defaultAvatar from '@/assets/defaultAvatar.png'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

const sidebarItemClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#43403B]'

export function ProfilePage() {
  const location = useLocation()
  const { user, updateProfile } = useAuth()
  const isLoading = usePageLoading([location.pathname])
  const fileInputRef = useRef(null)

  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [isSaving, setIsSaving] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const savedDisplayName = user.name || user.username || 'Member'
  const savedAvatarSrc = user.avatar || defaultAvatar
  const formAvatarSrc = avatar || defaultAvatar

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)

    try {
      updateProfile({ name, username, avatar })
      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated',
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {isLoading ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            {/* เมนูด้านซ้าย + หัวข้อ */}
            <aside>
              <div className="mb-6 flex items-center gap-3">
                <img
                  src={savedAvatarSrc}
                  alt={savedDisplayName}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h1 className="text-xl text-foreground md:text-2xl">
                  <span className="font-normal">{savedDisplayName}</span>{' '}
                  <span className="font-normal text-[#75716B]">|</span>{' '}
                  <span className="font-bold">Profile</span>
                </h1>
              </div>

              <nav className="flex flex-col gap-1">
                <span
                  className={`${sidebarItemClassName} font-semibold text-foreground`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </span>
                <span className={`${sidebarItemClassName} text-[#75716B]`}>
                  <RotateCcw className="h-4 w-4" />
                  Reset password
                </span>
              </nav>
            </aside>

            {/* ฟอร์มแก้ไข profile */}
            <div>
              <div className="rounded-2xl bg-[#EFEEEB] px-6 py-8 md:px-10 md:py-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <img
                      src={formAvatarSrc}
                      alt={name || savedDisplayName}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      className="rounded-full border-[#75716B] px-6 py-5 text-sm font-medium"
                    >
                      Upload profile picture
                    </Button>
                  </div>

                  <hr className="border-[#DAD6D1]" />

                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={`mt-2 ${inputClassName}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className={`mt-2 ${inputClassName}`}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#75716B]">Email</p>
                    <p className="mt-2 text-base font-medium text-[#75716B]">
                      {maskEmail(user.email ?? '')}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 w-full rounded-full text-base font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
