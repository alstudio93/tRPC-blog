import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import AuthWrapper from '../../components/AuthWrapper';
import Markdown from '../../components/Markdown';
import { trpc } from '../../utils/trpc'

const Profile = ({id}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [isEditing, setIsEditing] = useState(false);

    const {data: userProfile} = trpc.useQuery(["user.get-profile", {id}]);

    const client = trpc.useContext();

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name: userProfile?.name! && "",
            about: userProfile?.about! && ""
        }
    });

    const editProfile = trpc.useMutation("user.edit-profile", {
        onSuccess: ()=> {
            client.invalidateQueries(["user.get-profile"]);
        }
    });

    const onEdit = ({name, about}: {name: string, about: string}) => {
        setIsEditing(true);
        return editProfile.mutate({
            id: userProfile?.id!,
            name,
            about
        })
    };

  return (
    <AuthWrapper redirect={userProfile?.name!}>
        <main className='py-5 max-w-3xl mx-auto'>
            <h1 className='capitalize text-4xl text-center'>Welcome back! {userProfile?.name!}</h1>
        
            <form className='flex flex-col gap-y-5 max-w-lg mx-auto pt-10'>
                {/* <h2 className='text-center text-2xl'>Update your Profile Information</h2> */}
                <h2 className='text-2xl'>{userProfile?.name}</h2>
                <div className='w-full leading-relaxed'>
                    <Markdown>{userProfile?.about!}</Markdown>
                </div>
                {
                    isEditing && (
                        <>
                            <input className="px-5 py-2 rounded-lg rounded-br-none" placeholder='Your Name' {...register("name")} defaultValue={userProfile?.name!}/>
                            <ReactTextareaAutosize className="px-5 py-2 rounded-lg" placeholder='Write a little about yourself' {...register("about")} defaultValue={userProfile?.about!}/>
                        </>
                    )
                }
                <div className='flex  justify-center gap-x-5'>
                    <button onClick={handleSubmit(onEdit)} className=" border px-4 py-2 mt-5 flex-1">
                        {isEditing ? "Publish Changes"  : "Edit Profile"}
                    </button>
                    {isEditing && 
                        <button className=' border px-4 py-2 mt-5' onClick={()=> setIsEditing(false)}>Cancel</button>
                    }
                </div>
            </form>
        </main>
     </AuthWrapper>
  )
}

export default Profile

export const getServerSideProps: GetServerSideProps = async({query}) => {
    const {id} = query;
    return {
        props: {
            id
        }
    }
}