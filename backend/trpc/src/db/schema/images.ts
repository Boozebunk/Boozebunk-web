import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const productImagesTable = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandName: text("brand_name").notNull(),
    productName: text("product_name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("product_images_unique_key").on(table.brandName, table.productName)],
);
