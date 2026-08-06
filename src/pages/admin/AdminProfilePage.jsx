// หน้า Admin Profile — แก้ไขข้อมูลโปรไฟล์ admin (name, username, email, bio, avatar)
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import defaultAvatar from '@/assets/defaultAvatar.png'

const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

const BIO_MAX_LENGTH = 120

const successToastClassNames = {
  toast: 'cn-toast !rounded-xl !border-[#12B279] !bg-[#12B279] !text-white',
  title: '!text-white !font-semibold',
  description: '!text-white/90',
  closeButton:
    '!absolute !right-3 !top-3 !left-auto !border-white/30 !bg-transparent !text-white hover:!bg-white/10',
}

export function AdminProfilePage() {
  const fileInputRef = useRef(null)
  // โปรไฟล์ admin คือบัญชีผู้ใช้ที่ login อยู่ ไม่ใช่ข้อมูลแยกใน localStorage อีกแล้ว
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const avatarSrc = avatar || defaultAvatar

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

  async function handleSave() {
    setIsSaving(true)

    try {
      // ไม่ส่ง email ไปด้วย เพราะ backend ไม่ให้เปลี่ยนอีเมล (เป็นตัวระบุตัวตนตอน login)
      await updateProfile({ name, username, bio, avatar })
      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated',
        classNames: successToastClassNames,
      })
    } catch (error) {
      console.error('Failed to update admin profile:', error)
      toast.error('Failed to save profile', { description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex shrink-0 flex-col gap-4 border-b border-[#EFEEEB] px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <Button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="h-11 w-full rounded-full px-6 text-sm font-medium sm:w-auto"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="max-w-2xl px-4 py-8 md:px-8 md:py-10">
        <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <img
              src={avatarSrc}
              alt={name}
              className="h-20 w-20 rounded-full object-cover"
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
            <label htmlFor="username" className="text-sm font-medium text-foreground">
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
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ''}
              readOnly
              className={`mt-2 ${inputClassName} bg-[#F9F8F6] text-[#75716B]`}
            />
            <p className="mt-1 text-xs text-[#75716B]">
              Email is used to log in and cannot be changed here.
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio (max 120 letters)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value.slice(0, BIO_MAX_LENGTH))}
              rows={4}
              maxLength={BIO_MAX_LENGTH}
              className={`mt-2 ${inputClassName} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-[#75716B]">
              {bio.length}/{BIO_MAX_LENGTH}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
