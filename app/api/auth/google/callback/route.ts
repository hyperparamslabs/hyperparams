import { google, GoogleClaims } from "@/lib/oauth"
import { decodeIdToken } from "arctic"
import { cookies } from "next/headers"

import type { OAuth2Tokens } from "arctic"
import { db } from "@/db/drizzle"
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session"
import { usersTable } from "@/db/schema"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const cookieStore = await cookies()
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    })
  }

  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    })
  }

  let tokens: OAuth2Tokens
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier)
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    })
  }

  const claims = decodeIdToken(tokens.idToken()) as GoogleClaims
  console.log(claims)

  // // TODO: Replace this with your own DB query.
  const existingUser = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.oauthId, claims.sub),
  })

  if (existingUser) {
    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, existingUser.id)
    await setSessionTokenCookie(sessionToken, session.expiresAt)

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    })
  }

  // TODO: Replace this with your own DB query.
  const [user] = await db
    .insert(usersTable)
    .values({
      oauthId: claims.sub,
      oauthProvider: "google",
      username: claims.name,
      email: claims.email,
    })
    .returning()

  if (!user) {
    return new Response(null, {
      status: 400,
    })
  }

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)
  await setSessionTokenCookie(sessionToken, session.expiresAt)

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
