/*
  Warnings:

  - Added the required column `user_id` to the `user_profile_question_anwsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user_profile_question_anwsers" ADD COLUMN     "user_id" TEXT NOT NULL;
