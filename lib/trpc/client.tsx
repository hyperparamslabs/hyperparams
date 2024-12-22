"use client"

import React from "react"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import { makeQueryClient } from "./query-client"
import type { AppRouter } from "@/server/trpc/router/_app"
import superjson from "superjson"
import { readSSROnlySecret } from "ssr-only-secrets"

export const trpc = createTRPCReact<AppRouter>()

export let queryClient: QueryClient
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (queryClient ??= makeQueryClient())
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return ""
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return "http://localhost:3000"
  })()
  return `${base}/api/trpc`
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode
    ssrOnlySecret: string
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
          async headers() {
            const headers = new Headers()
            const secret = props.ssrOnlySecret
            const value = await readSSROnlySecret(
              secret,
              "SECRET_CLIENT_COOKIE_VAR",
            )
            headers.set("x-trpc-source", "nextjs-react")
            if (value) {
              headers.set("cookie", value)
            }
            return headers
          },
        }),
      ],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
