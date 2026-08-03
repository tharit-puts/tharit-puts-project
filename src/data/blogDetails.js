// ข้อมูล mock สำหรับ comments — backend ยังไม่มีตาราง comments
// คอมเมนต์ตัวอย่างเก่า — หน้า BlogDetailPage ใช้ comments จาก backend แล้ว
// ไฟล์นี้เหลือไว้เป็นอ้างอิง ไม่ถูก import อีก
const commentPool = [
  {
    name: "Jacob Lash",
    text: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    date: "12 September 2024 at 18:30",
  },
  {
    name: "Ahri",
    text: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!",
    date: "12 September 2024 at 20:15",
  },
  {
    name: "Mimi mama",
    text: "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!",
    date: "13 September 2024 at 09:42",
  },
  {
    name: "Sarah K.",
    text: "Really well written and easy to follow. Shared this with my friends who just adopted their first cat!",
    date: "13 September 2024 at 14:20",
  },
  {
    name: "Tom W.",
    text: "The tips here are practical and thoughtful. I appreciate how much care went into explaining each point clearly.",
    date: "14 September 2024 at 11:05",
  },
  {
    name: "Luna",
    text: "As a new cat parent, this was exactly what I needed. Thank you for making complex topics so approachable!",
    date: "14 September 2024 at 16:48",
  },
  {
    name: "David Chen",
    text: "Great insights throughout. I bookmarked this to come back to whenever I have questions about my furry friend.",
    date: "15 September 2024 at 08:30",
  },
  {
    name: "Emma R.",
    text: "Love the depth of this post. Every section gave me something new to think about and try at home.",
    date: "15 September 2024 at 19:12",
  },
];

// สุ่มแบบ deterministic จาก seed — ได้ผลเหมือนเดิมทุกครั้งสำหรับ id เดียวกัน
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// สุ่ม 3 comments ตาม blog id — BlogDetailPage ส่งให้ CommentSection
export function pickComments(blogId) {
  const random = seededRandom(blogId * 7919)
  const shuffled = [...commentPool].sort(() => random() - 0.5)
  return shuffled.slice(0, 3)
}
