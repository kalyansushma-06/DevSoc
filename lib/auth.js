import crypto from "crypto";
import { cookies } from "next/headers";
import { readCollection } from "./db";

// ---------------------------------------------------------------------------
// Minimal admin auth.
//
// This is deliberately simple (no external auth library, no npm install
// required beyond Next.js itself) so the project runs out of the box. It is
// NOT production-grade: passwords are stored in plaintext in
// data/admins.json and the session token is a signed-but-unencrypted blob.
//
// Before deploying for real:
//  - hash passwords (e.g. with bcrypt) instead of storing them in plaintext
//  - move admins + sessions into a real database
//  - rotate SESSION_SECRET and keep it out of source control (.env.local)
// ---------------------------------------------------------------------------

const COOKIE_NAME = "devsoc_admin_session";
const SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function checkCredentials(email, password) {
  const admins = readCollection("admins");
  const admin = admins.find(
    (a) => a.email.toLowerCase() === String(email || "").toLowerCase()
  );
  if (!admin) return null;
  // Plaintext compare for the demo credential store described above.
  if (admin.password !== password) return null;
  const { password: _pw, ...safe } = admin;
  return safe;
}

export function createSessionToken(admin) {
  return sign({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000
  });
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE;

// Server Component / Route Handler helper - reads the session from cookies().
export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verify(token);
}
