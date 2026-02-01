import { Menu, X, Star } from "lucide-react"
import { Link } from "react-router-dom"
import React from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { site } from "@/config/site"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCartButton } from "../shop/shopping-cart-button"
import { useSubscription } from "@/lib/use-subscription"

interface RouteProps {
    href: string
    label: string
}

const routeList: RouteProps[] = [
    {
        href: "/shop",
        label: "Obchod"
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
    const { user, signOut } = useAuth()
    const { hasActiveSubscription } = useSubscription()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const getUserInitials = () => {
        if (!user?.email) return "U"
        return user.email.charAt(0).toUpperCase()
    }

    return (
        <div className={`sticky top-0 z-50 transition-all duration-500 ease-out lg:top-2 lg:mx-auto lg:px-4 ${
            isScrolled ? 'lg:w-[70%] lg:max-w-5xl' : 'lg:w-[98%] lg:max-w-7xl'
        }`}>
            <nav className="border-b border-border bg-card/50 shadow-black/2 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out lg:rounded-xl lg:border">
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
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50"
                                    >
                                        <Link to="/courses">
                                            Kurzy
                                        </Link>
                                    </Button>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50"
                                    >
                                        <Link to="/shop">
                                            Obchod
                                        </Link>
                                    </Button>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                                        Reference
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                                            <div className="relative overflow-hidden rounded-lg bg-muted">
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="300" height="200" fill="currentColor" opacity="0.1"/>
                                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="currentColor" opacity="0.5">
                                                            Image
                                                        </text>
                                                    </svg>
                                                </div>
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
                                            <div className="relative overflow-hidden rounded-lg bg-muted">
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="300" height="200" fill="currentColor" opacity="0.1"/>
                                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="currentColor" opacity="0.5">
                                                            Image
                                                        </text>
                                                    </svg>
                                                </div>
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
                                            <div className="relative overflow-hidden rounded-lg bg-muted">
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="300" height="200" fill="currentColor" opacity="0.1"/>
                                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="currentColor" opacity="0.5">
                                                            Image
                                                        </text>
                                                    </svg>
                                                </div>
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
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <ShoppingCartButton />
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
                                    <SheetFooter className="flex-col gap-2 border-border/50 border-t pt-4">
                                        {user ? (
                                            <>
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
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Link to="/dashboard">
                                                        Dashboard
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => {
                                                        signOut()
                                                        setIsOpen(false)
                                                    }}
                                                >
                                                    Odhlásit se
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex gap-2 w-full">
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
                                            </div>
                                        )}
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
