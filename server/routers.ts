import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { evidenceFiles } from "../drizzle/schema";
import { getDb } from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { addAuditEvent, createSimulation, getAuditEvents, getDashboardSnapshot, getOperationalIntelligence, getSimulations, updateRiskScore } from "./db";
import { checkDemoRateLimit, DEMO_LOGIN_EMAIL, DEMO_LOGIN_PASSWORD } from "./demoRateLimit";

const roleProcedure = (roles: string[]) => protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user.platformRole ?? "admin";
  if (!roles.includes(role)) throw new TRPCError({ code: "FORBIDDEN", message: "This module is outside your assigned operational scope." });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    demoAccess: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1) })).mutation(({ ctx, input }) => {
      const forwarded = ctx.req.headers["x-forwarded-for"];
      const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
      const requestKey = ctx.req.ip ?? forwardedIp ?? "unknown-client";
      const limit = checkDemoRateLimit(requestKey);
      if (!limit.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `Too many demo access attempts. Try again in ${limit.retryAfterSeconds} seconds.` });
      }
      if (input.email !== DEMO_LOGIN_EMAIL || input.password !== DEMO_LOGIN_PASSWORD) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Demo credentials do not match the published synthetic access details." });
      }
      return { success: true, synthetic: true, remainingAttempts: limit.remaining } as const;
    }),
  }),
  intelligence: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const snapshot = await getDashboardSnapshot();
      await addAuditEvent(ctx.user.id, "dashboard_viewed", "dashboard", "national", { synthetic: true });
      return { ...snapshot, role: ctx.user.platformRole ?? "admin" };
    }),
    explainRisk: roleProcedure(["admin", "risk_analyst", "auditor"]).input(z.object({ taxpayerName: z.string(), score: z.number().min(0).max(100), reasons: z.array(z.string()), features: z.record(z.string(), z.number()) })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a tax-risk intelligence assistant. Explain synthetic risk signals in plain language for an authorised officer. Never declare tax evasion, guilt, or liability. State that the output is an investigative lead requiring human validation. Keep the explanation under 120 words." },
          { role: "user", content: JSON.stringify({ taxpayer: input.taxpayerName, riskScore: input.score, reasonCodes: input.reasons, featureBreakdown: input.features, synthetic: true }) },
        ],
      });
      const content = response.choices?.[0]?.message?.content;
      return { explanation: typeof content === "string" ? content : "The model returned no explanation. Review the visible reason codes and source lineage manually.", synthetic: true };
    }),
    analyzeInvoice: roleProcedure(["admin", "risk_analyst", "auditor"]).input(z.object({ invoiceNo: z.string(), description: z.string(), amount: z.number().nonnegative(), vatAmount: z.number().nonnegative() })).mutation(async ({ input }) => {
      const response = await invokeLLM({ messages: [
        { role: "system", content: "Review a synthetic invoice description for possible anomaly patterns. Do not conclude fraud or liability. Return a concise review note with observed pattern, confidence, and a human validation step." },
        { role: "user", content: JSON.stringify({ ...input, synthetic: true }) },
      ] });
      const content = response.choices?.[0]?.message?.content;
      return { review: typeof content === "string" ? content : "No automated note available; review the description and supporting documents manually.", synthetic: true };
    }),
    summarizeDiscrepancy: roleProcedure(["admin", "risk_analyst", "auditor"]).input(z.object({ taxpayerName: z.string(), declaredIncome: z.number().nonnegative(), assetValue: z.number().nonnegative(), sources: z.array(z.string()) })).mutation(async ({ input }) => {
      const response = await invokeLLM({ messages: [
        { role: "system", content: "Summarise a synthetic taxpayer discrepancy for an authorised auditor. Use neutral language, identify missing validation, and state clearly that the result is an investigative lead rather than a conclusion." },
        { role: "user", content: JSON.stringify({ ...input, synthetic: true }) },
      ] });
      const content = response.choices?.[0]?.message?.content;
      return { summary: typeof content === "string" ? content : "No automated summary available; validate the source records manually.", synthetic: true };
    }),
    overrideRisk: roleProcedure(["admin", "risk_analyst", "auditor"]).input(z.object({ taxpayerId: z.number().int().positive(), score: z.number().min(0).max(100), reason: z.string().min(3) })).mutation(async ({ ctx, input }) => {
      if (!input.reason.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "A human override reason is required." });
      return updateRiskScore(input.taxpayerId, input.score, input.reason, ctx.user.id);
    }),
    operationalIntelligence: roleProcedure(["admin", "auditor", "risk_analyst", "customs_officer", "policy_analyst"]).query(async () => getOperationalIntelligence()),
    simulations: roleProcedure(["admin", "policy_analyst"]).query(async () => ({ syntheticOnly: true, runs: await getSimulations() })),
    simulatePolicy: roleProcedure(["admin", "policy_analyst"]).input(z.object({ name: z.string().min(3), vatRate: z.number().min(0).max(100), exemptionChange: z.number().min(-100).max(100) })).mutation(async ({ ctx, input }) => {
      if (input.vatRate < 0 || input.vatRate > 100) throw new TRPCError({ code: "BAD_REQUEST", message: "VAT rate must be between 0 and 100." });
      return createSimulation({ ...input, actorId: ctx.user.id });
    }),
    uploadEvidence: roleProcedure(["admin", "auditor"]).input(z.object({ caseId: z.number().int().positive(), fileName: z.string().min(1).max(255), mimeType: z.string().min(1).max(120), base64: z.string().min(20) })).mutation(async ({ ctx, input }) => {
      if (!["application/pdf", "image/png", "image/jpeg"].includes(input.mimeType)) throw new TRPCError({ code: "BAD_REQUEST", message: "Only PDF, PNG, and JPEG evidence files are accepted." });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });
      const buffer = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
      if (buffer.byteLength > 10 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Evidence files must be 10 MB or smaller." });
      const stored = await storagePut(`evidence/${ctx.user.id}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`, buffer, input.mimeType);
      const [created] = await db.insert(evidenceFiles).values({ caseId: input.caseId, fileName: input.fileName, mimeType: input.mimeType, storageKey: stored.key, storageUrl: stored.url, uploadedBy: ctx.user.id }).$returningId();
      await addAuditEvent(ctx.user.id, "evidence_uploaded", "case", String(input.caseId), { fileName: input.fileName, mimeType: input.mimeType, synthetic: true });
      return { id: created?.id, url: stored.url, synthetic: true };
    }),
    auditTrail: adminProcedure.query(async () => {
      const events = await getAuditEvents();
      return { syntheticOnly: true, events };
    }),
  }),
});

export type AppRouter = typeof appRouter;
