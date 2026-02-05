import {
  Activity,
  Stethoscope,
  HeartPulse,
  Brain,
  Dumbbell,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  MenuIcon,
  X,
  Star,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
  forwardRef,
  Fragment,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

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
import { site } from "@/config/site";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { ShoppingCartButton } from "../shop/shopping-cart-button";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
  showDescription?: boolean;
};

const NAVIGATION: MenuItem[] = [
  {
    title: "Služby",
    id: 1,
    links: [
      {
        label: "Manuální terapie",
        icon: Activity,
        description:
          "Tradiční české techniky manuální terapie pro léčbu pohybového aparátu",
        url: "/#services",
        image: "https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
      {
        label: "Sportovní rehabilitace",
        icon: Dumbbell,
        description:
          "Specializované programy pro léčbu a prevenci sportovních zranění",
        url: "/#services",
        image: "https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
      {
        label: "Neurologická fyzioterapie",
        icon: Brain,
        description: "Vojtova a Bobathova metoda pro neurologické obtíže",
        url: "/#services",
        image: "https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
      {
        label: "Kardiovaskulární rehabilitace",
        icon: HeartPulse,
        description:
          "Komplexní péče po srdečních onemocněních a operacích",
        url: "/#services",
        image: "https://images.pexels.com/photos/4506270/pexels-photo-4506270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
      {
        label: "Pediatrická fyzioterapie",
        icon: Users,
        description: "Specializovaná péče pro děti a novorozence",
        url: "/#services",
        image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
      {
        label: "Geriatrická fyzioterapie",
        icon: Stethoscope,
        description: "Péče zaměřená na seniory a prevenci pádů",
        url: "/#services",
        image: "https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      },
    ],
  },
  {
    title: "Vzdělávání",
    id: 2,
    featuredLinks: [
      {
        label: "Online kurzy",
        icon: BookOpen,
        description: "Komplexní online vzdělávací programy pro fyzioterapeuty",
        background:
          "https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
        url: "/courses",
      },
      {
        label: "Certifikace",
        icon: Award,
        description: "Mezinárodně uznávané certifikační programy",
        background:
          "https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
        url: "/#features",
      },
    ],
    links: [
      {
        description:
          "Kurzy manuální terapie dle českých fyzioterapeutických tradic",
        url: "/#features",
        company: {
          logo: site.logo,
          name: "Manuální terapie",
        },
      },
      {
        description: "Specializované kurzy pro sportovní fyzioterapeuty",
        url: "/#features",
        company: {
          logo: site.logo,
          name: "Sportovní fyzio",
        },
      },
      {
        description: "Vojtova reflexní lokomoce a Bobath koncept",
        url: "/#features",
        company: {
          logo: site.logo,
          name: "Neurorehabilitace",
        },
      },
      {
        description:
          "Komplexní vzdělávací programy pro zdravotnické profesionály",
        url: "/#features",
        company: {
          logo: site.logo,
          name: "Profesní rozvoj",
        },
      },
    ],
  },
  {
    title: "Zdroje",
    id: 3,
    imageLink: {
      url: "/shop",
      image: "https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      label: "Prozkoumejte náš obchod",
    },
    groupLinks: [
      {
        title: "Vzdělávací materiály",
        links: [
          {
            label: "Odborné kurzy",
            icon: GraduationCap,
            description: "Komplexní vzdělávací programy pro fyzioterapeuty",
            url: "/courses",
          },
          {
            label: "Studijní materiály",
            icon: BookOpen,
            description: "Knihy, příručky a online studijní materiály",
            url: "/shop",
          },
          {
            label: "Kazuistiky",
            icon: FileText,
            description:
              "Reálné případové studie z klinické praxe",
            url: "/#testimonials",
          },
        ],
      },
      {
        title: "Podpora a komunita",
        links: [
          {
            label: "Reference",
            icon: MessageSquare,
            description:
              "Zkušenosti absolventů našich kurzů",
            url: "/#testimonials",
          },
          {
            label: "Kontakt",
            icon: Phone,
            description:
              "Spojte se s naším týmem",
            url: "/#contact",
          },
          {
            label: "FAQ",
            icon: Mail,
            description: "Často kladené otázky a odpovědi",
            url: "/#faq",
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
    title: "Ceník",
    url: "/#pricing",
  },
];

const MOBILE_BREAKPOINT = 1024;

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user, signOut } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleMobileMenu = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Fragment>
      <section
        className={cn(
          "pointer-events-auto sticky top-0 z-50 flex w-full items-center justify-center bg-background border-b",
          className,
        )}
      >
        <NavigationMenu className="h-16 max-w-full after:absolute after:inset-0 after:z-998 after:block after:size-full after:bg-background after:content-[''] [&>div:last-child>div]:mt-0 [&>div:last-child>div]:animate-none [&>div:last-child>div]:rounded-none [&>div:last-child>div]:border-0 [&>div:last-child>div]:border-b [&>div:last-child>div]:!shadow-[0px_-1px_0px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(17,26,37,0.05),0px_2px_5px_0px_rgba(16,25,36,0.1),0px_5px_20px_0px_rgba(16,25,36,0.1)]">
          <div className="relative z-999 container grid w-full grid-cols-2 items-center justify-between gap-8 xl:grid-cols-3">
            <Link
              to="/"
              className="flex max-h-8 items-center gap-2 text-lg font-semibold tracking-tighter"
            >
              <img
                src={site.logo}
                alt={site.name}
                className="inline-block size-6"
              />
              <span className="hidden md:inline-block">{site.name}</span>
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
            <div className="justify-self-end flex items-center gap-2">
              <div className="hidden xl:flex items-center gap-2">
                <ShoppingCartButton />
                <ModeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium leading-none ${hasActiveSubscription ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                              Můj účet
                            </p>
                            {hasActiveSubscription && (
                              <Badge variant="outline" className="h-5 px-1.5 bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                                <Star className="mr-1 size-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-xs">Premium</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/courses" className="cursor-pointer">
                          Kurzy
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/settings" className="cursor-pointer">
                          Nastavení
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                        Odhlásit se
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link to="/auth/sign-in">
                      Přihlásit se
                      <ChevronRight />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="xl:hidden flex items-center gap-2">
                <ShoppingCartButton />
                <ModeToggle />
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
      <MobileNavigationMenu open={open} user={user} signOut={signOut} hasActiveSubscription={hasActiveSubscription} getUserInitials={getUserInitials} />
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
                    onMouseEnter={handleMouseEnter}
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
      <Link to={link.url} className="w-full max-w-[36.875rem]">
        <AspectRatio
          ratio={1.77245509}
          className="overflow-hidden rounded-[0.25rem] bg-muted"
        >
          <div className="size-full">
            <Badge className="absolute top-2 left-2">Nové</Badge>
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
      </Link>
    </div>
  );
};

const FeaturedLink = ({ link }: { link: MenuLink }) => {
  return (
    <Link
      to={link.url}
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
    </Link>
  );
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ link, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <Link
        ref={ref}
        to={link.url}
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
      </Link>
    );
  },
);

const MobileNavigationMenu = ({
  open,
  user,
  signOut,
  hasActiveSubscription,
  getUserInitials
}: MobileNavigationMenuProps & {
  user: any;
  signOut: () => void;
  hasActiveSubscription: boolean;
  getUserInitials: () => string;
}) => {
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
                Mobilní navigace
              </SheetTitle>
            </div>
            <div className="flex min-h-full flex-col gap-6">
              <Accordion type="multiple" className="w-full">
                {NAVIGATION.map((item, index) =>
                  renderMobileMenuItem(item, index),
                )}
              </Accordion>

              {user ? (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <div className="flex items-center gap-3 pb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${hasActiveSubscription ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                          Můj účet
                        </p>
                        {hasActiveSubscription && (
                          <Badge variant="outline" className="h-5 px-1.5 bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                            <Star className="mr-1 size-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs">Premium</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    Odhlásit se
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth/sign-in">Přihlásit se</Link>
                </Button>
              )}
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
              {item.featuredLinks.map((link, index) => (
                <NavLink key={`default-nav-link-${index}`} link={link} />
              ))}
            </div>
          )}

          {item.links && (
            <div className="flex flex-col gap-2 p-2">
              {item.links.map((link, index) => (
                <NavLink key={`default-nav-link-${index}`} link={link} />
              ))}
            </div>
          )}

          {item.groupLinks && (
            <div className="flex flex-col gap-2 p-2">
              {item.groupLinks.map((group, index1) => (
                <div className="mb-8 last:mb-0" key={`group-link-${index1}`}>
                  <div className="mb-4 text-xs text-muted-foreground">
                    {group.title}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link, index2) => (
                      <li key={`group-link-${index1}-${index2}`}>
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
