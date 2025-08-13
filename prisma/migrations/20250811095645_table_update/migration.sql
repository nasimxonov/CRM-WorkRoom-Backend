/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."CountMember" AS ENUM ('only_me', '2-5', '6-10', '11-20', '21-40', '41-50', '51-100', '101-500');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."about_users" (
    "id" TEXT NOT NULL,
    "compose" TEXT[],
    "bestIn" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "about_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."about_companys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyDirection" TEXT[],
    "membersCount" "public"."CountMember" NOT NULL DEFAULT 'only_me',

    CONSTRAINT "about_companys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "about_users_userId_key" ON "public"."about_users"("userId");

-- AddForeignKey
ALTER TABLE "public"."about_users" ADD CONSTRAINT "about_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."about_companys" ADD CONSTRAINT "about_companys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
