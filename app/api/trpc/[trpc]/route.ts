import { createContext } from "@/server/trpc/context"
import { appRouter } from "@/server/trpc/router/_app"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { NextRequest } from "next/server"

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext,
  })
}

export { handler as GET, handler as POST }
