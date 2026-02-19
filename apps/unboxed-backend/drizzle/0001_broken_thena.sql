ALTER TABLE "users" ADD COLUMN "auth0_id" varchar(255);--> statement-breakpoint
UPDATE "users" SET "auth0_id" = 'auth0|legacy-' || "id" WHERE "auth0_id" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "auth0_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_auth0_id_unique" UNIQUE("auth0_id");
