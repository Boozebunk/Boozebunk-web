-- 2. Create the product_images table
CREATE TABLE IF NOT EXISTS "product_images" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "brand_name" text NOT NULL,
    "product_name" text NOT NULL,
    "image_url" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "product_images_brand_name_product_name_unique" UNIQUE("brand_name", "product_name")
);

-- 3. Create the unique index on brandName and productName (for the cache key)
CREATE UNIQUE INDEX IF NOT EXISTS "product_images_unique_key" ON "product_images" USING btree ("brand_name", "product_name");

-- 4. Create the GIN index for fuzzy searching (LOWER and TRIM are critical here)
CREATE INDEX IF NOT EXISTS "product_images_fuzzy_trgm_idx" ON "product_images" 
USING gin (LOWER(TRIM("brand_name" || ' ' || "product_name")) gin_trgm_ops);