-- Custom SQL migration file, put your code below! --
CREATE INDEX IF NOT EXISTS "users_email_search_idx" ON "users" USING gin (to_tsvector('english', coalesce("email", '')));

CREATE INDEX IF NOT EXISTS "vendors_search_idx" ON "vendors" USING gin((
        setweight(to_tsvector('english', coalesce("mart_name", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("vendor_contact_name", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("phone_number", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("license_number", '')), 'D'))
);

CREATE INDEX IF NOT EXISTS "vendor_addresses_search_idx" ON "vendor_addresses" USING gin((
        setweight(to_tsvector('english', coalesce("address_state", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("address_postal_code", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("address_city", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("address_area", '')), 'D'))
);

CREATE INDEX IF NOT EXISTS "vendor_stock_search_idx" ON "vendor_stock" USING gin((
setweight(to_tsvector('english', coalesce("brand_name", '')), 'A') ||
setweight(to_tsvector('english', coalesce("product_name")), 'B') ||
setweight(to_tsvector('english', coalesce("category")), 'C') ||
setweight(to_tsvector('english', coalesce("type")), 'D') ||
setweight(to_tsvector('english', coalesce("size")), 'E')
));