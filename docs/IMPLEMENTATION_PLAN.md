# Implementation Plan — Eunomia

## Guiding Principles

- TDD: write tests first (RED → GREEN → REFACTOR)
- Small focused files (<800 lines), small functions (<50 lines)
- Immutable data patterns throughout
- No feature beyond what the current phase requires
- Each phase must be deployable and testable before moving to next

---

## Phase 0: Project Cleanup & Foundation Setup ✅ COMPLETED

**Goal:** Clean up boilerplate, set up project structure, configure tooling.

### Completed
- [x] Remove unused pages, components, Stripe integration, stale types, blog utils
- [x] Rewrite root layout (Providers only) + root page (redirect to /signin)
- [x] Full Prisma schema with all Eunomia models
- [x] Folder structure: `src/lib/`, `src/hooks/`, `src/components/` subdirs, `uploads/`
- [x] `src/lib/prisma/client.ts` — Prisma singleton (PrismaPg adapter)
- [x] Install Recharts + Vitest + jose
- [x] `.env.example` created

---

## Phase 1: License Activation ✅ COMPLETED

**Goal:** App cannot be used without a valid activated license.

### Design
- License key entered via **Web UI** (no env var for key)
- Validated against **Supabase REST API** (no Edge Function needed)
- Cached in local DB + **HS256 JWT cookie** (signed with NEXTAUTH_SECRET)
- Cookie valid **24 hours** → triggers daily re-validation
- **7-day grace period** if Supabase unreachable
- 19 unit tests (TDD) — all passing

### Completed
- [x] `src/lib/license/validate.ts` — call Supabase REST API, return typed result
- [x] `src/lib/license/cookie.ts` — create/verify HS256 JWT cookie
- [x] `src/lib/license/check.ts` — query local DB, check expiry
- [x] `src/lib/license/__tests__/` — 19 unit tests
- [x] `src/app/(setup)/activate/page.tsx` — license activation UI
- [x] `src/app/api/license/activate/route.ts` — validate + store + set cookie
- [x] `src/app/api/license/refresh/route.ts` — daily re-validation + grace period
- [x] `src/middleware.ts` — license cookie guard + auth guard
- [x] Prisma schema: `License` model simplified (no certificate, no fingerprint)
- [x] `.env.example` updated (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

### Supabase Setup (pre-requisite — done once by developer)
```sql
create table license_keys (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  max_tenants int not null,
  license_type text not null default 'standard',
  expires_at timestamptz,
  is_active boolean default true,
  customer_name text,
  created_at timestamptz default now()
);
```
To issue a license: INSERT a row into this table via Supabase Dashboard.

---

## Phase 2: Authentication & Multi-Tenancy Foundation ✅ COMPLETED

**Goal:** Users can register/login. Super Admin can create tenants and assign users.

### Completed
- [x] `src/utils/auth.ts` — fixed: signIn path, NEXTAUTH_SECRET, removed GitHub/Google/console.log, added isSuperAdmin to JWT/session
- [x] `src/types/next-auth.d.ts` — type augmentation for session.user.id + isSuperAdmin
- [x] `src/app/api/register/route.ts` — first registered user becomes Super Admin automatically
- [x] `src/lib/auth/rbac.ts` — checkIsSuperAdmin, getTenantRoleForUser, hasMinimumTenantRole, getUserTenants
- [x] `src/lib/auth/session.ts` — typed getAuthSession() wrapper
- [x] `src/lib/utils/api.ts` — ok() and err() API response helpers
- [x] `src/lib/auth/__tests__/rbac.test.ts` — 12 unit tests
- [x] `src/app/api/tenants/route.ts` — GET (scoped by role), POST (Super Admin, enforces maxTenants)
- [x] `src/app/api/tenants/[tenantId]/route.ts` — GET, PATCH, DELETE with RBAC
- [x] `src/app/api/tenants/__tests__/route.test.ts` — 5 integration tests
- [x] `src/app/api/users/route.ts` — GET (tenant-scoped), POST (invite by email)
- [x] `src/app/api/users/[userId]/route.ts` — PATCH (role), DELETE (remove from tenant)
- [x] `src/app/api/users/__tests__/route.test.ts` — 6 integration tests
- [x] `src/app/dashboard/layout.tsx` — sidebar layout, role-conditional nav, user info
- [x] `src/app/dashboard/page.tsx` — overview with contextual empty states
- [x] `src/app/dashboard/tenants/page.tsx` — tenant list with license usage
- [x] `src/app/dashboard/tenants/new/page.tsx` — create tenant form
- [x] `src/app/dashboard/tenants/[tenantId]/page.tsx` — tenant detail + members
- [x] `src/app/dashboard/users/page.tsx` — user management per tenant
- [x] `src/components/dashboard/SidebarNav.tsx` — client component with active link state
- [x] `src/middleware.ts` — updated: authenticated root / redirects to /dashboard

### Notes
- Dashboard URL prefix: `/dashboard/*` (not route group, explicit folder)
- First registered user = Super Admin (automatic, no separate setup step)
- `prisma migrate dev --name init` still needs to be run once when DB is connected

### Acceptance criteria
- Super Admin can create tenants up to `license.maxTenants`
- Tenant Admin can invite users and assign ADMIN / ASSESSOR role
- Assessor cannot access `/tenants` or `/users` management
- API rejects requests that access another tenant's data

---

## Phase 3: Framework Seed Data ✅ COMPLETED

**Goal:** All framework controls seeded into DB, browsable in UI.

### Tasks
- [x] `prisma/seeds/framework-nist-csf.ts` — NIST CSF v2.0 (6 Functions, 106 Subcategories)
- [x] `prisma/seeds/framework-iso-27001.ts` — ISO 27001:2022 (4 Themes, 93 controls) + ISO 27002 guidance (`GUIDANCE_ADDITIONS`)
- [x] `prisma/seeds/framework-pci-dss.ts` — PCI DSS v4.0.1 (12 Requirements, 63 sub-requirements)
- (ISO 27002 was initially a separate seed; later removed — its guidance folded into ISO 27001, see migration `remove_iso_27002`)
- [x] `prisma/seed.ts` — orchestrate all seeds (idempotent upserts)
- [x] Configure seed in `prisma.config.ts` (`migrations.seed = "tsx prisma/seed.ts"`) + `db:seed`/`db:migrate`/`db:generate` scripts in package.json
- [x] `src/app/api/frameworks/route.ts`: GET frameworks list (with domain/control counts)
- [x] `src/app/api/frameworks/[frameworkId]/domains/route.ts`: GET domains + controls
- [x] `src/app/dashboard/frameworks/page.tsx`: framework cards
- [x] `src/app/dashboard/frameworks/[frameworkId]/page.tsx`: control browser grouped by domain/section
- [x] Tests: `prisma/seeds/__tests__/seed-data.test.ts` — counts, uniqueness, required fields, NIST section integrity (29 tests)

### Acceptance criteria
- [x] `prisma db seed` populates all frameworks correctly and is safe to re-run (idempotent upserts)
- [x] Framework browser shows controls grouped by domain/section

### Notes
- Seed uses `tsx` (added as devDependency). Each seed function upserts by unique key, so re-running is safe.
- ISO 27002's implementation guidance is folded into the ISO 27001 controls (`GUIDANCE_ADDITIONS` in `framework-iso-27001.ts`); it is not a separate framework.
- Seed counts: **3 frameworks · 22 domains · 262 controls** total (NIST 106, ISO 27001 93, PCI DSS 63).

---

## Phase 4: Assessment Management ✅ COMPLETED

**Goal:** Tenant Admin creates assessments; assessors fill in control responses collaboratively.

### Tasks
- [x] `src/app/api/assessments/route.ts`: GET (tenant-scoped list), POST (create + auto-stub responses)
- [x] `src/app/api/assessments/[assessmentId]/route.ts`: GET, PATCH, DELETE
- [x] `src/app/api/assessments/[assessmentId]/controls/route.ts`: GET all responses (joined w/ control+domain)
- [x] `src/app/api/assessments/[assessmentId]/controls/[controlId]/route.ts`: PUT (upsert)
- [x] `src/app/dashboard/assessments/page.tsx`: assessment list (with progress bars)
- [x] `src/app/dashboard/assessments/new/page.tsx` + `components/assessments/NewAssessmentForm.tsx`
- [x] `src/app/dashboard/assessments/[assessmentId]/page.tsx`: overview + controls grouped by domain
- [x] `src/app/dashboard/assessments/[assessmentId]/controls/[controlId]/page.tsx` + `ControlResponseForm.tsx`
- [x] Response form: maturity 1–5 (NIST CSF) or status dropdown + notes + optional deadline
- [x] Tests: create assessment + auto-stub, upsert response, RBAC (13 tests)

### Acceptance criteria
- [x] Creating assessment auto-stubs all controls as NOT_STARTED
- [x] Any assessor in the tenant can update any control response (collaborative upsert)
- [x] NIST CSF shows maturity selector; others show status dropdown

### Notes
- Pages use the explicit `dashboard/` folder (not the `(dashboard)` route group named in the original plan), consistent with the project's routing decision.
- RBAC: list/view/update-response = ASSESSOR; create/patch/delete assessment = ADMIN (Super Admin bypasses).
- Completion % on list & detail = (IMPLEMENTED + NOT_APPLICABLE) / total responses.

---

## Phase 5: Evidence Management ✅ COMPLETED

**Goal:** Assessors upload, view, and delete evidence files per control.

### Tasks
- [x] `src/lib/evidence/storage.ts`: save/read/delete files on filesystem (+ path-traversal guard, filename sanitization)
- [x] `src/lib/evidence/validate.ts`: file type + size validation
- [x] `src/app/api/evidence/route.ts`: POST (multipart upload)
- [x] `src/app/api/evidence/[evidenceId]/route.ts`: GET (stream, auth-gated), DELETE
- [x] `src/components/evidence/EvidencePanel.tsx` (upload + list + delete, wired into the control response page)
- [x] Allowed: PDF, DOCX, XLSX, PNG, JPG, JPEG, TXT — max 50MB (`MAX_FILE_SIZE_MB`)
- [x] Tests: upload, delete, type/size rejection, RBAC, storage round-trip + traversal (23 tests)

### Acceptance criteria
- [x] Files served only via authenticated API (direct path blocked; traversal-guarded reads)
- [x] Cascade delete: deleting an assessment removes its evidence files from disk (DB rows cascade)
- [x] Path: `{UPLOAD_DIR}/{tenantId}/{assessmentId}/{controlId}/{uuid}_{filename}` (relative path stored in DB)

### Notes
- Combined upload + list + delete into a single `EvidencePanel` client component instead of two separate components.
- Evidence is attached to the `ControlResponse` (which is auto-stubbed for every control), so uploads target an existing response.

---

## Post-Phase-5 Enhancements (delivered between Phase 5 and Phase 6)

### NIST CSF per-control maturity criteria + implementation examples

**Goal:** Each NIST CSF control shows assessors what "good" looks like at each maturity level, plus implementation guidance from NIST source data.

### Completed
- [x] `docs/nist-control.xlsx` — source data (106 controls × 5 maturity levels + implementation examples)
- [x] `prisma/seeds/nist-maturity-data.ts` — auto-generated from Excel; 530 maturity criteria definitions
- [x] `prisma/schema.prisma`: added `maturityCriteria Json?` + `implementationExamples String? @db.Text` to `Control` model
- [x] Migration `20260603100000_control_maturity_fields` applied
- [x] `seedNistCsf()` updated to upsert maturity data from `nist-maturity-data.ts`
- [x] `MaturityTable` component — 5-row table (Level | Criteria), highlights the assessor's current level
- [x] `ImplementationExamples` component — collapsed by default; expand shows parsed entries with category/example tags

### Maturity level labels
| Level | Label |
|---|---|
| 1 | Ad-Hoc |
| 2 | Repeatable |
| 3 | Capable |
| 4 | Matured |
| 5 | Industry Best |

---

## Phase 6: Dashboard & Charts ✅ COMPLETED

**Goal:** Compliance progress visualized per assessment and per tenant.

### Tasks
- [x] `src/lib/utils/compliance.ts`: `calculateCompletion`, `groupByStatus`, `calculateNistMaturityByDomain`, `calculateNistMaturityTable`, `getUpcomingDeadlines` (17 tests)
- [x] `src/lib/utils/nist-colors.ts` — NIST CSF 2.0 official palette (6 Functions)
- [x] `src/lib/utils/framework-colors.ts` — ISO 27001 (4 colors) + PCI DSS (12-color gradient)
- [x] `src/components/charts/StatusBreakdownChart.tsx` — Recharts donut; non-NIST only
- [x] `src/components/charts/DomainProgressChart.tsx` — Recharts horizontal bar; dynamic Y-axis width; domain-specific colors + legend for all frameworks
- [x] `src/components/charts/MaturityRadarChart.tsx` — Recharts RadarChart; avg maturity per NIST Function; title = "Overall Maturity Score: X.X"
- [x] `src/components/assessments/NistMaturityTable.tsx` — section rows per domain, domain avg row, overall score; NIST CSF 2.0 colors
- [x] `src/components/dashboard/StatsCards.tsx` — summary cards
- [x] `src/components/dashboard/DeadlineList.tsx` — upcoming deadlines ≤30 days; urgency color coding
- [x] `src/app/dashboard/page.tsx`: overview with stats, recent assessments (mini bar), deadlines
- [x] Assessment detail NIST: radar + completion bar + NistMaturityTable (no status donut)
- [x] Assessment detail non-NIST: status donut + domain bar with legend
- [x] `src/app/dashboard/settings/page.tsx`: settings page

### Acceptance criteria
- [x] Correct % calculated from real data (pure utility, 17 tests)
- [x] NIST: RadarChart + NistMaturityTable (section-level, domain avg, overall score)
- [x] All frameworks: domain-specific colors + legend on DomainProgressChart
- [x] Deadline list shows controls due ≤30 days

### Notes
- NIST colors centralized in `nist-colors.ts`, shared by `NistMaturityTable` + `DomainProgressChart`
- `DomainProgressChart.colorMap` prop drives both color and legend visibility
- CI updated to Node 24 (Node 20 deprecated June 16, 2026)

---

## Phase 7: Polish & Production Readiness ✅ COMPLETED

### Tasks
- [x] Settings page: System Configuration section (UPLOAD_DIR, MAX_FILE_SIZE_MB, email host — Super Admin only, read-only)
- [x] Loading skeletons: `src/app/dashboard/loading.tsx` + `src/app/dashboard/assessments/loading.tsx`; reusable `Skeleton` component
- [x] Error boundary: `src/app/dashboard/error.tsx` (Next.js App Router convention)
- [x] Toast notifications: `react-hot-toast` already wired in Providers; added toast.success to NewAssessmentForm + EditAssessmentForm
- [x] License expiry warning: amber/red banner in dashboard layout (≤30 days) + Settings section detail
- [x] Tenant limit warning banner: shown in dashboard layout when count ≥ maxTenants (Super Admin only)
- [x] `AdminBanners` server component in layout handles both banners efficiently (one render path)
- [x] E2E tests (Playwright): `e2e/auth.spec.ts`, `e2e/assessment.spec.ts`, `e2e/settings.spec.ts` — runs locally against `npm run dev` via `npm run test:e2e`; excluded from Vitest/CI
- [x] Misc polish: past-deadline warning in both assessment forms, server logger (`src/lib/logger.ts`), console.log cleanup

### Notes
- Dark mode already implemented via Tailwind `dark:` classes throughout; no audit issues found
- E2E tests are local-only (require live DB + running server); not added to CI to keep it simple
- Playwright config: `playwright.config.ts`; set `E2E_EMAIL` + `E2E_PASSWORD` env vars for tests

### Acceptance criteria
- [x] Dashboard shows meaningful loading state while data fetches
- [x] Rendering errors display a user-friendly "Something went wrong" screen with retry
- [x] Super Admin sees banner when license is expiring or tenant limit reached
- [x] Settings shows upload path, max file size, and email server config

---

## Dependency Order

```
Phase 0 ✅ (Setup)
    └── Phase 1 ✅ (License)
        └── Phase 2 ✅ (Auth + Tenants)
            └── Phase 3 (Framework Data)
                └── Phase 4 (Assessments)
                    ├── Phase 5 (Evidence)
                    └── Phase 6 (Dashboard)
                            └── Phase 7 (Polish)
```
