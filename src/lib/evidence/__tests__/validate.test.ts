import { afterEach, describe, expect, it, vi } from "vitest";

import { maxFileSizeBytes, validateEvidenceFile } from "../validate";

afterEach(() => {
  vi.unstubAllEnvs();
});

function file(overrides: Partial<{ name: string; size: number; type: string }> = {}) {
  return { name: "report.pdf", size: 1024, type: "application/pdf", ...overrides };
}

describe("validateEvidenceFile", () => {
  it("accepts an allowed type within the size limit", () => {
    expect(validateEvidenceFile(file())).toEqual({ ok: true });
  });

  it("accepts office formats sent with a generic octet-stream type", () => {
    expect(
      validateEvidenceFile(file({ name: "sheet.xlsx", type: "application/octet-stream" })),
    ).toEqual({ ok: true });
  });

  it("rejects a disallowed extension", () => {
    const result = validateEvidenceFile(file({ name: "malware.exe", type: "" }));
    expect(result.ok).toBe(false);
  });

  it("rejects a clearly disallowed MIME type", () => {
    const result = validateEvidenceFile(file({ name: "x.pdf", type: "application/x-msdownload" }));
    expect(result.ok).toBe(false);
  });

  it("rejects an empty file", () => {
    const result = validateEvidenceFile(file({ size: 0 }));
    expect(result.ok).toBe(false);
  });

  it("rejects a file over the size limit", () => {
    vi.stubEnv("MAX_FILE_SIZE_MB", "1");
    const result = validateEvidenceFile(file({ size: 2 * 1024 * 1024 }));
    expect(result.ok).toBe(false);
  });

  it("rejects a missing file name", () => {
    const result = validateEvidenceFile(file({ name: "" }));
    expect(result.ok).toBe(false);
  });

  it("derives the size limit from MAX_FILE_SIZE_MB", () => {
    vi.stubEnv("MAX_FILE_SIZE_MB", "10");
    expect(maxFileSizeBytes()).toBe(10 * 1024 * 1024);
  });

  it("falls back to 50MB when MAX_FILE_SIZE_MB is invalid", () => {
    vi.stubEnv("MAX_FILE_SIZE_MB", "not-a-number");
    expect(maxFileSizeBytes()).toBe(50 * 1024 * 1024);
  });
});
