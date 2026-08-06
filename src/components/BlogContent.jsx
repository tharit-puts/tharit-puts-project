// แสดงเนื้อหาบทความแบบมีหัวข้อตัวเลข ย่อหน้า และรูปซ้ำตรงกลาง
function BlogSection({ index, section }) {
  return (
    <div className="mt-10">
      {/* หัวข้อย่อย เช่น 1. Independent Yet Affectionate */}
      <h2 className="text-xl font-bold wrap-break-word text-foreground sm:text-2xl">
        {index}. {section.title}
      </h2>

      {/* ย่อหน้าปกติของหัวข้อนั้น */}
      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="mt-4 text-base leading-relaxed wrap-break-word text-[#43403B]"
        >
          {paragraph}
        </p>
      ))}

      {/* ถ้ามี bullet points ให้แสดงเป็น list */}
      {section.bullets && (
        <ul className="mt-4 space-y-4">
          {section.bullets.map((bullet) => (
            <li
              key={bullet.label}
              className="text-base leading-relaxed wrap-break-word text-[#43403B]"
            >
              <span className="font-bold">{bullet.label}:</span> {bullet.text}
            </li>
          ))}
        </ul>
      )}

      {/* ย่อหน้าปิดท้ายของหัวข้อ (ถ้ามี) */}
      {section.closing && (
        <p className="mt-4 text-base leading-relaxed wrap-break-word text-[#43403B]">
          {section.closing}
        </p>
      )}
    </div>
  )
}

export function BlogContent({ intro, sectionsBeforeImage, sectionsAfterImage, image }) {
  return (
    <div>
      {/* บทนำใต้หัวข้อหลัก */}
      <p className="mt-6 text-base leading-relaxed text-[#43403B]">{intro}</p>

      {/* หัวข้อ 1-3 ก่อนรูปที่สอง */}
      {sectionsBeforeImage.map((section, index) => (
        <BlogSection key={section.title} index={index + 1} section={section} />
      ))}

      {/* รูปซ้ำตรงกลางบทความ */}
      <img
        src={image}
        alt=""
        className="mt-10 aspect-4/3 w-full rounded-2xl object-cover"
      />

      {/* หัวข้อที่เหลือหลังรูป */}
      {sectionsAfterImage.map((section, index) => (
        <BlogSection
          key={section.title}
          index={index + sectionsBeforeImage.length + 1}
          section={section}
        />
      ))}
    </div>
  )
}
