import { createRouter } from "./context";
import { z } from "zod";
import { inferQueryInput } from "../../utils/trpc";
import { createPostValidation } from "../../utils/validations";
import { userAgent } from "next/server";

export const postRouter = createRouter()
  .query("get-posts", {
    async resolve({ ctx }) {
     const posts = await ctx.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updated: true,
          seoDescription: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });
      return posts.map((post)=> {
        return {
          ...post
        }
      })
    },
  })
  .query("get-my-posts", {
    async resolve({ctx}){
      if(ctx.session) {
       if(ctx.session.user?.email){
        const posts = await ctx.prisma.post.findMany({
          where: {
            userEmail: ctx.session.user?.email
          },
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updated: true,
            seoDescription: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
        return [...posts].map((post)=> ({
          ...post
        }))
       }
      }
    }
  })
  .query("get-post-by-id", {
   input: z.object({
    id: z.string()
   }),
   async resolve({input,ctx}){
    const postContent = await ctx.prisma.post.findFirst({
      where: {
        id: input.id
      }
    });
    const post = await ctx.prisma.post.findFirst({
      where: {
        id: input.id
      },
      include: {
        user: {
         select: {
          name: true,
          email: true,
          image: true,
         }
        }
      }
    });
    return {
      ...post
    }
   }
  })

  .mutation("create-post", {
    input: createPostValidation,
    async resolve({input, ctx}){
      if(!ctx.session) throw new Error("Unauthorized");
      if(ctx.session){
       if(ctx.session.user?.email){
        return await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            userEmail: ctx.session.user?.email,
            seoDescription: input.seoDescription
          },
        });
       }
      }
    }
  })
  .mutation("edit-post", {
    input: z.object({
      id: z.string(),
      title: z.string().min(3).max(200),
      content: z.string().min(1).max(10000).trim(),
    }),
    async resolve({input, ctx}){
      if(!ctx.session) throw new Error("Unauthorized");

      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id
        },
      });

      if(!post) throw new Error("404 Not Found");

      if(post.userEmail !== null) {
        if(!ctx.session) throw new Error("Unauthorized");
        if(ctx.session && ctx.session.user) {
          if(post.userEmail === ctx.session.user.email) {
            return await ctx.prisma.post.update({
              where: {
                id: input.id
              },
              data: {
                title: input.title,
                content: input.content,
                updated: new Date(),
              }
            })
          } else {
            throw new Error("Unauthorized");
          }
        }
      }
    }
  })

  .mutation("delete-post", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({input, ctx}){
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id
        }
      });

      if(!post) throw new Error("404 Not Found");

      if(!ctx.session) throw new Error("Unauthorized");
      if(post.userEmail !== ctx.session.user?.email) throw new Error("Unauthorized: You may only delete your own posts!");
      if(ctx.session && ctx.session.user){
        if(post.userEmail === ctx.session.user.email){
         return await ctx.prisma.post.delete({
            where: {
              id: input.id
            }
          })
        }
      }
    }
  })
  export type GetPostsArrType = inferQueryInput<"post.get-posts">;
