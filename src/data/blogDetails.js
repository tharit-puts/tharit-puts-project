// ข้อมูล mock สำหรับ comments และเนื้อหาบทความ
// เชื่อมกับ: BlogDetailPage (pickComments), getBlogDetail (legacy)
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

function getEmotionCount(blogId) {
  const random = seededRandom(blogId * 3571);
  return Math.floor(random() * 400) + 120;
}

// ส่วนเนื้อหาตัวอย่างแยกตามหมวด — getBlogDetail ใช้เมื่อไม่ได้ดึงจาก API
const catSectionTemplates = [
  {
    title: "Independent Yet Affectionate",
    paragraphs: [
      "One of the most charming aspects of cats is their ability to balance independence with affection. Unlike dogs, who often rely on constant attention, cats enjoy their alone time but will seek out their owners when they want companionship.",
      "They may curl up on your lap for a cozy nap or nuzzle against you when they feel like showing love. This duality makes cats perfect for people who appreciate a pet that respects personal space but still offers plenty of affection.",
    ],
  },
  {
    title: "Playful Personalities",
    paragraphs: [
      "Cats are naturally curious and playful creatures. From kittens to adult cats, they enjoy engaging in activities that stimulate their minds and bodies.",
      "Whether it's chasing a feather toy, pouncing on a moving shadow, or exploring a new cardboard box, their playfulness is a joy to watch. Play is not just fun for cats—it's essential for their physical and mental health.",
    ],
  },
  {
    title: "Communication Through Body Language",
    paragraphs: [
      "Cats are master communicators, though they often use subtle body language rather than vocalizations. Understanding these cues can help you build a stronger bond with your feline friend.",
    ],
    bullets: [
      {
        label: "Purring",
        text: "Often a sign of contentment, though cats may also purr when anxious or in pain.",
      },
      {
        label: "Tail Position",
        text: "A tail held high usually indicates a happy, confident cat, while a puffed-up tail signals fear or aggression.",
      },
      {
        label: "Slow Blinks",
        text: 'When a cat slowly blinks at you, it\'s a sign of trust and affection—often called a "cat kiss."',
      },
    ],
    closing:
      "By learning to interpret these signals, you can better understand your cat's needs and emotions, leading to a more harmonious relationship.",
  },
  {
    title: "Health Benefits of Having a Cat",
    paragraphs: [
      "Did you know that owning a cat can be good for your health? Studies have shown that petting a cat can reduce stress and lower blood pressure. The calming sound of a cat's purr is often associated with relaxation and well-being.",
      "Additionally, the companionship of a cat can help combat loneliness, providing emotional support to their owners. People who live with cats may also experience reduced feelings of anxiety and depression, thanks to the comfort and companionship these animals provide.",
    ],
  },
  {
    title: "A History with Humans",
    paragraphs: [
      "Cats were first domesticated in the Near East around 9,000 years ago, likely because they were excellent at catching rodents that threatened food supplies. Over time, their relationship with humans evolved from pest control to companionship.",
      "In ancient Egypt, cats were revered and even worshipped. Killing a cat, even accidentally, was punishable by death, and families often mummified their cats to honor them after death. Today, while not seen as divine figures, cats remain cherished members of the family.",
    ],
  },
];

const inspirationSectionTemplates = [
  {
    title: "Start with Small, Achievable Goals",
    paragraphs: [
      "When life feels overwhelming, breaking challenges into smaller steps makes progress feel possible. Instead of focusing on the entire mountain ahead, identify one action you can take today.",
      "Each small win builds momentum and reminds you that forward movement is always within reach, even during difficult seasons.",
    ],
  },
  {
    title: "Practice Mindfulness Daily",
    paragraphs: [
      "Mindfulness helps anchor you in the present moment rather than worrying about the past or future. Even five minutes of quiet breathing can reset your perspective.",
      "Try pairing mindfulness with a daily routine—morning coffee, an evening walk, or a few minutes before bed—to make it a sustainable habit.",
    ],
  },
  {
    title: "Build a Supportive Environment",
    paragraphs: [
      "Your surroundings shape your mindset more than you might realize. Creating spaces that inspire calm and clarity can make staying motivated significantly easier.",
    ],
    bullets: [
      {
        label: "Declutter",
        text: "A tidy space reduces mental noise and helps you focus on what matters most.",
      },
      {
        label: "Visual Reminders",
        text: "Place quotes, photos, or notes that reflect your goals where you'll see them daily.",
      },
      {
        label: "Limit Distractions",
        text: "Identify what pulls your attention away and set gentle boundaries to protect your focus.",
      },
    ],
    closing:
      "When your environment supports your intentions, staying inspired becomes less of a struggle and more of a natural rhythm.",
  },
  {
    title: "Embrace Setbacks as Learning",
    paragraphs: [
      "Setbacks are not failures—they are feedback. Every obstacle teaches you something about your limits, your priorities, and your capacity to adapt.",
      "Reframing challenges as opportunities for growth keeps you moving forward with resilience rather than discouragement.",
    ],
  },
  {
    title: "Celebrate Progress Along the Way",
    paragraphs: [
      "Waiting until the finish line to acknowledge your effort can drain motivation over time. Celebrate milestones, no matter how small they seem.",
      "Recognizing how far you've come reinforces the belief that you are capable of continuing—and that the journey itself has value.",
    ],
  },
];

const generalSectionTemplates = [
  {
    title: "Understanding the Basics",
    paragraphs: [
      "Every great outcome starts with a solid foundation. Taking time to understand the fundamentals ensures that your efforts are focused and effective.",
      "Whether you're caring for a pet or building a new habit, clarity about the basics prevents costly mistakes down the road.",
    ],
  },
  {
    title: "Practical Tips for Everyday Life",
    paragraphs: [
      "Theory is helpful, but daily practice is what creates real change. Small, consistent actions compound over time into meaningful results.",
      "Look for opportunities to apply what you learn in ordinary moments—these are often where the biggest improvements happen.",
    ],
  },
  {
    title: "Common Questions Answered",
    paragraphs: [
      "Many people share similar concerns when starting something new. Addressing these questions upfront saves time and builds confidence.",
    ],
    bullets: [
      {
        label: "How often?",
        text: "Consistency matters more than perfection—find a rhythm that works for your lifestyle.",
      },
      {
        label: "What if I make mistakes?",
        text: "Mistakes are part of learning. Adjust and keep going rather than giving up entirely.",
      },
      {
        label: "When will I see results?",
        text: "Progress varies, but patience paired with steady effort almost always pays off.",
      },
    ],
    closing:
      "Having honest answers to common questions helps you stay on track without unnecessary second-guessing.",
  },
  {
    title: "Long-Term Benefits",
    paragraphs: [
      "The rewards of thoughtful effort often extend far beyond the immediate goal. Building good practices creates habits that serve you for years.",
      "Investing time now in understanding and applying these principles sets you up for lasting success and satisfaction.",
    ],
  },
  {
    title: "Taking the Next Step",
    paragraphs: [
      "Knowledge alone is not enough—action transforms understanding into experience. Choose one idea from this article and put it into practice this week.",
      "The best time to start is now. Small steps taken today become the foundation for everything you want to achieve tomorrow.",
    ],
  },
];

const blog2Content = {
  intro:
    "Cats have captivated human hearts for thousands of years. Whether lounging in a sunny spot or playfully chasing a string, these furry companions bring warmth and joy to millions of homes. But what makes cats so special? Let's dive into the unique traits, behaviors, and quirks that make cats endlessly fascinating.",
  sectionsBeforeImage: catSectionTemplates.slice(0, 3),
  sectionsAfterImage: catSectionTemplates.slice(3),
};

function getTemplatesByCategory(category) {
  if (category === "Inspiration") return inspirationSectionTemplates;
  if (category === "General") return generalSectionTemplates;
  return catSectionTemplates;
}

function buildIntro(title, excerpt, category) {
  if (category === "Cat") {
    return `${excerpt.replace(/\.\.\.$/, ".")} But what makes this topic so special? Let's explore the unique traits, behaviors, and insights that make ${title.toLowerCase().includes("cat") ? "cats" : "this subject"} endlessly fascinating.`;
  }
  if (category === "Inspiration") {
    return `${excerpt.replace(/\.\.\.$/, ".")} This article explores practical ideas and mindset shifts to help you stay inspired and move forward with purpose.`;
  }
  return `${excerpt.replace(/\.\.\.$/, ".")} Here is a thoughtful guide to help you understand the essentials and apply them in your everyday life.`;
}

// สร้างเนื้อหาเต็มของบทความจากข้อมูล static — ใช้กับ blogs.js (legacy)
export function getBlogDetail(blog) {
  if (blog.id === 2) {
    return {
      intro: blog2Content.intro,
      sectionsBeforeImage: blog2Content.sectionsBeforeImage,
      sectionsAfterImage: blog2Content.sectionsAfterImage,
      emotionCount: getEmotionCount(blog.id),
      comments: pickComments(blog.id),
    };
  }

  const templates = getTemplatesByCategory(blog.category);

  return {
    intro: buildIntro(blog.title, blog.excerpt, blog.category),
    sectionsBeforeImage: templates.slice(0, 3),
    sectionsAfterImage: templates.slice(3),
    emotionCount: getEmotionCount(blog.id),
    comments: pickComments(blog.id),
  };
}
