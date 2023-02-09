import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import { useAuth0 } from '@auth0/auth0-react';
import { NavBar } from './components/Navbar';
import './styles/global.css'
import "./lib/dayjs"
import logoImage from "./assets/logo.svg"

export function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  return (
    <div className="w-screen h-screen flex justify-center items-center" >
      <NavBar />
      
      {isAuthenticated ? (
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header/>

          <SummaryTable />
        </div>
      ) : (
        <div className="w-full max-w-[560px] px-6 ">
          <div className="">
            <img src={logoImage} alt="Habits" />

            <h1 className="mt-6 text-2xl font-bold " >
              Comece agora a acompanhar o seu progresso diário!
            </h1>
          </div>
        </div>
      )}
      
    </div>
  )
}

