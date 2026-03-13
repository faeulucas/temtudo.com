ALTER TABLE `users`
ADD COLUMN `passwordHash` varchar(255) NULL AFTER `email`;
