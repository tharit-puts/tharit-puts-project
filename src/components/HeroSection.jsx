import manWithCat from '@/assets/man-with-cat.jpg'

export function HeroSection() {
    return (
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-10 md:py-20 lg:gap-12">
          <div className="text-right">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Stay 
              <br/>
              Informed,
              <br/>
              Stay Inspired
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base font-medium">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
              Inspiration and Information.
            </p>
          </div>
  
          <div className="mx-auto w-full max-w-[280px] shrink-0 md:max-w-[360px]">
            <img
              src={manWithCat}
              alt="Thompson P. with a cat on his shoulder"
              className="aspect-3/4 w-full rounded-2xl object-cover"
            />
          </div>
  
          <div className="max-w-sm md:max-w-none">
            <p className="text-sm text-muted-foreground">-Author</p>
            <h2 className="text-[#43403B] mt-2 text-xl font-bold">Thompson P.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base font-medium">
              I am a pet enthusiast and freelance writer who specializes in animal
              behavior and care. With a deep love for cats, I enjoy sharing insights
              on feline companionship and wellness.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base font-medium">
              When i'm not writing, I spends time volunteering at my local
              animal shelter, helping cats find loving homes.
            </p>
          </div>
        </div>
      </section>
    )
  }
