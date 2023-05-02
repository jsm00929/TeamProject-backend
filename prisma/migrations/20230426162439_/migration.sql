/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `User_googleId_key` ON `User`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `googleId`,
    DROP COLUMN `username`,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Movie`;
