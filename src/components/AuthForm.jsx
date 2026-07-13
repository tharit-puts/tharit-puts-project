// ชิ้นส่วน UI ร่วมสำหรับหน้า Login และ Sign up

// style ของ input ทุกช่องในฟอร์ม auth
const inputClassName =
  'w-full rounded-xl border border-[#DAD6D1] bg-white px-4 py-3 text-sm text-foreground placeholder:text-[#75716B] outline-none focus:border-[#75716B]'

// ช่องกรอกข้อมูล 1 ช่อง (มี label + input)
export function AuthInput({ id, label, type = 'text', placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`mt-2 ${inputClassName}`}
      />
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
