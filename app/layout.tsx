import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TRPCProvider } from "@/lib/trpc/client"
import { headers } from "next/headers"
import { cloakSSROnlySecret } from "ssr-only-secrets"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Hyperparams",
  description: "",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = new Headers(await headers()).get("cookie")
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SECRET_CLIENT_COOKIE_VAR",
  )

  return (
    <TRPCProvider ssrOnlySecret={encryptedCookie}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </TRPCProvider>
  )
}
