import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import MarketingLayout from './layouts/marketing-layout'
import HomePage from './pages/home-page'
import CoursesPage from './pages/courses-page'
import ShopPage from './pages/shop-page'
import CartPage from './pages/cart-page'
import ProductDetailPage from './pages/product-detail-page'
import { CoursePlayerPage } from './pages/course-player-page'
import ScrollToTop from './components/layout/scroll-to-top'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
        <Route path="/course/:courseId" element={<CoursePlayerPage />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}
