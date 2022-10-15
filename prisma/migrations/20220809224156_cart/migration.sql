/*
  Warnings:

  - You are about to drop the column `favoriteById` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_favoriteById_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "favoriteById";

-- CreateTable
CREATE TABLE "_cart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_cart_AB_unique" ON "_cart"("A", "B");

-- CreateIndex
CREATE INDEX "_cart_B_index" ON "_cart"("B");

-- AddForeignKey
ALTER TABLE "_cart" ADD CONSTRAINT "_cart_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cart" ADD CONSTRAINT "_cart_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
