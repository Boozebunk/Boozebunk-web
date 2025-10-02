CREATE TABLE "popular_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_name" text NOT NULL,
	"category" text NOT NULL,
	"search_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "popular_searches_brand_name_idx" ON "popular_searches" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "popular_searches_count_idx" ON "popular_searches" USING btree ("search_count");