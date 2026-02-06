import { ArrowRight } from 'lucide-react'
import { Fragment } from 'react'

import { cn } from '@/lib/utils'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const news = [
  {
    title: 'Novy balicek: Pokrocile rehabilitacni techniky',
    category: 'Novinka',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '6. unor 2026',
    link: '#',
  },
  {
    title: 'Aktualizace obsahu: Zaklady fyzioterapie',
    category: 'Aktualizace',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '1. unor 2026',
    link: '#',
  },
  {
    title: 'Spolupraca s odborniky na sportovni medicinu',
    category: 'Partnerstvi',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '28. leden 2026',
    link: '#',
  },
  {
    title: 'Nove studijni materialy ke stazeni pro vsechny kurzy',
    category: 'Novinka',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '20. leden 2026',
    link: '#',
  },
  {
    title: 'Pripravujeme certifikacni program pro absolventy',
    category: 'Oznameni',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    date: '15. leden 2026',
    link: '#',
  },
]

interface CoursesNewsProps {
  className?: string
}

const CoursesNews = ({ className }: CoursesNewsProps) => {
  return (
    <section className={cn('py-32', className)}>
      <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
        <div className="flex w-full max-w-56 items-center gap-3 text-sm">
          <span className="size-2 rounded-full bg-primary" />
          Novinky
        </div>
        <div className="flex-1">
          <h2 className="text-3xl">
            Zustan v obraze
            <br />
            <span className="text-primary/50">
              Posledni aktualizace a novinky.
            </span>
          </h2>
          <div className="mt-14">
            <Separator />
            {news.map((item, idx) => (
              <Fragment key={idx}>
                <a
                  href={item.link}
                  className="group flex flex-col justify-between gap-10 py-6 transition-all duration-400 lg:flex-row lg:items-center lg:hover:bg-muted"
                >
                  <div className="flex items-center gap-2 text-lg transition-all duration-400 lg:group-hover:translate-x-8">
                    <p className="inline text-pretty text-primary">
                      {item.title}
                      <ArrowRight className="ml-2 inline size-4 shrink-0 opacity-0 transition-all duration-400 lg:group-hover:text-primary lg:group-hover:opacity-100" />
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between transition-all duration-400 lg:max-w-72 lg:group-hover:-translate-x-4 xl:max-w-80">
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 rounded-full border border-border">
                        <AvatarImage src={item.avatar} />
                      </Avatar>
                      <time className="text-xs text-muted-foreground">
                        {item.date}
                      </time>
                    </div>
                  </div>
                </a>
                <Separator />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { CoursesNews }
