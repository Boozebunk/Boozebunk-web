import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const FeedbackTable = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  description: text("description"),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});
