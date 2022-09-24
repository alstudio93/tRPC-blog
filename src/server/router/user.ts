import { createRouter } from "./context";
import { z } from "zod";
import { inferQueryInput } from "../../utils/trpc";

export const userRouter = createRouter()
  .query("get-profile", {
    input: z.object({
      id: z.string()
    }),
    async resolve({input, ctx}){
      const userProfile = await ctx.prisma.user.findFirst({
        where: {
          id: input.id
        },
      });

      return {
        ...userProfile
      }
    }
  })

  .query("get-all-users", {
    async resolve({ctx}){
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true
        }
      })
      return users.map((user)=> {
        return {
          ...user
        }
      })
    }
  })

  .mutation("edit-profile", {
    input: z.object({
      id: z.string(),
      name: z.string().max(100),
      about: z.string().min(3).max(1000).trim()
    }),
    async resolve({input, ctx}){
      if(!ctx.session) throw new Error("Unauthorized to Access this Page");

      const findProfile = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user?.id
        }
      });

      if(!findProfile) throw new Error("Profile does not exist");

      if(ctx.session && ctx.session.user){
        if(findProfile.id === ctx.session.user.id){
          return await ctx.prisma.user.update({
            where: {
              id: ctx.session.user?.id
            },
            data: {
              name: input.name,
              about: input.about
            }
          })
        } else {
          throw new Error("Unauthorized")
        }
      }
    }
  })

  export type GetUserArrType = inferQueryInput<"user.get-profile">;
