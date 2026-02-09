import { ArrowRight, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Blog12Props {
  className?: string;
}

const Blog12 = ({ className }: Blog12Props) => {
  return (
    <section className={cn("py-16 px-6 md:px-12 lg:px-20", className)}>
      <div className="container max-w-6xl mx-auto">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <Badge variant="outline" className="gap-1 py-1">
            <FileText className="h-full w-4" /> Náš Blog
          </Badge>
          <h1 className="text-3xl md:text-4xl font-semibold text-balance">
            Objevte nejnovější trendy ve fyzioterapii
          </h1>
          <p className="text-muted-foreground">
            Prozkoumejte náš blog s odbornými články, osobními úvahami a nápady pro váš profesní rozvoj.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a className="group rounded-xl border transition-all hover:shadow-lg hover:border-primary/50" href="/blog/jak-ziskat-maximalni-vysledky">
            <div className="p-2">
              <img
                src="https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fyzioterapie v praxi"
                className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 pt-2 pb-4">
              <h2 className="mb-1 font-medium">
                Jak ziskat maximalni vysledky z fyzioterapie v roce 2025
              </h2>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                Komplexni pruvodce modernimi pristup ke fyzioterapii. Personalizovane plany, pokrokove techniky a dlouhodobe vysledky.
              </p>
              <Separator className="my-5" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="MUDr. Jana Novakova"
                    />
                  </Avatar>
                  <span className="text-sm font-medium">MUDr. Jana Novakova</span>
                </div>
                <Badge variant="secondary" className="h-fit">
                  10 Min
                </Badge>
              </div>
            </div>
          </a>
          <a className="group rounded-xl border transition-all hover:shadow-lg hover:border-primary/50" href="/blog/rozdil-mezi-akutni-a-chronickou-bolesti">
            <div className="p-2">
              <img
                src="https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Diagnostika a lecba"
                className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 pt-2 pb-4">
              <h2 className="mb-1 font-medium">
                Rozdil mezi akutni a chronickou bolesti a jak ji leeit
              </h2>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                Pochopit typy bolesti je klicove pro ueinnou lecbu. Diagnostika, terapeuticke pristupy a prevence recidivy.
              </p>
              <Separator className="my-5" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Mgr. Petr Svoboda"
                    />
                  </Avatar>
                  <span className="text-sm font-medium">Mgr. Petr Svoboda</span>
                </div>
                <Badge variant="secondary" className="h-fit">
                  14 Min
                </Badge>
              </div>
            </div>
          </a>
          <a className="group rounded-xl border transition-all hover:shadow-lg hover:border-primary/50" href="/blog/optimalizace-vasi-rutiny">
            <div className="p-2">
              <img
                src="https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Prevence zraneni"
                className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 pt-2 pb-4">
              <h2 className="mb-1 font-medium">
                Optimalizace vasi rutiny pro zdravi pohyboveho aparatu
              </h2>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                Prakticke tipy pro kazdodenni peci o pohybovy aparat. Prevence bolesti, spravne drzeni tela a aktivni zivotni styl.
              </p>
              <Separator className="my-5" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Bc. Marketa Dvorakova"
                    />
                  </Avatar>
                  <span className="text-sm font-medium">Bc. Marketa Dvorakova</span>
                </div>
                <Badge variant="secondary" className="h-fit">
                  9 Min
                </Badge>
              </div>
            </div>
          </a>
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg" className="rounded-full">
            Všechny články <ArrowRight className="ml-2 h-full w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Blog12 };
