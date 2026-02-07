import {
  BarChart3,
  BookOpen,
  ChevronDown,
  type LucideIcon,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Receipt,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
}

const adminNav: NavItem[] = [
  { id: 'overview', label: 'Prehled', icon: BarChart3, path: '/admin' },
  { id: 'users', label: 'Uzivatele', icon: Users, path: '/admin/users' },
  { id: 'courses', label: 'Kurzy', icon: BookOpen, path: '/admin/courses' },
  { id: 'invoices', label: 'Faktury', icon: Receipt, path: '/admin/invoices' },
]

const SIDEBAR_WIDTH = 260
const RAIL_WIDTH = 64

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'A'
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const sidebarWidth = collapsed ? RAIL_WIDTH : SIDEBAR_WIDTH

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <aside
          className="sticky top-0 z-40 hidden h-screen flex-col transition-[width] duration-300 md:flex"
          style={{ width: sidebarWidth }}
        >
          <div className="flex h-full flex-col bg-neutral-100 dark:bg-neutral-900">
            <div className={cn('flex items-center gap-2 p-4', collapsed && 'justify-center px-2')}>
              <Link to="/admin" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                  <Shield className="size-4" />
                </div>
                {!collapsed && (
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Admin Panel
                  </span>
                )}
              </Link>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-2">
              {adminNav.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                const navLink = (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-75',
                      collapsed && 'justify-center px-0',
                      active
                        ? 'bg-red-100/60 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        : 'text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        active ? 'text-red-700 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </a>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                return navLink
              })}
            </nav>

            <div className="border-t border-neutral-200 p-2 dark:border-neutral-800">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 w-full"
                    onClick={() => setCollapsed((c) => !c)}
                  >
                    {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
                    {!collapsed && <span className="ml-2 text-sm">Sbalit</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={8}>
                    Rozbalit
                  </TooltipContent>
                )}
              </Tooltip>

              <div className="mt-2 flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-black/5 dark:hover:bg-white/5',
                        collapsed && 'justify-center'
                      )}
                    >
                      <Avatar className="size-7 shrink-0">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user?.email?.split('@')[0] || 'Admin')}
                        </AvatarFallback>
                      </Avatar>
                      {!collapsed && (
                        <>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
                              {user?.email?.split('@')[0]}
                            </span>
                            <span className="truncate text-[10px] text-neutral-500">Admin</span>
                          </div>
                          <ChevronDown className="size-3.5 text-neutral-400" />
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={collapsed ? 'center' : 'end'} side="top" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Settings className="mr-2 size-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/')}>
                      Domovska stranka
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 size-4" />
                      Odhlasit se
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </aside>

        <MobileAdminNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          items={adminNav}
          isActive={isActive}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:py-2 md:pr-2">
          <div className="flex items-center gap-2 border-b bg-white p-3 md:hidden dark:border-neutral-700 dark:bg-neutral-900">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setMobileOpen(true)}>
              <PanelLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded bg-red-600 text-white">
                <Shield className="size-3" />
              </div>
              <span className="text-sm font-semibold">Admin</span>
            </div>
          </div>
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden pb-16 md:rounded-xl md:bg-white md:pb-0 dark:md:bg-neutral-900">
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 sm:p-6 md:pb-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

function MobileAdminNav({
  open,
  onOpenChange,
  items,
  isActive,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: NavItem[]
  isActive: (path: string) => boolean
}) {
  const navigate = useNavigate()

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <DrawerTitle>Admin navigace</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[70vh] px-4 pb-6">
            <nav className="flex flex-col gap-1">
              {items.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                      onOpenChange(false)
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-red-100/60 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        : 'text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn('size-4', active ? 'text-red-700 dark:text-red-400' : 'text-neutral-500')} />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 px-[15px]">
          {items.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 text-xs',
                  active ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
