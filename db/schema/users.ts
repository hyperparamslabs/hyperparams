import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  oauthId: text("oauth_id").notNull().unique(),
  oauthProvider: text("oauth_provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
