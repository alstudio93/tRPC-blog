import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { trpc } from '../utils/trpc'

const Users = ({}) => {
    const {data} = trpc.useQuery(["user.get-all-users"]);


    return (
    <div className='flex flex-col gap-y-10'>
        {data?.map((user)=> (
            <div key={user.id} className="border flex items-center w-80 gap-x-5 ">
                <Link href={`/profile/${user?.id}`}><a><h1>{user.name}</h1></a></Link>
            {user.image && user.name && <Image src={user?.image} height="50" width="50" className='rounded-full' alt={user?.name}/>}
            </div>
        ))}
    </div>
  )
}

export default Users