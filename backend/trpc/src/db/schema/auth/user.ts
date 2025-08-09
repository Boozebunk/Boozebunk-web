import { relations } from "drizzle-orm";
import { boolean, date, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { adminTable } from "../admin";

export const userTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    role: text("role"),
    password: text("password").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    lastLoginAt: date("last_login_at").defaultNow(),
  },
  (table) => [uniqueIndex("email_index").on(table.email)],
);

export const userRelations = relations(userTable, ({ one }) => ({
  admin: one(adminTable),
}));
