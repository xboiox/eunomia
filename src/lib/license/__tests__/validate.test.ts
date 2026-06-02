import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeSupabaseRow(overrides: Record<string, unknown> = {}) {
  return {
    max_tenants: 5,
    license_type: "professional",
    expires_at: null,
    is_active: true,
    ...overrides,
  };
}

function mockSupabaseResponse(rows: unknown[], ok = true) {
  mockFetch.mockResolvedValueOnce({
    ok,
    json: async () => rows,
  } as Response);
}

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("validateLicenseKey", () => {
  it("returns valid:true with metadata for an active key", async () => {
    mockSupabaseResponse([makeSupabaseRow()]);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("VALID-KEY");

    expect(result.valid).toBe(true);
    expect(result.maxTenants).toBe(5);
    expect(result.licenseType).toBe("professional");
    expect(result.expiresAt).toBeNull();
  });

  it("returns valid:false with reason not_found when key does not exist", async () => {
    mockSupabaseResponse([]);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("MISSING-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("not_found");
  });

  it("returns valid:false with reason inactive for a deactivated key", async () => {
    mockSupabaseResponse([makeSupabaseRow({ is_active: false })]);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("INACTIVE-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("inactive");
  });

  it("returns valid:false with reason expired for a past expires_at", async () => {
    mockSupabaseResponse([
      makeSupabaseRow({ expires_at: "2020-01-01T00:00:00Z" }),
    ]);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("EXPIRED-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("expired");
  });

  it("returns valid:true for a key with a future expires_at", async () => {
    mockSupabaseResponse([
      makeSupabaseRow({ expires_at: "2099-01-01T00:00:00Z" }),
    ]);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("FUTURE-KEY");

    expect(result.valid).toBe(true);
    expect(result.expiresAt).toBe("2099-01-01T00:00:00Z");
  });

  it("returns valid:false with reason server_unreachable when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("ANY-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("server_unreachable");
  });

  it("returns valid:false with reason server_unreachable on a non-ok HTTP response", async () => {
    // Supabase error responses return an object, not an array.
    mockSupabaseResponse({ message: "permission denied" } as never, false);
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("ANY-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("server_unreachable");
  });

  it("returns valid:false with reason misconfigured when env vars missing", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.resetModules();
    const { validateLicenseKey } = await import("../validate");
    const result = await validateLicenseKey("ANY-KEY");

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("misconfigured");
  });
});
