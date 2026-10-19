import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Developer & Author Attribution Watermark
console.log(
  '%c ProductVision 3D Studio %c Designed & Engineered by Vishal Kumar Mohaniya ',
  'background: #06b6d4; color: #020617; font-weight: 700; padding: 4px 8px; border-radius: 4px 0 0 4px;',
  'background: #0f172a; color: #38bdf8; font-weight: 600; padding: 4px 8px; border-radius: 0 4px 4px 0; border: 1px solid #0891b2;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
