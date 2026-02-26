import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './lib/auth-context'
import { CartProvider } from './lib/cart-context'
import { NavVisibilityProvider } from './lib/nav-visibility-context'
import { useActivityTracker } from './lib/use-activity-tracker'
import { ProtectedRoute } from './components/layout/protected-route'
import { PageTransition } from './components/layout/page-transition'
import MarketingLayout from './layouts/marketing-layout'
import DashboardLayout from './layouts/dashboard-layout'
import AdminLayout from './layouts/admin-layout'
import HomePage from './pages/home-page'
import OnboardingPage from './pages/onboarding-page'
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
import MyCoursesPage from './pages/my-courses-page'
import MyCourseDetailPage from './pages/my-course-detail-page'
import SettingsPage from './pages/settings-page'
import SubscriptionPage from './pages/subscription-page'
import InvoicesPage from './pages/invoices-page'
import ProgressPage from './pages/progress-page'
import TestResultsPage from './pages/test-results-page'
import CertificatesPage from './pages/certificates-page'
import SignInPage from './pages/sign-in-page'
import SignUpPage from './pages/sign-up-page'
import VerifyEmailPage from './pages/verify-email-page'
import ForgotPasswordPage from './pages/forgot-password-page'
import ResetPasswordPage from './pages/reset-password-page'
import CourseOverviewPage from './pages/course-overview-page'
import CoursePartPage from './pages/course-part-page'
import ScrollToTop from './components/layout/scroll-to-top'
import AdminOverviewPage from './pages/admin/admin-overview-page'
import AdminUsersPage from './pages/admin/admin-users-page'
import AdminBlogsPage from './pages/admin/admin-blogs-page'
import AdminBlogEditorPage from './pages/admin/admin-blog-editor-page'
import AdminCoursesPage from './pages/admin/admin-courses-page'
import AdminCourseEditorPage from './pages/admin/admin-course-editor-page'
import AdminInvoicesPage from './pages/admin/admin-invoices-page'
import AdminSubscriptionsPage from './pages/admin/admin-subscriptions-page'
import AdminPromoCodesPage from './pages/admin/admin-promo-codes-page'
import TeamPage from './pages/team-page'
import TeamMemberPage from './pages/team-member-page'
import BlogPage from './pages/blog-page'
import BlogPostPage from './pages/blog-post-page'

function ActivityTrackerInit() {
  useActivityTracker()
  return null
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <NavVisibilityProvider>
        <CartProvider>
        <ScrollToTop />
        <ActivityTrackerInit />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/prihlaseni" replace />} />
            <Route path="/prihlaseni" element={<PageTransition><SignInPage /></PageTransition>} />
            <Route path="/registrace" element={<PageTransition><SignUpPage /></PageTransition>} />
            <Route path="/overeni-emailu" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
            <Route path="/zapomenute-heslo" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/obnoveni-hesla" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/onboarding" element={<ProtectedRoute><PageTransition><OnboardingPage /></PageTransition></ProtectedRoute>} />

            <Route path="/home" element={<MarketingLayout />}>
              <Route index element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="kurzy" element={<PageTransition><CoursesPage /></PageTransition>} />
              <Route path="obchod" element={<PageTransition><ShopPage /></PageTransition>} />
              <Route path="produkt/:productId" element={<PageTransition><ProductDetailPage /></PageTransition>} />
              <Route path="kosik" element={<PageTransition><CartPage /></PageTransition>} />
              <Route path="reference" element={<PageTransition><ReferencesPage /></PageTransition>} />
              <Route path="tym" element={<PageTransition><TeamPage /></PageTransition>} />
              <Route path="tym/:slug" element={<PageTransition><TeamMemberPage /></PageTransition>} />
              <Route path="blog" element={<PageTransition><BlogPage /></PageTransition>} />
              <Route path="blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />
            </Route>

            <Route path="/potvrzeni-objednavky" element={<PageTransition><OrderConfirmationPage /></PageTransition>} />
            <Route path="/order-confirmation" element={<PageTransition><OrderConfirmationPage /></PageTransition>} />
            <Route path="/kurz/:courseId" element={<ProtectedRoute><PageTransition><CourseOverviewPage /></PageTransition></ProtectedRoute>} />
            <Route path="/kurz/:courseId/cast/:partNumber" element={<ProtectedRoute><PageTransition><CoursePartPage /></PageTransition></ProtectedRoute>} />

            <Route path="/prehled" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="analytika" element={<PageTransition><AnalyticsPage /></PageTransition>} />
              <Route path="api" element={<PageTransition><ApiPage /></PageTransition>} />
              <Route path="fakturace" element={<PageTransition><BillingPage /></PageTransition>} />
              <Route path="integrace" element={<PageTransition><IntegrationsPage /></PageTransition>} />
              <Route path="moje-kurzy" element={<PageTransition><MyCoursesPage /></PageTransition>} />
              <Route path="moje-kurzy/:courseId" element={<PageTransition><MyCourseDetailPage /></PageTransition>} />
              <Route path="predplatne" element={<PageTransition><SubscriptionPage /></PageTransition>} />
              <Route path="faktury" element={<PageTransition><InvoicesPage /></PageTransition>} />
              <Route path="pokrok" element={<PageTransition><ProgressPage /></PageTransition>} />
              <Route path="vysledky-testu" element={<PageTransition><TestResultsPage /></PageTransition>} />
              <Route path="certifikaty" element={<PageTransition><CertificatesPage /></PageTransition>} />
              <Route path="nastaveni" element={<PageTransition><SettingsPage /></PageTransition>} />
            </Route>

            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<PageTransition><AdminOverviewPage /></PageTransition>} />
              <Route path="users" element={<PageTransition><AdminUsersPage /></PageTransition>} />
              <Route path="blogs" element={<PageTransition><AdminBlogsPage /></PageTransition>} />
              <Route path="blogs/:id" element={<PageTransition><AdminBlogEditorPage /></PageTransition>} />
              <Route path="courses" element={<PageTransition><AdminCoursesPage /></PageTransition>} />
              <Route path="courses/:id" element={<PageTransition><AdminCourseEditorPage /></PageTransition>} />
              <Route path="subscriptions" element={<PageTransition><AdminSubscriptionsPage /></PageTransition>} />
              <Route path="promo-codes" element={<PageTransition><AdminPromoCodesPage /></PageTransition>} />
              <Route path="invoices" element={<PageTransition><AdminInvoicesPage /></PageTransition>} />
            </Route>
          </Routes>
        </AnimatePresence>
        <Toaster />
        </CartProvider>
        </NavVisibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
