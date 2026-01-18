import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthProvider } from './lib/auth-context'
import MarketingLayout from './layouts/marketing-layout'
import DashboardLayout from './layouts/dashboard-layout'
import HomePage from './pages/home-page'
import CoursesPage from './pages/courses-page'
import ShopPage from './pages/shop-page'
import CartPage from './pages/cart-page'
import ProductDetailPage from './pages/product-detail-page'
import OrderConfirmationPage from './pages/order-confirmation-page'
import DashboardPage from './pages/dashboard-page'
import AnalyticsPage from './pages/analytics-page'
import ApiPage from './pages/api-page'
import BillingPage from './pages/billing-page'
import IntegrationsPage from './pages/integrations-page'
import SettingsPage from './pages/settings-page'
import SignInPage from './pages/sign-in-page'
import SignUpPage from './pages/sign-up-page'
import ForgotPasswordPage from './pages/forgot-password-page'
import ResetPasswordPage from './pages/reset-password-page'
import VerifyEmailPage from './pages/verify-email-page'
import { CoursePlayerPage } from './pages/course-player-page'
import ScrollToTop from './components/layout/scroll-to-top'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/course/:courseId" element={<CoursePlayerPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="api" element={<ApiPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
