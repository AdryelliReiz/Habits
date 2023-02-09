import * as Popover from "@radix-ui/react-popover"
import { useAuth0 } from "@auth0/auth0-react";

export function NavBar() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    if(isLoading) {
        return <div/>
    }
    return (
        <div className="w-full h-16 fixed top-0 px-20 bg-background flex items-center justify-end">
            {isAuthenticated && user ? (
                <Popover.Root>
                    <Popover.Trigger className="p-4" />
                    <img 
                        className="w-12 h-12 rounded-full border-1 border-violet-800" 
                        src={user.picture} 
                        alt={user.name} 
                    />
                    <p className="font-semibold leading-tight" >{user.name}</p>
                
                    <Popover.Portal>
                        <Popover.Content className="w-full p-6 rounded-2xl bg-zinc-900" >
                            <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                        
                            <button 
                                className="border border-violet-500 font-semibold rounded-lg px-4 py-2 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background hover:border-violet-300"
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            >
                                Log Out
                            </button>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            ) : <button 
                    className="border border-violet-500 font-semibold rounded-lg px-4 py-2 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background hover:border-violet-300"
                    onClick={() => loginWithRedirect()}
                >
                    Log In
                </button>}
        </div>
    )
}