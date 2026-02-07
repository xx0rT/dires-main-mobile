import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { useAdmin } from '@/lib/use-admin'
import { AdminShell } from '@/components/admin/admin-shell'

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()

  if (authLoading || adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
