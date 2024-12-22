import { initTRPC, TRPCError } from "@trpc/server"
import { Context } from "./context"
import { ZodError } from "zod"
import superjson from "superjson"

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

export const router = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do this",
    })
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  })
})
