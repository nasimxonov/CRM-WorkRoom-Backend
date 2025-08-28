/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "public"."user_profile_questions" (
    "id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_profile_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "option_value" TEXT NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profile_question_anwsers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,

    CONSTRAINT "user_profile_question_anwsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."selected_answer_options" (
    "id" TEXT NOT NULL,
    "answer_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,

    CONSTRAINT "selected_answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_question_anwsers_question_id_key" ON "public"."user_profile_question_anwsers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "selected_answer_options_answer_id_option_id_key" ON "public"."selected_answer_options"("answer_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."user_profile_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profile_question_anwsers" ADD CONSTRAINT "user_profile_question_anwsers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."user_profile_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."selected_answer_options" ADD CONSTRAINT "selected_answer_options_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."user_profile_question_anwsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
