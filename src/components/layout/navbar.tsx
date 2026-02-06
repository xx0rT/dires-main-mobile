import {
  Activity,
  BookOpen,
  Brain,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  GraduationCap,
  HandHeart,
  HeartPulse,
  LayoutGrid,
  MenuIcon,
  Sparkles,
  Stethoscope,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  forwardRef,
  Fragment,
  type MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { site } from "@/config/site";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface MenuLink {
  label?: string;
  description?: string;
  url: string;
  icon?: LucideIcon;
  image?: string;
  background?: string;
  company?: {
    logo: string;
    name: string;
  };
}

interface MenuGroup {
  title: string;
  links: MenuLink[];
}

interface MenuItem {
  id?: number;
  title: string;
  url?: string;
  links?: MenuLink[];
  featuredLinks?: MenuLink[];
  imageLink?: MenuLink;
  groupLinks?: MenuGroup[];
}

interface DesktopMenuItemProps {
  item: MenuItem;
  index: number;
}

interface MobileNavigationMenuProps {
  open: boolean;
}

type NavLinkProps = {
  link: MenuLink;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>;
};

const NAVIGATION: MenuItem[] = [
  {
    title: "Kurzy",
    id: 1,
    links: [
      {
        label: "Manualni terapie",
        icon: HandHeart,
        description:
          "Tradicni ceske techniky manualni terapie a mekkych tkani",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Sportovni rehabilitace",
        icon: Dumbbell,
        description:
          "Specializovane kurzy pro lecbu sportovnich zraneni a prevenci",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Neurologicka rehabilitace",
        icon: Brain,
        description:
          "Pokrocile techniky Vojtovy a Bobathovy metody",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Pediatricka fyzioterapie",
        icon: HeartPulse,
        description:
          "Specialni pristupy k detske rehabilitaci a vyvoji",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Ergonomie a prevence",
        icon: ClipboardList,
        description: "Kurzy zamerenych na prevenci a spravne drzeni tela",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Lecba bolesti",
        icon: Activity,
        description: "Moderni pristupy k managementu chronicke bolesti",
        url: "/courses",
        image:
          "https://images.pexels.com/photos/5473223/pexels-photo-5473223.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    title: "Sluzby",
    id: 2,
    featuredLinks: [
      {
        label: "Online vzdelavani",
        icon: Sparkles,
        description: "Pristup ke studijnim materialam kdykoliv a odkudkoliv",
        background:
          "https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=800",
        url: "/#services",
      },
      {
        label: "Certifikace",
        icon: GraduationCap,
        description: "Mezinarodne uznavane certifikaty pro fyzioterapeuty",
        background:
          "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800",
        url: "/#services",
      },
    ],
    links: [
      {
        label: "Individualni konzultace",
        icon: Stethoscope,
        description:
          "Osobni poradenstvi s nasimi odborniky pro vas profesni rust",
        url: "/#services",
      },
      {
        label: "Skupinove workshopy",
        icon: Users,
        description: "Prakticke workshopy v malych skupinach pod odbornym vedenim",
        url: "/#services",
      },
      {
        label: "Firemni skoleni",
        icon: LayoutGrid,
        description:
          "Skoleni na miru pro kliniky a zdravotnicka zarizeni",
        url: "/#services",
      },
      {
        label: "Mentoring program",
        icon: Trophy,
        description:
          "Dlouhodoby mentoring pro zacínajici fyzioterapeuty",
        url: "/#services",
      },
    ],
  },
  {
    title: "Platforma",
    id: 3,
    imageLink: {
      url: "/courses",
      image:
        "https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=800",
      label: "Prozkoumejte nase kurzy",
    },
    groupLinks: [
      {
        title: "Pro studenty",
        links: [
          {
            label: "Video kurzy",
            icon: BookOpen,
            description: "Profesionalne natocene videolekce s odborniky",
            url: "/courses",
          },
          {
            label: "Praktika",
            icon: HandHeart,
            description: "Prakticke lekce pod odbornym dohledem",
            url: "/courses",
          },
          {
            label: "Zkousky a testy",
            icon: ClipboardList,
            description:
              "Overeni znalosti a ziskani certifikatu",
            url: "/courses",
          },
        ],
      },
      {
        title: "Pro odborníky",
        links: [
          {
            label: "Pokrocile techniky",
            icon: Zap,
            description:
              "Specializovane kurzy pro zkusene fyzioterapeuty",
            url: "/courses",
          },
          {
            label: "Konference",
            icon: Users,
            description:
              "Odborne konference a networking s kolegy z oboru",
            url: "/#contact",
          },
          {
            label: "Novinky z oboru",
            icon: Sparkles,
            description: "Aktualni trendy a vyzkum ve fyzioterapii",
            url: "/#features",
          },
        ],
      },
    ],
  },
  {
    title: "Reference",
    url: "/#testimonials",
  },
  {
    title: "Cenik",
    url: "/#pricing",
  },
];

const MOBILE_BREAKPOINT = 1024;

interface Navbar10Props {
  className?: string;
}

const Navbar10 = ({ className }: Navbar10Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleMobileMenu = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <section
        className={cn(
          "pointer-events-auto fixed top-0 z-999 flex w-full items-center justify-center bg-background transition-all duration-500 ease-out",
          isScrolled && "shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_2px_8px_0px_rgba(16,25,36,0.08)]",
          className,
        )}
      >
        <NavigationMenu
          className={cn(
            "max-w-full transition-all duration-500 ease-out after:absolute after:inset-0 after:z-998 after:block after:size-full after:bg-background after:content-[''] [&>div:last-child>div]:mt-0 [&>div:last-child>div]:animate-none [&>div:last-child>div]:rounded-none [&>div:last-child>div]:border-0 [&>div:last-child>div]:border-b [&>div:last-child>div]:!shadow-[0px_-1px_0px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(17,26,37,0.05),0px_2px_5px_0px_rgba(16,25,36,0.1),0px_5px_20px_0px_rgba(16,25,36,0.1)]",
            isScrolled ? "h-14" : "h-20",
          )}
        >
          <div className="relative z-999 container grid w-full grid-cols-2 items-center justify-between gap-8 xl:grid-cols-3">
            <Link
              to="/"
              className="flex max-h-8 items-center gap-2 text-lg font-semibold tracking-tighter"
            >
              <img
                src={site.logo}
                alt={site.name}
                className={cn(
                  "inline-block transition-all duration-500",
                  isScrolled ? "size-5" : "size-7",
                )}
              />
              <span
                className={cn(
                  "hidden font-bold transition-all duration-500 md:inline-block",
                  isScrolled ? "text-lg" : "text-xl",
                )}
              >
                {site.name}
              </span>
            </Link>
            <div className="hidden xl:flex">
              <NavigationMenuList>
                {NAVIGATION.map((item, index) => (
                  <DesktopMenuItem
                    key={`desktop-link-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </NavigationMenuList>
            </div>
            <div className="flex items-center gap-2 justify-self-end">
              <div className="hidden xl:flex xl:items-center xl:gap-2">
                <Button variant="ghost" asChild size={isScrolled ? "sm" : "default"}>
                  <Link to="/auth/sign-in">Prihlasit se</Link>
                </Button>
                <Button asChild size={isScrolled ? "sm" : "default"}>
                  <Link to="/auth/sign-up">
                    Zacit
                    <ChevronRight />
                  </Link>
                </Button>
              </div>
              <div className="xl:hidden">
                <Button
                  className="size-11"
                  variant="ghost"
                  size="icon"
                  onClick={handleMobileMenu}
                >
                  {open ? (
                    <X className="size-5.5 stroke-foreground" />
                  ) : (
                    <MenuIcon className="size-5.5 stroke-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </NavigationMenu>
      </section>
      <MobileNavigationMenu open={open} />
    </Fragment>
  );
};

const DesktopMenuItem = ({ item, index }: DesktopMenuItemProps) => {
  if (item.links || item.featuredLinks || item.groupLinks) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <NavigationMenuTrigger className="h-fit bg-transparent font-normal text-foreground/60">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="hidden !rounded-xl !border-0 !p-0 xl:block">
          <div className="w-dvw animate-[fade-in-slide-down_0.35s_cubic-bezier(0.33,1,0.68,1)_forwards] px-8 pt-6 pb-12">
            <div className="container">
              {item.id === 1 && <DropdownMenu1 links={item.links} />}
              {item.id === 2 && (
                <DropdownMenu2
                  featuredLinks={item.featuredLinks}
                  links={item.links}
                />
              )}
              {item.id === 3 && (
                <DropdownMenu3
                  groupLinks={item.groupLinks}
                  imageLink={item.imageLink}
                />
              )}
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
      <NavigationMenuLink
        href={item.url}
        className={`${navigationMenuTriggerStyle()} h-fit bg-transparent font-normal text-foreground/60`}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const DropdownMenu1 = ({ links }: { links?: MenuLink[] }) => {
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  const updateImageClasses = (activeIndex: number) => {
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      const isActive = i === activeIndex;
      img.classList.toggle("opacity-100", isActive);
      img.classList.toggle("translate-y-0", isActive);
      img.classList.toggle("opacity-0", !isActive);
      img.classList.toggle("translate-y-20", !isActive);
      img.classList.toggle("z-10", isActive);
    });
  };

  const handleMouseEnter =
    (index: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      linksRef.current.forEach((link) => {
        if (link && link !== event.currentTarget) {
          link.classList.add("opacity-50");
        }
      });
      updateImageClasses(index);
    };

  const handleMouseLeave = () => {
    linksRef.current.forEach((link) => {
      link?.classList.remove("opacity-50");
    });
    updateImageClasses(0);
  };

  if (!links) return null;

  return (
    <div className="grid grid-cols-2 gap-8">
      <ul className="grid grid-cols-2 gap-8">
        {links.map((link, index) => (
          <NavLink
            key={`default-nav-link-${index}`}
            link={link}
            onMouseEnter={handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            ref={(el) => {
              if (el) linksRef.current[index] = el;
            }}
          />
        ))}
      </ul>
      <div className="relative !h-[16rem] w-full overflow-hidden rounded-lg bg-muted">
        {links.map((link, index) => (
          <div
            key={`default-nav-link-img-${index}`}
            ref={(el) => {
              if (el) imageRefs.current[index] = el;
            }}
            className={`will-change-opacity absolute top-14 left-14 aspect-video w-[43.75rem] overflow-hidden rounded-tl-md border-t border-l transition-all duration-600 ease-in-out will-change-transform ${
              index === 0
                ? "z-10 translate-y-0 opacity-100"
                : "pointer-events-none z-0 translate-y-20 opacity-0"
            }`}
          >
            <img
              src={link.image}
              alt={link.label}
              className="size-full object-cover object-left-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const DropdownMenu2 = ({
  links,
  featuredLinks,
}: {
  links?: MenuLink[];
  featuredLinks?: MenuLink[];
}) => {
  return (
    <div>
      <div className="flex gap-8 pb-8">
        {featuredLinks &&
          featuredLinks.map((link, index) => (
            <FeaturedLink key={`desktop-featured-link-${index}`} link={link} />
          ))}
      </div>
      <Separator />
      <div className="grid grid-cols-4 pt-8">
        {links &&
          links.map((link, index) => (
            <NavLink key={`default-nav-link-${index}`} link={link} />
          ))}
      </div>
    </div>
  );
};

const DropdownMenu3 = ({
  groupLinks,
  imageLink,
}: {
  groupLinks?: MenuGroup[];
  imageLink?: MenuLink;
}) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <GroupLinks groupLinks={groupLinks} />
      <FeaturedImageLink link={imageLink} />
    </div>
  );
};

const GroupLinks = ({ groupLinks }: { groupLinks?: MenuGroup[] }) => {
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  const handleMouseEnter =
    () => (event: React.MouseEvent<HTMLAnchorElement>) => {
      linksRef.current.forEach((link) => {
        if (link && link !== event.currentTarget) {
          link.classList.add("opacity-50");
        }
      });
    };

  const handleMouseLeave = () => {
    linksRef.current.forEach((link) => {
      link?.classList.remove("opacity-50");
    });
  };

  if (!groupLinks) return null;

  let linkIndex = 0;
  return (
    <div className="grid grid-cols-2 gap-8">
      {groupLinks.map((group, index1) => (
        <div key={`group-link-${index1}`}>
          <div className="mb-4 text-xs text-muted-foreground">
            {group.title}
          </div>
          <ul className="flex flex-col gap-8">
            {group.links.map((link, index2) => {
              const index = linkIndex++;
              return (
                <li key={`group-link-${index1}-${index2}`}>
                  <NavLink
                    link={link}
                    onMouseEnter={handleMouseEnter()}
                    onMouseLeave={handleMouseLeave}
                    ref={(el) => {
                      if (el) linksRef.current[index] = el;
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

const FeaturedImageLink = ({ link }: { link?: MenuLink }) => {
  if (!link) return null;

  return (
    <div className="hidden xl:block">
      <a href={link.url} className="w-full max-w-[36.875rem]">
        <AspectRatio
          ratio={1.77245509}
          className="overflow-hidden rounded-[0.25rem] bg-muted"
        >
          <div className="size-full">
            <Badge className="absolute top-2 left-2">Nove</Badge>
            <div className="flex w-full flex-col items-center justify-center gap-8 pt-10">
              <div className="text-2xl font-semibold">{link.label}</div>
              <div className="w-[80%]">
                <AspectRatio
                  ratio={1.5}
                  className="overflow-hidden rounded-[0.25rem] bg-muted"
                >
                  <img
                    src={link.image}
                    alt={link.label}
                    className="size-full object-cover object-left-top"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </AspectRatio>
      </a>
    </div>
  );
};

const FeaturedLink = ({ link }: { link: MenuLink }) => {
  return (
    <a
      href={link.url}
      className="group relative flex w-full overflow-hidden rounded-xl bg-muted px-8 py-7"
    >
      <div className="relative z-10 flex w-full items-center gap-6">
        <div className="flex size-12 shrink-0 rounded-lg border bg-background shadow-lg">
          {link.icon && (
            <link.icon className="m-auto size-5 stroke-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold text-white">{link.label}</div>
          <div className="font-medium text-white/80">{link.description}</div>
        </div>
      </div>
      <img
        src={link.background}
        alt={link.label}
        className="absolute top-0 left-0 size-full object-cover object-left-top opacity-90 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
      />
    </a>
  );
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ link, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <a
        ref={ref}
        href={link.url}
        className="flex w-full gap-2 transition-opacity duration-300"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {link.icon && (
          <div className="flex size-6 shrink-0 rounded-md border shadow">
            <link.icon className="m-auto size-3.5" />
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          {link.company && (
            <div className="block text-base leading-normal xl:hidden">
              {link.company.name}
            </div>
          )}
          {link.company && (
            <img
              className="hidden h-6 xl:block"
              src={link.company.logo}
              alt={link.company.name}
            />
          )}
          {link.label && (
            <div className="text-base leading-normal">{link.label}</div>
          )}
          <div className="text-sm leading-normal text-muted-foreground">
            {link.description}
          </div>
        </div>
      </a>
    );
  },
);

const MobileNavigationMenu = ({ open }: MobileNavigationMenuProps) => {
  return (
    <Sheet open={open}>
      <SheetContent
        aria-describedby={undefined}
        side="top"
        className="inset-0 z-998 h-dvh w-full bg-background pt-20 [&>button]:hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="container py-8">
            <div className="absolute -m-px h-px w-px overflow-hidden border-0 mask-clip-border p-0 text-nowrap whitespace-nowrap">
              <SheetTitle className="text-primary">
                Mobilni navigace
              </SheetTitle>
            </div>
            <div className="flex min-h-full flex-col gap-6">
              <Accordion type="multiple" className="w-full">
                {NAVIGATION.map((item, index) =>
                  renderMobileMenuItem(item, index),
                )}
              </Accordion>

              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link to="/auth/sign-in">Prihlasit se</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/sign-up">Zacit</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const renderMobileMenuItem = (item: MenuItem, index: number) => {
  if (item.links || item.featuredLinks || item.groupLinks) {
    return (
      <AccordionItem
        key={item.title}
        value={`nav-${index}`}
        className="border-b-0"
      >
        <AccordionTrigger className="h-[2.5rem] items-center text-base font-normal text-foreground hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-6 p-2">
          {item.featuredLinks && (
            <div className="flex flex-col gap-2 p-2">
              {item.featuredLinks.map((link, i) => (
                <NavLink key={`featured-nav-link-${i}`} link={link} />
              ))}
            </div>
          )}

          {item.links && (
            <div className="flex flex-col gap-2 p-2">
              {item.links.map((link, i) => (
                <NavLink key={`default-nav-link-${i}`} link={link} />
              ))}
            </div>
          )}

          {item.groupLinks && (
            <div className="flex flex-col gap-2 p-2">
              {item.groupLinks.map((group, i1) => (
                <div className="mb-8 last:mb-0" key={`group-link-${i1}`}>
                  <div className="mb-4 text-xs text-muted-foreground">
                    {group.title}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link, i2) => (
                      <li key={`group-link-${i1}-${i2}`}>
                        <NavLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="flex h-[2.5rem] items-center rounded-md text-left text-base leading-[3.75] font-normal text-foreground ring-ring/10 outline-ring/50 transition-all focus-visible:ring-4 focus-visible:outline-1 nth-last-1:border-0"
    >
      {item.title}
    </a>
  );
};

export { Navbar10 };
