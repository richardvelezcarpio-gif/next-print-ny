export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const decoded = decodeJwtPayload(key);

  res.status(200).json({
    hasSupabaseUrl: Boolean(url),
    supabaseUrlHost: safeHost(url),
    hasServiceRoleKey: Boolean(key),
    keyLooksLikeJwt: key.split(".").length === 3,
    keyRole: decoded?.role || "unknown",
    keyIssuer: decoded?.iss || "unknown",
    advice:
      decoded?.role === "service_role"
        ? "Vercel is using a service_role key. If permission denied continues, run the Supabase SQL grants/policies again."
        : "Vercel is NOT using a service_role key. Replace SUPABASE_SERVICE_ROLE_KEY with the service_role key from Supabase, then redeploy.",
  });
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function safeHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return "";
  }
}
