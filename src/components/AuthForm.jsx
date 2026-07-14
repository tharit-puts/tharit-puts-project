// ชิ้นส่วน UI ร่วมสำหรับหน้า Login และ Sign up

// style ของ input ทุกช่องในฟอร์ม auth
const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

const inputErrorClassName =
  'border-red-500 text-red-500 placeholder:text-red-500 focus:border-red-500'

// ช่องกรอกข้อมูล 1 ช่อง (มี label + input)
export function AuthInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  invalid,
}) {
  const hasErrorStyle = Boolean(error || invalid)

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        {...(onBlur ? { onBlur } : {})}
        aria-invalid={hasErrorStyle}
        className={`mt-2 ${inputClassName} ${hasErrorStyle ? inputErrorClassName : ''}`}
      />
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}

// กล่องครอบฟอร์มทั้งหมด พร้อมหัวข้อตรงกลาง
export function AuthFormCard({ title, children }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-[#EFEEEB] px-8 py-10">
      <h1 className="text-center text-3xl font-bold text-foreground">{title}</h1>
      <div className="mt-8 space-y-5">{children}</div>
    </div>
  )
}
