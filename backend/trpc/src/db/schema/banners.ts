import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const bannersTable = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  fileKey: text("file_key").notNull().unique(),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});
