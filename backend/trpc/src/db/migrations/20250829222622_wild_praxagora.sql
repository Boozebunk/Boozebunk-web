CREATE TABLE "vendor_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"address_formatted" text NOT NULL,
	"address_area" text NOT NULL,
	"address_city" text NOT NULL,
	"address_state" text NOT NULL,
	"address_postal_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendor_addresses_vendor_id_unique" UNIQUE("vendor_id")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" text,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"brand_name" text NOT NULL,
	"product_name" text NOT NULL,
	"category" text NOT NULL,
	"type" text,
	"size" text NOT NULL,
	"price" text NOT NULL,
	"availability" boolean DEFAULT true NOT NULL,
	"product_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mart_name" text NOT NULL,
	"vendor_contact_name" text,
	"phone_number" text,
	"license_number" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"mart_status" text DEFAULT 'OPEN' NOT NULL,
	"mart_open_time" text DEFAULT '10:00 AM' NOT NULL,
	"mart_close_time" text DEFAULT '08:00 PM' NOT NULL,
	"location_coordinates" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "vendor_addresses" ADD CONSTRAINT "vendor_addresses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_stock" ADD CONSTRAINT "vendor_stock_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vendor_address_vendor_id_idx" ON "vendor_addresses" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "admin_name_index" ON "admins" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_token_user_id_type_index" ON "verification_tokens" USING btree ("user_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_token_token_index" ON "verification_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "vendor_stock_vendor_id_idx" ON "vendor_stock" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_stock_brand_name_idx" ON "vendor_stock" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "vendor_stock_product_name_idx" ON "vendor_stock" USING btree ("product_name");--> statement-breakpoint
CREATE INDEX "vendor_stock_availability_idx" ON "vendor_stock" USING btree ("availability");--> statement-breakpoint
CREATE INDEX "vendor_mart_name_idx" ON "vendors" USING btree ("mart_name");--> statement-breakpoint
CREATE INDEX "vendor_user_id_idx" ON "vendors" USING btree ("user_id");