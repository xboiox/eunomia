# Architecture — Eunomia

## System Overview

Eunomia is a **self-hosted Next.js web application** with a PostgreSQL database. It is deployed entirely within the customer's internal network. The only external dependency is the Supabase license server — called once during activation, then daily for re-validation.

```
┌─────────────────────────────────────────────────────┐
│                Customer Internal Network             │
│                                                      │
│   ┌───────────────┐     ┌──────────────────────┐    │
│   │  Browser      │────▶│  Next.js App         │    │
│   │  (User)       │     │  (App Router)        │    │
│   └───────────────┘     │                      │    │
│                          │  - UI (React)        │    │
│                          │  - API Routes        │    │
│                          │  - Auth (NextAuth)   │    │
│                          └──────────┬───────────┘    │
│                                     │                │
│                          ┌──────────▼───────────┐    │
│                          │  PostgreSQL           │    │
│                          │  (via Prisma 7)       │    │
│                          └──────────────────────┘    │
│                                                      │
│                          ┌──────────────────────┐    │
│                          │  Local Filesystem     │    │
│                          │  /uploads/...         │    │
│                          └──────────────────────┘    │
└─────────────────────────────────────────────────────┘
         │ (activation + daily re-validation)
         ▼
┌─────────────────────────┐
│  Supabase (External)    │
│  License REST API       │
│  (no Edge Function)     │
└─────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS + TailGrids | 4.x |
| ORM | Prisma | 7.x |
| Database | PostgreSQL | 15+ |
| Auth | NextAuth | 4.x |
| Charts | Recharts | 2.x |
| Email | Nodemailer | 7.x |
| License Server | Supabase REST API (no Edge Function) | — |
| Testing | Vitest (unit/integration), Playwright (E2E) | — |

---

## Application Routes

```
app/
├── page.tsx                   # / → redirects to /signin (or /dashboard if authed)
│
├── (site)/                    # Auth pages — no dashboard layout
│   └── (auth)/
│       ├── signin/
│       ├── signup/
│       ├── forgot-password/
│       └── reset-password/[token]/
│
├── (setup)/                   # First-run setup — no auth or dashboard layout
│   └── activate/              # License activation page
│
└── dashboard/                 # Protected — requires license cookie + auth session
    ├── layout.tsx             # Dashboard shell (sidebar + role-conditional nav)
    ├── page.tsx               # Overview (placeholder, Phase 6 adds charts)
    ├── tenants/               # Super Admin only
    │   ├── page.tsx           # List tenants + license usage
    │   ├── new/page.tsx       # Create tenant
    │   └── [tenantId]/page.tsx # Tenant detail + member list
    ├── users/
    │   └── page.tsx           # User management per tenant (invite, role, remove)
    ├── assessments/           # Phase 4
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [assessmentId]/
    │       ├── page.tsx
    │       └── controls/[controlId]/page.tsx
    ├── frameworks/            # Phase 3
    │   └── page.tsx
    └── settings/              # Phase 7
        └── page.tsx
```

---

## API Routes

```
api/
├── auth/[...nextauth]/        # NextAuth (credentials + magic link)
├── register/                  # POST: create user (first = Super Admin)
├── forgot-password/           # Reset password flow (boilerplate)
│
├── license/
│   ├── activate/route.ts      # POST: validate key → store DB → set cookie
│   └── refresh/route.ts       # GET: daily re-validate → new cookie or grace period
│
├── tenants/
│   ├── route.ts               # GET (scoped by role), POST (Super Admin, enforces maxTenants)
│   └── [tenantId]/route.ts    # GET, PATCH (ADMIN+), DELETE (Super Admin)
│
├── users/
│   ├── route.ts               # GET (tenant-scoped), POST (invite by email, ADMIN+)
│   └── [userId]/route.ts      # PATCH (role change), DELETE (remove from tenant)
│
├── frameworks/                # Phase 3
│   └── [frameworkId]/domains/route.ts
│
├── assessments/               # Phase 4
│   └── [assessmentId]/controls/[controlId]/route.ts
│
└── evidence/                  # Phase 5
    └── [evidenceId]/route.ts
```

---

## Folder Structure

```
src/
├── app/                       # Next.js App Router (routes)
│
├── components/
│   ├── dashboard/
│   │   └── SidebarNav.tsx     # Client component — active link via usePathname
│   ├── assessment/            # Phase 4
│   ├── evidence/              # Phase 5
│   ├── frameworks/            # Phase 3
│   ├── charts/                # Phase 6
│   └── ui/                    # Shared primitives (Phase 7)
│
├── lib/
│   ├── auth/
│   │   ├── rbac.ts            # checkIsSuperAdmin, getTenantRoleForUser, hasMinimumTenantRole
│   │   └── session.ts         # getAuthSession() — typed wrapper around getServerSession
│   ├── license/
│   │   ├── validate.ts        # Supabase REST API call
│   │   ├── cookie.ts          # HS256 JWT cookie (sign/verify with NEXTAUTH_SECRET)
│   │   └── check.ts           # Query local DB License record
│   ├── evidence/              # Phase 5
│   ├── prisma/
│   │   └── client.ts          # Prisma singleton (PrismaPg adapter) — use in all new code
│   └── utils/
│       └── api.ts             # ok() and err() API response helpers
│
├── types/
│   └── next-auth.d.ts         # Session type augmentation (id, isSuperAdmin)
│
├── hooks/                     # Phase 4+
│
├── styles/
│   └── index.css
│
└── utils/                     # Boilerplate utils (auth, email, prismaDB, validateEmail)
```

---

## Multi-Tenancy Model

Tenancy enforced at **database query level** — every data query is scoped by `tenantId`.

```
User ─────────── TenantUser ─────────── Tenant
                 (role: ADMIN           (Organization)
                       ASSESSOR)
                      │
                      ▼
                 Assessment ──── Framework
                      │
                      ▼
                 ControlResponse ──── Control
                      │
                      ▼
                 Evidence (files on disk)
```

**Role hierarchy:**
```
Super Admin  (User.isSuperAdmin = true)
  → Manage all tenants, all users, view license status
  → Not necessarily a member of any tenant

Tenant Admin  (TenantUser.role = ADMIN)
  → Manage users within their tenant
  → Create/manage assessments
  → View all evidence in their tenant

Assessor  (TenantUser.role = ASSESSOR)
  → Fill in control responses
  → Upload/view evidence
  → Cannot manage users or delete assessments
```

**RBAC helpers** (use these in all API routes):
```typescript
import { getAuthSession } from "@/lib/auth/session"
import { hasMinimumTenantRole } from "@/lib/auth/rbac"

const session = await getAuthSession()
if (!session) return err("Unauthorized", 401)
const ok = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN")
if (!ok) return err("Forbidden", 403)
```

---

## License Flow

### Activation (first run)
```
1. No eunomia-license cookie → middleware → /setup/activate
2. Admin enters license key in Web UI
3. POST /api/license/activate:
   → GET Supabase: /rest/v1/license_keys?key=eq.{key}
   → Returns { max_tenants, license_type, expires_at, is_active }
   → Store License in local DB
   → Set HS256 JWT cookie (valid 24h, signed with NEXTAUTH_SECRET)
4. Redirect to /signin
```

### Daily Re-validation
```
Cookie validUntil expires (every 24h):
1. Middleware → redirect /api/license/refresh?from=/current-path
2. GET local DB for licenseKey → re-call Supabase
3. Success → update lastValidatedAt, new 24h cookie, redirect back
4. Supabase unreachable → grace period logic:
   - gracePeriodStart not set → start grace period now
   - now < gracePeriodStart + 7 days → extend cookie 24h, redirect back
   - grace expired → clear cookie, redirect /setup/activate
```

### Supabase Setup (one-time, by developer)
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
To issue a license: INSERT a row. No Edge Function needed — app uses Supabase REST API directly via `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

---

## Evidence Storage

```
uploads/
└── {tenantId}/
    └── {assessmentId}/
        └── {controlId}/
            └── {uuid}_{originalFilename}
```

Files served only via authenticated API route — never directly accessible by URL.  
**Allowed types:** PDF, DOCX, XLSX, PNG, JPG, JPEG, TXT — max `MAX_FILE_SIZE_MB` (default 50MB).

---

## Framework Data Model

Controls seeded once at deployment via `prisma db seed`. Hierarchy:

```
Framework (e.g. NIST_CSF v2.0)
└── ControlDomain        ← top-level grouping
    │  NIST CSF: Function (GV, ID, PR, DE, RS, RC)
    │  ISO 27001/27002: Theme (Organizational, People, Physical, Technological)
    │  PCI DSS: Requirement (Req-1 … Req-12)
    │
    └── Control          ← assessable unit
           NIST CSF: Subcategory (e.g. GV.OC-01) — sectionCode = Category
           ISO: Control (e.g. 5.1)
           PCI DSS: Sub-requirement (e.g. 1.1.1)
```

**Assessment response per framework:**
- NIST CSF: `maturityLevel` (1–5 integer)
- ISO 27001, ISO 27002, PCI DSS: `ComplianceStatus` enum (NOT_STARTED / IN_PROGRESS / IMPLEMENTED / NOT_APPLICABLE)

---

## Security Considerations

- All API routes validate session via `getAuthSession()`
- RBAC via `hasMinimumTenantRole()` on every tenant-scoped route
- Super Admin routes check `session.isSuperAdmin`
- Tenant isolation enforced in all DB queries (no cross-tenant leakage)
- Evidence files served only via authenticated API (not static)
- License validated daily via Supabase; 7-day grace period for downtime
- No secrets hardcoded — all via environment variables
- Input validated at API boundary (400 on missing/invalid fields)
