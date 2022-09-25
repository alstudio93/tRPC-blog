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
        seoDescription: string | null;
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
          seoDescription: inputs.seoDescription ?? "",
        },
        resolver: zodResolver(createPostValidation)
      });
    
    // Edit 
  const editPost = trpc.useMutation("post.edit-post", {
    onSuccess: ()=> {
      client.invalidateQueries(["post.get-my-posts"])
      setShowEdit(false);
    }
  })

  const onEditPost = ({title, content, seoDescription}: {title: string, content: string, seoDescription: string}) => {
    return editPost.mutate({
        id: inputs.id,
        title,
        content, 
        seoDescription
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

    <article className="mt-20 border rounded-lg px-5 py-3 flex flex-col w-11/12 gap-y-5">
      
      <div className='flex justify-between items-center gap-x-5 flex-col md:flex-row w-full'>
        {/* Blog Title */}
        <Link href={"/post/" + inputs.id}><a className="text-3xl  text-left">{inputs.title}</a></Link>

        {/* Blog Created By + Username + Profile Image */}
            <Link href={`/profile/${inputs.userId}`}>
              <a className="flex items-center justify-between  gap-x-5 ">
               {`${router.pathname === "/" ? "Created By: " + inputs.name : ""}`}
                  { inputs?.image && <img className="rounded-full" src={inputs?.image} height="50" width="50"/>}
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
            <fieldset className='w-full flex flex-col gap-y-2'>
                <label htmlFor="seoDescription">SEO Description</label>
                {inputs.seoDescription && <input id="seoDescription" {...register("seoDescription")} className="w-full rounded-lg px-2 py-3" placeholder={inputs?.seoDescription}  />}
              </fieldset>
              <fieldset className='w-full flex flex-col gap-y-2'>
                <label htmlFor="title">Title</label>
                <input id="title" {...register("title")} className="w-full rounded-lg px-2 py-3" placeholder={inputs.title}  />
              </fieldset>
              <fieldset className='w-full flex flex-col gap-y-2'>
                <label htmlFor="content">Content Body</label>
                <TextareaAutosize id="content" rows={7} {...register("content")}  className="w-full rounded-lg px-2 py-3" placeholder={inputs.content} />
              </fieldset>
            </form>
            <div className='flex items-center justify-between'>
            <button className='border p-2 w-40 rounded-lg' onClick={()=> setShowEdit(showEdit => !showEdit)}>{showEdit ? "Cancel Edit" : "Edit Post"}</button>
            {onMyBlogs && session?.user?.email === inputs.email && 
              <div className='flex items-center gap-x-10'>
                  {showEdit && <button className="p-2 w-40 mx-auto border rounded-lg" onClick={handleSubmit(onEditPost)}>Publish Changes</button>}
                  {/* <button className="p-2 w-32 mx-auto border rounded-lg" >Delete</button> */}
              </div>
            }
           {showEdit && 
            <span className='flex items-center gap-x-3'> Markdown Cheatsheet: 
              <Link  href="https://www.markdownguide.org/cheat-sheet/">
                <a title="Markdown Cheatsheet" target="_blank" rel="noreferrer">
                  <BsMarkdown className='text-3xl '/>
                </a>
              </Link>
            </span>
          }
            </div>
          </>
        )
      }
    <div className='flex flex-col items-center gap-y-5'>
    <div className='flex flex-col items-start md:flex-row md:items-center md:justify-between w-full'>
      <div className='flex flex-col'>
      <small>Created On: {dateFormatter(inputs.created)}</small> 
        <div className='absolute before:content-none before:top-0 before:h-[20px] before:w-[20px] before:bg-[#fff]'/>
          {inputs.updated && 
      <small className='text-center'> Updated on: {dateFormatter(inputs.updated)}</small> }
      </div>
      <Link href={`/post/${inputs.id}`}><a className='border w-48 text-center p-2 rounded-lg'>Read Blog</a></Link>
      {router.pathname === "/post" && <AiOutlineDelete  className='text-3xl cursor-pointer' onClick={()=> handleDelete(inputs.id)} />}
    </div>
    </div>

    </article>
  )
}

export default BlogCard