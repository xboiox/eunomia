# Product Requirements Document — Eunomia

## Overview

**Eunomia** is a self-hosted IT Security Compliance Dashboard web application. It enables organizations to perform self-assessments against major security frameworks, track evidence, monitor compliance progress, and manage deadlines — all within their own infrastructure.

---

## Problem Statement

Organizations need to demonstrate compliance with security frameworks (NIST CSF, ISO 27001, PCI DSS) but lack a structured, internal tool to:
- Track assessment progress per control
- Manage and store evidence files securely
- Monitor compliance completeness and deadlines
- Support multi-team collaboration on assessments

---

## Target Users

| Role | Description |
|---|---|
| **Super Admin** | Manages the entire installation: activates license, creates and manages tenants (organizations), manages system-wide settings |
| **Tenant Admin** | Manages one organization: manages users within their tenant, creates assessments, assigns frameworks |
| **Assessor** | Fills in control responses, uploads evidence, collaborates with other assessors on the same assessment |

---

## Supported Frameworks

| Framework | Version | Assessment Model |
|---|---|---|
| NIST Cybersecurity Framework | v2.0 | Maturity Level 1–5 per subcategory; status shown as Not Started / In Progress / Done |
| ISO/IEC 27001 | 2022 | Not Started / In Progress / Implemented / Not Applicable (carries ISO 27002 implementation guidance) |
| PCI DSS | v4.0.1 | Not Started / In Progress / Implemented / Not Applicable |

> ISO/IEC 27002:2022 is not a separate assessable framework — it is the implementation guidance for ISO 27001's Annex A controls, so its guidance is attached to the ISO 27001 controls.

---

## Core Features

### 1. License Activation
- App requires license key activation on first install
- One-time online activation against Supabase-hosted license server
- After activation, app operates fully offline
- License key limits the number of tenants (organizations) that can be managed

### 2. Multi-Tenancy
- A single installation can host multiple independent organizations (tenants)
- Each tenant's data is fully isolated
- Number of tenants is gated by the license

### 3. User Management
- Super Admin manages tenants and system-wide users
- Tenant Admin manages users within their organization
- Users can belong to multiple tenants with different roles

### 4. Framework Selection & Assessment
- Tenant Admin creates an assessment by selecting a framework
- An assessment can be named, described, and assigned an optional overall deadline
- Multiple assessors can collaborate on the same assessment

### 5. Control Assessment
- App displays all controls for the selected framework, organized by domain/category
- For NIST CSF: assessors assign a maturity level (1–5) per subcategory
- For other frameworks: assessors assign a status per control
- Optional per-control deadline
- Notes field per control

### 6. Evidence Management
- Multiple evidence files can be uploaded per control
- Files stored on local filesystem under `uploads/{tenantId}/{assessmentId}/{controlId}/`
- Supported file types: PDF, DOCX, XLSX, PNG, JPG, TXT
- Evidence is viewable and downloadable within the app

### 7. Dashboard & Reporting
- Overview dashboard per assessment showing:
  - Overall compliance percentage
  - Progress by domain/category (donut/bar chart)
  - Controls by status breakdown
  - Upcoming deadlines
- Framework-level progress tracker
- Per-control status visible at a glance

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Deployment** | Self-hosted, runs on any Node.js 20+ environment |
| **Database** | PostgreSQL (via Prisma) |
| **Auth** | Email/password + magic link (NextAuth) |
| **Offline Operation** | Fully offline after license activation |
| **Security** | All user input validated, no secrets in code, RBAC enforced |
| **Performance** | Dashboard loads in < 2s on local network |
| **Browser Support** | Modern browsers (Chrome, Firefox, Edge, Safari) |

---

## Out of Scope (v1)

- Automated control testing / scanning
- Integration with external ticketing systems (Jira, ServiceNow)
- PDF report export
- Email notifications for deadlines
- SSO / SAML integration
- Mobile app
