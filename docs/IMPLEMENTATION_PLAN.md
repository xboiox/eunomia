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
- [x] `prisma/seeds/framework-iso-27001.ts` — ISO 27001:2022 (4 Themes, 93 controls)
- [x] `prisma/seeds/framework-iso-27002.ts` — ISO 27002:2022 (reuses 27001's 93 controls + guidance)
- [x] `prisma/seeds/framework-pci-dss.ts` — PCI DSS v4.0.1 (12 Requirements, 63 sub-requirements)
- [x] `prisma/seed.ts` — orchestrate all seeds (idempotent upserts)
- [x] Configure seed in `prisma.config.ts` (`migrations.seed = "tsx prisma/seed.ts"`) + `db:seed`/`db:migrate`/`db:generate` scripts in package.json
- [x] `src/app/api/frameworks/route.ts`: GET frameworks list (with domain/control counts)
- [x] `src/app/api/frameworks/[frameworkId]/domains/route.ts`: GET domains + controls
- [x] `src/app/dashboard/frameworks/page.tsx`: framework cards
- [x] `src/app/dashboard/frameworks/[frameworkId]/page.tsx`: control browser grouped by domain/section
- [x] Tests: `prisma/seeds/__tests__/seed-data.test.ts` — counts, uniqueness, required fields, NIST section integrity (29 tests)

### Acceptance criteria
- [x] `prisma db seed` populates all 4 frameworks correctly and is safe to re-run (idempotent upserts)
- [x] Framework browser shows controls grouped by domain/section

### Notes
- Seed uses `tsx` (added as devDependency). Each seed function upserts by unique key, so re-running is safe.
- ISO 27002 deliberately reuses `ISO_27001_DOMAINS` (identical 93 Annex A controls) and layers in implementation guidance via a `GUIDANCE_ADDITIONS` map.
- Seed counts: 4 frameworks · 26 domains · 355 controls total (NIST 106, ISO 27001 93, ISO 27002 93, PCI DSS 63).

---

## Phase 4: Assessment Management

**Goal:** Tenant Admin creates assessments; assessors fill in control responses collaboratively.

### Tasks
- [ ] `src/app/api/assessments/route.ts`: GET (tenant-scoped list), POST (create + bulk-create stubs)
- [ ] `src/app/api/assessments/[assessmentId]/route.ts`: GET, PATCH, DELETE
- [ ] `src/app/api/assessments/[assessmentId]/controls/route.ts`: GET all responses
- [ ] `src/app/api/assessments/[assessmentId]/controls/[controlId]/route.ts`: PUT (upsert)
- [ ] `src/app/(dashboard)/assessments/page.tsx`: assessment list
- [ ] `src/app/(dashboard)/assessments/new/page.tsx`: create (framework, name, deadline)
- [ ] `src/app/(dashboard)/assessments/[assessmentId]/page.tsx`: overview + controls list
- [ ] `src/app/(dashboard)/assessments/[assessmentId]/controls/[controlId]/page.tsx`: response form
- [ ] Response form: maturity 1–5 (NIST CSF) or status dropdown + notes + optional deadline
- [ ] Tests: create assessment, upsert response, auto-create stubs

### Acceptance criteria
- Creating assessment auto-stubs all controls as NOT_STARTED
- Any assessor in the tenant can update any control response
- NIST CSF shows maturity selector; others show status dropdown

---

## Phase 5: Evidence Management

**Goal:** Assessors upload, view, and delete evidence files per control.

### Tasks
- [ ] `src/lib/evidence/storage.ts`: save/delete files on filesystem
- [ ] `src/lib/evidence/validate.ts`: file type + size validation
- [ ] `src/app/api/evidence/route.ts`: POST (multipart upload)
- [ ] `src/app/api/evidence/[evidenceId]/route.ts`: GET (stream, auth-gated), DELETE
- [ ] `src/components/evidence/EvidenceUpload.tsx`
- [ ] `src/components/evidence/EvidenceList.tsx`
- [ ] Allowed: PDF, DOCX, XLSX, PNG, JPG, JPEG, TXT — max 50MB
- [ ] Tests: upload, download, delete, type/size rejection

### Acceptance criteria
- Files served only via authenticated API (direct path blocked)
- Cascade delete: removing a control response deletes filesystem files
- Path: `{UPLOAD_DIR}/{tenantId}/{assessmentId}/{controlId}/{uuid}_{filename}`

---

## Phase 6: Dashboard & Charts

**Goal:** Compliance progress visualized per assessment and per tenant.

### Tasks
- [ ] `src/lib/utils/compliance.ts`: completion %, status breakdown, upcoming deadlines
- [ ] `src/components/charts/ComplianceDonutChart.tsx`
- [ ] `src/components/charts/DomainProgressChart.tsx`
- [ ] `src/components/charts/StatusBreakdownChart.tsx`
- [ ] `src/components/charts/MaturityRadarChart.tsx` (NIST CSF only)
- [ ] `src/components/dashboard/StatsCards.tsx`
- [ ] `src/components/dashboard/DeadlineList.tsx`
- [ ] `src/app/(dashboard)/page.tsx`: tenant overview
- [ ] `src/app/(dashboard)/assessments/[assessmentId]/page.tsx`: full dashboard
- [ ] Tests: compliance calculation functions

### Acceptance criteria
- Correct % calculated from real data
- NIST CSF shows RadarChart of avg maturity per Function
- Deadline list shows controls due ≤30 days

---

## Phase 7: Polish & Production Readiness

### Tasks
- [ ] Settings page (upload path, file size, email config)
- [ ] Loading skeletons, empty states, error boundaries
- [ ] Toast notifications (react-hot-toast)
- [ ] Dark mode audit
- [ ] License expiry warning banner (≤30 days)
- [ ] Tenant limit warning banner
- [ ] E2E tests (Playwright): full user flow

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
