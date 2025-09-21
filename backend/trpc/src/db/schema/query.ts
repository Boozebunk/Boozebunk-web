import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { vendorTable } from "./vendor";

export const VendorQueryTable = pgTable("vendor-query", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendorTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});

export const VendorQueryRelations = relations(VendorQueryTable, ({ one }) => ({
  vendor: one(vendorTable, {
    fields: [VendorQueryTable.vendorId],
    references: [vendorTable.id],
  }),
}));
