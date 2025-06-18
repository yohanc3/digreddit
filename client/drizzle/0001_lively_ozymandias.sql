CREATE TYPE "public"."lead_stage" AS ENUM('identification', 'initial_outreach', 'engagement', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."stages" AS ENUM('identification', 'initial_outreach', 'engagement', 'skipped');--> statement-breakpoint
CREATE TABLE "Account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Authenticator" (
	"credentialId" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialId")
);
--> statement-breakpoint
CREATE TABLE "Bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userID" uuid NOT NULL,
	"productID" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"subreddits" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userID" uuid NOT NULL,
	"productID" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"area" text NOT NULL,
	"feedback" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"attendedTo" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "NonBetaUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "CommentLeads" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "CommentLeads" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "CommentLeads" ALTER COLUMN "rating" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "PostLeads" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "PostLeads" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "PostLeads" ALTER COLUMN "subredditSubscribers" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "PostLeads" ALTER COLUMN "rating" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD COLUMN "isInteracted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD COLUMN "stage" "stages" DEFAULT 'identification' NOT NULL;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD COLUMN "uniqueID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD COLUMN "bookmarkID" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD COLUMN "isInteracted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD COLUMN "stage" "stages" DEFAULT 'identification' NOT NULL;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD COLUMN "uniqueID" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD COLUMN "bookmarkID" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "Products" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "membershipEndsAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "redditRefreshToken" text;--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "account_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Authenticator" ADD CONSTRAINT "authenticator_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Bookmarks" ADD CONSTRAINT "fk_product" FOREIGN KEY ("productID") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Collections" ADD CONSTRAINT "fk_collection_product" FOREIGN KEY ("productID") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Feedback" ADD CONSTRAINT "feedback_userID_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "session_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD CONSTRAINT "fk_product" FOREIGN KEY ("productID") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostLeads" ADD CONSTRAINT "fk_product" FOREIGN KEY ("productID") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN "profile_picture";--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "CommentLeads" ADD CONSTRAINT "unique_commentleads_uniqueid" UNIQUE("uniqueID");--> statement-breakpoint
ALTER TABLE "PostLeads" ADD CONSTRAINT "unique_postleads_uniqueid" UNIQUE("uniqueID");