import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress known upstream deprecation warning from @react-three/fiber's internal THREE.Clock usage in Three.js r187+
const originalWarn = console.warn
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('THREE.Clock: This module has been deprecated')
  ) {
    return
  }
  originalWarn.apply(console, args)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
