import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

interface CaseStudyItem {
  logo: string;
  company: string;
  tags: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface CaseStudies3Props {
  featuredCasestudy?: CaseStudyItem;
  casestudies?: CaseStudyItem[];
  className?: string;
}

const CaseStudies3 = ({
  featuredCasestudy,
  casestudies,
  className,
}: CaseStudies3Props) => {
  const navigate = useNavigate();

  if (!featuredCasestudy || !casestudies) {
    return null;
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto flex justify-center">
        <div className="border border-sky-200/60 dark:border-sky-800/30 max-w-7xl w-full">
          <div
            onClick={() => featuredCasestudy.link && navigate(featuredCasestudy.link)}
            className="group grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out hover:bg-sky-50/40 dark:hover:bg-sky-950/20 lg:grid-cols-2 xl:px-28 cursor-pointer"
          >
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <img src={featuredCasestudy.logo} alt="logo" className="h-9" />
                {featuredCasestudy.company}
              </div>
              <div>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {featuredCasestudy.tags}
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                  {featuredCasestudy.title}
                  <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                    {" "}
                    {featuredCasestudy.subtitle}
                  </span>
                </h2>
                <div className="flex items-center gap-2 font-medium">
                  Přečíst článek
                  <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-border bg-background p-2">
                <div className="h-full overflow-hidden">
                  <img
                    src={featuredCasestudy.image}
                    alt="placeholder"
                    className="aspect-14/9 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t border-sky-200/60 dark:border-sky-800/30">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2">
              {casestudies.map((item, idx) => (
                <div
                  key={item.company}
                  onClick={() => item.link && navigate(item.link)}
                  className={`group flex flex-col justify-between gap-12 border-sky-200/60 dark:border-sky-800/30 bg-background px-6 py-8 transition-colors duration-500 ease-out hover:bg-sky-50/40 dark:hover:bg-sky-950/20 md:py-16 lg:pb-16 xl:gap-16 cursor-pointer ${
                    idx === 0
                      ? "xl:border-l xl:pl-8"
                      : "border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8"
                  }`}
                >
                  <div className="flex items-center gap-2 text-2xl font-medium">
                    <img src={item.logo} alt="logo" className="h-9" />
                    {item.company}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {item.tags}
                    </span>
                    <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                      {item.title}
                      <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                        {" "}
                        {item.subtitle}
                      </span>
                    </h2>
                    <div className="flex items-center gap-2 font-medium">
                      Přečíst článek
                      <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CaseStudies3 };
