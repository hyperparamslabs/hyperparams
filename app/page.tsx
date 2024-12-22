import { HydrateClient, trpc } from "@/lib/trpc/server"
import { ClientGreeting } from "./client-greeting"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import Link from "next/link"

export default async function Home() {
  await trpc.greeting.prefetch()

  return (
    <HydrateClient>
      <Link href="/dashboard">Dashboard</Link>
      <hr />
      <Link href="/login">Login</Link>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
