import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  platformRole: mysqlEnum("platformRole", ["admin", "auditor", "risk_analyst", "customs_officer", "policy_analyst"]).default("admin").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const taxpayers = mysqlTable("taxpayers", {
  id: int("id").autoincrement().primaryKey(),
  tin: varchar("tin", { length: 32 }).notNull().unique(),
  displayName: varchar("displayName", { length: 180 }).notNull(),
  taxpayerType: mysqlEnum("taxpayerType", ["individual", "company"]).notNull(),
  sector: varchar("sector", { length: 80 }).notNull(),
  region: varchar("region", { length: 80 }).notNull(),
  declaredIncome: decimal("declaredIncome", { precision: 18, scale: 2 }).notNull(),
  riskScore: int("riskScore").notNull().default(0),
  riskBand: mysqlEnum("riskBand", ["low", "medium", "high", "critical"]).notNull().default("low"),
  riskReasons: json("riskReasons").notNull(),
  featureBreakdown: json("featureBreakdown").notNull(),
  sourceCount: int("sourceCount").notNull().default(1),
  matchConfidence: int("matchConfidence").notNull().default(100),
  dataLineage: json("dataLineage").notNull(),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const entities = mysqlTable("entities", {
  id: int("id").autoincrement().primaryKey(),
  taxpayerId: int("taxpayerId").notNull(),
  entityType: mysqlEnum("entityType", ["individual", "company", "related_party"]).notNull(),
  legalName: varchar("legalName", { length: 180 }).notNull(),
  registrationNo: varchar("registrationNo", { length: 80 }).notNull(),
  source: varchar("source", { length: 120 }).notNull(),
  confidence: int("confidence").notNull().default(100),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  taxpayerId: int("taxpayerId").notNull(),
  counterpartyTin: varchar("counterpartyTin", { length: 32 }).notNull(),
  transactionType: varchar("transactionType", { length: 80 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("TZS"),
  source: varchar("source", { length: 120 }).notNull(),
  occurredAt: timestamp("occurredAt").notNull(),
  synthetic: boolean("synthetic").notNull().default(true),
});

export const fieldAudits = mysqlTable("field_audits", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  officerId: int("officerId").notNull(),
  outcome: varchar("outcome", { length: 120 }).notNull(),
  notes: text("notes").notNull(),
  evidenceCount: int("evidenceCount").notNull().default(0),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const taxpayerAssets = mysqlTable("taxpayer_assets", {
  id: int("id").autoincrement().primaryKey(),
  taxpayerId: int("taxpayerId").notNull(),
  assetType: mysqlEnum("assetType", ["property", "vehicle", "import", "procurement"]).notNull(),
  description: varchar("description", { length: 240 }).notNull(),
  value: decimal("value", { precision: 18, scale: 2 }).notNull(),
  source: varchar("source", { length: 120 }).notNull(),
  acquiredAt: timestamp("acquiredAt").notNull(),
  synthetic: boolean("synthetic").notNull().default(true),
});

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNo: varchar("invoiceNo", { length: 64 }).notNull().unique(),
  sellerTin: varchar("sellerTin", { length: 32 }).notNull(),
  buyerTin: varchar("buyerTin", { length: 32 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  vatAmount: decimal("vatAmount", { precision: 18, scale: 2 }).notNull(),
  description: varchar("description", { length: 240 }).notNull(),
  riskType: varchar("riskType", { length: 80 }),
  riskScore: int("riskScore").notNull().default(0),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  caseRef: varchar("caseRef", { length: 40 }).notNull().unique(),
  taxpayerId: int("taxpayerId"),
  module: varchar("module", { length: 100 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).notNull(),
  status: mysqlEnum("status", ["new", "in_review", "assigned", "resolved"]).notNull().default("new"),
  assignedRole: varchar("assignedRole", { length: 80 }),
  assignedTo: int("assignedTo"),
  evidence: json("evidence").notNull(),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const customsFlags = mysqlTable("customs_flags", {
  id: int("id").autoincrement().primaryKey(),
  shipmentRef: varchar("shipmentRef", { length: 64 }).notNull().unique(),
  importer: varchar("importer", { length: 180 }).notNull(),
  port: varchar("port", { length: 80 }).notNull(),
  declaredValue: decimal("declaredValue", { precision: 18, scale: 2 }).notNull(),
  benchmarkValue: decimal("benchmarkValue", { precision: 18, scale: 2 }).notNull(),
  probability: int("probability").notNull(),
  flagType: varchar("flagType", { length: 100 }).notNull(),
  recommendation: text("recommendation").notNull(),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const simulations = mysqlTable("simulations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  vatRate: decimal("vatRate", { precision: 5, scale: 2 }).notNull(),
  exemptionChange: decimal("exemptionChange", { precision: 5, scale: 2 }).notNull(),
  horizons: json("horizons").notNull(),
  assumptions: json("assumptions").notNull(),
  createdBy: int("createdBy"),
  synthetic: boolean("synthetic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const evidenceFiles = mysqlTable("evidence_files", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 700 }).notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const auditEvents = mysqlTable("audit_events", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId"),
  action: varchar("action", { length: 120 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }).notNull(),
  details: json("details").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Taxpayer = typeof taxpayers.$inferSelect;
export type Case = typeof cases.$inferSelect;
