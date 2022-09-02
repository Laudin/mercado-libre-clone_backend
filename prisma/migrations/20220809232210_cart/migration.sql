/*
  Warnings:

  - You are about to drop the `_cart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_cart" DROP CONSTRAINT "_cart_A_fkey";

-- DropForeignKey
ALTER TABLE "_cart" DROP CONSTRAINT "_cart_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cart" TEXT[];

-- DropTable
DROP TABLE "_cart";
