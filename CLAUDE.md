# Eunomia — Claude Project Context

## What This Is

**Eunomia** is a self-hosted IT Security Compliance Dashboard. It allows organizations to perform self-assessments against major security frameworks (NIST CSF, ISO 27001, PCI DSS), manage evidence, and track compliance progress.

Built on top of the **Play Next.js** SaaS boilerplate.

## Key Docs

- [PRD.md](docs/PRD.md) — Product requirements, features, out-of-scope
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design, folder structure, routes, RBAC pattern
- [DB_SCHEMA.md](docs/DB_SCHEMA.md) — Full Prisma schema with all models
- [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) — Phase-by-phase tasks (check here for current progress)

## Current Status

**Phase 5 ✅ Complete — Phase 6 (Dashboard + Recharts) is next.**

```
Phase 0 ✅  Setup & cleanup
Phase 1 ✅  License activation (Supabase daily check + Web UI)
Phase 2 ✅  Auth + multi-tenancy + RBAC + dashboard shell
Phase 3 ✅  Framework seed data + browser UI (3 frameworks, 22 domains, 262 controls)
Phase 4 ✅  Assessment management + collaborative control responses
Phase 5 ✅  Evidence upload/download/delete (local filesystem)
Phase 6 ←   Dashboard + Recharts
Phase 7     Polish + E2E tests
```

---

## Key Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| License | Daily online check (Supabase REST API) + Web UI input | Simple, revocable, no cryptography needed |
| License cookie | HS256 JWT, signed with `NEXTAUTH_SECRET`, valid 24h | Edge Runtime compatible, no extra secrets |
| Grace period | 7 days if Supabase unreachable | Tolerates maintenance windows |
| Auth | First registered user = Super Admin automatically | Simple for self-hosted internal deployment |
| RBAC | `hasMinimumTenantRole()` called on every tenant-scoped API route | Explicit, testable, consistent |
| Dashboard routes | `/dashboard/*` (explicit folder, not route group) | Clearer URL structure |
| Framework data | Seed into PostgreSQL | Queryable, relational, consistent |
| Evidence storage | Local filesystem (`./uploads/`) | Internal deployment, no S3 dependency |
| Charts | Recharts | React-native, lightweight |
| Multi-tenancy | DB-level isolation via `tenantId` on all queries | Simple, no schema-per-tenant complexity |
| Prisma client | `PrismaPg` adapter; singleton at `src/lib/prisma/client.ts` | Prisma 7 requirement |

---

## Frameworks & Versions

| Framework | Version | Controls | Assessment Model |
|---|---|---|---|
| NIST CSF | v2.0 | 106 subcategories | Maturity level 1–5; status shown as Not started / In progress / Done (Done = `IMPLEMENTED`, `NOT_APPLICABLE` hidden) |
| ISO/IEC 27001 | 2022 | 93 (Annex A) | NOT_STARTED / IN_PROGRESS / IMPLEMENTED / NOT_APPLICABLE |
| PCI DSS | v4.0.1 | 12 requirements + 63 sub-requirements | Same enum as 27001 |

> ISO/IEC 27002:2022 is **not** a separate framework — it is the implementation guidance for the same Annex A controls, so its guidance lives on the ISO 27001 controls (`guidance` field, via `GUIDANCE_ADDITIONS` in `framework-iso-27001.ts`).

---

## Role Hierarchy

```
Super Admin  (User.isSuperAdmin = true)
  → Manages all tenants, all users, views license status
  → Created automatically for first registered user

Tenant Admin  (TenantUser.role = ADMIN)
  → Manages users in their tenant, creates assessments

Assessor  (TenantUser.role = ASSESSOR)
  → Fills control responses, uploads evidence
```

---

## RBAC Pattern (use in all new API routes)

```typescript
import { getAuthSession } from "@/lib/auth/session"
import { hasMinimumTenantRole } from "@/lib/auth/rbac"
import { ok, err } from "@/lib/utils/api"

export async function GET(request: NextRequest) {
  const session = await getAuthSession()
  if (!session) return err("Unauthorized", 401)

  const tenantId = request.nextUrl.searchParams.get("tenantId")!
  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR")
  if (!canAccess) return err("Forbidden", 403)

  const data = await prisma.something.findMany({ where: { tenantId } })
  return ok(data)
}
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + TailGrids |
| ORM | Prisma v7 + PrismaPg adapter |
| Database | PostgreSQL |
| Auth | NextAuth v4 (email/password + magic link) |
| License server | Supabase REST API (server-side only) |
| Charts | Recharts |
| Email | Nodemailer |
| Testing | Vitest (unit + integration) |

---

## Environment Variables

```
DATABASE_URL=                  # PostgreSQL connection string
NEXTAUTH_SECRET=               # Random secret ≥32 chars (also signs license cookie)
NEXTAUTH_URL=                  # App base URL (e.g. http://localhost:3000)
SUPABASE_URL=                  # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=     # Supabase service role key (server-side only, never client)
UPLOAD_DIR=./uploads           # Evidence file storage path
MAX_FILE_SIZE_MB=50
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
```

---

## Important File Locations

### Core Libraries (use in new code)
| File | Purpose |
|---|---|
| `src/lib/prisma/client.ts` | Prisma singleton — **use this everywhere** |
| `src/lib/auth/rbac.ts` | RBAC: `checkIsSuperAdmin`, `getTenantRoleForUser`, `hasMinimumTenantRole`, `getUserTenants` |
| `src/lib/auth/session.ts` | `getAuthSession()` — typed wrapper, use in all API routes + Server Components |
| `src/lib/utils/api.ts` | `ok()` and `err()` — consistent API response format |
| `src/types/next-auth.d.ts` | Augments `session.user` with `id` and `isSuperAdmin` |

### License
| File | Purpose |
|---|---|
| `src/lib/license/validate.ts` | Calls Supabase REST API to validate license key |
| `src/lib/license/cookie.ts` | Creates/verifies HS256 JWT cookie (24h validity + grace period) |
| `src/lib/license/check.ts` | Queries local DB for License record |
| `src/app/api/license/activate/route.ts` | First activation: validate → store DB → set cookie |
| `src/app/api/license/refresh/route.ts` | Daily re-validation + 7-day grace period |
| `src/app/(setup)/activate/page.tsx` | License activation UI |

### Dashboard
| File | Purpose |
|---|---|
| `src/app/dashboard/layout.tsx` | Dashboard shell with role-conditional sidebar |
| `src/components/dashboard/SidebarNav.tsx` | Client component (uses `usePathname` for active state) |

### Frameworks (Phase 3)
| File | Purpose |
|---|---|
| `prisma/seeds/framework-nist-csf.ts` | NIST CSF v2.0 data + `seedNistCsf()` (6 domains, 106 subcategories) |
| `prisma/seeds/framework-iso-27001.ts` | ISO 27001:2022 data + `seedIso27001()` (4 themes, 93 controls) + `GUIDANCE_ADDITIONS` (ex-ISO 27002 guidance) |
| `prisma/seeds/framework-pci-dss.ts` | PCI DSS v4.0.1 data + `seedPciDss()` (12 requirements, 63 sub-reqs) |
| `prisma/seed.ts` | Orchestrator — runs all 4 seeds (idempotent); `npm run db:seed` |
| `src/app/api/frameworks/route.ts` | GET frameworks list with domain/control counts |
| `src/app/api/frameworks/[frameworkId]/domains/route.ts` | GET domain → control tree |
| `src/app/dashboard/frameworks/page.tsx` | Framework cards |
| `src/app/dashboard/frameworks/[frameworkId]/page.tsx` | Control browser grouped by domain/section |

### Assessments (Phase 4)
| File | Purpose |
|---|---|
| `src/app/api/assessments/route.ts` | GET list (?tenantId, ASSESSOR) + POST create (ADMIN, auto-stubs all controls) |
| `src/app/api/assessments/[assessmentId]/route.ts` | GET / PATCH / DELETE (PATCH+DELETE = ADMIN) |
| `src/app/api/assessments/[assessmentId]/controls/route.ts` | GET all responses (control+domain joined) |
| `src/app/api/assessments/[assessmentId]/controls/[controlId]/route.ts` | PUT upsert response (ASSESSOR, collaborative) |
| `src/app/dashboard/assessments/page.tsx` | List with progress bars |
| `src/app/dashboard/assessments/new/page.tsx` + `components/assessments/NewAssessmentForm.tsx` | Create form |
| `src/app/dashboard/assessments/[assessmentId]/page.tsx` + `components/assessments/AssessmentControls.tsx` | Overview + clickable status filter + controls grouped by domain |
| `src/app/dashboard/assessments/[assessmentId]/controls/[controlId]/page.tsx` + `components/assessments/ControlResponseForm.tsx` | Response form (maturity for NIST, status otherwise) |

### Evidence (Phase 5)
| File | Purpose |
|---|---|
| `src/lib/evidence/validate.ts` | Allowed extensions/MIME + size limit (`validateEvidenceFile`, `maxFileSizeBytes`) |
| `src/lib/evidence/storage.ts` | `saveEvidenceFile` / `readEvidenceFile` / `deleteEvidenceFile` (+ traversal guard, `sanitizeFileName`) |
| `src/app/api/evidence/route.ts` | POST multipart upload (ASSESSOR) |
| `src/app/api/evidence/[evidenceId]/route.ts` | GET (auth-gated file stream) + DELETE |
| `src/components/evidence/EvidencePanel.tsx` | Upload + list + delete, wired into the control response page |

### Infrastructure
| File | Purpose |
|---|---|
| `src/middleware.ts` | License cookie guard + auth session guard |
| `prisma/schema.prisma` | Full schema — all models defined, run `prisma migrate dev --name init` once |
| `.env.example` | All required env vars with descriptions |
| `uploads/` | Evidence file storage root (gitignored) |

---

## Testing

```bash
npm run test        # watch mode
npm run test:run    # single run
npm run test:coverage  # with coverage report
```

Current: **118 tests, 12 test files, all passing** (CI runs lint + typecheck + test on every push)

Test files:
- `src/lib/license/__tests__/` — validate, cookie, check (20 tests)
- `src/lib/auth/__tests__/rbac.test.ts` — RBAC helpers (12 tests)
- `src/lib/evidence/__tests__/` — validate + storage (15 tests)
- `src/app/api/tenants/__tests__/route.test.ts` — tenant API (5 tests)
- `src/app/api/users/__tests__/route.test.ts` — user API (6 tests)
- `src/app/api/frameworks/__tests__/route.test.ts` — framework API (5 tests)
- `src/app/api/assessments/__tests__/route.test.ts` — assessment API (create/patch/delete) + response upsert (19 tests)
- `src/app/api/evidence/__tests__/route.test.ts` — evidence upload/delete API (8 tests)
- `prisma/seeds/__tests__/seed-data.test.ts` — framework seed integrity (28 tests)

---

## Supabase License Server Setup (one-time)

```sql
create table license_keys (
  key text primary key,
  max_tenants int not null,
  license_type text not null default 'standard',
  expires_at timestamptz,
  is_active boolean default true,
  customer_name text,
  created_at timestamptz default now()
);
```

To issue a license: INSERT a row via Supabase Dashboard.  
App authenticates via `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server-side only).

---

## First-Run Setup Sequence

> Full step-by-step local install + troubleshooting lives in [README.md](README.md). Summary:

1. Create the PostgreSQL role + database (default dev role: `<db-user>`, db `eunomia`)
2. Set env vars (`cp .env.example .env`, then fill `DATABASE_URL`, `NEXTAUTH_SECRET`, `SUPABASE_*`)
3. `npm run db:generate` → `npm run db:migrate` → `npm run db:seed`
4. `npm run dev` → app redirects to **`/activate`** (license gate URL = `/activate`, the `(setup)` route group page)
5. Enter license key → first user registers → becomes Super Admin
6. Super Admin creates tenant → invites users → start assessments

**Note on `DATABASE_URL`:** percent-encode any special characters in the DB password inside the URI (e.g. `!` → `%21`, `$` → `%24`).
