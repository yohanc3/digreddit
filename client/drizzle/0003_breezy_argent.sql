ALTER TABLE "CommentLeads" ADD COLUMN "bookmarkID" uuid;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD COLUMN "bookmarkID" uuid;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD CONSTRAINT "fk_bookmark" FOREIGN KEY ("bookmarkID") REFERENCES "public"."Bookmarks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD CONSTRAINT "fk_bookmark" FOREIGN KEY ("bookmarkID") REFERENCES "public"."Bookmarks"("id") ON DELETE no action ON UPDATE no action;