import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../lib/axios';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

interface AuthenticateTokenContextData {
  token: string;
}

interface ProviderProps {
  children: ReactNode;
}

export const AuthenticateTokenContext = createContext({} as AuthenticateTokenContextData);

export const AuthenticateTokenContextProvider = ({children}: ProviderProps) => {
  const [token, setToken] = useState("");

  const { user, isAuthenticated } = useAuth0();

  async function registerUserAndGetToken() {
    console.log(user)
    await api.post("/signin", {
      email: user?.email,
      username: user?.name,
      picture: user?.picture
    }).then(res => setToken(res.data.token))
  }

  useEffect(() => {
    if(isAuthenticated) {
      registerUserAndGetToken()
    }
  }, [user])

  return (
    <AuthenticateTokenContext.Provider
      value={{
        token
      }}
    >
      {children}
    </AuthenticateTokenContext.Provider>
  )
}
