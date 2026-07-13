import { clean } from "./paypal.js";

const COOKIE_ACCESS = "np_member_access";
const COOKIE_REFRESH = "np_member_refresh";

export async function requireMemberSession(req, res) {
  let accessToken = cookie(req, COOKIE_ACCESS);
  const refreshToken = cookie(req, COOKIE_REFRESH);

  if (!accessToken && !refreshToken) {
    res.status(401).json({ error: "Please sign in to continue." });
    return null;
  }

  let user = accessToken ? await authUser(accessToken) : null;
  if (!user && refreshToken) {
    const refreshed = await authFetch("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }, true);
    if (refreshed?.access_token) {
      setAuthCookies(req, res, refreshed);
      accessToken = refreshed.access_token;
      user = refreshed.user;
    }
  }

  if (!user) {
    res.setHeader("Set-Cookie", [expiredCookie(COOKIE_ACCESS), expiredCookie(COOKIE_REFRESH)]);
    res.status(401).json({ error: "Your session expired. Please sign in again." });
    return null;
  }

  return { user, accessToken };
}

export function publicUser(user) {
  return user ? {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || "",
    businessName: user.user_metadata?.business_name || "",
  } : null;
}

async function authUser(token) {
  try {
    return await authFetch("/auth/v1/user", { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    return null;
  }
}

async function authFetch(path, options = {}, quiet = false) {
  requireSupabaseAuth();
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const response = await fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok && !quiet) {
    throw new Error(data?.msg || data?.error_description || data?.message || "Authentication failed.");
  }
  return response.ok ? data : null;
}

function requireSupabaseAuth() {
  if (!process.env.SUPABASE_URL || !(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    throw new Error("Supabase member service is not configured.");
  }
}

function cookie(req, name) {
  const match = String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function setAuthCookies(req, res, data) {
  const secure = !String(req.headers.host || "").includes("localhost") && !String(req.headers.host || "").includes("127.0.0.1");
  res.setHeader("Set-Cookie", [
    authCookie(COOKIE_ACCESS, data.access_token, data.expires_in || 3600, secure),
    authCookie(COOKIE_REFRESH, data.refresh_token, 60 * 60 * 24 * 30, secure),
  ]);
}

function authCookie(name, value, maxAge, secure) {
  return `${name}=${encodeURIComponent(value || "")}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

function expiredCookie(name) {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function normalizedMember(user) {
  return {
    id: clean(user?.id, 120),
    email: clean(user?.email, 180),
  };
}
