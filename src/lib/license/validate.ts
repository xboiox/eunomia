export type ValidationReason =
  | "not_found"
  | "inactive"
  | "expired"
  | "server_unreachable"
  | "misconfigured";

export interface ValidationResult {
  valid: boolean;
  maxTenants?: number;
  licenseType?: string;
  expiresAt?: string | null;
  reason?: ValidationReason;
}

interface SupabaseLicenseRow {
  max_tenants: number;
  license_type: string;
  expires_at?: string | null;
  is_active: boolean;
}

import { logger } from "@/lib/logger";

// PostgREST error code for "undefined column" (Postgres SQLSTATE 42703).
const UNDEFINED_COLUMN_CODE = "42703";

const FULL_SELECT = "max_tenants,license_type,expires_at,is_active";
const FALLBACK_SELECT = "max_tenants,license_type,is_active";

type QueryOutcome =
  | { kind: "ok"; rows: SupabaseLicenseRow[] }
  | { kind: "missing_expires_at" }
  | { kind: "error" };

function isMissingExpiresAtError(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  const body = payload as { code?: unknown; message?: unknown };
  if (body.code === UNDEFINED_COLUMN_CODE) return true;
  return typeof body.message === "string" && body.message.includes("expires_at");
}

async function queryLicenseRows(
  baseUrl: string,
  headers: Record<string, string>,
  select: string,
): Promise<QueryOutcome> {
  const res = await fetch(`${baseUrl}&select=${select}`, { headers });
  const payload = await res.json();

  if (!res.ok) {
    if (select === FULL_SELECT && isMissingExpiresAtError(payload)) {
      return { kind: "missing_expires_at" };
    }
    return { kind: "error" };
  }

  // Supabase error responses return an object (not an array). Treat anything
  // that isn't a successful array payload as a server error.
  if (!Array.isArray(payload)) return { kind: "error" };

  return { kind: "ok", rows: payload };
}

export async function validateLicenseKey(
  key: string,
): Promise<ValidationResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { valid: false, reason: "misconfigured" };
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };
  const baseUrl =
    `${supabaseUrl}/rest/v1/license_keys?key=eq.${encodeURIComponent(key)}`;

  let rows: SupabaseLicenseRow[];
  try {
    let outcome = await queryLicenseRows(baseUrl, headers, FULL_SELECT);

    // The license_keys table may predate the optional expires_at column.
    // Fall back to a select without it and treat such licenses as perpetual.
    if (outcome.kind === "missing_expires_at") {
      logger.warn(
        "'expires_at' column not found in license_keys; treating licenses as perpetual. " +
          "Add it with: alter table license_keys add column if not exists expires_at timestamptz;",
      );
      outcome = await queryLicenseRows(baseUrl, headers, FALLBACK_SELECT);
    }

    if (outcome.kind !== "ok") {
      return { valid: false, reason: "server_unreachable" };
    }
    rows = outcome.rows;
  } catch {
    return { valid: false, reason: "server_unreachable" };
  }

  if (!rows.length) {
    return { valid: false, reason: "not_found" };
  }

  const row = rows[0];

  if (!row.is_active) {
    return { valid: false, reason: "inactive" };
  }

  // expires_at is null/undefined for perpetual licenses (or when the column
  // is absent); only a real past timestamp counts as expired.
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return { valid: false, reason: "expired" };
  }

  return {
    valid: true,
    maxTenants: row.max_tenants,
    licenseType: row.license_type,
    expiresAt: row.expires_at ?? null,
  };
}
