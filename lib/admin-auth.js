import crypto from "node:crypto";

const COOKIE_NAME = "np_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function requireAdmin(req, res) {
  const session = readSession(req);

  if (!session) {
    res.status(401).json({ error: "Admin login required" });
    return null;
  }

  return session;
}

export function createSessionCookie(email) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return [
    `${COOKIE_NAME}=${encodedPayload}.${signature}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join("; ");
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readSession(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookieValue = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminEmail() {
  return String(process.env.ADMIN_EMAIL || "owner@nextprintny.com").trim().toLowerCase();
}

export function verifyPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { ok: false, error: "ADMIN_PASSWORD missing" };
  }

  return {
    ok: timingSafeEqual(String(password || ""), adminPassword),
  };
}

function sign(value) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "local-dev-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function timingSafeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));

  if (first.length !== second.length) return false;
  return crypto.timingSafeEqual(first, second);
}
