import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { initSmoothScroll } from './lib/smooth'
import { initGA } from './lib/track'

// Smooth scroll must exist before the preloader mounts (it pauses scrolling).
initSmoothScroll()
initGA()
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
