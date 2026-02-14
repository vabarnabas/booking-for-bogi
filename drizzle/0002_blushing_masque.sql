ALTER TABLE "services" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN "option_count";