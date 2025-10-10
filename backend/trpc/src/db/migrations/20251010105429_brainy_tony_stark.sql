CREATE TABLE "banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"file_key" text NOT NULL,
	"website_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banners_file_key_unique" UNIQUE("file_key")
);
