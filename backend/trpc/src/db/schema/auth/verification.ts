import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const verificationTokensTable = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    type: text("type").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("verification_token_user_id_type_index").on(table.userId, table.type),
    uniqueIndex("verification_token_token_index").on(table.token),
  ],
);

export const verificationTokensRelations = relations(verificationTokensTable, ({ one }) => ({
  user: one(userTable, {
    fields: [verificationTokensTable.userId],
    references: [userTable.id],
  }),
}));
