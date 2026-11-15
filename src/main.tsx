import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/sora/400.css'
import '@fontsource/sora/500.css'
import '@fontsource/sora/600.css'
import '@fontsource/geist-mono/500.css'
import '@/index.css'
import App from '@/App.tsx'
import { preloadDeck } from '@/deck/preload.ts'

const root = createRoot(document.getElementById('root')!)

void preloadDeck().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
