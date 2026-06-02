# Eunomia — IT Security Compliance Dashboard

**Eunomia** is a self-hosted IT Security Compliance Dashboard. It lets an organization run internal self-assessments against major security frameworks — **NIST CSF v2.0, ISO/IEC 27001:2022, ISO/IEC 27002:2022, and PCI DSS v4.0.1** — manage evidence, and track compliance progress.

It is installed on the organization's own server and activated with a license key.

> Built on the [Play Next.js](https://github.com/NextJSTemplates/play-nextjs) boilerplate. For architecture and design decisions see [CLAUDE.md](CLAUDE.md) and the [`docs/`](docs/) folder.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + TailGrids |
| ORM | Prisma v7 (`PrismaPg` adapter) |
| Database | PostgreSQL 16 |
| Auth | NextAuth v4 (email/password + magic link) |
| License server | Supabase REST API (server-side only) |
| Charts | Recharts |
| Testing | Vitest |

---

## Prerequisites

Install these on the target machine first:

- **Node.js ≥ 20** — `node --version`
- **PostgreSQL ≥ 14** (16 recommended) — running and reachable
- **A Supabase project** — used as the license server (free tier is fine)

---

## Local Server Installation

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> React 19 still causes peer-dependency conflicts with some packages, so `--legacy-peer-deps` is required.

### 2. Create the PostgreSQL role and database

Connect to PostgreSQL as a superuser, then create the application role and database. Run this in `psql`:

```sql
-- Application role (change the password for your environment)
CREATE ROLE <db-user> WITH LOGIN PASSWORD '<your-db-password>' CREATEDB;

-- Application database, owned by that role
CREATE DATABASE eunomia OWNER <db-user>;

-- Privileges on the public schema
\c eunomia
GRANT ALL ON SCHEMA public TO <db-user>;
```

> ⚠️ **Security:** choose a strong password for the `<db-user>` role and keep it **only** in your local `.env` (already git-ignored). Never commit real credentials.

### 3. Configure environment variables

Copy the template and fill it in:

```bash
cp .env.example .env
```

Edit `.env`:

```ini
# Percent-encode any special characters in the password (e.g. ! -> %21, $ -> %24)
DATABASE_URL="postgresql://<db-user>:<password>@localhost:5432/eunomia"

# Any random string ≥ 32 chars. Generate with:  openssl rand -base64 48
NEXTAUTH_SECRET="<your-generated-secret>"
NEXTAUTH_URL="http://localhost:3000"

# From Supabase → Project Settings (see step 4). Base URL only, no /rest/v1/.
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service_role-key>"

UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB="50"
```

> **Tip:** if your DB password contains other special characters, percent-encode them too (`@` → `%40`, `:` → `%3A`, `#` → `%23`, `/` → `%2F`).

### 4. Set up the Supabase license server

In your Supabase project → **SQL Editor**, create the license table and at least one key:

```sql
create table license_keys (
  key           text primary key,
  max_tenants   int     not null default 1,
  license_type  text    not null default 'standard',
  expires_at    timestamptz,
  is_active     boolean not null default true,
  customer_name text,
  created_at    timestamptz default now()
);

insert into license_keys (key, max_tenants, license_type, customer_name)
values ('EUNOMIA-DEV-0001', 5, 'standard', 'Internal Testing');
```

Then, in **Project Settings**:
- **Data API → Project URL** → put in `SUPABASE_URL`
- **API Keys → `service_role`** (the secret one, *not* `anon`) → put in `SUPABASE_SERVICE_ROLE_KEY`

> The `service_role` key is server-side only and bypasses Row Level Security, so no RLS policy is needed. **Never expose it to the browser.**

### 5. Create the database schema and seed framework data

```bash
npm run db:generate   # generate the Prisma client
npm run db:migrate    # create all tables (prisma migrate dev)
npm run db:seed        # load the 4 frameworks (355 controls)
```

A successful seed prints: `Done. 4 frameworks, 26 domains, 355 controls.`

### 6. Run the app

```bash
npm run dev
```

Open **http://localhost:3000**.

### 7. First-run activation

1. You are redirected to **`/activate`** (the license gate).
2. Enter your license key (e.g. `EUNOMIA-DEV-0001`) → **Activate**.
3. Click **Sign up** and create the first account → it automatically becomes **Super Admin**.
4. Sign in → you land on the **dashboard**. Open **Frameworks** in the sidebar to browse the seeded controls.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on :3000 |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start the production server |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Apply migrations (`prisma migrate dev`) |
| `npm run db:seed` | Seed framework data (idempotent) |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with coverage |

---

## Troubleshooting

### License: "This license key has been deactivated."

The `is_active` column for your key in Supabase is **`false` or `NULL`**. The validator treats anything other than `true` as deactivated.

Fix it in the Supabase **SQL Editor**:

```sql
update license_keys set is_active = true where key = 'EUNOMIA-DEV-0001';

-- Recommended: enforce a default + NOT NULL so this can't happen again
alter table license_keys alter column is_active set default true;
update license_keys set is_active = true where is_active is null;
alter table license_keys alter column is_active set not null;
```

### License: "A license is already activated."

A `License` row already exists in your **local** database, so the activation endpoint refuses to create a second one (HTTP 409). This happens if a previous activation succeeded, or if the row was left behind after the Supabase key changed.

**Option A — re-activate cleanly (clears the local cache):**

```sql
-- Run against your local eunomia database
DELETE FROM "License";
```

Then reload `/activate` and enter the key again.

**Option B — keep the existing license, just refresh the cookie:**
If the license is genuinely valid and you only lost the browser cookie, visit
`http://localhost:3000/api/license/refresh` — it re-validates against Supabase and re-issues the cookie without needing re-activation.

### License: "License server is not configured."

`SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing from `.env`. Fill both in and restart the dev server.

### License: "Could not reach the license server."

- Check `SUPABASE_URL` is the **base** URL (`https://<project>.supabase.co`) with **no** trailing `/rest/v1/` — the code appends that path itself.
- Confirm the machine has outbound internet access to Supabase.

Quick check (mimics what the app does):

```bash
curl "$SUPABASE_URL/rest/v1/license_keys?select=key,is_active" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

### Database: `prisma generate` fails with "Missing required environment variable: DATABASE_URL"

`prisma.config.ts` reads `DATABASE_URL` via `env()`. Make sure `.env` exists and contains it. (Even client generation needs the variable to be present.)

### Database: authentication / connection failures

- Verify PostgreSQL is running: `lsof -iTCP:5432 -sTCP:LISTEN`
- Verify the role and password by connecting with the exact URI:
  ```bash
  psql 'postgresql://<db-user>:<password>@localhost:5432/eunomia' -c '\conninfo'
  ```
- Remember to **percent-encode** special characters in the password inside `DATABASE_URL`.

### After editing `.env`, changes don't take effect

The dev server reads `.env` at startup. Restart it:

```bash
lsof -ti:3000 | xargs kill   # stop
npm run dev                  # start again
```

---

## Testing

```bash
npm run test:run       # single run
npm run test:coverage  # with coverage
```

---

## License

Eunomia's application code is built on the open-source Play Next.js boilerplate. Framework control texts (NIST CSF, ISO, PCI DSS) are the property of their respective standards bodies.
