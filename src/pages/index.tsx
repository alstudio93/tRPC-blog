import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import {useForm} from "react-hook-form"
import { createPostValidation } from "../utils/validations";
import {zodResolver} from "@hookform/resolvers/zod"
import BlogCard from "../components/blogCard";
import { useState } from "react";
import Navbar from "../components/Navbar";
import AllUsers from "../components/All-Users";
import Footer from "../components/Footer";
import Link from "next/link";

const Home: NextPage = (props) => {

  const [sort, setSort] = useState("second")

  // All Blogs
  const {isLoading, data} = trpc.useQuery(["post.get-posts"]);

 

  // const client = trpc.useContext(); // 
  // const {data: session} = useSession();

  // const {register, reset, handleSubmit} = useForm({
  //   defaultValues: {
  //     title: "",
  //     content: ""
  //   },
  //   resolver: zodResolver(createPostValidation)
  // });


  // Create
  // const {mutate: createPost} = trpc.useMutation("post.create-post", {
  //   onSuccess: () => {
  //     client.invalidateQueries(["post.get-posts"])
  //     reset();
  //   }
  // })

  // const onCreatePost = ({title, content}: {title: string, content: string}) => {
  //   return createPost({title, content});
  // }

  if(sort === "nameAsc"){
    data?.sort((a, b)=> {
      if(a.title < b.title) return -1;
      return 1;
    })
  }

  if(sort === "nameDesc"){
    data?.sort((a, b)=> {
      if(a.title < b.title) return 1;
      return -1;
    })
  }
  
  if(sort === "createdAsc"){
    data?.sort((a, b)=> {
      console.log(data);
      
     return Number(b.createdAt) - Number(a.createdAt);
    })
  }
  
  if(sort === "updatedNew"){
    data?.sort((a, b)=> {
      console.log(data);
      
     return Number(b.updated) - Number(a.updated);
    })
  }

  return (
    <>
      <Head>
        <title>Blogger</title>
        <meta name="description" content="Multi-User Blogging Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Navbar/>
          <main className="container mx-auto flex items-center justify-center pt-20">

        <div className="w-52 hidden lg:block">
         <p> Left Sidebar</p>
         <p> What should go here?</p>
        </div>


       <section className="flex flex-wrap gap-x-5 max-w-6xl justify-center">
        <div className="flex flex-col items-center gap-y-5">
        <h2 className="text-hero-h1 text-center">Welcome to Blogger!</h2>
        <Link href="/post/">Start writing!</Link>
        </div>
        <div className="flex gap-x-5 mt-10 flex-col lg:flex-row gap-y-5">
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("nameAsc")}>Sort A - Z</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("nameDesc")}>Sort Z - A</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("createdAsc")}>Sort by Newest</button>
          <button className="border px-4 py-3 rounded-lg" onClick={()=> setSort("updatedNew")}>Sort by Recently Updated</button>
         </div>
       {!isLoading && data?.map((post)=> (
        <BlogCard 
        key={post.id}
        onHomePage={true}
        inputs={{
          id: post.id,
          title: post.title,
          content: post.content,
          created: post.createdAt,
          updated: post.updated,
          seoDescription: post.seoDescription,
          userId: post.user.id,
          name: post.user.name,
          image: post.user.image,
          email: post.user.email,
        }}
       />
       ))}
       </section>

       <AllUsers/>
      </main>
      <Footer/>
      
      </>
  )
}
export default Home
