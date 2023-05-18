-- CreateTable
CREATE TABLE `ReviewResponse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `result` BOOLEAN NOT NULL,

    UNIQUE INDEX `ReviewResponse_reviewId_key`(`reviewId`),
    INDEX `ReviewResponse_movieId_reviewId_idx`(`movieId`, `reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
