// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("post.", postRouter)
  .merge("user.", userRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
