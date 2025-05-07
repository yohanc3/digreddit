-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "CommentLeads" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"subreddit" text NOT NULL,
	"author" text NOT NULL,
	"body" text NOT NULL,
	"url" text NOT NULL,
	"ups" smallint NOT NULL,
	"downs" smallint NOT NULL,
	"productID" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"rating" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PostLeads" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"subreddit" text NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"body" text NOT NULL,
	"url" text NOT NULL,
	"numComments" smallint NOT NULL,
	"subredditSubscribers" smallint,
	"over18" boolean NOT NULL,
	"ups" smallint NOT NULL,
	"downs" smallint NOT NULL,
	"productID" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"rating" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"url" text,
	"mrr" integer DEFAULT 0,
	"industry" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"keywords" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_picture" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

*/