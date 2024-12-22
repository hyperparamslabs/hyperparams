"use client"

import { trpc } from "@/lib/trpc/client"

export function ClientGreeting() {
  const [greeting] = trpc.greeting.useSuspenseQuery()

  if (!greeting) return <div>Loading...</div>

  return <div>{greeting}</div>
}
