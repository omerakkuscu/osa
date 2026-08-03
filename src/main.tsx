import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './LanguageContext.tsx'
import { CurrencyProvider } from './CurrencyContext.tsx'
import { ContentProvider } from './ContentContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </StrictMode>,
)
