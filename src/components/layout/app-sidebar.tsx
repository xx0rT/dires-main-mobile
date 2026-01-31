import {
  RiSettingsLine,
  RiSpeedUpLine,
  RiBookOpenLine,
  RiUserLine,
  RiBillLine,
  RiMailLine,
} from '@remixicon/react'
import { Link, useLocation } from 'react-router-dom'
import type * as React from 'react'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { site } from '@/config/site'

const data = {
  navMain: [
    {
      title: 'Hlavní',
      items: [
        { title: 'Přehled', url: '/dashboard', icon: RiSpeedUpLine },
        { title: 'Moje Kurzy', url: '/dashboard/integrations', icon: RiBookOpenLine },
        { title: 'Platby', url: '/dashboard/billing', icon: RiBillLine },
        { title: 'Profil', url: '/dashboard/settings', icon: RiUserLine },
        { title: 'Nastavení', url: '/dashboard/api', icon: RiSettingsLine },
        { title: 'Kontakt', url: '/dashboard/analytics', icon: RiMailLine },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 border-b flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img
                    src={site.logo}
                    alt={site.name}
                    className="h-8 w-8 rounded-sm bg-muted p-1"
                  />
                </div>
                <span className="truncate font-semibold">{site.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-xs font-medium tracking-wide text-muted-foreground">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((navItem) => {
                  const isActive = pathname === navItem.url

                  return (
                    <SidebarMenuItem key={navItem.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={navItem.title}
                        isActive={isActive}
                      >
                        <Link to={navItem.url}>
                          {navItem.icon && (
                            <navItem.icon size={18} />
                          )}
                          <span>{navItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
