import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

const AllUsers = () => {
    const {data} = trpc.useQuery(["user.get-all-users"]);


    return (
    <div className='flex flex-col gap-y-10 items-center mx-auto'>
        {data?.map((user)=> (
            <div key={user.id} >
                <div className="flex items-center justify-between w-52 gap-x-5 ">
                <Link href={`/profile/${user?.id}`}><a><h1>{user.name}</h1></a></Link>
            {user.image && user.name && <Image src={user?.image} height="50" width="50" className='rounded-full' alt={user?.name}/>}
            </div>
                <div className='border-b pb-10' />
            </div>
        ))}
    </div>
  )
}

export default AllUsers