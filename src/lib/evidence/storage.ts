import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

// Evidence files live on the local filesystem under UPLOAD_DIR, organized as
// {UPLOAD_DIR}/{tenantId}/{assessmentId}/{controlId}/{uuid}_{filename}.
// Only the path relative to UPLOAD_DIR is stored in the database.

const DEFAULT_UPLOAD_DIR = "./uploads";
const MAX_STORED_NAME_LENGTH = 200;

function uploadRoot(): string {
  return process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
}

export function sanitizeFileName(name: string): string {
  const base = path.basename(name); // strip any directory components
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, MAX_STORED_NAME_LENGTH);
  return cleaned.replace(/^\.+/, "") || "file";
}

// Resolve a stored relative path against UPLOAD_DIR and guard against traversal.
function resolveWithinRoot(relativePath: string): string {
  const root = path.resolve(uploadRoot());
  const abs = path.resolve(root, relativePath);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw new Error("Invalid evidence path");
  }
  return abs;
}

export interface SaveEvidenceArgs {
  tenantId: string;
  assessmentId: string;
  controlId: string;
  fileName: string;
  bytes: Buffer;
}

export interface SavedEvidence {
  relativePath: string;
  storedName: string;
}

export async function saveEvidenceFile(args: SaveEvidenceArgs): Promise<SavedEvidence> {
  const storedName = `${randomUUID()}_${sanitizeFileName(args.fileName)}`;
  const relDir = path.join(args.tenantId, args.assessmentId, args.controlId);
  const absDir = path.join(path.resolve(uploadRoot()), relDir);

  await mkdir(absDir, { recursive: true });
  const absPath = path.join(absDir, storedName);
  await writeFile(absPath, args.bytes);

  return { relativePath: path.join(relDir, storedName), storedName };
}

export async function readEvidenceFile(relativePath: string): Promise<Buffer> {
  return readFile(resolveWithinRoot(relativePath));
}

export async function deleteEvidenceFile(relativePath: string): Promise<void> {
  try {
    await unlink(resolveWithinRoot(relativePath));
  } catch (error: unknown) {
    // Ignore "file not found" — deletion is idempotent.
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
      throw error;
    }
  }
}
