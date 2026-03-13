CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `tokenHash` varchar(128) NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `usedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
  CONSTRAINT `password_reset_tokens_tokenHash_unique` UNIQUE(`tokenHash`)
);
