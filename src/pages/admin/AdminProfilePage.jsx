// หน้า Admin Profile — แก้ไขข้อมูลโปรไฟล์ admin (name, username, email, bio, avatar)
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getProfile, updateProfile } from '@/services/adminProfile'
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
  const [profile] = useState(() => getProfile())

  const [name, setName] = useState(profile.name)
  const [username, setUsername] = useState(profile.username)
  const [email, setEmail] = useState(profile.email)
  const [bio, setBio] = useState(profile.bio)
  const [avatar, setAvatar] = useState(profile.avatar)
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

  function handleSave() {
    setIsSaving(true)

    try {
      updateProfile({ name, username, email, bio, avatar })
      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated',
        classNames: successToastClassNames,
      })
    } catch (error) {
      console.error('Failed to update admin profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#EFEEEB] px-8 py-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <Button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="h-11 rounded-full px-6 text-sm font-medium"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="max-w-2xl px-8 py-10">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`mt-2 ${inputClassName}`}
            />
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
