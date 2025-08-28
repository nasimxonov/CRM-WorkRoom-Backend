-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "company" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "skype" TEXT;
