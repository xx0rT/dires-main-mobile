import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  type LucideIcon,
  Layers,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Receipt,
  Settings,
  Shield,
  ShoppingBag,
  Target,
  Users,
  BarChart3,
  CreditCard,
} from "lucide-react";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useAdmin } from "@/lib/use-admin";
import { useSelectedCourse } from "@/lib/selected-course-context";

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

export interface NavItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavSectionConfig {
  id: string;
  label?: string;
  items: NavItemConfig[];
}

export interface NavModuleConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultPath: string;
  sections: NavSectionConfig[];
}

export interface RailIconConfig {
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
      aria-label={isPanelOpen ? "Sbalit postranní panel" : "Rozbalit postranní panel"}
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
        <span>{isPanelOpen ? "Sbalit" : "Rozbalit"}</span>
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
    <div className="flex h-full w-16 flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-3 p-2">
        <div className="pb-1 pt-2">
          <a
            href="/"
            className="block rounded-lg px-1 py-4 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={20}
              className="h-5"
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
                      "relative flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50",
                      isActive
                        ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                        : "text-neutral-600 hover:bg-black/5 active:bg-black/10 dark:text-neutral-400 dark:hover:bg-white/5 dark:active:bg-white/10"
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
        <SidebarTrigger className="size-11 text-neutral-600 hover:bg-black/5 active:bg-black/10 dark:text-neutral-400 dark:hover:bg-white/5 dark:active:bg-white/10" />

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
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-11 items-center justify-center rounded-lg hover:bg-black/5 active:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/50 dark:hover:bg-white/5 dark:active:bg-white/10 dark:focus-visible:ring-white/50"
          aria-label="Účet"
        >
          <Avatar className="size-7">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ""} />
            <AvatarFallback className="text-xs">
              {getInitials(user?.email?.split('@')[0] || "User")}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.email?.split('@')[0] || "Uživatel"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/prehled/nastaveni')}>Nastavení</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/')}>Domovská stránka</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/prehled/fakturace')}>Fakturace</DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <Shield className="mr-2 size-4 text-red-500" />
              Admin Panel
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/prihlaseni')}>Odhlásit se</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrganizationSwitcher() {
  const navigate = useNavigate();
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse } = useSelectedCourse();

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigate("/prehled");
  };

  const handleShowAll = () => {
    setSelectedCourseId(null);
    navigate("/prehled");
  };

  const triggerLabel = selectedCourse ? selectedCourse.title : "Moje Kurzy";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5">
          <div className="flex size-6 items-center justify-center rounded bg-neutral-200 dark:bg-neutral-800">
            <img
              src="/logo.svg"
              alt="Moje Kurzy"
              width={16}
              height={16}
              className="size-4"
            />
          </div>
          <span className="flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {triggerLabel}
          </span>
          <ChevronDown className="size-4 text-neutral-500 dark:text-neutral-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Moje Kurzy</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShowAll}>
          <div className="flex items-center gap-2 w-full">
            <div className="flex size-6 items-center justify-center rounded bg-neutral-200 dark:bg-neutral-800 shrink-0">
              <Home className="size-3.5" />
            </div>
            <span className="truncate flex-1">Prehled</span>
            {!selectedCourseId && <Check className="size-4 text-blue-600 shrink-0" />}
          </div>
        </DropdownMenuItem>
        {courses.length > 0 && <DropdownMenuSeparator />}
        {courses.map((course) => (
          <DropdownMenuItem
            key={course.id}
            onClick={() => handleSelectCourse(course.id)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="flex size-6 items-center justify-center rounded bg-neutral-200 dark:bg-neutral-800 shrink-0">
                <BookOpen className="size-3.5" />
              </div>
              <span className="truncate flex-1">{course.title}</span>
              {selectedCourseId === course.id && <Check className="size-4 text-blue-600 shrink-0" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/kurzy')}>
          <Plus className="mr-2 size-4" />
          Zapsat se na kurz
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
      className="ml-auto size-8 text-neutral-600 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"
      aria-label="Oznámení"
    >
      <Bell className="size-4" />
    </Button>
  );
}

function NewActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-start gap-2 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200">
          <Plus className="size-4" />
          Nový
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem>Nová Lekce</DropdownMenuItem>
        <DropdownMenuItem>Nová Poznámka</DropdownMenuItem>
        <DropdownMenuItem>Nový Dotaz</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SidebarPanelProps {
  module: NavModuleConfig;
  utilities: NavItemConfig[];
  panelHeader?: React.ReactNode;
}

function isItemActive(pathname: string, itemPath: string): boolean {
  if (pathname === itemPath) return true;
  if (pathname === "/prehled" && itemPath === "/prehled") return true;
  if (itemPath !== "/prehled" && pathname.startsWith(itemPath + "/")) return true;
  return false;
}

function SidebarPanel({ module, utilities, panelHeader }: SidebarPanelProps) {
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
      className="relative flex h-screen flex-col overflow-hidden rounded-l-xl bg-neutral-100 dark:bg-neutral-900"
      style={{ width: `${SIDEBAR_PANEL_WIDTH}px` }}
    >
      <div
        key={module.id}
        className="relative flex min-h-0 flex-1 animate-in fade-in slide-in-from-right-2 flex-col text-neutral-500 dark:text-neutral-500 duration-200"
      >
        <div className="shrink-0 p-3">
          {panelHeader ?? (
            <>
              <div className="mb-2 flex items-center gap-2">
                <OrganizationSwitcher />
                <NotificationBell />
              </div>
              <div>
                <NewActionButton />
              </div>
            </>
          )}
        </div>

        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-3">
          {primarySections.map((section) => (
            <div key={section.id}>
              {section.label && (
                <div className="mb-2 pl-3 text-sm text-neutral-500 dark:text-neutral-500">
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
                        ? "bg-neutral-200/70 font-medium text-neutral-900 dark:bg-neutral-800/70 dark:text-neutral-100"
                        : "text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                    )}
                  >
                    <Settings
                      className={cn(
                        "size-4",
                        isSetupActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-500"
                      )}
                    />
                    <span className="font-medium">Konfigurace</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto size-4",
                        isSetupActive ? "text-neutral-500" : "text-neutral-400 dark:text-neutral-600"
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
                          className="absolute right-0 top-0 p-1 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
                          aria-label="Sbalit konfiguraci"
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
              <div className="mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-800">
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
          ? "bg-neutral-200/70 font-medium text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800/70 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
          : "text-neutral-700 hover:bg-black/5 active:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/5 dark:active:bg-white/10"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400"
          )}
        />
        <span className="truncate">{item.label}</span>
      </span>
      {isExternal && (
        <ExternalLink className="size-3.5 text-neutral-500 transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px dark:text-neutral-500" />
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
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-200 md:py-2 md:pr-2 dark:bg-neutral-800">
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div
          className={cn(
            "absolute -left-2 top-0 z-0 hidden h-3 w-5 bg-neutral-100 transition-opacity duration-300 md:block dark:bg-neutral-900",
            showCornerFills ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute -left-2 bottom-0 z-0 hidden h-3 w-5 bg-neutral-100 transition-opacity duration-300 md:block dark:bg-neutral-900",
            showCornerFills ? "opacity-100" : "opacity-0"
          )}
        />
        <main className="z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-16 md:rounded-xl md:bg-white md:pb-0 dark:md:bg-neutral-900">
          <div
            className="flex-1 overflow-y-auto px-4 pb-24 sm:px-6 md:px-6 md:pb-6"
            style={{
              WebkitOverflowScrolling: 'touch',
              overflowX: 'clip',
              paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 16px)',
            }}
          >
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
  panelHeader?: React.ReactNode;
}

function DubSidebar({
  railIcons,
  activeModule,
  activeModuleId,
  utilities,
  onModuleChange,
  panelHeader,
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
                <SidebarPanel module={activeModule} utilities={utilities} panelHeader={panelHeader} />
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
            <DrawerTitle>{activeModule?.label ?? "Navigace"}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[70vh] px-[15px] pb-6">
            {activeModule ? (
              <>
                <div className="flex flex-col gap-6">
                  {activeModule.sections.map((section) => (
                    <div key={section.id}>
                      {section.label && (
                        <div className="mb-2 pl-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
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
                  <div className="mt-6 border-t border-neutral-200 pt-3 dark:border-neutral-800">
                    <div className="mb-2 pl-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                      Nástroje
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

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div
          className="grid px-[15px]"
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
                  "flex flex-col items-center gap-1 py-2 text-xs",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
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
          ? "bg-neutral-200/70 font-medium text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800/70 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
          : "text-neutral-700 hover:bg-black/5 active:bg-black/10 dark:text-neutral-300 dark:hover:bg-white/5 dark:active:bg-white/10"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400"
          )}
        />
        <span className="truncate">{item.label}</span>
      </span>
      {isExternal && (
        <ExternalLink className="size-3.5 text-neutral-500 transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px dark:text-neutral-500" />
      )}
    </a>
  );
}

export interface NavigationConfig {
  railIcons: RailIconConfig[];
  modules: NavModuleConfig[];
  utilities: NavItemConfig[];
}

const navigationData: NavigationConfig = {
  railIcons: [
    { moduleId: "home", label: "Domu", icon: Home, defaultPath: "/prehled" },
    { moduleId: "analytics", label: "Statistiky", icon: BarChart3, defaultPath: "/prehled/pokrok" },
    { moduleId: "integrations", label: "Kurzy", icon: BookOpen, defaultPath: "/prehled/moje-kurzy" },
    { moduleId: "billing", label: "Platby", icon: CreditCard, defaultPath: "/prehled/predplatne" },
  ] as RailIconConfig[],
  modules: [
    {
      id: "home",
      label: "Domu",
      icon: Home,
      defaultPath: "/prehled",
      sections: [
        {
          id: "main",
          items: [
            { id: "overview", label: "Prehled", icon: Home, path: "/prehled" },
            { id: "my-courses-home", label: "Moje Kurzy", icon: BookOpen, path: "/prehled/moje-kurzy" },
            { id: "progress-home", label: "Pokrok", icon: BarChart3, path: "/prehled/pokrok" },
            { id: "certificates-home", label: "Certifikaty", icon: Award, path: "/prehled/certifikaty" },
          ],
        },
      ],
    },
    {
      id: "analytics",
      label: "Statistiky",
      icon: BarChart3,
      defaultPath: "/prehled/pokrok",
      sections: [
        {
          id: "main",
          items: [
            { id: "progress", label: "Pokrok", icon: BarChart3, path: "/prehled/pokrok" },
            { id: "test-results", label: "Vysledky Testu", icon: Target, path: "/prehled/vysledky-testu" },
            { id: "certificates", label: "Certifikaty", icon: Award, path: "/prehled/certifikaty" },
            { id: "study-time", label: "Studijni doba", icon: Layers, path: "/prehled/analytika" },
          ],
        },
      ],
    },
    {
      id: "integrations",
      label: "Kurzy",
      icon: BookOpen,
      defaultPath: "/prehled/moje-kurzy",
      sections: [
        {
          id: "main",
          items: [
            { id: "my-courses", label: "Moje Kurzy", icon: BookOpen, path: "/prehled/moje-kurzy" },
            { id: "all-courses", label: "Prohlidnout Kurzy", icon: Users, path: "/prehled/integrace" },
            { id: "course-certificates", label: "Certifikaty", icon: Award, path: "/prehled/certifikaty" },
          ],
        },
      ],
    },
    {
      id: "billing",
      label: "Platby",
      icon: CreditCard,
      defaultPath: "/prehled/predplatne",
      sections: [
        {
          id: "main",
          items: [
            { id: "subscription", label: "Predplatne", icon: CreditCard, path: "/prehled/predplatne" },
            { id: "invoices", label: "Faktury", icon: FileText, path: "/prehled/faktury" },
            { id: "orders", label: "Objednavky", icon: ShoppingBag, path: "/prehled/fakturace" },
            { id: "payment-methods", label: "Platebni metody", icon: Receipt, path: "/prehled/nastaveni" },
          ],
        },
      ],
    },
  ] as NavModuleConfig[],
  utilities: [
    { id: "settings", label: "Nastaveni", icon: Settings, path: "/prehled/nastaveni" },
    { id: "help", label: "Pomoc & Podpora", icon: HelpCircle, path: "#" },
  ] as NavItemConfig[],
};

interface ApplicationShellProps {
  children: React.ReactNode;
  navigationConfig?: NavigationConfig;
  resolveActiveModuleId?: (pathname: string) => string;
  panelHeader?: React.ReactNode;
  defaultSidebarOpen?: boolean;
}

export function ApplicationShell({
  children,
  navigationConfig = navigationData,
  resolveActiveModuleId: resolveActiveModuleIdProp,
  panelHeader,
  defaultSidebarOpen = true,
}: ApplicationShellProps) {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveModuleId = () => {
    if (resolveActiveModuleIdProp) return resolveActiveModuleIdProp(location.pathname);
    const path = location.pathname;
    if (path === "/prehled") return "home";
    if (path.startsWith("/prehled/pokrok")) return "analytics";
    if (path.startsWith("/prehled/vysledky-testu")) return "analytics";
    if (path.startsWith("/prehled/analytika")) return "analytics";
    if (path.startsWith("/prehled/certifikaty")) return "analytics";
    if (path.startsWith("/prehled/moje-kurzy")) return "integrations";
    if (path.startsWith("/prehled/integrace")) return "integrations";
    if (path.startsWith("/prehled/predplatne")) return "billing";
    if (path.startsWith("/prehled/faktury")) return "billing";
    if (path.startsWith("/prehled/fakturace")) return "billing";
    return "home";
  };

  const [activeModuleId, setActiveModuleId] = React.useState(getActiveModuleId());

  React.useEffect(() => {
    setActiveModuleId(getActiveModuleId());
  }, [location.pathname]);

  const activeModule = React.useMemo(
    () => navigationConfig.modules.find((m) => m.id === activeModuleId) ?? navigationConfig.modules[0],
    [activeModuleId]
  );

  const handleModuleChange = (moduleId: string) => {
    setActiveModuleId(moduleId);
    const module = navigationConfig.modules.find((m) => m.id === moduleId);
    if (module) {
      navigate(module.defaultPath);
    }
  };

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <div className="flex h-screen flex-col overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
          <DubSidebar
            railIcons={navigationConfig.railIcons}
            activeModule={activeModule}
            activeModuleId={activeModuleId}
            utilities={navigationConfig.utilities}
            onModuleChange={handleModuleChange}
            panelHeader={panelHeader}
          />

          <ContentArea>
            {children}
          </ContentArea>
        </div>

        <MobileNavigation
          open={isMobilePanelOpen}
          onOpenChange={setIsMobilePanelOpen}
          railIcons={navigationConfig.railIcons}
          activeModule={activeModule}
          activeModuleId={activeModuleId}
          utilities={navigationConfig.utilities}
          onModuleChange={handleModuleChange}
        />
      </div>
    </SidebarProvider>
  );
}
