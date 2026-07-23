// Minimal single-admin auth for the /admin gallery panel.
//
// There's exactly one admin (the owner), so no user table — just a shared
// password checked server-side against ADMIN_PASSWORD, and a signed,
// HttpOnly session cookie so the browser stays logged in. The cookie is an
// HMAC (keyed by ADMIN_SESSION_SECRET) over an expiry timestamp, so it can't be
// forged without the secret and it can't be read by client JS.
import crypto from "crypto";
import { cookies } from "next/headers";
import { getRecord, setRecord, delRecord } from "@/lib/adminStore";

export const SESSION_COOKIE = "bb_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const RESET_TTL_SECONDS = 60 * 30; // reset links are valid 30 minutes
const RESET_RESEND_COOLDOWN_SECONDS = 90; // throttle repeat "forgot" requests
export const MIN_PASSWORD_LENGTH = 8;

// Store keys.
const PASSWORD_KEY = "password";
const RESET_KEY = "reset";

type PasswordRecord = { salt: string; hash: string };
type ResetRecord = { tokenHash: string; exp: number; sentAt: number };

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set — refusing to sign admin sessions.",
    );
  }
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Constant-time compare so a wrong password/cookie can't be timed. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function scryptHash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

/** True once the owner has set their own password via a reset — from then on
 *  the stored hash wins and the ADMIN_PASSWORD env var is only a fallback. */
async function storedPassword(): Promise<PasswordRecord | null> {
  return getRecord<PasswordRecord>(PASSWORD_KEY);
}

/** Verify a login attempt. Prefers the stored (resettable) password; falls
 *  back to the ADMIN_PASSWORD env var to bootstrap before any reset. */
export async function verifyPassword(password: string): Promise<boolean> {
  const record = await storedPassword();
  if (record) {
    return safeEqual(scryptHash(password, record.salt), record.hash);
  }
  const bootstrap = process.env.ADMIN_PASSWORD;
  if (!bootstrap) return false;
  return safeEqual(password, bootstrap);
}

/** Persist a new admin password (salted scrypt hash) as the source of truth. */
export async function setPassword(password: string): Promise<void> {
  const salt = crypto.randomBytes(16).toString("hex");
  await setRecord<PasswordRecord>(PASSWORD_KEY, {
    salt,
    hash: scryptHash(password, salt),
  });
}

// ---- Password reset tokens ------------------------------------------------

/** Mint a one-time reset token, store only its hash, and return the raw token
 *  (to embed in the emailed link). Returns null if a token was just sent, so
 *  repeated "forgot" clicks can't flood the owner's inbox. */
export async function createResetToken(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const existing = await getRecord<ResetRecord>(RESET_KEY);
  if (existing && now - existing.sentAt < RESET_RESEND_COOLDOWN_SECONDS) {
    return null;
  }
  const token = crypto.randomBytes(32).toString("base64url");
  await setRecord<ResetRecord>(RESET_KEY, {
    tokenHash: sha256(token),
    exp: now + RESET_TTL_SECONDS,
    sentAt: now,
  });
  return token;
}

/** Check a reset token without consuming it (for the reset page to validate). */
export async function resetTokenIsValid(token: string): Promise<boolean> {
  if (!token) return false;
  const record = await getRecord<ResetRecord>(RESET_KEY);
  if (!record) return false;
  if (record.exp <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sha256(token), record.tokenHash);
}

/** Invalidate the current reset token (call right after a successful reset). */
export async function consumeResetToken(): Promise<void> {
  await delRecord(RESET_KEY);
}

/** Build the session cookie value: "<expiryEpoch>.<hmac>". */
export function makeSessionValue(): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

function tokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (!safeEqual(mac, expected)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

/** Read the request's cookies and report whether the caller is an admin. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return tokenIsValid(store.get(SESSION_COOKIE)?.value);
}
