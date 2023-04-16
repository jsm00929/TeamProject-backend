/*
  Warnings:

  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `adult` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteAverage` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteCount` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Movie` ADD COLUMN `adult` BOOLEAN NOT NULL,
    ADD COLUMN `backdropUrl` VARCHAR(191) NULL,
    ADD COLUMN `budget` INTEGER NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `lang` VARCHAR(191) NOT NULL,
    ADD COLUMN `overviewKo` TEXT NULL,
    ADD COLUMN `popularity` DOUBLE NOT NULL,
    ADD COLUMN `posterUrl` VARCHAR(191) NULL,
    ADD COLUMN `releaseDate` DATE NOT NULL,
    ADD COLUMN `revenue` INTEGER NOT NULL,
    ADD COLUMN `runtime` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `titleKo` VARCHAR(50) NULL,
    ADD COLUMN `userId` INTEGER NULL,
    ADD COLUMN `voteAverage` DOUBLE NOT NULL,
    ADD COLUMN `voteCount` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `UserFavoriteMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRecentlyViewedMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Genre_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieGenre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genreId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFavoriteMovie` ADD CONSTRAINT `UserFavoriteMovie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavoriteMovie` ADD CONSTRAINT `UserFavoriteMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRecentlyViewedMovie` ADD CONSTRAINT `UserRecentlyViewedMovie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRecentlyViewedMovie` ADD CONSTRAINT `UserRecentlyViewedMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movie` ADD CONSTRAINT `Movie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieGenre` ADD CONSTRAINT `MovieGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieGenre` ADD CONSTRAINT `MovieGenre_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
