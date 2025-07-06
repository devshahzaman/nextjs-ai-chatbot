ALTER TABLE "Vote" DROP CONSTRAINT "Vote_chatId_messageId_pk";--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_messageId_pk" PRIMARY KEY("userId","messageId");--> statement-breakpoint
ALTER TABLE "Vote" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
