import { index, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const popularSearchTable = pgTable(
  "popular_searches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandName: text("brand_name").notNull(),
    category: text("category").notNull(),
    searchCount: integer("search_count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("popular_searches_brand_name_idx").on(table.brandName),
    index("popular_searches_count_idx").on(table.searchCount),
  ],
);
