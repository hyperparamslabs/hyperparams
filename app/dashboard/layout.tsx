import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/session"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default async function Layout({ children }: PropsWithChildren) {
  async function logout() {
    "use server"
    const { session } = await getCurrentSession()
    if (!session) {
      console.error("No session found")
      return
    }

    await invalidateSession(session.id)
    await deleteSessionTokenCookie()
    redirect("/login")
  }

  return (
    <div className="">
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>

      <div className="bg-slate-200 my-2">
        <Link href="/dashboard">Dashboard</Link>
      </div>

      <div className="bg-slate-100 h-full">{children}</div>
    </div>
  )
}
