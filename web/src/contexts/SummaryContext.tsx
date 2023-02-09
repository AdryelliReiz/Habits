import { api } from '../lib/axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthenticateTokenContext } from './AuthenticateTokenContext';

interface SummaryContextData {
    summary: Summary
    handleUpdateSummary: () => Promise<void>
}

interface ProviderProps {
    children: ReactNode;
}
type Summary = Array<{
    id: string
    date: string
    amount: number
    completed: number
}>

export const SummaryContext = createContext({} as SummaryContextData);

export const SummaryContextProvider = ({children}: ProviderProps) => {
    const [summary, setSummary] = useState<Summary>([])

    const {token} = useContext(AuthenticateTokenContext)


    async function handleUpdateSummary() {
        if(token !== "") {
            api.get("/summary", {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            }).then(response => {
                setSummary(response.data)
            })
        }
    }

    useEffect(() => {
        handleUpdateSummary()
    }, [token])

  return (
    <SummaryContext.Provider
      value={{
        summary,
        handleUpdateSummary
      }}
    >
      {children}
    </SummaryContext.Provider>
  )
}
