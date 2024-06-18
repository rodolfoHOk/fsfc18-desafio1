-- AlterTable
ALTER TABLE `Event` MODIFY `name` CHAR(255) NOT NULL,
    MODIFY `description` CHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Spot` MODIFY `name` CHAR(255) NOT NULL;
