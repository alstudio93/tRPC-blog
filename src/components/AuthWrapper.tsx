import { signIn, useSession } from 'next-auth/react';
import Footer from './Footer';
import Navbar from './Navbar';

const AuthWrapper: React.FC<{
    children: React.ReactNode;
    redirect: string;
}> = ({children, redirect}) => {

    const { status } = useSession();

    const authCheck = () => {
        if(status === "unauthenticated"){
           signIn("github", {
                callbackUrl: `http://localhost:3000/profile/${redirect}`
            })
        }
    }

    authCheck();

  return (
    <>
        {status === "authenticated" && (
            <div className='min-h-screen flex flex-col justify-between'>
            <Navbar/>
            {children}
            <Footer/>
            </div>
        )}
    </>
  )
}

export default AuthWrapper