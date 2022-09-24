import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { createPostValidation } from '../utils/validations';
import TextareaAutosize from "react-textarea-autosize"
import Link from 'next/link';
import Markdown from './Markdown';
import { useRouter } from 'next/router';
import { dateFormatter } from '../utils/dateFormatter';
import { BsMarkdown } from 'react-icons/bs';
import {AiOutlineDelete} from 'react-icons/ai'

const BlogCard:React.FC<{
    inputs: {
        id: string;
        title: string;
        content: string;
        updated: Date | null;
        created: Date;
        userId: string;
        name: string | null;
        image: string | null;
        email: string | null;
    },
    onHomePage: boolean;
}> = ({onHomePage, inputs}) => {

  const router = useRouter();
  const onMyBlogs = router.pathname.includes("/post")

    const [showEdit, setShowEdit] = useState(false)

    const client = trpc.useContext(); // 

    const {data: session} = useSession();

    const {register, handleSubmit } = useForm({
        defaultValues: {
          title: inputs.title ?? "",
          content: inputs.content ?? "",
        },
        resolver: zodResolver(createPostValidation)
      });
    
    // Edit 
  const editPost = trpc.useMutation("post.edit-post", {
    onSuccess: ()=> {
      client.invalidateQueries(["post.get-my-posts"])
    }
  })

  const onEditPost = ({title, content}: {title: string, content: string}) => {
    return editPost.mutate({
        id: inputs.id,
        title,
        content
    });
  }

      // Delete
  const {mutate: deletePost} = trpc.useMutation("post.delete-post", {
    onSuccess: ()=> {
      client.invalidateQueries(["post.get-my-posts"])
    }
  })

  const handleDelete = (id:string) => {
    return deletePost({
        id
    })
  }

  

  
  return (

    <article className="mt-20 border rounded-lg px-5 py-3 flex flex-col w-3/4 gap-y-5">
      
      <div className='flex justify-between items-center gap-x-5'>
        {/* Blog Title */}
        <Link href={"/post/" + inputs.id}><a className="text-3xl flex-1">{inputs.title}</a></Link>

        {/* Blog Created By + Username + Profile Image */}
            <Link href={`/profile/${inputs.userId}`}>
              <a>
                <p className="flex items-center gap-x-5">{`${router.pathname === "/" ? "Created By: " + inputs.name : ""}`}
                  <span><img className="rounded-full" src={inputs.image!} height="50" width="50"/></span>
                </p>
              </a>
            </Link>
      </div>

    {/* Blog Content */}
    {
      onHomePage && <Markdown>{`${inputs.content.slice(0, 300)}`}</Markdown>
    }
    
    {/* Update Form */}
      {
        onMyBlogs && (
          <>
            <form className={`flex-col items-center gap-y-10 pt-10 ${showEdit ? "flex" : "hidden"}`}>
              <input {...register("title")} className="w-full rounded-lg px-2 py-3" placeholder={inputs.title}  />
              <TextareaAutosize rows={7} {...register("content")}  className="w-full rounded-lg px-2 py-3" placeholder={inputs.content} />
            </form>
            <div className='flex items-center justify-between'>
            <button className='border p-2 w-40 rounded-lg' onClick={()=> setShowEdit(showEdit => !showEdit)}>{showEdit ? "Cancel Edit" : "Edit Post"}</button>
           {showEdit && <span className='flex items-center gap-x-3'> Markdown Cheatsheet: <Link href="https://www.markdownguide.org/cheat-sheet/"><a title="Markdown Cheatsheet"><BsMarkdown className='text-3xl '/></a></Link></span>}
            </div>
          </>
        )
      }
    <div className='flex flex-col items-center gap-y-5'>
    {onMyBlogs && session?.user?.email === inputs.email && 
      <div className='flex items-center gap-x-10'>
          {showEdit && <button className="p-2 w-40 mx-auto border rounded-lg" onClick={handleSubmit(onEditPost)}>Publish Changes</button>}
          {/* <button className="p-2 w-32 mx-auto border rounded-lg" >Delete</button> */}
      </div>
    }
    <div className='flex items-center gap-x-10 relative'>
    <small>Created On: {dateFormatter(inputs.created)}</small> 
      <div className='absolute before:content-none before:top-0 before:h-[20px] before:w-[20px] before:bg-[#fff]'/>
        {inputs.updated && 
    <small className='text-center'> Updated on: {dateFormatter(inputs.updated)}</small> }
    {router.pathname === "/post" && <AiOutlineDelete  className='text-3xl cursor-pointer' onClick={()=> handleDelete(inputs.id)} />}
    </div>
    </div>

    </article>
  )
}

export default BlogCard