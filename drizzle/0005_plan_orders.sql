CREATE TABLE `plan_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('profissional','premium') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`billingCycle` enum('annual') NOT NULL,
	`status` enum('pending','paid','failed','canceled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plan_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_plan_orders_userId` ON `plan_orders` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_plan_orders_status` ON `plan_orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_plan_orders_createdAt` ON `plan_orders` (`createdAt`);