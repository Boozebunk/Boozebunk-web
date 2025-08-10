ALTER TABLE "users" ALTER COLUMN "last_login_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login_at" SET DEFAULT now();