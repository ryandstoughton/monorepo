CREATE TABLE "cards" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"oracle_id" varchar(36),
	"name" varchar(512) NOT NULL,
	"lang" varchar(10) NOT NULL,
	"set_code" varchar(10) NOT NULL,
	"collector_number" varchar(50) NOT NULL,
	"rarity" varchar(20),
	"layout" varchar(50),
	"data" jsonb NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
