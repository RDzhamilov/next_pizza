/* TODO: изменения в таблице */

-- DropIndex
DROP INDEX "VerificationCode_code_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verified" DROP NOT NULL;
