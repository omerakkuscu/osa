import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Currency = 'EUR' | 'USD'
// Sabit gösterim kuru — gerçek zamanlı değil, sadece yaklaşık gösterim içindir.
// Ödeme her zaman EUR olarak Stripe üzerinden yapılır.
const FX_RATES: Record<Currency, number> = { EUR: 1, USD: 1.08 }
const SYMBOLS: Record<Currency, string> = { EUR: '€', USD: '$' }

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; formatPrice: (eurValue: number) => string }
const CurrencyContext = createContext<Ctx | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try { return (localStorage.getItem('osa-currency') as Currency) || 'EUR' } catch { return 'EUR' }
  })

  useEffect(() => {
    try { localStorage.setItem('osa-currency', currency) } catch { /* ignore */ }
  }, [currency])

  function setCurrency(c: Currency) { setCurrencyState(c) }

  function formatPrice(eurValue: number): string {
    const converted = eurValue * FX_RATES[currency]
    const formatted = converted.toLocaleString(currency === 'EUR' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return currency === 'EUR' ? `${formatted} €` : `$${formatted}`
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}

export { SYMBOLS }
