import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { vendorTable } from "./vendor";

export const vendorAddressesTable = pgTable(
  "vendor_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .unique()
      .references(() => vendorTable.id, { onDelete: "cascade" }),

    addressFormatted: text("address_formatted").notNull(), // "123 Main St, City, State..."
    addressArea: text("address_area").notNull(),
    addressCity: text("address_city").notNull(),
    addressState: text("address_state").notNull(),
    addressPostalCode: text("address_postal_code"),

    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("vendor_address_vendor_id_idx").on(table.vendorId), // Index for quick lookup by vendor_id
    sql`CREATE INDEX vendor_addresses_search_idx ON ${table} USING gin(
        setweight(to_tsvector('english', coalesce(${table.addressArea}, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(${table.addressCity}, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(${table.addressState}, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(${table.addressPostalCode}, '')), 'B')
    )`,
  ],
);

export const vendorAddressesRelations = relations(vendorAddressesTable, ({ one }) => ({
  vendor: one(vendorTable, {
    fields: [vendorAddressesTable.vendorId],
    references: [vendorTable.id],
  }),
}));
