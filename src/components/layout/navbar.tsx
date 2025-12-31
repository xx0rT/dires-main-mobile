import { Menu, X } from "lucide-react"
import { RiGithubFill } from "@remixicon/react"
import { Link } from "react-router-dom"
import React from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "../ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "../ui/navigation-menu"
import { Separator } from "../ui/separator"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "../ui/sheet"
import { site } from "@/config/site"

interface RouteProps {
    href: string
    label: string
}

const routeList: RouteProps[] = [
    {
        href: "#features",
        label: "Vlastnosti"
    },
    {
        href: "#testimonials",
        label: "Reference"
    },
    {
        href: "#pricing",
        label: "Ceník"
    },
    {
        href: "#contact",
        label: "Kontakt"
    }
]

const menuContent = {
    solutions: [
        {
            title: "Kurzy Manuální Terapie",
            description: "Ovládněte tradiční české techniky manuální terapie.",
            href: "#features"
        },
        {
            title: "Sportovní Rehabilitace",
            description: "Specializované kurzy pro léčbu sportovních zranění.",
            href: "#services"
        },
        {
            title: "Neurologická Rehabilitace",
            description: "Pokročilé techniky Vojtovy a Bobathovy metody.",
            href: "#services"
        }
    ],
    features: [
        {
            title: "Certifikované Vzdělávání",
            description: "Všechny kurzy jsou mezinárodně uznávané.",
            href: "#features"
        },
        {
            title: "Praktická Výuka",
            description: "Rozsáhlé praktické lekce pod odborným dohledem.",
            href: "#features"
        },
        {
            title: "Online Materiály",
            description: "Celoživotní přístup ke studijním materiálům.",
            href: "#features"
        }
    ],
    testimonials: [
        {
            title: "Příběhy Absolventů",
            description: "Přečtěte si, jak naši studenti dosáhli úspěchu.",
            href: "#testimonials"
        },
        {
            title: "Případové Studie",
            description: "Detailní analýzy reálných implementací.",
            href: "#testimonials"
        },
        {
            title: "Hodnocení",
            description: "Zjistěte, co o nás říkají naši studenti.",
            href: "#testimonials"
        }
    ],
    pricing: [
        {
            title: "Základní Kurz",
            description: "Ideální pro začátečníky a malé týmy.",
            href: "#pricing"
        },
        {
            title: "Profesionální",
            description: "Pokročilé techniky pro rostoucí praxi.",
            href: "#pricing"
        },
        {
            title: "Mistrovský",
            description: "Individuální řešení pro zkušené odborníky.",
            href: "#pricing"
        }
    ],
    contact: [
        {
            title: "Kontaktujte Nás",
            description: "Ozvěte se našemu týmu s jakýmikoli dotazy.",
            href: "#contact"
        },
        {
            title: "Informace o Kurzech",
            description: "Promluvte si s námi o vašich potřebách.",
            href: "#contact"
        },
        {
            title: "Podpora",
            description: "Získejte pomoc od našeho týmu podpory.",
            href: "#contact"
        }
    ]
}

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className={`sticky top-2 z-50 mx-auto px-4 transition-all duration-500 ease-out ${
            isScrolled ? 'w-[70%] max-w-5xl' : 'w-[98%] max-w-7xl'
        }`}>
            <nav className="rounded-xl border border-border bg-card/50 shadow-black/2 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out">
                <div className={`flex items-center justify-between px-4 lg:px-6 transition-all duration-500 ease-out ${
                    isScrolled ? 'py-2' : 'py-3'
                }`}>
                    {/* Logo */}
                    <Link
                        to="/"
                        className="group flex items-center gap-2 font-bold"
                    >
                        <div className="relative">
                            <img
                                src={site.logo}
                                alt={site.name}
                                className="w-[30px] h-[30px]"
                            />
                        </div>
                        <h3 className={`font-bold text-xl lg:text-2xl transition-all duration-300 ${
                            isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                        }`}>
                            {site.name}
                        </h3>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-1 lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-2">
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Kurzy
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src="/demo-img.png"
                                                    alt="Product Demo"
                                                    className="h-full w-full object-cover"
                                                    width={300}
                                                    height={200}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <ul className="flex flex-col gap-3">
                                                {menuContent.solutions.map(
                                                    ({
                                                        title,
                                                        description,
                                                        href
                                                    }) => (
                                                        <li key={title}>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <a
                                                                    href={href}
                                                                    className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                                                                >
                                                                    <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                                                        {title}
                                                                    </p>
                                                                    <p className="line-clamp-2 text-muted-foreground text-xs">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Vlastnosti
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src="/demo-img.png"
                                                    alt="Product Demo"
                                                    className="h-full w-full object-cover"
                                                    width={300}
                                                    height={200}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <ul className="flex flex-col gap-3">
                                                {menuContent.features.map(
                                                    ({
                                                        title,
                                                        description,
                                                        href
                                                    }) => (
                                                        <li key={title}>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <a
                                                                    href={href}
                                                                    className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                                                                >
                                                                    <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                                                        {title}
                                                                    </p>
                                                                    <p className="line-clamp-2 text-muted-foreground text-xs">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Reference
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src="/demo-img.png"
                                                    alt="Product Demo"
                                                    className="h-full w-full object-cover"
                                                    width={300}
                                                    height={200}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <ul className="flex flex-col gap-3">
                                                {menuContent.testimonials.map(
                                                    ({
                                                        title,
                                                        description,
                                                        href
                                                    }) => (
                                                        <li key={title}>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <a
                                                                    href={href}
                                                                    className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                                                                >
                                                                    <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                                                        {title}
                                                                    </p>
                                                                    <p className="line-clamp-2 text-muted-foreground text-xs">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Ceník
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src="/demo-img.png"
                                                    alt="Product Demo"
                                                    className="h-full w-full object-cover"
                                                    width={300}
                                                    height={200}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <ul className="flex flex-col gap-3">
                                                {menuContent.pricing.map(
                                                    ({
                                                        title,
                                                        description,
                                                        href
                                                    }) => (
                                                        <li key={title}>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <a
                                                                    href={href}
                                                                    className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                                                                >
                                                                    <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                                                        {title}
                                                                    </p>
                                                                    <p className="line-clamp-2 text-muted-foreground text-xs">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Kontakt
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src="/demo-img.png"
                                                    alt="Product Demo"
                                                    className="h-full w-full object-cover"
                                                    width={300}
                                                    height={200}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <ul className="flex flex-col gap-3">
                                                {menuContent.contact.map(
                                                    ({
                                                        title,
                                                        description,
                                                        href
                                                    }) => (
                                                        <li key={title}>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <a
                                                                    href={href}
                                                                    className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                                                                >
                                                                    <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                                                        {title}
                                                                    </p>
                                                                    <p className="line-clamp-2 text-muted-foreground text-xs">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-2 lg:flex">
                    <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-10 rounded-full"
                        >
                            <Link
                                to={site.links.github}
                                target="_blank"
                                aria-label="View on GitHub"
                            >
                                <RiGithubFill className="size-5 fill-foreground" />
                            </Link>
                        </Button>
                        <ModeToggle />

                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="ml-2"
                        >
                            <Link to="/auth/sign-in">
                                Přihlásit se
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Link to="/auth/sign-up">
                                Začít
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-10 rounded-full"
                        >
                            <Link
                                to={site.links.github}
                                target="_blank"
                                aria-label="View on GitHub"
                            >
                                <RiGithubFill className="size-5 fill-foreground" />
                            </Link>
                        </Button>
                        <ModeToggle />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg hover:bg-accent/50"
                                    aria-label="Toggle menu"
                                >
                                    {isOpen ? (
                                        <X className="size-4" />
                                    ) : (
                                        <Menu className="size-4" />
                                    )}
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-full max-w-sm border-border/50 border-l bg-background/95 backdrop-blur-md"
                            >
                                <div className="flex h-full flex-col">
                                    <SheetHeader className="pb-4">
                                        <SheetTitle>
                                            <Link
                                                to="/"
                                                className="flex items-center gap-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <img
                                                    src={site.logo}
                                                    alt={site.name}
                                                    width={32}
                                                    height={32}
                                                />
                                                <span className="font-bold text-lg">
                                                    {site.name}
                                                </span>
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>

                                    <Separator className="mb-4" />

                                    {/* Mobile Navigation Links */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="space-y-1">
                                            {routeList.map(
                                                ({ href, label }) => (
                                                    <Button
                                                        key={href}
                                                        onClick={() =>
                                                            setIsOpen(false)
                                                        }
                                                        asChild
                                                        variant="ghost"
                                                        className="h-auto w-full justify-start px-3 py-2.5 font-medium hover:bg-accent/50"
                                                    >
                                                        <a href={href}>
                                                            {label}
                                                        </a>
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Actions */}
                                    <SheetFooter className="flex-row gap-2 border-border/50 border-t pt-4">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link to="/auth/sign-in">
                                                Přihlásit se
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            className="w-full bg-primary hover:bg-primary/90"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link to="/auth/sign-up">
                                                Začít
                                            </Link>
                                        </Button>
                                    </SheetFooter>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </div>
    )
}
