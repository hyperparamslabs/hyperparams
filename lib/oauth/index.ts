import { Google } from "arctic"

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
)

export type GoogleClaims = {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture: string
  given_name: string
  family_name: string
}
