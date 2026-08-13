CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorId` int,
	`action` varchar(120) NOT NULL,
	`entityType` varchar(80) NOT NULL,
	`entityId` varchar(80) NOT NULL,
	`details` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseRef` varchar(40) NOT NULL,
	`taxpayerId` int,
	`module` varchar(100) NOT NULL,
	`title` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`priority` enum('low','medium','high','critical') NOT NULL,
	`status` enum('new','in_review','assigned','resolved') NOT NULL DEFAULT 'new',
	`assignedRole` varchar(80),
	`assignedTo` int,
	`evidence` json NOT NULL,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `cases_caseRef_unique` UNIQUE(`caseRef`)
);
--> statement-breakpoint
CREATE TABLE `customs_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shipmentRef` varchar(64) NOT NULL,
	`importer` varchar(180) NOT NULL,
	`port` varchar(80) NOT NULL,
	`declaredValue` decimal(18,2) NOT NULL,
	`benchmarkValue` decimal(18,2) NOT NULL,
	`probability` int NOT NULL,
	`flagType` varchar(100) NOT NULL,
	`recommendation` text NOT NULL,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customs_flags_id` PRIMARY KEY(`id`),
	CONSTRAINT `customs_flags_shipmentRef_unique` UNIQUE(`shipmentRef`)
);
--> statement-breakpoint
CREATE TABLE `evidence_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(700) NOT NULL,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceNo` varchar(64) NOT NULL,
	`sellerTin` varchar(32) NOT NULL,
	`buyerTin` varchar(32) NOT NULL,
	`amount` decimal(18,2) NOT NULL,
	`vatAmount` decimal(18,2) NOT NULL,
	`description` varchar(240) NOT NULL,
	`riskType` varchar(80),
	`riskScore` int NOT NULL DEFAULT 0,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNo_unique` UNIQUE(`invoiceNo`)
);
--> statement-breakpoint
CREATE TABLE `simulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`vatRate` decimal(5,2) NOT NULL,
	`exemptionChange` decimal(5,2) NOT NULL,
	`horizons` json NOT NULL,
	`assumptions` json NOT NULL,
	`createdBy` int,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxpayer_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taxpayerId` int NOT NULL,
	`assetType` enum('property','vehicle','import','procurement') NOT NULL,
	`description` varchar(240) NOT NULL,
	`value` decimal(18,2) NOT NULL,
	`source` varchar(120) NOT NULL,
	`acquiredAt` timestamp NOT NULL,
	`synthetic` boolean NOT NULL DEFAULT true,
	CONSTRAINT `taxpayer_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxpayers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tin` varchar(32) NOT NULL,
	`displayName` varchar(180) NOT NULL,
	`taxpayerType` enum('individual','company') NOT NULL,
	`sector` varchar(80) NOT NULL,
	`region` varchar(80) NOT NULL,
	`declaredIncome` decimal(18,2) NOT NULL,
	`riskScore` int NOT NULL DEFAULT 0,
	`riskBand` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`riskReasons` json NOT NULL,
	`featureBreakdown` json NOT NULL,
	`sourceCount` int NOT NULL DEFAULT 1,
	`matchConfidence` int NOT NULL DEFAULT 100,
	`dataLineage` json NOT NULL,
	`synthetic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taxpayers_id` PRIMARY KEY(`id`),
	CONSTRAINT `taxpayers_tin_unique` UNIQUE(`tin`)
);
