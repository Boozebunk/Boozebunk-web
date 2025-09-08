import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { adminTable } from "../admin";
import { vendorTable } from "../vendor";

export const userTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    role: text("role"),
    password: text("password").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    lastLoginAt: timestamp("last_login_at", { withTimezone: false }).defaultNow(),
    roleId: uuid("role_id"),
  },
  (table) => [
    uniqueIndex("email_index").on(table.email),
    sql`CREATE INDEX users_email_search_idx ON ${table} USING gin(to_tsvector('english', coalesce(${table.email}, '')))`,
  ],
);

export const userRelations = relations(userTable, ({ one }) => ({
  admin: one(adminTable),
  vendor: one(vendorTable, {
    fields: [userTable.id],
    references: [vendorTable.userId],
  }),
}));
