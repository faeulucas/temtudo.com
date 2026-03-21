ALTER TABLE `listings` ADD `subcategory` varchar(80);--> statement-breakpoint
ALTER TABLE `listings` ADD `itemCondition` varchar(30);--> statement-breakpoint
ALTER TABLE `listings` ADD `extraDataJson` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bannerUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `openingHoursJson` text;