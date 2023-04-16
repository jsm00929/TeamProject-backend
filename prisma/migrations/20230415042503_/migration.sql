/*
  Warnings:

  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `MovieGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRecentlyViewedMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MovieGenre` DROP FOREIGN KEY `MovieGenre_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `MovieGenre` DROP FOREIGN KEY `MovieGenre_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `UserFavoriteMovie` DROP FOREIGN KEY `UserFavoriteMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `UserFavoriteMovie` DROP FOREIGN KEY `UserFavoriteMovie_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRecentlyViewedMovie` DROP FOREIGN KEY `UserRecentlyViewedMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRecentlyViewedMovie` DROP FOREIGN KEY `UserRecentlyViewedMovie_userId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;

-- DropTable
DROP TABLE `MovieGenre`;

-- DropTable
DROP TABLE `UserFavoriteMovie`;

-- DropTable
DROP TABLE `UserRecentlyViewedMovie`;

-- CreateTable
CREATE TABLE `UserMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `viewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,

    INDEX `UserMovie_userId_movieId_idx`(`userId`, `movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GenreToMovie` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GenreToMovie_AB_unique`(`A`, `B`),
    INDEX `_GenreToMovie_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserMovie` ADD CONSTRAINT `UserMovie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMovie` ADD CONSTRAINT `UserMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToMovie` ADD CONSTRAINT `_GenreToMovie_A_fkey` FOREIGN KEY (`A`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToMovie` ADD CONSTRAINT `_GenreToMovie_B_fkey` FOREIGN KEY (`B`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
