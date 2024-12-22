import { protectedProcedure, router } from "../trpc"

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user
  }),
})
