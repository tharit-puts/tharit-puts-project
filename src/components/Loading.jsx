export function Loading({ className = '' }) {
  return (
    <p
      className={`animate-pulse text-center text-base font-medium text-[#75716B] ${className}`}
    >
      Loading...
    </p>
  )
}
