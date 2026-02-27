import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  GraduationCap,
  HelpCircle,
  Info,
  LayoutGrid,
  LogOut,
  MenuIcon,
  MessageSquare,
  Settings,
  Star,
  ShoppingBag,
  Tag,
  Users,
  X,
  Zap,
  Home,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ShoppingCartButton } from "@/components/shop/shopping-cart-button";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    title: "Dires",
    url: "/",
    id: 1,
    groupLinks: [
      {
        title: "O nas",
        links: [
          {
            label: "Kdo jsme",
            icon: Info,
            description: "Poznejte nas tym a nasi vizi",
            url: "/#benefits",
          },
          {
            label: "Co delame",
            icon: Zap,
            description: "Nase sluzby a specializace",
            url: "/tym",
          },
          {
            label: "Nas tym",
            icon: Users,
            description: "Seznamte se s nasimi odborniky",
            url: "/tym",
          },
        ],
      },
      {
        title: "Vice",
        links: [
          {
            label: "Blog",
            icon: BookOpen,
            description: "Clanky a novinky ze sveta fyzioterapie",
            url: "/blog",
          },
          {
            label: "Obchod",
            icon: ShoppingBag,
            description: "Fyzioterapeuticke pomucky a vybaveni",
            url: "/obchod",
          },
          {
            label: "Cenik",
            icon: Tag,
            description: "Prehled cen a predplatnych planu",
            url: "/#pricing",
          },
          {
            label: "Casté dotazy",
            icon: HelpCircle,
            description: "Odpovedi na nejcastejsi otazky",
            url: "/#faq",
          },
          {
            label: "Kontakt",
            icon: MessageSquare,
            description: "Napiste nam nebo nas navstivte",
            url: "/#contact",
          },
        ],
      },
    ],
    imageLink: {
      url: "/#features",
      image:
        "https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=800",
      label: "Objevte nase funkce",
    },
  },
  {
    title: "Obchod",
    id: 2,
    url: "/obchod",
    featuredLinks: [
      {
        label: "Lineseat",
        icon: ShoppingBag,
        description: "Pomucka pro stabilni a funkcni sed v aute i kancelari",
        background:
          "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
        url: "/obchod",
      },
      {
        label: "Correctfoot",
        icon: LayoutGrid,
        description: "Balancni desticka pro trenink koncetin",
        background:
          "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800",
        url: "/obchod",
      },
    ],
    links: [
      {
        label: "4CORE Program",
        icon: Zap,
        description: "Online treninkovy program - 70 dni, 15 minut denne",
        url: "/obchod",
      },
      {
        label: "Fyziotrenink",
        icon: BookOpen,
        description: "Kniha Pohyb jako lek - aktualizovane vydani",
        url: "/obchod",
      },
    ],
  },
  {
    title: "Kurzy",
    url: "/kurzy",
    id: 3,
    groupLinks: [
      {
        title: "Nabidka kurzu",
        links: [
          {
            label: "Vsechny kurzy",
            icon: LayoutGrid,
            description: "Kompletni prehled vsech dostupnych kurzu",
            url: "/kurzy",
          },
          {
            label: "71denni kurz",
            icon: Calendar,
            description: "Intenzivni program na 71 dni pro maximalni vysledky",
            url: "/kurzy",
          },
          {
            label: "Kratke kurzy",
            icon: Clock,
            description: "Kratke specializovane kurzy a workshopy",
            url: "/kurzy",
          },
        ],
      },
      {
        title: "Informace",
        links: [
          {
            label: "Cenik kurzu",
            icon: Tag,
            description: "Prehled cen a balicku pro vsechny kurzy",
            url: "/#pricing",
          },
          {
            label: "Certifikace",
            icon: GraduationCap,
            description: "Informace o ziskani certifikatu",
            url: "/kurzy",
          },
          {
            label: "Pro pokrocile",
            icon: Zap,
            description: "Specializovane kurzy pro zkusene fyzioterapeuty",
            url: "/kurzy",
          },
        ],
      },
    ],
    imageLink: {
      url: "/courses",
      image:
        "https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800",
      label: "Prozkoumejte nase kurzy",
    },
  },
  {
    title: "Kosik",
    url: "/kosik",
    id: 100,
  },
  {
    title: "Prepnout tema",
    id: 101,
  },
];

const MOBILE_BREAKPOINT = 1024;

interface Navbar10Props {
  className?: string;
}

const Navbar10 = ({ className }: Navbar10Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 10) {
        setIsScrolled(false);
      } else if (currentY > lastY) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
          "pointer-events-auto fixed top-0 z-999 flex w-full items-center justify-center bg-background transition-all duration-500 ease-out pt-[env(safe-area-inset-top,0px)]",
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
                  "inline-block transition-all duration-500 dark:invert",
                  isScrolled ? "size-6" : "size-8",
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
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={cn("gap-2 group", isScrolled ? "h-9 px-3" : "h-11 px-4")}>
                        <Avatar className={cn(isScrolled ? "size-7" : "size-8")}>
                          <AvatarFallback className="text-xs font-medium">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className={cn("font-medium", isScrolled ? "text-sm" : "text-base")}>
                          {user.email?.split('@')[0] || 'User'}
                        </span>
                        <ChevronDown className={cn("transition-transform duration-200 group-data-[state=open]:rotate-180", isScrolled ? "size-4" : "size-4")} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-56 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                      sideOffset={8}
                    >
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {user.email?.split('@')[0] || 'User'}
                            </span>
                            {hasActiveSubscription && (
                              <Badge variant="outline" className="h-4 px-1 text-[10px] bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                                <Star className="mr-0.5 size-2.5 fill-yellow-500 text-yellow-500" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/prehled">
                          <Home className="mr-2 size-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950">
                        <LogOut className="mr-2 size-4" />
                        Logout
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/prehled/nastaveni">
                          <Settings className="mr-2 size-4" />
                          Nastaveni
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/prehled/fakturace">
                          <CreditCard className="mr-2 size-4" />
                          Fakturace
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="ghost" asChild size={isScrolled ? "sm" : "default"}>
                      <Link to="/prihlaseni">Prihlasit se</Link>
                    </Button>
                    <Button asChild size={isScrolled ? "sm" : "default"}>
                      <Link to="/registrace">
                        Zacit
                        <ChevronRight />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="xl:hidden">
                <Button
                  className="size-11"
                  variant="ghost"
                  size="icon"
                  onClick={handleMobileMenu}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                      <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <X className="size-5.5 stroke-foreground" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <MenuIcon className="size-5.5 stroke-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
  if (item.id === 100) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <ShoppingCartButton />
      </NavigationMenuItem>
    );
  }

  if (item.id === 101) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <ModeToggle />
      </NavigationMenuItem>
    );
  }

  if (item.links || item.featuredLinks || item.groupLinks) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <NavigationMenuTrigger className="h-fit bg-transparent font-normal text-foreground/60">
          {item.url ? (
            <Link to={item.url} className="hover:text-foreground transition-colors">
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="hidden !rounded-xl !border-0 !p-0 xl:block">
          <div className="w-dvw animate-[fade-in-slide-down_0.35s_cubic-bezier(0.33,1,0.68,1)_forwards] px-8 pt-6 pb-12">
            <div className="container">
              {(item.id === 1 || item.id === 3) && (
                <DropdownMenu3
                  groupLinks={item.groupLinks}
                  imageLink={item.imageLink}
                />
              )}
              {item.id === 2 && (
                <DropdownMenu2
                  featuredLinks={item.featuredLinks}
                  links={item.links}
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

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MobileNavigationMenu = ({ open }: MobileNavigationMenuProps) => {
  const menuItems = NAVIGATION.filter(
    (item) => item.id !== 100 && item.id !== 101,
  );
  const { user, signOut } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-998 flex h-dvh w-full flex-col overflow-hidden bg-background pt-20"
          role="dialog"
          aria-modal="true"
          aria-label="Mobilni navigace"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/8 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-[70px]" />

          <div className="relative flex-1 overflow-y-auto">
            <div className="py-6 px-5 sm:px-8">
              <div className="flex flex-col gap-3 pb-8">
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + index * 0.07,
                        ease: [0.33, 1, 0.68, 1],
                      }}
                    >
                      <AccordionItem
                        value={`nav-${index}`}
                        className="my-0 overflow-hidden rounded-xl border-border/40 bg-muted/30 px-1 backdrop-blur-sm transition-colors data-[state=open]:border-primary/15 data-[state=open]:bg-muted/50"
                      >
                        <AccordionTrigger className="px-3 text-[15px] font-medium text-foreground/80 hover:text-foreground hover:no-underline data-[state=open]:text-foreground">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-1 pb-1">
                          <div className="flex flex-col gap-0.5">
                            {item.featuredLinks?.map((link, i) => (
                              <MobileNavLink key={`featured-${i}`} link={link} />
                            ))}
                            {item.links?.map((link, i) => (
                              <MobileNavLink key={`link-${i}`} link={link} />
                            ))}
                            {item.groupLinks?.map((group, gi) => (
                              <div key={`group-${gi}`} className={cn(gi > 0 && "mt-3")}>
                                <div className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                                  {group.title}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  {group.links.map((link, li) => (
                                    <MobileNavLink key={`glink-${gi}-${li}`} link={link} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                  className="mt-2 flex items-center gap-3"
                >
                  <ShoppingCartButton />
                  <ModeToggle />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.38, ease: [0.33, 1, 0.68, 1] }}
                  className="flex flex-col gap-3 pt-2"
                >
                  {user ? (
                    <>
                      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="text-sm font-medium">
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {user.email?.split('@')[0] || 'User'}
                              </span>
                              {hasActiveSubscription && (
                                <Badge variant="outline" className="h-4 px-1 text-[10px] bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                                  <Star className="mr-0.5 size-2.5 fill-yellow-500 text-yellow-500" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="lg" className="h-12 rounded-xl border-border/50" asChild>
                        <Link to="/prehled">
                          <Home className="mr-2 size-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="h-12 rounded-xl border-border/50" asChild>
                        <Link to="/prehled/nastaveni">
                          <Settings className="mr-2 size-4" />
                          Nastaveni
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-xl border-border/50"
                        onClick={signOut}
                      >
                        <LogOut className="mr-2 size-4" />
                        Odhlasit se
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="lg" className="h-12 rounded-xl border-border/50" asChild>
                        <Link to="/prihlaseni">Prihlasit se</Link>
                      </Button>
                      <Button size="lg" className="h-12 rounded-xl" asChild>
                        <Link to="/registrace">
                          Zacit
                          <ChevronRight className="ml-1 size-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileNavLink = ({ link }: { link: MenuLink }) => {
  return (
    <a
      href={link.url}
      className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary/5"
    >
      {link.icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background/80 shadow-sm transition-all duration-200 group-hover:border-primary/25 group-hover:shadow-md">
          <link.icon className="size-3.5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
        </div>
      )}
      <div className="flex flex-col gap-0.5 pt-0.5">
        {link.label && (
          <span className="text-sm font-medium leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
            {link.label}
          </span>
        )}
        {link.description && (
          <span className="text-xs leading-relaxed text-muted-foreground/70">
            {link.description}
          </span>
        )}
      </div>
    </a>
  );
};

export { Navbar10 };
