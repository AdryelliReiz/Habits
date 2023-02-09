import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import { useAuth0 } from '@auth0/auth0-react';
import './styles/global.css'
import "./lib/dayjs"
import { NavBar } from './components/Navbar';

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
        <div/>
      )}
      
    </div>
  )
}

