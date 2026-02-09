import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const blogPosts = [
  {
    id: 1,
    title: "Fyzioterapie pro sportovce",
    date: "15. Leden 2025",
    description:
      "Objevte nejnovejsi metody fyzioterapie specificky navrzene pro sportovce. Zotaveni po urazech, prevence zraneni a optimalizace vykonu.",
    image: "https://images.pexels.com/photos/7662865/pexels-photo-7662865.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Fyzioterapeut pracujici se sportovcem",
    href: "#",
  },
  {
    id: 2,
    title: "Rehabilitace bolesti zad",
    date: "22. Leden 2025",
    description:
      "Komplexni pruvodce lecbou a prevenci bolesti zad. Cviceni, manualni terapie a moderni pristup k rehabilitaci patere.",
    image: "https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Lecba bolesti zad",
    href: "#",
  },
  {
    id: 3,
    title: "Moderni metody fyzioterapie",
    date: "5. Unor 2025",
    description:
      "Prozkoumejte nejnovejsi trendy ve fyzioterapii - od suchych jehlani pres kinesiotaping az po virtualni realitu v rehabilitaci.",
    image: "https://images.pexels.com/photos/5793641/pexels-photo-5793641.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageAlt: "Moderni fyzioterapeuticke zarizeni",
    href: "#",
  },
];

interface Blog30Props {
  className?: string;
}

const Blog30 = ({ className }: Blog30Props) => {
  return (
    <section className={cn("bg-background py-16 px-6 md:px-12 lg:px-20", className)}>
      <div className="container max-w-6xl mx-auto">
        <h1 className="mb-8 max-w-lg font-sans text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Objevte naše články
        </h1>

        <div className="flex flex-col gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex flex-col items-center gap-8 md:flex-row"
            >
              <div className="flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl bg-muted md:w-140">
                <img
                  src={post.image}
                  className="h-full w-full object-cover"
                  alt={post.imageAlt}
                />
              </div>
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <div
                    className={cn(
                      "mb-5 flex h-90 items-start border-b py-10 md:mb-0 lg:gap-32",
                      index === 0 && "md:border-t",
                    )}
                  >
                    <div className="flex h-full w-full flex-col items-start justify-between pr-8">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                        {post.date}
                      </p>
                    </div>
                    <div className="flex h-full w-full flex-col items-start justify-between gap-6">
                      <p className="text-lg leading-relaxed font-normal tracking-tight text-muted-foreground md:text-xl">
                        {post.description}
                      </p>
                      <Button
                        variant="ghost"
                        className="inline-flex items-center justify-center gap-4 px-0 text-primary transition-all ease-in-out hover:gap-6 hover:text-accent-foreground"
                      >
                        <a
                          href={post.href}
                          className="text-lg font-semibold tracking-tight"
                        >
                          Cist dale
                        </a>
                        <ArrowRightIcon />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog30 };
