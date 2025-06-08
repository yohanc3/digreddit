CREATE TABLE "Bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"productId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Bookmarks" ADD CONSTRAINT "fk_product" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;