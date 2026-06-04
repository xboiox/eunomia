# Database Schema — Eunomia

## Overview

Schema extends the existing Play Next.js boilerplate models (Account, Session, VerificationToken) and adds Eunomia-specific models.

---

## Entity Relationship Summary

```
User ──────────── TenantUser ──────── Tenant
  │               (role)               │
  │                                    ├── Assessment ──── Framework
  │                                    │       │
  └── ControlResponse ◀───────────────┘       │
  │   (lastUpdatedBy)                          │
  └── Evidence                        ControlResponse ──── Control
      (uploadedBy)                        │
                                          └── Evidence
                                                      
Framework ──── ControlDomain ──── Control
License (standalone, system-level)
```

---

## Prisma Schema

```prisma
// ─────────────────────────────────────────
// EXISTING BOILERPLATE MODELS (unchanged)
// ─────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

// ─────────────────────────────────────────
// EXTENDED: User (modified from boilerplate)
// ─────────────────────────────────────────

model User {
  id                    String           @id @default(cuid())
  name                  String?
  email                 String?          @unique
  emailVerified         DateTime?
  image                 String?
  password              String?
  passwordResetToken    String?          @unique
  passwordResetTokenExp DateTime?
  isSuperAdmin          Boolean          @default(false)
  mustChangePassword    Boolean          @default(false)  // true on first login / admin reset
  passwordChangedAt     DateTime?                         // set on every password change; used for expiry check
  failedLoginAttempts   Int              @default(0)      // incremented on wrong password
  lockedUntil           DateTime?                         // non-null = account locked until this time
  createdAt             DateTime         @default(now())
  updatedAt             DateTime         @updatedAt
  accounts              Account[]
  sessions              Session[]
  tenantUsers           TenantUser[]
  controlResponses      ControlResponse[]
  evidences             Evidence[]
}

// ─────────────────────────────────────────
// NEW MODELS
// ─────────────────────────────────────────

// Key-value store for runtime configuration (Security Policy etc.)
// Avoids env-var restarts for settings that Super Admin may change at runtime.
model AppSettings {
  key       String   @id    // e.g. "password_expiry_days", "lockout_attempts", "lockout_minutes"
  value     String
  updatedAt DateTime @updatedAt
}

// System-level license (one record per installation)
// Validated daily against Supabase REST API
model License {
  id              String    @id @default(cuid())
  licenseKey      String    @unique
  licenseType     String    @default("standard")
  maxTenants      Int
  activatedAt     DateTime  @default(now())
  expiresAt       DateTime?
  lastValidatedAt DateTime  @default(now())
  createdAt       DateTime  @default(now())
}

// Organization / company
model Tenant {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique  // URL-safe identifier
  description String?
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  tenantUsers TenantUser[]
  assessments Assessment[]
}

// User membership in a tenant with role
model TenantUser {
  id        String     @id @default(cuid())
  userId    String
  tenantId  String
  role      TenantRole @default(ASSESSOR)
  createdAt DateTime   @default(now())
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant    Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([userId, tenantId])
}

enum TenantRole {
  ADMIN
  ASSESSOR
}

// Security framework definition
model Framework {
  id          String          @id @default(cuid())
  code        FrameworkCode   @unique
  name        String
  version     String
  description String?         @db.Text
  domains     ControlDomain[]
  assessments Assessment[]
}

enum FrameworkCode {
  NIST_CSF   // NIST CSF v2.0
  ISO_27001  // ISO/IEC 27001:2022 (carries ISO 27002 implementation guidance)
  PCI_DSS    // PCI DSS v4.0.1
}

// Top-level grouping within a framework
// NIST CSF: Function (Govern, Identify, Protect, Detect, Respond, Recover)
// ISO 27001: Theme (Organizational, People, Physical, Technological)
// PCI DSS: Requirement (Req-1 through Req-12)
model ControlDomain {
  id          String    @id @default(cuid())
  frameworkId String
  code        String    // e.g. "GV", "5", "Req-1"
  name        String    // e.g. "Govern", "Organizational controls"
  description String?   @db.Text
  order       Int
  framework   Framework @relation(fields: [frameworkId], references: [id])
  controls    Control[]
  @@unique([frameworkId, code])
}

// Individual assessable control
// NIST CSF: Subcategory (e.g. GV.OC-01) — sectionCode = Category code
// ISO 27001: Control (e.g. 5.1)
// PCI DSS: Sub-requirement (e.g. 1.1.1)
model Control {
  id                     String            @id @default(cuid())
  domainId               String
  code                   String            // e.g. "GV.OC-01", "5.1", "1.1.1"
  sectionCode            String?           // Mid-level grouping code (NIST CSF Category)
  sectionName            String?           // Mid-level grouping name
  name                   String
  description            String?           @db.Text
  guidance               String?           @db.Text // ISO 27002 implementation guidance (ISO 27001 only)
  maturityCriteria       Json?             // NIST CSF only — {"1":"Ad-Hoc desc","2":"Repeatable desc",...,"5":"Industry Best desc"}
  implementationExamples String?           @db.Text // NIST CSF only — raw text from NIST source, parsed in UI
  order                  Int
  domain                 ControlDomain     @relation(fields: [domainId], references: [id])
  responses              ControlResponse[]
  @@unique([domainId, code])
}

// Compliance assessment for a tenant against a framework
model Assessment {
  id              String           @id @default(cuid())
  tenantId        String
  frameworkId     String
  name            String           // e.g. "NIST CSF Assessment Q1 2026"
  description     String?
  status          AssessmentStatus @default(DRAFT)
  overallDeadline DateTime?        // Optional overall deadline
  createdById     String
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  tenant          Tenant           @relation(fields: [tenantId], references: [id])
  framework       Framework        @relation(fields: [frameworkId], references: [id])
  responses       ControlResponse[]
}

enum AssessmentStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
}

// Assessor's response to a single control within an assessment
// One response per control per assessment (multiple assessors share the same record)
model ControlResponse {
  id              String           @id @default(cuid())
  assessmentId    String
  controlId       String
  lastUpdatedById String
  // Non-NIST frameworks
  status          ComplianceStatus @default(NOT_STARTED)
  // NIST CSF only (null for other frameworks)
  maturityLevel   Int?             // 1–5
  notes           String?          @db.Text
  deadline        DateTime?        // Optional per-control deadline
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  assessment      Assessment       @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  control         Control          @relation(fields: [controlId], references: [id])
  lastUpdatedBy   User             @relation(fields: [lastUpdatedById], references: [id])
  evidences       Evidence[]
  @@unique([assessmentId, controlId])
}

enum ComplianceStatus {
  NOT_STARTED
  IN_PROGRESS
  IMPLEMENTED
  NOT_APPLICABLE
}

// Evidence file attached to a control response
model Evidence {
  id                String          @id @default(cuid())
  controlResponseId String
  fileName          String          // Original filename
  filePath          String          // Relative path: tenantId/assessmentId/controlId/uuid_filename
  fileSize          Int             // Bytes
  mimeType          String
  uploadedById      String
  uploadedAt        DateTime        @default(now())
  controlResponse   ControlResponse @relation(fields: [controlResponseId], references: [id], onDelete: Cascade)
  uploadedBy        User            @relation(fields: [uploadedById], references: [id])
}
```

---

## Key Design Decisions

### Single ControlResponse per control per assessment
`@@unique([assessmentId, controlId])` enforces one shared response record per control. Multiple assessors collaborate by updating the same record. `lastUpdatedById` tracks the most recent contributor.

### Separate status fields for NIST CSF
- `maturityLevel Int?` — used only when `framework.code = NIST_CSF` (values 1–5)
- `status ComplianceStatus` — used for ISO 27001, PCI DSS (NIST CSF maps it to Not started / In progress / Done)
- At the application layer, the correct field is used based on the framework

### sectionCode / sectionName on Control
Allows storing the mid-level grouping (NIST CSF Categories like "Organizational Context", "Risk Management Strategy") without requiring a third model. Querying by `sectionCode` groups subcategories visually in the UI.

### License model is standalone
No foreign keys. One record per installation. Validated daily against Supabase REST API; result cached in a signed HS256 cookie (`eunomia-license`) valid for 24 hours.

### Soft delete via isActive on Tenant
Tenants are deactivated rather than deleted to preserve assessment history.

---

## Indexes to Add

```prisma
// Frequently queried combinations
@@index([tenantId]) on Assessment
@@index([assessmentId]) on ControlResponse
@@index([controlResponseId]) on Evidence
@@index([userId, tenantId]) on TenantUser  // already covered by @@unique
```

---

## Seed Data Structure

Framework seed order:
1. `Framework` records (3 records)
2. `ControlDomain` records per framework
3. `Control` records per domain (NIST CSF also seeds `maturityCriteria` + `implementationExamples`)

Seed files location: `prisma/seeds/`
- `framework-nist-csf.ts` — NIST CSF v2.0 (6 functions, 106 subcategories); reads maturity data from `nist-maturity-data.ts`
- `nist-maturity-data.ts` — auto-generated from `docs/nist-control.xlsx`; 106 × 5-level maturity criteria + implementation examples
- `framework-iso-27001.ts` — ISO 27001:2022 (4 themes, 93 controls + ISO 27002 guidance via `GUIDANCE_ADDITIONS`)
- `framework-pci-dss.ts` — PCI DSS v4.0.1 (12 requirements, 63 sub-requirements)

Total: **3 frameworks · 22 domains · 262 controls**
