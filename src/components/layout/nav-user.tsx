import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  RiFindReplaceLine,
  RiLogoutCircleLine,
  RiMore2Line,
  RiTimer2Line,
  RiHomeLine,
  RiUserLine,
  RiLockLine,
  RiBankCardLine,
} from '@remixicon/react'

import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, signOut, loading } = useAuth()
  const { hasActiveSubscription } = useSubscription()

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out">
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
            <div className="ms-1 grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Načítání...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
    return null
  }

  const displayName = user.email?.split('@')[0] || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:active:bg-transparent group-data-[collapsible=icon]:hover:bg-transparent"
            >
              <Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out group-data-[collapsible=icon]:size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ms-1 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2">
                  <span className={`truncate font-medium ${hasActiveSubscription ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                    {displayName}
                  </span>
                  {hasActiveSubscription && (
                    <Badge variant="outline" className="h-4 px-1 bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                      <Star className="mr-0.5 size-2.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-[10px]">Premium</span>
                    </Badge>
                  )}
                </div>
                <span className="truncate text-muted-foreground text-xs">{user.email}</span>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent group-data-[collapsible=icon]:hidden">
                <RiMore2Line className="size-5 opacity-40" size={20} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild className="gap-3 px-1">
              <Link to="/dashboard">
                <RiTimer2Line size={20} className="text-muted-foreground/70" aria-hidden="true" />
                <span>Přehled</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-3 px-1">
              <Link to="/dashboard/settings">
                <RiUserLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
                <span>Účet</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-3 px-1">
              <Link to="/dashboard/billing">
                <RiBankCardLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
                <span>Fakturace</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 px-1">
              <RiLockLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
              <span>Zabezpečení</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 px-1">
              <RiFindReplaceLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
              <span>Historie</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-3 px-1">
              <Link to="/">
                <RiHomeLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
                <span>Domovská stránka</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer gap-3 px-1" onClick={signOut}>
              <RiLogoutCircleLine size={20} className="text-muted-foreground/70" aria-hidden="true" />
              <span>Odhlásit se</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
