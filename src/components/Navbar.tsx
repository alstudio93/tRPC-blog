import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';

const Navbar = () => {

  const router = useRouter();

    const {data: session, status} = useSession();
   

  return (
    <nav className='flex items-center justify-between pl-10 pr-20'>
        <Link href="/"><a><img src="/logo.png" height={50} width={150} /></a></Link>

        <ul className='flex gap-x-5'>
            <li>
                <Link href="/"><a>Home</a></Link>
            </li>
            {
              session && 
              <>
                <li>
                  <Link href="/post"><a>My Blogs</a></Link>
                </li>
                <li>
                  <Link href={"/profile/" + session?.user?.id}><a>Profile</a></Link>
                </li>
              </>
            }
            <li>
            {!session ? <button onClick={()=> signIn("github")}>Login</button> : <button onClick={()=> signOut({callbackUrl: "/"})}>Logout</button>}
            </li>
            {session && (
          <>
          {/* <p>{session.user?.name}</p>  */}
          <Image src={session.user?.image!} height={30} width={30} objectFit="cover" className="rounded-full "/>
          </>
        )}
            
        </ul>

    </nav>
  )
}

export default Navbar