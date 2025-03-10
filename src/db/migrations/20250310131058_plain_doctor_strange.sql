CREATE TABLE `clients_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`companyName` text NOT NULL,
	`email` text,
	`address_street` text,
	`address_city` text,
	`address_zip` text,
	`phoneCountryCode` text,
	`phoneNumber` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archivedAt` integer,
	`isArchived` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_table_email_unique` ON `clients_table` (`email`);--> statement-breakpoint
CREATE TABLE `invoices_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`totalCost` integer NOT NULL,
	`dueDate` integer NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`validatedAt` integer,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archivedAt` integer,
	`isArchived` integer DEFAULT false NOT NULL,
	`client_id` integer,
	`project_id` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectName` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archivedAt` integer,
	`isArchived` integer DEFAULT false NOT NULL,
	`client_id` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients_table`(`id`) ON UPDATE no action ON DELETE no action
);
