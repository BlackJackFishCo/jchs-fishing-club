import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { checkForUpdate } from './versionCheck.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

checkForUpdate()

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkForUpdate()
  }
})
