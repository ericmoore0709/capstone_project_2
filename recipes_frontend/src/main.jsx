import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider.jsx'
import NotificationProvider from './providers/NotificationProvider.jsx'
import ShelvesProvider from './providers/ShelvesProvider.jsx'
import RecipesProvider from './providers/RecipesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ShelvesProvider>
            <RecipesProvider>
              <App />
            </RecipesProvider>
          </ShelvesProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
