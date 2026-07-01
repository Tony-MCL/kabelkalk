import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProjectProvider } from './context/ProjectContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectProvider>
      <App />
    </ProjectProvider>
  </StrictMode>,
)