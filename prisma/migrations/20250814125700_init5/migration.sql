/*
  Warnings:

  - A unique constraint covering the columns `[question_text]` on the table `user_profile_questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `step_number` to the `user_profile_questions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `question_type` on the `user_profile_questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('text', 'select', 'radio', 'checkbox', 'button');

-- AlterTable
ALTER TABLE "public"."user_profile_questions" ADD COLUMN     "step_number" INTEGER NOT NULL,
DROP COLUMN "question_type",
ADD COLUMN     "question_type" "public"."QuestionType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_questions_question_text_key" ON "public"."user_profile_questions"("question_text");
