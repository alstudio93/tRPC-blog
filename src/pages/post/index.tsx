import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import BlogCard from '../../components/blogCard';
import Navbar from '../../components/Navbar';
import { trpc } from '../../utils/trpc';
import { createPostValidation } from '../../utils/validations';

const MyBlogs = ({}) => {

  const [sort, setSort] = useState("")

     // User Specific Blogs
    const {data: session} = useSession();

    const client = trpc.useContext(); // 

  const {data: userBlogs} = trpc.useQuery(["post.get-my-posts"]);

  const {register, reset, handleSubmit} = useForm({
    defaultValues: {
      title: "",
      content: ""
    },
    resolver: zodResolver(createPostValidation)
  });

  // Create
  const {mutate: createPost} = trpc.useMutation("post.create-post", {
    onSuccess: () => {
      client.invalidateQueries(["post.get-my-posts"])
      // reset();
    }
  })

  const onCreatePost = ({title, content}: {title: string, content: string}) => {
    return createPost({title, content});
  }
    if(sort === "nameAsc"){
    userBlogs?.sort((a, b)=> {
      if(a.title < b.title) return -1;
      return 1;
    })
  }

  if(sort === "nameDesc"){
    userBlogs?.sort((a, b)=> {
      if(a.title < b.title) return 1;
      return -1;
    })
  }
  
  if(sort === "createdAsc"){
    userBlogs?.sort((a, b)=> {
      console.log(userBlogs);
      
     return Number(b.createdAt) - Number(a.createdAt);
    })
  }
  
  if(sort === "updatedNew"){
    userBlogs?.sort((a, b)=> {
      console.log(userBlogs);
      
     return Number(b.updated) - Number(a.updated);
    })
  }


  return (
    <>
    <Navbar/>
    <section className="max-w-4xl mx-auto">
        {
            session && (
                <>
                <h2 className="text-8xl text-center">CREATE POST</h2>
                <form className="flex flex-col gap-y-2 pt-5">
                    <input placeholder="Title" className="shadow-lg rounded-lg p-2" {...register("title")} />
                    <ReactTextareaAutosize rows={7} placeholder="Content" className="shadow-lg rounded-lg p-2" {...register("content")}/>
                    <button className="p-2 w-32 mx-auto border rounded-lg" onClick={handleSubmit(onCreatePost)}>Create</button>
                </form>
                </>
            )
        }
        <div className="flex gap-x-5 mt-10 justify-center">
         <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("nameAsc")}>Sort A - Z</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("nameDesc")}>Sort Z - A</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("createdAsc")}>Sort by Newest</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("updatedNew")}>Sort by Recently Updated</button>
         </div>

          <div className='flex flex-wrap gap-x-10 justify-center'>
            {/* <h2>{session?.user?.name}'s Blogs</h2> */}
            {userBlogs?.map((blog)=> (
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
          </div>
    </section>
    </>
  )
}

export default MyBlogs