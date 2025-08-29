CREATE TABLE "vendor_stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"brand_name" text NOT NULL,
	"product_name" text NOT NULL,
	"category" text NOT NULL,
	"type" text,
	"size" text NOT NULL,
	"price" numeric NOT NULL,
	"product_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "mart_open_time" text DEFAULT '10:00 AM' NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "mart_close_time" text DEFAULT '08:00 PM' NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_stock" ADD CONSTRAINT "vendor_stock_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vendor_stock_vendor_id_idx" ON "vendor_stock" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_stock_brand_name_idx" ON "vendor_stock" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "vendor_stock_product_name_idx" ON "vendor_stock" USING btree ("product_name");