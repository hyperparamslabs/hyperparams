import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { usersTable } from "./users"

export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export type Session = typeof sessionsTable.$inferSelect
