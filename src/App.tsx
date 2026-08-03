import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './CartContext'
import Landing from './pages/Landing'
import ProductionsPage from './pages/ProductionsPage'
import CustomsPage from './pages/CustomsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import VanguardPage from './pages/VanguardPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import WithdrawalPage from './pages/WithdrawalPage'
import ImpressumPage from './pages/ImpressumPage'
import DatenschutzPage from './pages/DatenschutzPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AdminPage from './pages/AdminPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return <BrowserRouter>
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/productions" element={<ProductionsPage />} />
        <Route path="/customs" element={<CustomsPage />} />
        <Route path="/customs/:id" element={<ProductDetailPage />} />
        <Route path="/vanguard" element={<VanguardPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/odeme" element={<CheckoutPage />} />
        <Route path="/cayma-hakki" element={<WithdrawalPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/siparis-onay" element={<OrderConfirmationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
}

export default App
