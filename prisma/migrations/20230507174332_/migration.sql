-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NULL,
    `avatarUrl` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `titleKo` VARCHAR(100) NULL,
    `overview` TEXT NOT NULL,
    `overviewKo` TEXT NULL,
    `adult` BOOLEAN NOT NULL,
    `popularity` DOUBLE NOT NULL,
    `voteCount` INTEGER NOT NULL,
    `voteAverage` DOUBLE NOT NULL,
    `backdropUrl` VARCHAR(191) NULL,
    `posterUrl` VARCHAR(191) NULL,
    `lang` VARCHAR(191) NOT NULL,
    `releaseDate` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieMetaData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `latestHistoryId` INTEGER NULL,
    `historiesCount` INTEGER NOT NULL DEFAULT 0,
    `latestLikeId` INTEGER NULL,
    `likesCount` INTEGER NOT NULL DEFAULT 0,
    `latestFavoriteId` INTEGER NULL,
    `favoritesCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

    UNIQUE INDEX `MovieMetaData_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `lastViewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

    INDEX `MovieHistory_userId_idx`(`userId`),
    INDEX `MovieHistory_userId_lastViewedAt_idx`(`userId`, `lastViewedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

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
    `deletedAt` TIMESTAMP NULL,

    INDEX `LikeMovie_userId_movieId_idx`(`userId`, `movieId`),
    INDEX `LikeMovie_movieId_idx`(`movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Genre_name_key`(`name`),
    INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `overview` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `rating` TINYINT UNSIGNED NULL,
    `authorId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

    INDEX `authorIdDeletedAt`(`authorId`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,

    INDEX `movieId`(`movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(500) NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,

    INDEX `reviewId`(`reviewId`),
    INDEX `authorIdDeletedAt`(`authorId`, `deletedAt`),
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
ALTER TABLE `MovieMetaData` ADD CONSTRAINT `MovieMetaData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieMetaData` ADD CONSTRAINT `MovieMetaData_latestHistoryId_fkey` FOREIGN KEY (`latestHistoryId`) REFERENCES `MovieHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieMetaData` ADD CONSTRAINT `MovieMetaData_latestLikeId_fkey` FOREIGN KEY (`latestLikeId`) REFERENCES `LikeMovie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieMetaData` ADD CONSTRAINT `MovieMetaData_latestFavoriteId_fkey` FOREIGN KEY (`latestFavoriteId`) REFERENCES `FavoriteMovie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Review` ADD CONSTRAINT `Review_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToMovie` ADD CONSTRAINT `_GenreToMovie_A_fkey` FOREIGN KEY (`A`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GenreToMovie` ADD CONSTRAINT `_GenreToMovie_B_fkey` FOREIGN KEY (`B`) REFERENCES `Movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
