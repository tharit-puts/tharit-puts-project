// ค่า delay และ helper สำหรับ Loading state
// เชื่อมกับ: hooks/usePageLoading.js
export const LOADING_DELAY = {
  search: 500,
  filter: 600,
  viewMore: 1000,
  page: 800, // delay เริ่มต้นของ usePageLoading
}

// รอ X มิลลิวินาที — ใช้ใน usePageLoading ก่อนซ่อน Loading
export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
