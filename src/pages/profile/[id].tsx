import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import AuthWrapper from '../../components/AuthWrapper';
import Markdown from '../../components/Markdown';
import { trpc } from '../../utils/trpc'
import BlogCard from '../../components/blogCard';
import { useSession } from 'next-auth/react';



const Profile = ({id}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data: session} = useSession();

    const [isEditing, setIsEditing] = useState(false);

    const {data: userProfile} = trpc.useQuery(["user.get-profile", {id}]);

    const {data: recentPosts} = trpc.useQuery(["post.get-my-posts"]);

    const client = trpc.useContext();

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name: userProfile?.name,
            about: userProfile?.about
        }
    });

    const editProfile = trpc.useMutation("user.edit-profile", {
        onSuccess: ()=> {
            client.invalidateQueries(["user.get-profile"]);
        }
    });

    const onEdit = ({name, about}: {name: any; about: any}) => {
        setIsEditing(true);
        return editProfile.mutate({
            id,
            name,
            about
        })
    };

    const isProfileOwner = session?.user?.id === userProfile?.id

  return (
    <AuthWrapper>
        <main className='py-5 max-w-6xl mx-auto'>
        
                <div className='flex justify-between items-center gap-x-10'>
                    <h1 className='text-5xl'>{userProfile?.name}</h1>
                    {userProfile?.image && <Image src={userProfile?.image} height="100" width="100" alt="" className='rounded-full'/>}
                </div>
                <div className='w-full leading-relaxed'>
                    {userProfile?.about && <Markdown>{userProfile?.about}</Markdown>}
                </div>
            {
                isProfileOwner && (
                    <form className='flex flex-col gap-y-8 max-w-lg mx-auto pt-10'>
                {/* <h2 className='text-center text-2xl'>Update your Profile Information</h2> */}
                {
                    isEditing && (
                        <>
                            <fieldset className="flex flex-col gap-y-2">  
                                <label htmlFor='fullName'>Full Name</label>
                                <input id="fullName" className="px-5 py-2 rounded-lg rounded-br-none" placeholder='Your Name' {...register("name")}/>
                            </fieldset>
                        {/*
                            TODO -- Store Value in local storage so an edit does not get erased upon page refresh
                        */}
                            <fieldset className="flex flex-col gap-y-2">
                                <label htmlFor="biography">Biography</label>
                                <ReactTextareaAutosize id="biography" className="px-5 py-2 rounded-lg" placeholder='Write a little about yourself' {...register("about")}/>
                            </fieldset>
                        </>
                    )
                }
                <div className='flex  justify-center gap-x-5'>
                    <button onClick={handleSubmit(onEdit)} className=" border px-4 py-2 mt-5 flex-1">
                        {isEditing ? "Publish Changes"  : "Edit Profile"}
                    </button>
                    {isEditing && 
                        <button className=' border px-4 py-2 mt-5' onClick={()=> setIsEditing(false)}>Cancel Edit</button>
                    }
                </div>
            </form>
                )
            }

            {/* Show Most Recent Posts */}
            <section className='flex gap-x-5 items-center'>
                {recentPosts?.map((blog)=> (
                    <BlogCard 
                    key={blog.id}
                    onHomePage={true}
                    inputs={{
                      id: blog.id,
                      title: blog.title,
                      content: blog.content,
                      created: blog.createdAt,
                      updated: blog.updated,
                      username: blog.user.name,
                      image: blog.user.image,
                      email: blog.user.email,
                    }}/>
                ))}
            </section>
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