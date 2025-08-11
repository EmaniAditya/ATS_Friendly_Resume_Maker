import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './tailwind.css'
import './index.css'
import App from './App.jsx'

// Debug: verify mount
console.log('[main] script loaded')
const rootEl = document.getElementById('root')
if (!rootEl) {
  console.error('[main] #root not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
