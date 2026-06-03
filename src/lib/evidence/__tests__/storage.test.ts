import { mkdtemp, rm, stat } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteEvidenceFile,
  readEvidenceFile,
  sanitizeFileName,
  saveEvidenceFile,
} from "../storage";

let tmpRoot: string;

beforeEach(async () => {
  tmpRoot = await mkdtemp(path.join(tmpdir(), "eunomia-evidence-"));
  vi.stubEnv("UPLOAD_DIR", tmpRoot);
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(tmpRoot, { recursive: true, force: true });
});

describe("sanitizeFileName", () => {
  it("strips directory components and unsafe characters", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("my report (final).pdf")).toBe("my_report__final_.pdf");
  });

  it("never returns an empty or dot-only name", () => {
    expect(sanitizeFileName("...")).toBe("file");
  });
});

describe("saveEvidenceFile / readEvidenceFile / deleteEvidenceFile", () => {
  const args = {
    tenantId: "t-1",
    assessmentId: "a-1",
    controlId: "c-1",
    fileName: "evidence.pdf",
    bytes: Buffer.from("hello evidence"),
  };

  it("writes the file under the tenant/assessment/control path", async () => {
    const saved = await saveEvidenceFile(args);
    expect(saved.relativePath).toMatch(/^t-1\/a-1\/c-1\/.+_evidence\.pdf$/);

    const absolute = path.join(tmpRoot, saved.relativePath);
    const info = await stat(absolute);
    expect(info.size).toBe(args.bytes.length);
  });

  it("round-trips file contents via readEvidenceFile", async () => {
    const saved = await saveEvidenceFile(args);
    const read = await readEvidenceFile(saved.relativePath);
    expect(read.toString()).toBe("hello evidence");
  });

  it("deletes the file and is idempotent for a missing file", async () => {
    const saved = await saveEvidenceFile(args);
    await deleteEvidenceFile(saved.relativePath);
    await expect(readEvidenceFile(saved.relativePath)).rejects.toThrow();
    // second delete does not throw
    await expect(deleteEvidenceFile(saved.relativePath)).resolves.toBeUndefined();
  });

  it("blocks path traversal outside the upload root", async () => {
    await expect(readEvidenceFile("../../../etc/passwd")).rejects.toThrow("Invalid evidence path");
    await expect(deleteEvidenceFile("../escape.txt")).rejects.toThrow("Invalid evidence path");
  });
});
