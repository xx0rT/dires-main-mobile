import { Menu, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { site } from "@/config/site";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { ShoppingCartButton } from "../shop/shopping-cart-button";
import { ModeToggle } from "./mode-toggle";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const [currentTime, setCurrentTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("cs-CZ", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Kurzy", href: "/courses" },
    { name: "Obchod", href: "/shop" },
    { name: "Reference", href: "/#testimonials" },
    { name: "Ceník", href: "/#pricing" },
    { name: "Kontakt", href: "/#contact" },
  ];

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <section className={cn("sticky top-0 z-50 bg-background border-b py-4 text-foreground", className)}>
      <div className="container">
        <nav className="w-full border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2 md:hidden">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src={site.logo}
                    className="max-h-8"
                    alt={site.name}
                  />
                  <span className="text-lg font-semibold tracking-tighter">
                    {site.name}
                  </span>
                </Link>
              </div>

              <div className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src={site.logo}
                    className="max-h-8"
                    alt={site.name}
                  />
                  <span className="text-lg font-semibold tracking-tighter">
                    {site.name}
                  </span>
                </Link>
              </div>
              <div className="hidden items-center space-x-2 text-sm text-muted-foreground md:flex">
                <span className="font-medium">Praha</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{currentTime}</span>
              </div>

              <div className="hidden items-center space-x-6 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="group relative inline-block h-6 overflow-hidden text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      {link.name}
                    </span>
                    <span className="absolute top-full left-0 block w-full border-border text-muted-foreground transition-transform duration-300 group-hover:translate-y-[-100%] group-hover:border-b">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="hidden items-center gap-2 md:flex">
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

              <div className="flex items-center gap-2 md:hidden">
                <ShoppingCartButton />
                <ModeToggle />
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Otevřít menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="h-screen">
                    <SheetTitle className="sr-only">Navigační menu</SheetTitle>

                    <div className="m-4 flex flex-col space-y-6">
                      <div className="ml-3">
                        <Link
                          to="/"
                          className="flex items-center justify-start gap-2 text-2xl font-bold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          <img
                            src={site.logo}
                            className="max-h-8"
                            alt={site.name}
                          />
                          <span>{site.name}</span>
                        </Link>
                      </div>
                      <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg px-4 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>

                      {user ? (
                        <>
                          <Separator />
                          <div className="flex flex-col gap-2 px-4">
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
                                signOut();
                                setIsOpen(false);
                              }}
                            >
                              Odhlásit se
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Separator />
                          <div className="flex flex-col gap-2 px-4">
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
                        </>
                      )}

                      <div className="border-t border-border pt-6">
                        <div className="text-center text-sm text-muted-foreground">
                          <div className="font-medium">Praha</div>
                          <div className="mt-1">{currentTime}</div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
};
