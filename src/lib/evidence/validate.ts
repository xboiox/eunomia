// Allowed evidence file types and size validation.

const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_MAX_MB = 50;

export const ALLOWED_EXTENSIONS = [
  "pdf",
  "docx",
  "xlsx",
  "png",
  "jpg",
  "jpeg",
  "txt",
] as const;

// MIME types we positively recognize. Office formats and some browsers send
// generic types, so MIME is a secondary check and "octet-stream"/empty pass.
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "text/plain",
] as const;

export function maxFileSizeBytes(): number {
  const parsed = Number(process.env.MAX_FILE_SIZE_MB ?? DEFAULT_MAX_MB);
  const mb = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_MB;
  return mb * BYTES_PER_MB;
}

export interface EvidenceFileMeta {
  name: string;
  size: number;
  type: string;
}

export type ValidationResult = { ok: true } | { ok: false; error: string };

function extensionOf(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function validateEvidenceFile(file: EvidenceFileMeta): ValidationResult {
  if (!file.name?.trim()) {
    return { ok: false, error: "File name is required" };
  }

  const ext = extensionOf(file.name);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return {
      ok: false,
      error: `File type ".${ext}" is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // MIME is a secondary signal: reject only a clearly-disallowed, specific type.
  const genericTypes = ["", "application/octet-stream"];
  if (
    !genericTypes.includes(file.type) &&
    !(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    return { ok: false, error: `Content type "${file.type}" is not allowed` };
  }

  if (file.size <= 0) {
    return { ok: false, error: "File is empty" };
  }

  const max = maxFileSizeBytes();
  if (file.size > max) {
    return { ok: false, error: `File exceeds the ${max / BYTES_PER_MB}MB limit` };
  }

  return { ok: true };
}
