CREATE TABLE `companies_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectName` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archivedAt` integer,
	`isArchived` integer DEFAULT false NOT NULL,
	`clientId` integer,
	FOREIGN KEY (`clientId`) REFERENCES `companies_table`(`id`) ON UPDATE no action ON DELETE no action
);
