/*
  Warnings:

  - Made the column `user_id` on table `user_profile_question_anwsers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user_profile_question_anwsers" ALTER COLUMN "answer_text" DROP NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."user_members" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "user_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."user_members" ADD CONSTRAINT "user_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
