CREATE TABLE `clients_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archived_at` integer,
	`is_archived` integer DEFAULT false NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`company_name` text NOT NULL,
	`email` text,
	`address_street` text,
	`address_city` text,
	`address_zip` text,
	`phone_country_code` text,
	`phone_number` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_table_email_unique` ON `clients_table` (`email`);--> statement-breakpoint
CREATE TABLE `invoices_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archived_at` integer,
	`is_archived` integer DEFAULT false NOT NULL,
	`total_cost` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text NOT NULL,
	`validated_at` integer,
	`client_id` integer,
	`project_id` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`archived_at` integer,
	`is_archived` integer DEFAULT false NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`client_id` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients_table`(`id`) ON UPDATE no action ON DELETE no action
);
