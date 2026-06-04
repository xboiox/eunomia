import { randomBytes } from "crypto";

// Omit visually ambiguous characters (0/O, l/1/I) to reduce transcription errors.
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
const PASSWORD_LENGTH = 12;

export function generateTemporaryPassword(): string {
  const bytes = randomBytes(PASSWORD_LENGTH);
  return Array.from(bytes, (b) => CHARS[b % CHARS.length]).join("");
}
