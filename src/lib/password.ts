import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const storedBuf = Buffer.from(hash, "hex");
  const attempt = scryptSync(pw, salt, 64);
  if (storedBuf.length !== attempt.length) return false;
  return timingSafeEqual(storedBuf, attempt);
}
