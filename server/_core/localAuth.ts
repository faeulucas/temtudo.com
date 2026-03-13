import crypto from "node:crypto";

const SCRYPT_KEYLEN = 64;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function toLocalOpenId(email: string) {
  return `local:${normalizeEmail(email)}`;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) return false;

  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const actualHash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (actualHash.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(actualHash, expectedBuffer);
}

export function normalizeAuthEmail(email: string) {
  return normalizeEmail(email);
}
