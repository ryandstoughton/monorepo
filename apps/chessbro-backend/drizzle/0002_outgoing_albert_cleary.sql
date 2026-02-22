--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"white_player_token" varchar(255) NOT NULL,
	"black_player_token" varchar(255),
	"status" varchar(20) DEFAULT 'waiting' NOT NULL,
	"fen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' NOT NULL,
	"winner" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "anon_id" varchar(36);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_anon_id_unique" UNIQUE("anon_id");