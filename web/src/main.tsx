import React from 'react'
import ReactDOM from 'react-dom/client'
import {Auth0Provider} from "@auth0/auth0-react"
import {App} from './App'
import { AuthenticateTokenContextProvider } from './contexts/AuthenticateTokenContext'
import { SummaryContextProvider } from './contexts/SummaryContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="adry-dev.us.auth0.com"
      clientId="T8l60b61VYXBIJvPNgYxpFj5vQywCs19"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AuthenticateTokenContextProvider>
        <SummaryContextProvider>
          <App />
        </SummaryContextProvider>
      </AuthenticateTokenContextProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
