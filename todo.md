# Project TODO

- [x] Establish the NITCRES enterprise dashboard shell with refined visual system, responsive layout, and role-aware navigation
- [x] Implement five-role access model: Admin, Auditor, Risk Analyst, Customs Officer, and Policy Analyst
- [x] Add synthetic-only data policy indicators and prevent any implication of real taxpayer data
- [x] Add synthetic taxpayer profiles, entities, assets, transactions, invoices, customs records, cases, audits, simulations, and audit events
- [x] Implement Module 1: National Tax Data Integration Hub with entity resolution, source attribution, confidence scores, and lineage views
- [x] Implement Module 2: AI Risk Assessment and Scoring Engine with strict 0–100 scores, reason codes, feature breakdowns, and human override
- [x] Implement Module 3: Lifestyle and Asset Reconciliation with synthetic property, vehicle, import, and procurement comparisons and UWI investigative leads
- [x] Implement Module 4: Smart Invoice and VAT Graph Analytics with circular loops, duplicate invoices, shell-company patterns, and graph visualisation
- [x] Implement Module 5: Revenue Leakage and Customs Fraud Detector with synthetic customs flags and explainable inspection recommendations
- [ ] Implement Module 6: Transfer Pricing and Cross-Border Intelligence with synthetic related-party risk indicators and benchmarking views
- [ ] Implement Module 7: Predictive Audit and Field Operations Manager with prioritised queues, assignment, workload, evidence packs, and status tracking
- [ ] Implement Module 8: National Tax Gap and Revenue Capacity Engine with synthetic tax-gap analytics and transparent assumptions
- [ ] Implement Module 9: Executive Revenue and Operational Dashboard with KPIs, regional trends, collection performance, and operational health
- [x] Implement Module 10: Policy Intelligence and Economic Simulation with exactly 12-, 36-, and 60-month horizons and distributional impacts
- [x] Integrate LLM-assisted plain-language explanations for risk scores, anomalous invoice descriptions, and taxpayer discrepancy summaries
- [x] Add structured database procedures and complete audit trail for all sensitive actions and overrides
- [x] Add secure evidence document upload and case attachment metadata using S3-compatible storage
- [x] Add safeguards: human review, explainability, synthetic-data badges, evidence provenance, and non-conclusive UWI language
- [x] Add Vitest coverage for access control, risk-score bounds, override logging, horizon enforcement, synthetic-data constraints, and core procedures
- [x] Verify desktop and responsive layouts, loading states, empty states, errors, accessibility, and visual polish
- [ ] Save a final checkpoint after all implementation and verification work is complete

## Follow-up implementation gaps

- [x] Bind platformRole to authenticated UI state and enforce module/procedure access consistently for all five roles
- [ ] Implement distinct entities and transactions data coverage plus full audit records and persisted simulations
- [x] Implement real Module 1–5 and Module 10 screens/workflows, including lineage views, UWI reports, VAT graph visualization, revenue-leakage logic, and distributional impact output
- [x] Add visible risk feature breakdown and human override UI
- [ ] Add LLM workflows for invoice-description anomaly review and taxpayer discrepancy summaries
- [ ] Expose actual audit history and extend audit logging/tests to cover sensitive procedures, access control, synthetic-only constraints, and override logging
- [x] Build the auditor evidence-upload UI and case attachment workflow
- [x] Verify responsive, empty, error, and accessibility states with explicit test or visual evidence
