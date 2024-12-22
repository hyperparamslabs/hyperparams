import { db } from "@/db/drizzle"
import { getCurrentSession } from "@/lib/session"

export const createContext = async () => {
  const session = await getCurrentSession()

  const ctx = {
    db,
    session,
  }

  return ctx
}

export type Context = Awaited<ReturnType<typeof createContext>>
