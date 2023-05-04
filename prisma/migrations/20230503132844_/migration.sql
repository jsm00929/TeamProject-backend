/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `expiresAt` on the `RefreshToken` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `UserMovie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `token` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserMovie` DROP FOREIGN KEY `UserMovie_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `UserMovie` DROP FOREIGN KEY `UserMovie_userId_fkey`;

-- AlterTable
ALTER TABLE `Comment` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `RefreshToken` ADD COLUMN `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN `revoked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `token` VARCHAR(255) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `expiresAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Review` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;

-- DropTable
DROP TABLE `UserMovie`;

-- CreateTable
CREATE TABLE `MovieHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `lastViewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX `MovieHistory_userId_movieId_idx`(`userId`, `movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX `FavoriteMovie_userId_movieId_idx`(`userId`, `movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LikeMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX `LikeMovie_userId_movieId_idx`(`userId`, `movieId`),
    INDEX `LikeMovie_movieId_idx`(`movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovieHistory` ADD CONSTRAINT `MovieHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieHistory` ADD CONSTRAINT `MovieHistory_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteMovie` ADD CONSTRAINT `FavoriteMovie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteMovie` ADD CONSTRAINT `FavoriteMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeMovie` ADD CONSTRAINT `LikeMovie_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeMovie` ADD CONSTRAINT `LikeMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
