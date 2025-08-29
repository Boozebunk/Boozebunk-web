import { relations, sql } from "drizzle-orm";
import { boolean, geometry, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { vendorAddressesTable } from "./address";
import { userTable } from "./auth/user";

export const vendorTable = pgTable(
  "vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => userTable.id, { onDelete: "cascade" }),
    martName: text("mart_name").notNull(),
    vendorName: text("vendor_contact_name"),
    phoneNumber: text("phone_number"),
    licenseNumber: text("license_number"),
    isActive: boolean("is_active").default(true).notNull(),
    martStatus: text("mart_status").default("OPEN").notNull(),
    martOpenTime: text("mart_open_time").notNull().default("10:00 AM"),
    martCloseTime: text("mart_close_time").notNull().default("08:00 PM"),
    locationCoordinates: geometry("location_coordinates", { type: "Point", srid: 4326 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("vendor_mart_name_idx").on(table.martName),
    index("vendor_user_id_idx").on(table.userId),
    sql`CREATE INDEX vendors_search_idx ON ${table} USING gin(
        setweight(to_tsvector('english', coalesce(${table.martName}, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(${table.vendorName}, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(${table.phoneNumber}, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(${table.licenseNumber}, '')), 'D')
    )`,
  ],
);

export const vendorRelations = relations(vendorTable, ({ one }) => ({
  user: one(userTable, {
    fields: [vendorTable.userId],
    references: [userTable.id],
  }),
  address: one(vendorAddressesTable, {
    fields: [vendorTable.id],
    references: [vendorAddressesTable.vendorId],
  }),
}));
