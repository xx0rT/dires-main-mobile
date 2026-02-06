import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface CoursesHeroProps {
  className?: string
}

const CoursesHero = ({ className }: CoursesHeroProps) => {
  return (
    <div className={cn(className)}>
      <h1 className="text-4xl font-medium sm:text-6xl md:text-7xl">
        Video Balicky
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Kazdy balicek obsahuje sadu videi. Zakupte si balicek jednorazove a ziskejte pristup ke vsem videim uvnitr.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <a
          href="#courses"
          className="group relative isolate overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-7 lg:row-span-2"
        >
          <img
            src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fyzioterapie kurzy"
            className="size-full max-h-[550px] object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
            <Badge className="w-fit border border-background/20 bg-background/15 backdrop-blur-sm">
              <Sparkles className="size-4" />
              Doporuceny balicek
            </Badge>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-background">
                Kompletni kurzy fyzioterapie pro vasi praxi
              </h2>
              <div className="flex items-center gap-2">
                <time className="text-sm text-background/80">
                  Nove aktualizovano
                </time>
                <div className="flex items-center -space-x-2">
                  <Avatar className="size-6 border border-primary">
                    <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  </Avatar>
                  <Avatar className="size-6 border border-primary">
                    <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  </Avatar>
                  <span className="z-10 grid size-6 place-items-center rounded-full border border-primary bg-primary/90 text-xs text-background backdrop-blur-sm">
                    +5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
        <div className="flex flex-col gap-4 lg:col-span-5 lg:row-span-2 lg:flex-col">
          <a
            href="#courses"
            className="group relative isolate overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5"
          >
            <img
              src="https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Rehabilitace"
              className="size-full max-h-[267px] object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
              <Badge className="w-fit border border-background/20 bg-background/15 backdrop-blur-sm">
                Populární
              </Badge>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-background">
                  Rehabilitacni techniky pro kazdy den
                </h2>
                <div className="flex items-center gap-2">
                  <time className="text-sm text-background/80">
                    Nejnovejsi
                  </time>
                  <Avatar className="size-6 border border-primary">
                    <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  </Avatar>
                </div>
              </div>
            </div>
          </a>
          <a
            href="#courses"
            className="group relative isolate overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5"
          >
            <img
              src="https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Pokrocile techniky"
              className="size-full max-h-[267px] object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
              <Badge className="w-fit border border-background/20 bg-background/15 backdrop-blur-sm">
                Pokrocile
              </Badge>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-background">
                  Pokrocile fyzioterapeuticke postupy a metody
                </h2>
                <div className="flex items-center gap-2">
                  <time className="text-sm text-background/80">
                    Aktualizovano
                  </time>
                  <Avatar className="size-6 border border-primary">
                    <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  </Avatar>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export { CoursesHero }
