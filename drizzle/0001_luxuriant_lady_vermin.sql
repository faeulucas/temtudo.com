CREATE TABLE `banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200),
	`imageUrl` text NOT NULL,
	`linkUrl` text,
	`position` enum('home_top','home_mid','sidebar','category') DEFAULT 'home_top',
	`isActive` boolean DEFAULT true,
	`startsAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `boosters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('featured','top','banner') DEFAULT 'featured',
	`durationDays` int DEFAULT 7,
	`price` decimal(10,2),
	`status` enum('pending','active','expired','cancelled') DEFAULT 'pending',
	`startsAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `boosters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`icon` varchar(50),
	`color` varchar(20),
	`parentId` int,
	`isActive` boolean DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`state` varchar(2) NOT NULL DEFAULT 'PR',
	`slug` varchar(120) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `cities_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listing_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`url` text NOT NULL,
	`fileKey` text,
	`isPrimary` boolean DEFAULT false,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listing_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`cityId` int,
	`title` varchar(200) NOT NULL,
	`description` text,
	`price` decimal(12,2),
	`priceType` enum('fixed','negotiable','free','on_request') DEFAULT 'fixed',
	`type` enum('product','service','vehicle','property','food','job') DEFAULT 'product',
	`neighborhood` varchar(100),
	`whatsapp` varchar(20),
	`status` enum('pending','active','paused','sold','rejected','expired') DEFAULT 'pending',
	`isFeatured` boolean DEFAULT false,
	`isBoosted` boolean DEFAULT false,
	`boostExpiresAt` timestamp,
	`viewCount` int DEFAULT 0,
	`contactCount` int DEFAULT 0,
	`favoriteCount` int DEFAULT 0,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`slug` varchar(80) NOT NULL,
	`description` text,
	`price` decimal(10,2) DEFAULT '0.00',
	`durationDays` int DEFAULT 30,
	`maxListings` int DEFAULT 5,
	`maxImages` int DEFAULT 3,
	`canBoost` boolean DEFAULT false,
	`canFeatured` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `plans_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`listingId` int,
	`reason` varchar(100),
	`description` text,
	`status` enum('open','reviewed','resolved') DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`listingId` int,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','advertiser','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `whatsapp` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `personType` enum('pf','pj') DEFAULT 'pf';--> statement-breakpoint
ALTER TABLE `users` ADD `cpfCnpj` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `companyName` text;--> statement-breakpoint
ALTER TABLE `users` ADD `cityId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `neighborhood` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `planId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `planExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `trialStartedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `trialUsed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `isBanned` boolean DEFAULT false;