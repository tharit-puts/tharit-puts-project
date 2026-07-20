// ฟังก์ชันช่วยรวม className ของ Tailwind โดยไม่ให้ class ซ้ำกัน
// เชื่อมกับ: components/ui/* (button, dropdown-menu)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
