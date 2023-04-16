/*
  Warnings:

  - You are about to drop the column `budget` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `runtime` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Movie` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `Movie` DROP FOREIGN KEY `Movie_userId_fkey`;

-- AlterTable
ALTER TABLE `Movie` DROP COLUMN `budget`,
    DROP COLUMN `country`,
    DROP COLUMN `revenue`,
    DROP COLUMN `runtime`,
    DROP COLUMN `status`,
    DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP NULL;
