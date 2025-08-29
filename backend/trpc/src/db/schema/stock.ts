import { relations, sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { vendorTable } from "./vendor";

export const vendorStockTable = pgTable(
  "vendor_stock",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendorTable.id, { onDelete: "cascade" }),
    brandName: text("brand_name").notNull(),
    productName: text("product_name").notNull(),
    category: text("category").notNull(),
    type: text("type"),
    size: text("size").notNull(),
    price: text("price").notNull(),
    availability: boolean("availability").notNull().default(true),

    productImageUrl: text("product_image_url"),

    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("vendor_stock_vendor_id_idx").on(table.vendorId),
    index("vendor_stock_brand_name_idx").on(table.brandName),
    index("vendor_stock_product_name_idx").on(table.productName),
    index("vendor_stock_availability_idx").on(table.availability),

    sql`CREATE INDEX vendor_stock_search_idx ON ${table} USING gin(
        ( -- Ensure outer parentheses for the expression
            setweight(to_tsvector('english', coalesce(${table.brandName}, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(${table.productName}, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(${table.category}, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(${table.type}, '')), 'D') ||
            setweight(to_tsvector('english', coalesce(${table.size}, '')), 'E')
        )
    )`,
  ],
);

export const vendorStockRelations = relations(vendorStockTable, ({ one }) => ({
  vendor: one(vendorTable, {
    fields: [vendorStockTable.vendorId],
    references: [vendorTable.id],
  }),
}));
