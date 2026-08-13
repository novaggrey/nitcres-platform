CREATE TABLE `entities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taxpayerId` int NOT NULL,
	`entityType` enum('individual','company','related_party') NOT NULL,
	`legalName` varchar(180) NOT NULL,
	`registrationNo` varchar(80) NOT NULL,
	`source` varchar(120) NOT NULL,
	`confidence` int NOT NULL DEFAULT 100,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `entities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `field_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`officerId` int NOT NULL,
	`outcome` varchar(120) NOT NULL,
	`notes` text NOT NULL,
	`evidenceCount` int NOT NULL DEFAULT 0,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `field_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taxpayerId` int NOT NULL,
	`counterpartyTin` varchar(32) NOT NULL,
	`transactionType` varchar(80) NOT NULL,
	`amount` decimal(18,2) NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'TZS',
	`source` varchar(120) NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`synthetic` boolean NOT NULL DEFAULT true,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
