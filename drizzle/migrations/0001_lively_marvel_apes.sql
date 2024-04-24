CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`title` text,
	`method` text,
	`body` text,
	`big_category` text,
	`small_category` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
