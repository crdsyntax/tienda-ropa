import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { BackofficeApp } from './features/backoffice'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { MerchantPaymentProvider } from './context/MerchantPaymentContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <OrdersProvider>
          <MerchantPaymentProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/admin" element={<BackofficeApp />} />
            </Routes>
          </MerchantPaymentProvider>
        </OrdersProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
