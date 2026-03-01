import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ApplicationShell } from '@/components/layout/application-shell'
import { SelectedCourseProvider } from '@/lib/selected-course-context'
import { useNavVisibility } from '@/lib/nav-visibility-context'
import { PresenceProvider } from '@/lib/presence-context'

function NavShowOnSubPages() {
  const location = useLocation()
  const { showMobileNav, mobileNavVisible } = useNavVisibility()

  useEffect(() => {
    if (location.pathname !== '/prehled' && !mobileNavVisible) {
      showMobileNav()
    }
  }, [location.pathname, mobileNavVisible, showMobileNav])

  return null
}

export default function DashboardLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/prihlaseni" replace />
  }

  return (
    <PresenceProvider>
      <SelectedCourseProvider>
        <ApplicationShell>
          <NavShowOnSubPages />
          <Outlet />
        </ApplicationShell>
      </SelectedCourseProvider>
    </PresenceProvider>
  )
}
