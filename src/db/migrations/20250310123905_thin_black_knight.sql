CREATE TABLE `companies_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`totalCost` integer NOT NULL,
	`dueDate` integer NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`validatedAt` integer,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archivedAt` integer,
	`isArchived` integer DEFAULT false NOT NULL,
	`clientId` integer,
	FOREIGN KEY (`clientId`) REFERENCES `companies_table`(`id`) ON UPDATE no action ON DELETE no action
);
