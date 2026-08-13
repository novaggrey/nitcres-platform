import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { clampRiskScore, POLICY_HORIZONS, riskBandForScore } from "./nitcresRules";
import {
  InsertUser,
  auditEvents,
  cases,
  customsFlags,
  invoices,
  simulations,
  taxpayerAssets,
  taxpayers,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let seeded = false;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (user.platformRole !== undefined) {
    values.platformRole = user.platformRole;
    updateSet.platformRole = user.platformRole;
  } else if (user.openId === ENV.ownerOpenId) {
    values.platformRole = "admin";
    updateSet.platformRole = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureSyntheticSeed() {
  if (seeded) return;
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ count: sql<number>`count(*)` }).from(taxpayers);
  if (Number(existing[0]?.count ?? 0) > 0) {
    seeded = true;
    return;
  }

  const taxpayerRows = [
    { tin: "SYN-100021", displayName: "Kijani Logistics Co.", taxpayerType: "company" as const, sector: "Transport & logistics", region: "Dar es Salaam", declaredIncome: "480000000", riskScore: 91, reasons: ["Circular invoice topology", "Unusual supplier concentration", "Asset-income mismatch"], features: { filing: 92, supplier: 88, cashDigital: 84, sectorVariance: 79 }, sourceCount: 6, confidence: 98 },
    { tin: "SYN-100034", displayName: "Asha M. Holdings", taxpayerType: "individual" as const, sector: "Property & rentals", region: "Arusha", declaredIncome: "15000000", riskScore: 78, reasons: ["High-value asset acquisition", "Declared income variance"], features: { filing: 61, supplier: 55, cashDigital: 76, sectorVariance: 93 }, sourceCount: 5, confidence: 96 },
    { tin: "SYN-100055", displayName: "Bahari Consumer Goods Ltd.", taxpayerType: "company" as const, sector: "Wholesale & retail", region: "Mwanza", declaredIncome: "720000000", riskScore: 66, reasons: ["Duplicate invoice pattern", "Input tax credit anomaly"], features: { filing: 72, supplier: 81, cashDigital: 60, sectorVariance: 66 }, sourceCount: 7, confidence: 94 },
    { tin: "SYN-100081", displayName: "Mwangaza Agro Traders", taxpayerType: "company" as const, sector: "Agriculture", region: "Morogoro", declaredIncome: "180000000", riskScore: 43, reasons: ["Late filing history"], features: { filing: 48, supplier: 38, cashDigital: 42, sectorVariance: 45 }, sourceCount: 4, confidence: 91 },
    { tin: "SYN-100103", displayName: "Neema Consulting Services", taxpayerType: "company" as const, sector: "Professional services", region: "Dodoma", declaredIncome: "230000000", riskScore: 18, reasons: ["No material anomalies detected"], features: { filing: 12, supplier: 18, cashDigital: 22, sectorVariance: 16 }, sourceCount: 3, confidence: 99 },
  ];

  const inserted = await db.insert(taxpayers).values(taxpayerRows.map((row) => ({
    tin: row.tin,
    displayName: row.displayName,
    taxpayerType: row.taxpayerType,
    sector: row.sector,
    region: row.region,
    declaredIncome: row.declaredIncome,
    riskScore: row.riskScore,
    riskBand: riskBandForScore(row.riskScore),
    riskReasons: row.reasons,
    featureBreakdown: row.features,
    sourceCount: row.sourceCount,
    matchConfidence: row.confidence,
    dataLineage: ["Synthetic TRA ledger", "Synthetic registry", "Synthetic payments feed"],
    synthetic: true,
  }))).$returningId();

  const ids = inserted.map((row) => row.id);
  await db.insert(taxpayerAssets).values([
    { taxpayerId: ids[1]!, assetType: "property", description: "Njiro residential property", value: "500000000", source: "Synthetic land registry", acquiredAt: new Date("2025-06-12"), synthetic: true },
    { taxpayerId: ids[1]!, assetType: "vehicle", description: "Two commercial trucks", value: "220000000", source: "Synthetic vehicle registry", acquiredAt: new Date("2025-08-20"), synthetic: true },
    { taxpayerId: ids[0]!, assetType: "procurement", description: "Synthetic port logistics contract", value: "640000000", source: "Synthetic procurement feed", acquiredAt: new Date("2025-04-04"), synthetic: true },
  ]);

  await db.insert(invoices).values([
    { invoiceNo: "SYN-INV-2201", sellerTin: taxpayerRows[0]!.tin, buyerTin: taxpayerRows[2]!.tin, amount: "84000000", vatAmount: "14237288", description: "Industrial packaging services", riskType: "Circular trading loop", riskScore: 94, synthetic: true },
    { invoiceNo: "SYN-INV-2202", sellerTin: taxpayerRows[2]!.tin, buyerTin: taxpayerRows[0]!.tin, amount: "83500000", vatAmount: "14152542", description: "Industrial packaging services", riskType: "Circular trading loop", riskScore: 89, synthetic: true },
    { invoiceNo: "SYN-INV-2203", sellerTin: taxpayerRows[1]!.tin, buyerTin: taxpayerRows[3]!.tin, amount: "19000000", vatAmount: "3220339", description: "Property maintenance", riskType: null, riskScore: 24, synthetic: true },
  ]);

  await db.insert(cases).values([
    { caseRef: "NIT-2026-0042", taxpayerId: ids[0]!, module: "VAT Graph Analytics", title: "Circular invoice topology detected", summary: "Synthetic invoice graph shows reciprocal trading between two connected entities with limited underlying goods movement.", priority: "critical", status: "in_review", assignedRole: "auditor", evidence: ["SYN-INV-2201", "SYN-INV-2202"], synthetic: true },
    { caseRef: "NIT-2026-0043", taxpayerId: ids[1]!, module: "Lifestyle Reconciliation", title: "Declared income and assets diverge", summary: "Synthetic property and vehicle records materially exceed declared income; this is an investigative lead requiring human review.", priority: "high", status: "new", assignedRole: "risk_analyst", evidence: ["Synthetic land registry", "Synthetic vehicle registry"], synthetic: true },
    { caseRef: "NIT-2026-0044", taxpayerId: null, module: "Customs Intelligence", title: "Shipment valuation variance", summary: "Synthetic shipment value is below sector benchmark and requires document validation before any action.", priority: "medium", status: "assigned", assignedRole: "customs_officer", evidence: ["SYN-SHIP-0881"], synthetic: true },
  ]);

  await db.insert(customsFlags).values([
    { shipmentRef: "SYN-SHIP-0881", importer: "Kisiwa Industrial Supplies", port: "Dar es Salaam Port", declaredValue: "3500", benchmarkValue: "65000", probability: 94, flagType: "Potential under-valuation", recommendation: "Request document review and consider a targeted physical inspection.", synthetic: true },
    { shipmentRef: "SYN-SHIP-0882", importer: "Bahari Consumer Goods Ltd.", port: "Tunduma", declaredValue: "38000", benchmarkValue: "47000", probability: 62, flagType: "HS-code variance", recommendation: "Validate classification against manifest description and comparable entries.", synthetic: true },
  ]);
  seeded = true;
}

export async function getDashboardSnapshot() {
  const db = await getDb();
  if (!db) return null;
  await ensureSyntheticSeed();
  const [taxpayerRows, caseRows, customsRows, invoiceRows] = await Promise.all([
    db.select().from(taxpayers).orderBy(desc(taxpayers.riskScore)),
    db.select().from(cases).orderBy(desc(cases.createdAt)).limit(8),
    db.select().from(customsFlags).orderBy(desc(customsFlags.probability)),
    db.select().from(invoices).orderBy(desc(invoices.riskScore)),
  ]);
  const highRisk = taxpayerRows.filter((row) => row.riskScore >= 65).length;
  const criticalCases = caseRows.filter((row) => row.priority === "critical").length;
  return {
    syntheticOnly: true,
    kpis: { taxpayers: taxpayerRows.length, highRisk, criticalCases, collectionIndex: 82.4, preventedLeakage: 3.8 },
    taxpayers: taxpayerRows,
    cases: caseRows,
    customs: customsRows,
    invoices: invoiceRows,
    regional: [
      { region: "Dar es Salaam", value: 92 }, { region: "Arusha", value: 74 }, { region: "Mwanza", value: 68 }, { region: "Dodoma", value: 56 }, { region: "Morogoro", value: 49 },
    ],
  };
}

export async function addAuditEvent(actorId: number | undefined, action: string, entityType: string, entityId: string, details: unknown) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditEvents).values({ actorId, action, entityType, entityId, details });
}

export async function getAuditEvents(limit = 25) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(limit);
}

export async function updateRiskScore(taxpayerId: number, score: number, reason: string, actorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const bounded = clampRiskScore(score);
  const current = await db.select().from(taxpayers).where(eq(taxpayers.id, taxpayerId)).limit(1);
  if (!current[0]) throw new Error("Taxpayer not found");
  const reasons = Array.isArray(current[0].riskReasons) ? current[0].riskReasons : [];
  await db.update(taxpayers).set({ riskScore: bounded, riskBand: riskBandForScore(bounded), riskReasons: [...reasons, `Human override: ${reason}`] }).where(eq(taxpayers.id, taxpayerId));
  await addAuditEvent(actorId, "risk_score_override", "taxpayer", String(taxpayerId), { previousScore: current[0].riskScore, newScore: bounded, reason, synthetic: true });
  return { score: bounded, band: riskBandForScore(bounded) };
}

export async function createSimulation(input: { name: string; vatRate: number; exemptionChange: number; actorId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const base = 24_000_000_000_000;
  const rateDelta = (input.vatRate - 18) / 18;
  const exemptionDelta = input.exemptionChange / 100;
  const horizons = [...POLICY_HORIZONS].map((months) => ({ months, projectedRevenue: Math.round(base * (1 + rateDelta * 0.7 + exemptionDelta * 0.35) * (1 + months / 120)), complianceIndex: Math.round(72 + rateDelta * 18 - exemptionDelta * 12) }));
  const [created] = await db.insert(simulations).values({ name: input.name, vatRate: String(input.vatRate), exemptionChange: String(input.exemptionChange), horizons, assumptions: { baseRevenue: base, synthetic: true }, createdBy: input.actorId, synthetic: true }).$returningId();
  await addAuditEvent(input.actorId, "policy_simulation_created", "simulation", String(created?.id ?? "unknown"), { horizons: [12, 36, 60], synthetic: true });
  return { id: created?.id, horizons };
}
