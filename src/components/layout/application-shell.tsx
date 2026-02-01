import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  type LucideIcon,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
  Users,
  BarChart3,
  Code2,
  CreditCard,
} from "lucide-react";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";

const SIDEBAR_WIDTH = 304;
const SIDEBAR_RAIL_WIDTH = 64;
const SIDEBAR_PANEL_WIDTH = SIDEBAR_WIDTH - SIDEBAR_RAIL_WIDTH;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextValue {
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  panelState: "expanded" | "collapsed";
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SidebarProvider({ defaultOpen = true, children }: SidebarProviderProps) {
  const [_isPanelOpen, _setIsPanelOpen] = React.useState(defaultOpen);
  const isPanelOpen = _isPanelOpen;

  const setPanelOpen = React.useCallback((open: boolean) => {
    _setIsPanelOpen(open);
  }, []);

  const togglePanel = React.useCallback(() => {
    setPanelOpen(!isPanelOpen);
  }, [isPanelOpen, setPanelOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePanel]);

  const panelState = isPanelOpen ? "expanded" : "collapsed";

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      isPanelOpen,
      setPanelOpen,
      togglePanel,
      panelState,
    }),
    [isPanelOpen, setPanelOpen, togglePanel, panelState]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

interface NavItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavSectionConfig {
  id: string;
  label?: string;
  items: NavItemConfig[];
}

interface NavModuleConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultPath: string;
  sections: NavSectionConfig[];
}

interface RailIconConfig {
  moduleId: string;
  label: string;
  icon: LucideIcon;
  defaultPath: string;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { showTooltip?: boolean }
>(({ className, onClick, showTooltip = true, ...props }, ref) => {
  const { isPanelOpen, togglePanel } = useSidebar();

  const button = (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      onClick={(event) => {
        onClick?.(event);
        togglePanel();
      }}
      aria-label={isPanelOpen ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isPanelOpen}
      {...props}
    >
      {isPanelOpen ? (
        <PanelLeftClose className="size-4" />
      ) : (
        <PanelLeft className="size-4" />
      )}
    </Button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span>{isPanelOpen ? "Collapse" : "Expand"}</span>
        <kbd className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
          {"\u2318"}B
        </kbd>
      </TooltipContent>
    </Tooltip>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

interface SidebarRailProps {
  railIcons: RailIconConfig[];
  activeModuleId: string;
  onModuleChange: (moduleId: string) => void;
}

function SidebarRail({
  railIcons,
  activeModuleId,
  onModuleChange,
}: SidebarRailProps) {
  return (
    <div className="flex h-full w-16 flex-col items-center justify-between bg-neutral-50 dark:bg-neutral-950/50">
      <div className="flex flex-col items-center gap-3 p-2">
        <div className="pb-1 pt-2">
          <a
            href="/dashboard"
            className="block rounded-lg px-1 py-4 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={20}
              className="h-5 dark:invert"
            />
          </a>
        </div>

        <div className="flex flex-col items-center gap-3">
          {railIcons.map((item) => {
            const isActive = item.moduleId === activeModuleId;
            const Icon = item.icon;
            return (
              <Tooltip key={item.moduleId}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onModuleChange(item.moduleId)}
                    aria-label={item.label}
                    className={cn(
                      "relative flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15"
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-3">
        <SidebarTrigger className="size-11 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex size-11 items-center justify-center">
              <UserMenu />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Účet
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function UserMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-11 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          aria-label="Účet"
        >
          <Avatar className="size-7 ring-2 ring-blue-500/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ""} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              {getInitials(user?.email?.split('@')[0] || "User")}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.email?.split('@')[0] || "Student"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
          <Settings className="mr-2 size-4" />
          Nastavení
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard/billing')}>
          <CreditCard className="mr-2 size-4" />
          Platby
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/auth/sign-in')} className="text-red-600 dark:text-red-400">
          Odhlásit se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrganizationSwitcher() {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || "Student";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <div className="flex size-6 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
            <BookOpen className="size-3.5 text-white" />
          </div>
          <span className="flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Moje Vzdělávání
          </span>
          <ChevronDown className="size-4 text-neutral-500 dark:text-neutral-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium">Vítejte, {userName}</span>
            <span className="text-xs text-muted-foreground">Platforma pro fyzioterapeuty</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <BookOpen className="mr-2 size-4" />
          Moje Kurzy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users className="mr-2 size-4" />
          Studijní Skupina
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          Nastavení Profilu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto size-8 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Oznámení"
    >
      <Bell className="size-4" />
    </Button>
  );
}

function NewActionButton() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-sm">
          <Plus className="size-4" />
          Začít Studium
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          RYCHLÉ AKCE
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard/integrations')}>
          <BookOpen className="mr-2 size-4 text-blue-600 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="font-medium">Procházet Kurzy</span>
            <span className="text-xs text-muted-foreground">Objevte nové znalosti</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard/integrations')}>
          <Users className="mr-2 size-4 text-green-600 dark:text-green-400" />
          <div className="flex flex-col">
            <span className="font-medium">Pokračovat ve Studiu</span>
            <span className="text-xs text-muted-foreground">Tam, kde jste přestali</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard/analytics')}>
          <BarChart3 className="mr-2 size-4 text-purple-600 dark:text-purple-400" />
          <div className="flex flex-col">
            <span className="font-medium">Můj Pokrok</span>
            <span className="text-xs text-muted-foreground">Sledujte své výsledky</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SidebarPanelProps {
  module: NavModuleConfig;
  utilities: NavItemConfig[];
}

function isItemActive(pathname: string, itemPath: string): boolean {
  if (pathname === itemPath) return true;
  if (pathname === "/dashboard" && itemPath === "/dashboard") return true;
  return false;
}

function SidebarPanel({ module, utilities }: SidebarPanelProps) {
  const [setupOpen, setSetupOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const pathname = location.pathname;

  const primarySections = module.sections.filter((s) => s.id !== "studio-setup");
  const setupSection = module.sections.find((s) => s.id === "studio-setup");

  const isSetupActive =
    setupSection?.items.some((item) => isItemActive(pathname, item.path)) ?? false;

  React.useEffect(() => {
    if (isSetupActive) {
      setSetupOpen(true);
    }
  }, [isSetupActive]);

  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden rounded-l-xl bg-neutral-100 dark:bg-neutral-900/50 backdrop-blur-sm"
      style={{ width: `${SIDEBAR_PANEL_WIDTH}px` }}
    >
      <div
        key={module.id}
        className="relative flex min-h-0 flex-1 animate-in fade-in slide-in-from-right-2 flex-col text-neutral-500 dark:text-neutral-400 duration-200"
      >
        <div className="shrink-0 p-3">
          <div className="mb-2 flex items-center gap-2">
            <OrganizationSwitcher />
            <NotificationBell />
          </div>

          <div>
            <NewActionButton />
          </div>
        </div>

        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
          {primarySections.map((section) => (
            <div key={section.id}>
              {section.label && (
                <div className="mb-2 pl-3 text-sm text-neutral-500 dark:text-neutral-400">
                  {section.label}
                </div>
              )}
              <nav className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={isItemActive(pathname, item.path)}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>

        {(setupSection && setupSection.items.length > 0) ||
        utilities.length > 0 ? (
          <div className="shrink-0 px-3 pb-3 pt-1">
            {setupSection && setupSection.items.length > 0 && (
              <Collapsible
                open={setupOpen}
                onOpenChange={setSetupOpen}
                className="group/setup"
              >
                <div
                  className={cn("rounded-lg p-2", setupOpen && "bg-neutral-200/50 dark:bg-neutral-800/50")}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      setupOpen && "hidden",
                      isSetupActive
                        ? "bg-blue-100/50 dark:bg-blue-900/50 font-medium text-blue-600 dark:text-blue-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                    )}
                  >
                    <Settings
                      className={cn(
                        "size-4",
                        isSetupActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-500 dark:text-neutral-400"
                      )}
                    />
                    <span className="font-medium">Konfigurace</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto size-4",
                        isSetupActive ? "text-blue-400" : "text-neutral-400 dark:text-neutral-500"
                      )}
                    />
                  </CollapsibleTrigger>

                  <AnimatePresence initial={false}>
                    {setupOpen && (
                      <motion.nav
                        initial={
                          prefersReducedMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: prefersReducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 500, damping: 40, mass: 1 },
                            opacity: prefersReducedMotion ? { duration: 0 } : { duration: 0.2 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: prefersReducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 500, damping: 40, mass: 1 },
                            opacity: prefersReducedMotion ? { duration: 0 } : { duration: 0.15 },
                          },
                        }}
                        className="scrollbar-hide relative flex max-h-[40vh] flex-col gap-0.5 overflow-y-auto pr-6"
                      >
                        <CollapsibleTrigger
                          className="absolute right-0 top-0 p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                          aria-label="Collapse configuration"
                        >
                          <ChevronDown className="size-4" />
                        </CollapsibleTrigger>
                        {setupSection.items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: {
                                delay: prefersReducedMotion ? 0 : i * 0.03,
                                duration: prefersReducedMotion ? 0 : 0.2,
                                ease: [0.25, 0.1, 0.25, 1],
                              },
                            }}
                            exit={{
                              opacity: 0,
                              transition: { duration: prefersReducedMotion ? 0 : 0.1 },
                            }}
                          >
                            <NavItem
                              item={item}
                              isActive={isItemActive(pathname, item.path)}
                            />
                          </motion.div>
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              </Collapsible>
            )}

            {utilities.length > 0 && (
              <div className="mt-3 border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <nav className="flex flex-col gap-0.5">
                  {utilities.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={isItemActive(pathname, item.path)}
                    />
                  ))}
                </nav>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NavItem({ item, isActive }: { item: NavItemConfig; isActive: boolean }) {
  const isExternal = item.path.startsWith("http");
  const Icon = item.icon;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternal) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
  };

  return (
    <a
      href={item.path}
      onClick={handleClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex h-8 items-center justify-between rounded-lg p-2 text-sm leading-none transition-[background-color,color,font-weight] duration-75",
        isActive
          ? "bg-blue-100/50 dark:bg-blue-900/50 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/70 active:bg-blue-100 dark:active:bg-blue-900"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400"
          )}
        />
        <span className="truncate">{item.label}</span>
      </span>
      {isExternal && (
        <ExternalLink className="size-3.5 text-neutral-500 dark:text-neutral-400 transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px" />
      )}
    </a>
  );
}

function Area({
  visible,
  direction = "right",
  children,
}: {
  visible: boolean;
  direction?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "left-0 top-0 flex size-full flex-col transition-[opacity,transform] duration-300",
        visible
          ? "relative opacity-100"
          : cn(
              "pointer-events-none absolute opacity-0",
              direction === "left" ? "-translate-x-full" : "translate-x-full"
            )
      )}
      aria-hidden={!visible}
      inert={!visible ? true : undefined}
    >
      {children}
    </div>
  );
}

interface ContentAreaProps {
  children: React.ReactNode;
}

function ContentArea({ children }: ContentAreaProps) {
  const { isPanelOpen } = useSidebar();
  const showCornerFills = isPanelOpen;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-200 dark:bg-neutral-900 md:py-2 md:pr-2">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "absolute -left-2 top-0 z-0 hidden h-3 w-5 bg-neutral-100 dark:bg-neutral-900/50 transition-opacity duration-300 md:block",
            showCornerFills ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute -left-2 bottom-0 z-0 hidden h-3 w-5 bg-neutral-100 dark:bg-neutral-900/50 transition-opacity duration-300 md:block",
            showCornerFills ? "opacity-100" : "opacity-0"
          )}
        />
        <main className="z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-16 md:rounded-xl md:bg-white dark:md:bg-neutral-950 md:pb-0">
          <div className="flex-1 overflow-auto p-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface DubSidebarProps {
  railIcons: RailIconConfig[];
  activeModule: NavModuleConfig | null;
  activeModuleId: string;
  utilities: NavItemConfig[];
  onModuleChange: (moduleId: string) => void;
}

function DubSidebar({
  railIcons,
  activeModule,
  activeModuleId,
  utilities,
  onModuleChange,
}: DubSidebarProps) {
  const { isPanelOpen } = useSidebar();

  const hasContent = activeModule !== null;
  const showPanel = hasContent && isPanelOpen;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-screen transition-[width] duration-300 md:block"
        )}
        style={
          {
            width: showPanel ? SIDEBAR_WIDTH : SIDEBAR_RAIL_WIDTH,
            "--sidebar-width": `${showPanel ? SIDEBAR_WIDTH : SIDEBAR_RAIL_WIDTH}px`,
            "--sidebar-rail-width": `${SIDEBAR_RAIL_WIDTH}px`,
            "--sidebar-panel-width": `${SIDEBAR_PANEL_WIDTH}px`,
          } as React.CSSProperties
        }
        data-panel-state={isPanelOpen ? "expanded" : "collapsed"}
        data-has-content={hasContent}
      >
        <nav className="grid size-full grid-cols-[64px_1fr]">
          <SidebarRail
            railIcons={railIcons}
            activeModuleId={activeModuleId}
            onModuleChange={onModuleChange}
          />
          <div
            className={cn(
              "relative size-full overflow-hidden py-2 transition-opacity duration-300",
              !showPanel && "opacity-0"
            )}
          >
            <Area visible={true} direction="left">
              {activeModule && (
                <SidebarPanel module={activeModule} utilities={utilities} />
              )}
            </Area>
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  );
}

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  railIcons: RailIconConfig[];
  activeModule: NavModuleConfig | null;
  activeModuleId: string;
  utilities: NavItemConfig[];
  onModuleChange: (moduleId: string) => void;
}

function MobileNavigation({
  open,
  onOpenChange,
  railIcons,
  activeModule,
  activeModuleId,
  utilities,
  onModuleChange,
}: MobileNavigationProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const handleItemSelect = () => onOpenChange(false);

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <DrawerTitle>{activeModule?.label ?? "Navigation"}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[70vh] px-4 pb-6">
            {activeModule ? (
              <>
                <div className="flex flex-col gap-6">
                  {activeModule.sections.map((section) => (
                    <div key={section.id}>
                      {section.label && (
                        <div className="mb-2 pl-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                          {section.label}
                        </div>
                      )}
                      <nav className="flex flex-col gap-0.5">
                        {section.items.map((item) => (
                          <MobileNavItem
                            key={item.id}
                            item={item}
                            isActive={isItemActive(pathname, item.path)}
                            onSelect={handleItemSelect}
                          />
                        ))}
                      </nav>
                    </div>
                  ))}
                </div>

                {utilities.length > 0 && (
                  <div className="mt-6 border-t border-neutral-200 dark:border-neutral-700 pt-3">
                    <div className="mb-2 pl-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      NÁSTROJE
                    </div>
                    <nav className="flex flex-col gap-0.5">
                      {utilities.map((item) => (
                        <MobileNavItem
                          key={item.id}
                          item={item}
                          isActive={isItemActive(pathname, item.path)}
                          onSelect={handleItemSelect}
                        />
                      ))}
                    </nav>
                  </div>
                )}
              </>
            ) : null}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg md:hidden">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${railIcons.length}, minmax(0, 1fr))`,
          }}
        >
          {railIcons.map((module) => {
            const Icon = module.icon;
            const isActive = module.moduleId === activeModuleId;
            return (
              <button
                key={module.moduleId}
                type="button"
                onClick={() => {
                  onModuleChange(module.moduleId);
                  onOpenChange(true);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
                aria-label={module.label}
              >
                <Icon className="h-5 w-5" />
                <span>{module.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({
  item,
  isActive,
  onSelect,
}: {
  item: NavItemConfig;
  isActive: boolean;
  onSelect?: () => void;
}) {
  const isExternal = item.path.startsWith("http");
  const Icon = item.icon;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternal) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
      onSelect?.();
    }
  };

  return (
    <a
      href={item.path}
      onClick={handleClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex h-8 items-center justify-between rounded-lg p-2 text-sm leading-none transition-[background-color,color,font-weight] duration-75",
        isActive
          ? "bg-blue-100/50 dark:bg-blue-900/50 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/70 active:bg-blue-100 dark:active:bg-blue-900"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400"
          )}
        />
        <span className="truncate">{item.label}</span>
      </span>
      {isExternal && (
        <ExternalLink className="size-3.5 text-neutral-500 dark:text-neutral-400 transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px" />
      )}
    </a>
  );
}

const navigationData = {
  railIcons: [
    { moduleId: "home", label: "Domů", icon: Home, defaultPath: "/dashboard" },
    { moduleId: "analytics", label: "Analytika", icon: BarChart3, defaultPath: "/dashboard/analytics" },
    { moduleId: "integrations", label: "Kurzy", icon: BookOpen, defaultPath: "/dashboard/integrations" },
    { moduleId: "billing", label: "Platby", icon: CreditCard, defaultPath: "/dashboard/billing" },
  ] as RailIconConfig[],
  modules: [
    {
      id: "home",
      label: "Domů",
      icon: Home,
      defaultPath: "/dashboard",
      sections: [
        {
          id: "main",
          label: "PŘEHLED",
          items: [
            { id: "overview", label: "Můj Dashboard", icon: Home, path: "/dashboard" },
            { id: "analytics", label: "Pokrok a Statistiky", icon: BarChart3, path: "/dashboard/analytics" },
            { id: "api", label: "API Dokumentace", icon: Code2, path: "/dashboard/api" },
          ],
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytika",
      icon: BarChart3,
      defaultPath: "/dashboard/analytics",
      sections: [
        {
          id: "main",
          label: "VAŠE VÝSLEDKY",
          items: [
            { id: "overview", label: "Celkový Přehled", icon: BarChart3, path: "/dashboard/analytics" },
            { id: "reports", label: "Reporty a Grafy", icon: FileText, path: "/dashboard/analytics" },
            { id: "progress", label: "Historie Pokroku", icon: Users, path: "/dashboard/analytics" },
          ],
        },
      ],
    },
    {
      id: "integrations",
      label: "Kurzy",
      icon: BookOpen,
      defaultPath: "/dashboard/integrations",
      sections: [
        {
          id: "main",
          label: "VZDĚLÁVÁNÍ",
          items: [
            { id: "all-courses", label: "Všechny Kurzy", icon: BookOpen, path: "/dashboard/integrations" },
            { id: "my-courses", label: "Moje Kurzy", icon: Users, path: "/dashboard/integrations" },
            { id: "favorites", label: "Oblíbené", icon: FileText, path: "/dashboard/integrations" },
          ],
        },
      ],
    },
    {
      id: "billing",
      label: "Platby",
      icon: CreditCard,
      defaultPath: "/dashboard/billing",
      sections: [
        {
          id: "main",
          label: "PŘEDPLATNÉ",
          items: [
            { id: "overview", label: "Můj Plán", icon: CreditCard, path: "/dashboard/billing" },
            { id: "invoices", label: "Faktury", icon: FileText, path: "/dashboard/billing" },
            { id: "payment", label: "Platební Údaje", icon: Settings, path: "/dashboard/billing" },
          ],
        },
      ],
    },
  ] as NavModuleConfig[],
  utilities: [
    { id: "settings", label: "Nastavení", icon: Settings, path: "/dashboard/settings" },
    { id: "help", label: "Pomoc a Podpora", icon: HelpCircle, path: "#" },
  ] as NavItemConfig[],
};

export function ApplicationShell({ children }: { children: React.ReactNode }) {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveModuleId = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "home";
    if (path.startsWith("/dashboard/analytics")) return "analytics";
    if (path.startsWith("/dashboard/integrations")) return "integrations";
    if (path.startsWith("/dashboard/billing")) return "billing";
    return "home";
  };

  const [activeModuleId, setActiveModuleId] = React.useState(getActiveModuleId());

  React.useEffect(() => {
    setActiveModuleId(getActiveModuleId());
  }, [location.pathname]);

  const activeModule = React.useMemo(
    () => navigationData.modules.find((m) => m.id === activeModuleId) ?? navigationData.modules[0],
    [activeModuleId]
  );

  const handleModuleChange = (moduleId: string) => {
    setActiveModuleId(moduleId);
    const module = navigationData.modules.find((m) => m.id === moduleId);
    if (module) {
      navigate(module.defaultPath);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-neutral-200">
        <div className="flex min-h-0 flex-1 md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
          <DubSidebar
            railIcons={navigationData.railIcons}
            activeModule={activeModule}
            activeModuleId={activeModuleId}
            utilities={navigationData.utilities}
            onModuleChange={handleModuleChange}
          />

          <ContentArea>
            {children}
          </ContentArea>
        </div>

        <MobileNavigation
          open={isMobilePanelOpen}
          onOpenChange={setIsMobilePanelOpen}
          railIcons={navigationData.railIcons}
          activeModule={activeModule}
          activeModuleId={activeModuleId}
          utilities={navigationData.utilities}
          onModuleChange={handleModuleChange}
        />
      </div>
    </SidebarProvider>
  );
}
