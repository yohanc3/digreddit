ALTER TABLE "CommentLeads" DROP CONSTRAINT "fk_bookmark";
--> statement-breakpoint
ALTER TABLE "PostLeads" DROP CONSTRAINT "fk_bookmark";
--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD CONSTRAINT "fk_bookmark" FOREIGN KEY ("bookmarkID") REFERENCES "public"."Bookmarks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD CONSTRAINT "fk_bookmark" FOREIGN KEY ("bookmarkID") REFERENCES "public"."Bookmarks"("id") ON DELETE set null ON UPDATE no action;