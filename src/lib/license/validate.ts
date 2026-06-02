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
  expires_at: string | null;
  is_active: boolean;
}

export async function validateLicenseKey(
  key: string,
): Promise<ValidationResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { valid: false, reason: "misconfigured" };
  }

  let rows: SupabaseLicenseRow[];
  try {
    const url =
      `${supabaseUrl}/rest/v1/license_keys` +
      `?key=eq.${encodeURIComponent(key)}` +
      `&select=max_tenants,license_type,expires_at,is_active`;

    const res = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    // Supabase error responses return an object (not an array) with a non-2xx
    // status. Treat anything that isn't a successful array payload as unreachable.
    if (!res.ok) {
      return { valid: false, reason: "server_unreachable" };
    }

    const payload = await res.json();
    if (!Array.isArray(payload)) {
      return { valid: false, reason: "server_unreachable" };
    }
    rows = payload;
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

  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return { valid: false, reason: "expired" };
  }

  return {
    valid: true,
    maxTenants: row.max_tenants,
    licenseType: row.license_type,
    expiresAt: row.expires_at,
  };
}
