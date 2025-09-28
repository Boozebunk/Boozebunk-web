CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"description" text,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
