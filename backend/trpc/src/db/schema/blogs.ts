import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const BlogsTable = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});
