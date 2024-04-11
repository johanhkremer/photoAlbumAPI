/*
  Warnings:

  - Added the required column `userId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Album` ADD COLUMN `userId` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `userId` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `_AlbumToPhoto` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_AlbumToPhoto_AB_unique`(`A`, `B`),
    INDEX `_AlbumToPhoto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlbumToPhoto` ADD CONSTRAINT `_AlbumToPhoto_A_fkey` FOREIGN KEY (`A`) REFERENCES `Album`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlbumToPhoto` ADD CONSTRAINT `_AlbumToPhoto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
