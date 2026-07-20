// ฟิลด์ฟอร์มบทความ — ใช้ร่วมกันระหว่าง Create / Edit article
import { ChevronDown, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

export const categoryOptions = ['Cat', 'Inspiration', 'General']
export const INTRO_MAX_LENGTH = 120

export function ArticleFormFields({
  fileInputRef,
  thumbnail,
  onUploadClick,
  onFileChange,
  category,
  onCategoryChange,
  author,
  title,
  onTitleChange,
  introduction,
  onIntroductionChange,
  content,
  onContentChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground">Thumbnail image</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex h-40 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#DAD6D1] bg-[#F9F8F6]">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Article thumbnail preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-[#DAD6D1]" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onUploadClick}
              className="rounded-full border-[#75716B] px-6 py-5 text-sm font-medium"
            >
              Upload thumbnail image
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium text-foreground">
          Category
        </label>
        <div className="relative mt-2">
          <select
            id="category"
            value={category}
            onChange={onCategoryChange}
            className={`${inputClassName} appearance-none pr-10 text-[#43403B]`}
          >
            <option value="">Select category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#75716B]" />
        </div>
      </div>

      <div>
        <label htmlFor="author" className="text-sm font-medium text-foreground">
          Author name
        </label>
        <input
          id="author"
          type="text"
          value={author}
          readOnly
          className={`mt-2 ${inputClassName} bg-[#F9F8F6] text-[#75716B]`}
        />
      </div>

      <div>
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="Article title"
          className={`mt-2 ${inputClassName}`}
        />
      </div>

      <div>
        <label htmlFor="introduction" className="text-sm font-medium text-foreground">
          Introduction (max 120 letters)
        </label>
        <textarea
          id="introduction"
          value={introduction}
          onChange={onIntroductionChange}
          placeholder="Introduction"
          rows={4}
          maxLength={INTRO_MAX_LENGTH}
          className={`mt-2 ${inputClassName} resize-y`}
        />
        <p className="mt-1 text-right text-xs text-[#75716B]">
          {introduction.length}/{INTRO_MAX_LENGTH}
        </p>
      </div>

      <div>
        <label htmlFor="content" className="text-sm font-medium text-foreground">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={onContentChange}
          placeholder="Content"
          rows={12}
          className={`mt-2 ${inputClassName} resize-y`}
        />
      </div>
    </div>
  )
}
