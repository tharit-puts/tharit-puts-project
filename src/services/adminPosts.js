// สถานะบทความ — ตอนนี้เก็บอยู่ในคอลัมน์ status ของตาราง posts บน backend แล้ว
// จึงไม่ต้องมีสำเนาใน localStorage อีก เหลือแค่ตัวช่วยแปลงเป็นข้อความสำหรับแสดงผล
export function getStatusLabel(status) {
  return status === 'draft' ? 'Draft' : 'Published'
}
