import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Product } from './data'
import { useLanguage } from './LanguageContext'

export type CartLine = { product: Product; quantity: number }
type ToastItem = { id: number; text: string }
type Ctx = {
  lines: CartLine[]
  cartOpen: boolean
  cartBump: boolean
  toasts: ToastItem[]
  setCartOpen: (v: boolean) => void
  addToCart: (p: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}
const CartContext = createContext<Ctx | null>(null)

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem('osa-cart-v2')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const [lines, setLines] = useState<CartLine[]>(loadCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    try { localStorage.setItem('osa-cart-v2', JSON.stringify(lines)) } catch { /* ignore */ }
  }, [lines])

  useEffect(() => {
    if (!toasts.length) return
    const timer = setTimeout(() => setToasts((arr) => arr.slice(1)), 2800)
    return () => clearTimeout(timer)
  }, [toasts])

  function addToCart(product: Product, quantity = 1) {
    const stock = typeof product.stock === 'number' ? product.stock : Infinity
    let actuallyAdded = 0
    let hitLimit = false
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id)
      const currentQty = existing?.quantity || 0
      const room = Math.max(0, stock - currentQty)
      const toAdd = Math.min(quantity, room)
      actuallyAdded = toAdd
      hitLimit = toAdd < quantity
      if (toAdd <= 0) return prev
      if (existing) return prev.map((l) => l.product.id === product.id ? { ...l, quantity: l.quantity + toAdd } : l)
      return [...prev, { product, quantity: toAdd }]
    })

    if (actuallyAdded > 0) {
      setToasts((arr) => [...arr, { id: Date.now() + Math.random(), text: actuallyAdded > 1 ? t('toast_added_qty', { name: product.name, qty: actuallyAdded }) : t('toast_added', { name: product.name }) }])
      setCartBump(true)
      setTimeout(() => setCartBump(false), 400)
    }
    if (hitLimit) {
      setToasts((arr) => [...arr, { id: Date.now() + Math.random() + 1, text: t('stock_limit_reached') }])
    }
  }
  function removeFromCart(productId: number) {
    setLines((prev) => prev.filter((l) => l.product.id !== productId))
  }
  function setQuantity(productId: number, quantity: number) {
    setLines((prev) => prev.map((l) => {
      if (l.product.id !== productId) return l
      const stock = typeof l.product.stock === 'number' ? l.product.stock : Infinity
      const capped = Math.min(Math.max(1, quantity), stock)
      return { ...l, quantity: capped }
    }))
  }
  function clearCart() {
    setLines([])
  }
  const cartCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const cartTotal = lines.reduce((sum, l) => sum + l.product.priceValue * l.quantity, 0)

  return <CartContext.Provider value={{ lines, cartOpen, cartBump, toasts, setCartOpen, addToCart, removeFromCart, setQuantity, clearCart, cartCount, cartTotal }}>
    {children}
  </CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
