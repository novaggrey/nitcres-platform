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
- [x] Implement Module 6: Transfer Pricing and Cross-Border Intelligence with synthetic related-party risk indicators and benchmarking views
- [x] Implement Module 7: Predictive Audit and Field Operations Manager with prioritised queues, assignment, workload, evidence packs, and status tracking
- [x] Implement Module 8: National Tax Gap and Revenue Capacity Engine with synthetic tax-gap analytics and transparent assumptions
- [x] Implement Module 9: Executive Revenue and Operational Dashboard with KPIs, regional trends, collection performance, and operational health
- [x] Implement Module 10: Policy Intelligence and Economic Simulation with exactly 12-, 36-, and 60-month horizons and distributional impacts
- [x] Integrate LLM-assisted plain-language explanations for risk scores, anomalous invoice descriptions, and taxpayer discrepancy summaries
- [x] Add structured database procedures and complete audit trail for all sensitive actions and overrides
- [x] Add secure evidence document upload and case attachment metadata using S3-compatible storage
- [x] Add safeguards: human review, explainability, synthetic-data badges, evidence provenance, and non-conclusive UWI language
- [x] Add Vitest coverage for access control, risk-score bounds, override logging, horizon enforcement, synthetic-data constraints, and core procedures
- [x] Verify desktop and responsive layouts, loading states, empty states, errors, accessibility, and visual polish
- [x] Save a final checkpoint after all implementation and verification work is complete

## Follow-up implementation gaps

- [x] Bind platformRole to authenticated UI state and enforce module/procedure access consistently for all five roles
- [x] Implement distinct entities and transactions data coverage plus full audit records and persisted simulations
- [x] Implement real Module 1–5 and Module 10 screens/workflows, including lineage views, UWI reports, VAT graph visualization, revenue-leakage logic, and distributional impact output
- [x] Add visible risk feature breakdown and human override UI
- [x] Add LLM workflows for invoice-description anomaly review and taxpayer discrepancy summaries
- [x] Expose actual audit history and extend audit logging/tests to cover sensitive procedures, access control, synthetic-only constraints, and override logging
- [x] Build the auditor evidence-upload UI and case attachment workflow
- [x] Verify responsive, empty, error, and accessibility states with explicit test or visual evidence

## Verification-driven follow-up gaps

- [x] Build a dedicated Module 6 workspace with synthetic related-party entities, cross-border exposures, benchmark comparisons, and transfer-pricing risk indicators backed by data
- [x] Extend Module 7 with explicit prioritisation logic, workload allocation metrics, assignee state, and queue ordering evidence in code and UI
- [x] Implement a real Module 8 analytics view with tax-gap calculations, revenue-capacity metrics, and visible transparent assumptions sourced from synthetic data
- [x] Add a dedicated Module 9 executive workspace showing KPIs, regional trends, collection performance, and operational health with role-gated access and data bindings

## Data-binding verification gaps

- [x] Add transfer-pricing-specific synthetic tables/helpers/queries and bind Module 6 cards and benchmark views to fetched data
- [x] Implement computed audit prioritisation, assignee/workload state, and sorted queue logic for Module 7 and surface those results in the UI
- [x] Create server-side tax-gap and revenue-capacity calculations over synthetic data and bind Module 8 metrics to those results
- [x] Add dedicated backend data bindings for Module 9 KPIs, regional trends, collection performance, and operational health

## Final data-binding corrections

- [x] Return transfer-pricing comparables and benchmark rows from the server aggregation and bind the comparison view to them
- [x] Surface the computed prioritized case list and derive workload/SLA metrics from persisted case state rather than fixed placeholders
- [x] Bind executive regional trends, operational-health summary, and health signal values to the server aggregation

## Final UI binding corrections

- [x] Render transfer-pricing benchmark fields from the operational-intelligence comparables in the Module 6 comparison view
- [x] Fix Executive Dashboard regional trend binding to use the server response shape and verify visible labels

## Final verification correction

- [x] Use the server regional field consistently for the Executive Dashboard React key and capture final visual verification

## Login and GitHub delivery

- [x] Add a dedicated NITCRES login page with pre-filled, clearly labeled demo credentials
- [x] Preserve secure authentication boundaries and distinguish demo access from production OAuth
- [x] Validate the login page visually, functionally, responsively, and with tests
- [x] Create a separately documented commit for the login-page implementation
- [x] Push the login commit to the configured GitHub repository and verify the remote branch

## Login verification follow-up

- [x] Add and commit login-page test coverage that is executed by Vitest, then rerun the suite and confirm the login test file is included
- [x] Capture explicit mobile-width visual verification for `/login` and document the responsive result

## Commit verification follow-up

- [x] Create and verify a separately documented Git commit for the executed login test coverage and responsive verification updates
