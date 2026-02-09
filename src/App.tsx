import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthProvider } from './lib/auth-context'
import MarketingLayout from './layouts/marketing-layout'
import DashboardLayout from './layouts/dashboard-layout'
import AdminLayout from './layouts/admin-layout'
import HomePage from './pages/home-page'
import CoursesPage from './pages/courses-page'
import ShopPage from './pages/shop-page'
import CartPage from './pages/cart-page'
import ProductDetailPage from './pages/product-detail-page'
import OrderConfirmationPage from './pages/order-confirmation-page'
import ReferencesPage from './pages/references-page'
import DashboardPage from './pages/dashboard-page'
import AnalyticsPage from './pages/analytics-page'
import ApiPage from './pages/api-page'
import BillingPage from './pages/billing-page'
import IntegrationsPage from './pages/integrations-page'
import SettingsPage from './pages/settings-page'
import SignInPage from './pages/sign-in-page'
import SignUpPage from './pages/sign-up-page'
import VerifyEmailPage from './pages/verify-email-page'
import ForgotPasswordPage from './pages/forgot-password-page'
import ResetPasswordPage from './pages/reset-password-page'
import { CoursePlayerPage } from './pages/course-player-page'
import ScrollToTop from './components/layout/scroll-to-top'
import AdminOverviewPage from './pages/admin/admin-overview-page'
import AdminUsersPage from './pages/admin/admin-users-page'
import AdminCoursesPage from './pages/admin/admin-courses-page'
import AdminInvoicesPage from './pages/admin/admin-invoices-page'
import AdminSubscriptionsPage from './pages/admin/admin-subscriptions-page'
import AdminPromoCodesPage from './pages/admin/admin-promo-codes-page'
import TeamPage from './pages/team-page'
import TeamMemberPage from './pages/team-member-page'
import BlogPage from './pages/blog-page'
import BlogPostPage from './pages/blog-post-page'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
            <Route path="kurzy" element={<CoursesPage />} />
            <Route path="obchod" element={<ShopPage />} />
            <Route path="produkt/:productId" element={<ProductDetailPage />} />
            <Route path="kosik" element={<CartPage />} />
            <Route path="reference" element={<ReferencesPage />} />
            <Route path="tym" element={<TeamPage />} />
            <Route path="tym/:slug" element={<TeamMemberPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
          </Route>
          <Route path="/potvrzeni-objednavky" element={<OrderConfirmationPage />} />
          <Route path="/prihlaseni" element={<SignInPage />} />
          <Route path="/registrace" element={<SignUpPage />} />
          <Route path="/overeni-emailu" element={<VerifyEmailPage />} />
          <Route path="/zapomenute-heslo" element={<ForgotPasswordPage />} />
          <Route path="/obnoveni-hesla" element={<ResetPasswordPage />} />
          <Route path="/kurz/:courseId" element={<CoursePlayerPage />} />
          <Route path="/prehled" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analytika" element={<AnalyticsPage />} />
            <Route path="api" element={<ApiPage />} />
            <Route path="fakturace" element={<BillingPage />} />
            <Route path="integrace" element={<IntegrationsPage />} />
            <Route path="nastaveni" element={<SettingsPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="uzivatele" element={<AdminUsersPage />} />
            <Route path="kurzy" element={<AdminCoursesPage />} />
            <Route path="predplatne" element={<AdminSubscriptionsPage />} />
            <Route path="promo-kody" element={<AdminPromoCodesPage />} />
            <Route path="faktury" element={<AdminInvoicesPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
