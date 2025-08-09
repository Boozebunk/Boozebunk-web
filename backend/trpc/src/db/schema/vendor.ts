import { relations } from "drizzle-orm";
import { boolean, geometry, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { vendorAddressesTable } from "./address";
import { userTable } from "./auth/user";

export const vendorTable = pgTable(
  "vendors",
  {
    id: uuid("id").primaryKey(),
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
