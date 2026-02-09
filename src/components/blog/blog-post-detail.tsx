import {
  ArrowUp,
  Clock,
  Facebook,
  Home,
  Instagram,
  Lightbulb,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BlogPostDetailProps {
  className?: string;
}

const BlogPostDetail = ({ className }: BlogPostDetailProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    const sections = Object.keys(sectionRefs.current);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    let observer: IntersectionObserver | null = new IntersectionObserver(
      observerCallback,
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      },
    );

    sections.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        observer?.observe(element);
      }
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, []);

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref;
    }
  };

  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Jak získat maximální výsledky z fyzioterapie</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-7 mb-6 max-w-3xl text-3xl font-semibold md:text-5xl">
          Jak získat maximální výsledky z fyzioterapie v roce 2025
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100" />
          </Avatar>
          <span>
            <a href="#" className="font-medium">
              MUDr. Jana Nováková
            </a>
            <span className="ml-1 text-muted-foreground">
              15. ledna 2025
            </span>
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            10 min
          </span>
        </div>
        <Separator className="mt-8 mb-12" />
        <div className="relative grid grid-cols-12 gap-6 lg:grid">
          <div className="col-span-12 lg:col-span-8">
            <div>
              <h3 className="mt-3 text-xl font-semibold">
                Co je moderní fyzioterapie a proč je důležitá?
              </h3>
              <p className="mt-2 text-lg text-muted-foreground">
                Moderní fyzioterapie kombinuje tradiční metody s nejnovějšími poznatky z oboru rehabilitace a sportovní medicíny. Personalizovaný přístup k léčbě zajišťuje, že každý pacient dostane péči šitou na míru jeho potřebám. Díky této individuální péči lze dosáhnout výrazně lepších výsledků než při standardizovaném přístupu.
              </p>
            </div>
            <section
              id="section1"
              ref={(ref) => addSectionRef("section1", ref)}
              className="my-8 prose dark:prose-invert"
            >
              <h2>Jak funguje personalizovaná péče</h2>
              <p>
                Základem úspěšné fyzioterapie je{" "}
                <a href="#">důkladné vstupní vyšetření</a>, které pomáhá identifikovat příčiny problémů a nastavit optimální léčebný plán.
              </p>
              <blockquote>
                &ldquo;Každý pacient je jedinečný a vyžaduje individuální přístup. Neexistuje univerzální řešení, které by fungovalo pro všechny.&rdquo;
              </blockquote>
              <p>
                Důležitou součástí léčby je aktivní spolupráce pacienta. Domácí cvičení a dodržování doporučení terapeuta jsou klíčové pro dosažení optimálních výsledků.
              </p>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Důležité upozornění</AlertTitle>
                <AlertDescription>
                  Pravidelnost a důslednost v domácím cvičení jsou stejně důležité jako terapeutické návštěvy
                </AlertDescription>
              </Alert>
            </section>

            <section
              id="section2"
              ref={(ref) => addSectionRef("section2", ref)}
              className="prose mb-8 dark:prose-invert"
            >
              <h2>Nejčastější chyby při fyzioterapii</h2>
              <p>
                Mnozí pacienti dělají při fyzioterapii běžné chyby, které mohou zpomalit nebo úplně zastavit proces zotavení. Znalost těchto úskalí vám pomůže je vyhnout.
              </p>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Chyba</th>
                      <th>Správný přístup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nepravidelné návštěvy</td>
                      <td>Dodržování plánu terapie</td>
                    </tr>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      <td>Nedostatečné domácí cvičení</td>
                      <td>Pravidelná denní rutina</td>
                    </tr>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      <td>Předčasné ukončení</td>
                      <td>Dokončení celého plánu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Pacienti, kteří se vyhnou těmto chybám a důsledně spolupracují s fyzioterapeutem, dosahují výrazně lepších a trvalejších výsledků.
              </p>
            </section>

            <section
              id="section3"
              ref={(ref) => addSectionRef("section3", ref)}
              className="prose mb-8 dark:prose-invert"
            >
              <h2>Moderní technologie ve fyzioterapii</h2>
              <p>
                Současná fyzioterapie využívá{" "}
                <a href="#">řadu moderních technologií</a>, které pomáhají urychlit proces zotavení a zlepšit výsledky léčby.
              </p>
              <blockquote>
                &ldquo;Kombinace tradičních metod s moderními technologiemi přináší pacientům to nejlepší z obou světů.&rdquo;
              </blockquote>
              <p>
                Mezi nejpoužívanější metody patří:
              </p>
              <ul>
                <li>Rázová vlna pro léčbu chronických bolestí</li>
                <li>Elektroterapie pro urychlení hojení tkání</li>
                <li>Kineziotaping pro podporu pohybového aparátu</li>
                <li>Laserterapie pro protizánětlivý účinek</li>
              </ul>
              <p>
                Tyto moderní metody v kombinaci s klasickou manuální terapií a cvičením poskytují komplexní péči, která vede k optimálním výsledkům.
              </p>
            </section>
          </div>
          <div className="sticky top-8 col-span-3 col-start-10 hidden h-fit lg:block">
            <span className="text-lg font-medium">Na této stránce</span>
            <nav className="mt-4 text-sm">
              <ul className="space-y-1">
                <li>
                  <a
                    href="#section1"
                    className={cn(
                      "block py-1 transition-colors duration-200",
                      activeSection === "section1"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    Jak funguje personalizovaná péče
                  </a>
                </li>
                <li>
                  <a
                    href="#section2"
                    className={cn(
                      "block py-1 transition-colors duration-200",
                      activeSection === "section2"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    Nejčastější chyby při fyzioterapii
                  </a>
                </li>
                <li>
                  <a
                    href="#section3"
                    className={cn(
                      "block py-1 transition-colors duration-200",
                      activeSection === "section3"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    Moderní technologie ve fyzioterapii
                  </a>
                </li>
              </ul>
            </nav>
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Sdílet článek</p>
              <ul className="flex gap-2">
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Zpět nahoru
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BlogPostDetail };
