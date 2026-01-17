import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 👇 THIS LINE IS CRITICAL. CHECK THIS PATH.
import './assets/main.css' 

import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>,
)