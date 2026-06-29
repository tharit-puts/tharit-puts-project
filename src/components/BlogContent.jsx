function BlogSection({ index, section }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-foreground">
        {index}. {section.title}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="mt-4 text-base leading-relaxed text-[#43403B]"
        >
          {paragraph}
        </p>
      ))}

      {section.bullets && (
        <ul className="mt-4 space-y-4">
          {section.bullets.map((bullet) => (
            <li
              key={bullet.label}
              className="text-base leading-relaxed text-[#43403B]"
            >
              <span className="font-bold">{bullet.label}:</span> {bullet.text}
            </li>
          ))}
        </ul>
      )}

      {section.closing && (
        <p className="mt-4 text-base leading-relaxed text-[#43403B]">
          {section.closing}
        </p>
      )}
    </div>
  )
}

export function BlogContent({ intro, sectionsBeforeImage, sectionsAfterImage, image }) {
  return (
    <div>
      <p className="mt-6 text-base leading-relaxed text-[#43403B]">{intro}</p>

      {sectionsBeforeImage.map((section, index) => (
        <BlogSection key={section.title} index={index + 1} section={section} />
      ))}

      <img
        src={image}
        alt=""
        className="mt-10 aspect-4/3 w-full rounded-2xl object-cover"
      />

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
