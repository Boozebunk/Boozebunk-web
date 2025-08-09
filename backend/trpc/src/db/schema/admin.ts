import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth/user";

export const adminTable = pgTable(
  "admins",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("admin_name_index").on(table.name)],
);

export const adminRelations = relations(adminTable, ({ one }) => ({
  user: one(userTable, {
    fields: [adminTable.userId],
    references: [userTable.id],
  }),
}));
