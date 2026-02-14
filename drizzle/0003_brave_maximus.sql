CREATE TABLE "service_child_to_parent" (
	"parent_id" uuid NOT NULL,
	"child_id" uuid NOT NULL,
	CONSTRAINT "service_child_to_parent_parent_id_child_id_pk" PRIMARY KEY("parent_id","child_id")
);
--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN "parent_id";