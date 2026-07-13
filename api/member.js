import { clean, hasPayPalConfig, paypalFetch } from "../lib/paypal.js";
import { createHash } from "node:crypto";

const COOKIE_ACCESS = "np_member_access";
const COOKIE_REFRESH = "np_member_refresh";
const MEMBERSHIP_PRICE = 35;

export default async function handler(req, res) {
  const action = memberAction(req);
  try {
    if (action === "register") return register(req, res);
    if (action === "login") return login(req, res);
    if (action === "logout") return logout(req, res);
    if (action === "recover") return recover(req, res);

    const session = await requireMember(req, res);
    if (!session) return;
    if (action === "session") return res.status(200).json({ authenticated: true, user: publicUser(session.user) });
    if (action === "dashboard") return dashboard(res, session.user);
    if (action === "file") return memberFile(req, res, session.user);
    if (action === "design") return saveDesign(req, res, session.user);
    if (action === "delete-design") return deleteDesign(req, res, session.user);
    if (action === "membership-checkout") return membershipCheckout(req, res, session.user);
    if (action === "membership-confirm") return membershipConfirm(req, res, session.user);
    res.status(404).json({ error: "Unknown member action." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Member service error." });
  }
}

async function register(req, res) {
  requireMethod(req, "POST");
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const fullName = clean(req.body?.fullName, 120);
  const businessName = clean(req.body?.businessName, 140);
  if (!email || password.length < 8) return res.status(400).json({ error: "Use a valid email and a password of at least 8 characters." });

  const data = await authFetch("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, data: { full_name: fullName, business_name: businessName } }),
  });
  if (data.access_token) setAuthCookies(req, res, data);
  if (data.user?.id) await upsertProfile(data.user.id, { email, full_name: fullName, business_name: businessName });
  res.status(200).json({ ok: true, authenticated: Boolean(data.access_token), needsConfirmation: !data.access_token, user: publicUser(data.user) });
}

async function login(req, res) {
  requireMethod(req, "POST");
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const data = await authFetch("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
  setAuthCookies(req, res, data);
  res.status(200).json({ ok: true, user: publicUser(data.user) });
}

async function logout(req, res) {
  requireMethod(req, "POST");
  res.setHeader("Set-Cookie", [expiredCookie(COOKIE_ACCESS), expiredCookie(COOKIE_REFRESH)]);
  res.status(200).json({ ok: true });
}

async function recover(req, res) {
  requireMethod(req, "POST");
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: "Enter a valid email." });
  await authFetch("/auth/v1/recover", {
    method: "POST",
    body: JSON.stringify({ email, redirect_to: `${publicBaseUrl(req)}/member-login.html?reset=1` }),
  });
  res.status(200).json({ ok: true });
}

async function dashboard(res, user) {
  const email = normalizeEmail(user.email);
  const [profile, membership, designs, files, orders] = await Promise.all([
    selectOne(`member_profiles?user_id=eq.${encodeURIComponent(user.id)}&select=*`),
    selectOne(`member_memberships?user_id=eq.${encodeURIComponent(user.id)}&select=*&order=updated_at.desc`),
    selectMany(`member_designs?user_id=eq.${encodeURIComponent(user.id)}&select=id,name,editor_type,product,thumbnail_url,created_at,updated_at&order=updated_at.desc&limit=100`),
    selectMany(`member_files?user_id=eq.${encodeURIComponent(user.id)}&select=id,name,file_url,file_type,file_size,created_at&order=created_at.desc&limit=100`),
    selectMany(`business_records?customer_email=eq.${encodeURIComponent(email)}&type=eq.order&select=id,title,status,amount,quantity,due_date,created_at&order=created_at.desc&limit=100`),
  ]);
  res.status(200).json({ user: publicUser(user), profile, membership: normalizeMembership(membership), designs, files, orders });
}

async function saveDesign(req, res, user) {
  if (req.method === "GET") {
    const id = clean(new URL(req.url, "http://local").searchParams.get("id"), 80);
    const design = await selectOne(`member_designs?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&select=*`);
    if (!design) return res.status(404).json({ error: "Design not found." });
    return res.status(200).json({ design });
  }
  requireMethod(req, "POST");
  const membership = await selectOne(`member_memberships?user_id=eq.${encodeURIComponent(user.id)}&select=status,current_period_end&order=updated_at.desc`);
  const active = isMembershipActive(membership);
  const existingCount = await countRows(`member_designs?user_id=eq.${encodeURIComponent(user.id)}`);
  if (!active && existingCount >= 1 && !req.body?.id) return res.status(403).json({ error: "Free accounts can save one design. Activate membership for unlimited designs." });

  const designData = req.body?.designData;
  const serialized = JSON.stringify(designData || {});
  if (serialized.length > 4000000) return res.status(413).json({ error: "This editable design is too large to save. Reduce the uploaded image size and try again." });
  const record = {
    user_id: user.id,
    name: clean(req.body?.name, 140) || "Untitled design",
    editor_type: clean(req.body?.editorType, 40) || "print-products",
    product: clean(req.body?.product, 120),
    design_data: designData || {},
    thumbnail_url: clean(req.body?.thumbnailUrl, 500),
    updated_at: new Date().toISOString(),
  };
  const id = clean(req.body?.id, 80);
  const response = id
    ? await supabaseFetch(`member_designs?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(record) })
    : await supabaseFetch("member_designs", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(record) });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Could not save design. Run supabase-membership.sql first.");
  const assets = Array.isArray(req.body?.assets) ? req.body.assets.slice(0, 12) : [];
  if (assets.length) await saveMemberAssets(user.id, assets);
  res.status(200).json({ ok: true, design: data?.[0], membershipActive: active });
}

async function saveMemberAssets(userId, assets) {
  for (const asset of assets) {
    const content = String(asset?.content || "").replace(/^data:[^,]+,/, "");
    if (!content || content.length > 5500000) continue;
    const name = clean(asset?.name, 160) || "artwork.png";
    const mime = clean(asset?.type, 80) || "image/png";
    const bytes = Buffer.from(content, "base64");
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);
    const path = `${userId}/${hash}-${safeName}`;
    const upload = await storageFetch(`/object/member-assets/${path}`, { method: "POST", headers: { "Content-Type": mime, "x-upsert": "true" }, body: bytes });
    if (!upload.ok) continue;
    await supabaseFetch("member_files?on_conflict=user_id,file_url", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: userId, name, file_url: path, file_type: mime, file_size: bytes.length }),
    });
  }
}

async function memberFile(req, res, user) {
  requireMethod(req, "GET");
  const id = clean(new URL(req.url, "http://local").searchParams.get("id"), 80);
  const file = await selectOne(`member_files?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&select=*`);
  if (!file) return res.status(404).json({ error: "File not found." });
  const response = await storageFetch(`/object/member-assets/${file.file_url}`);
  if (!response.ok) return res.status(404).json({ error: "Stored file not found." });
  const buffer = Buffer.from(await response.arrayBuffer());
  res.setHeader("Content-Type", file.file_type || "application/octet-stream");
  res.setHeader("Content-Disposition", `inline; filename="${String(file.name || "member-file").replace(/[\r\n\"]/g, "")}"`);
  res.status(200).send(buffer);
}

async function deleteDesign(req, res, user) {
  requireMethod(req, "DELETE");
  const id = clean(new URL(req.url, "http://local").searchParams.get("id"), 80);
  const response = await supabaseFetch(`member_designs?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Could not delete design.");
  res.status(200).json({ ok: true });
}

async function membershipCheckout(req, res, user) {
  requireMethod(req, "POST");
  if (!hasPayPalConfig()) return res.status(500).json({ error: "PayPal is not configured." });
  const planId = clean(process.env.PAYPAL_MEMBERSHIP_PLAN_ID, 160);
  if (!planId) return res.status(500).json({ error: "Add PAYPAL_MEMBERSHIP_PLAN_ID in Vercel to activate the $35 monthly membership." });
  const subscription = await paypalFetch("/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: planId,
      custom_id: user.id,
      subscriber: { email_address: user.email },
      application_context: {
        brand_name: "Next Print NY",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${publicBaseUrl(req)}/member-dashboard.html?membership=return`,
        cancel_url: `${publicBaseUrl(req)}/membership.html?membership=cancelled`,
      },
    }),
  });
  const approvalUrl = subscription.links?.find((link) => link.rel === "approve")?.href;
  if (!approvalUrl) throw new Error("PayPal did not return a subscription approval link.");
  await upsertMembership(user.id, { email: user.email, status: "approval_pending", paypal_subscription_id: subscription.id, monthly_price: MEMBERSHIP_PRICE });
  res.status(200).json({ ok: true, url: approvalUrl, subscriptionId: subscription.id });
}

async function membershipConfirm(req, res, user) {
  requireMethod(req, "POST");
  const subscriptionId = clean(req.body?.subscriptionId, 160);
  if (!subscriptionId) return res.status(400).json({ error: "PayPal subscription id is required." });
  const subscription = await paypalFetch(`/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`);
  const subscriberEmail = normalizeEmail(subscription.subscriber?.email_address);
  if (subscriberEmail && subscriberEmail !== normalizeEmail(user.email)) return res.status(403).json({ error: "This membership belongs to another account." });
  const status = paypalMembershipStatus(subscription.status);
  await upsertMembership(user.id, {
    email: user.email,
    status,
    paypal_subscription_id: subscription.id,
    paypal_plan_id: subscription.plan_id,
    monthly_price: MEMBERSHIP_PRICE,
    current_period_start: subscription.start_time || null,
    current_period_end: subscription.billing_info?.next_billing_time || null,
  });
  res.status(200).json({ ok: true, membership: { status, subscriptionId: subscription.id } });
}

async function requireMember(req, res) {
  let accessToken = cookie(req, COOKIE_ACCESS);
  let refreshToken = cookie(req, COOKIE_REFRESH);
  if (!accessToken && !refreshToken) { res.status(401).json({ error: "Please sign in to continue." }); return null; }
  let user = accessToken ? await authUser(accessToken) : null;
  if (!user && refreshToken) {
    const refreshed = await authFetch("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) }, true);
    if (refreshed?.access_token) { setAuthCookies(req, res, refreshed); accessToken = refreshed.access_token; user = refreshed.user; }
  }
  if (!user) { res.setHeader("Set-Cookie", [expiredCookie(COOKIE_ACCESS), expiredCookie(COOKIE_REFRESH)]); res.status(401).json({ error: "Your session expired. Please sign in again." }); return null; }
  return { user, accessToken };
}

async function authUser(token) {
  try { return await authFetch("/auth/v1/user", { headers: { Authorization: `Bearer ${token}` } }); } catch { return null; }
}

async function authFetch(path, options = {}, quiet = false) {
  requireSupabase();
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const response = await fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}${path}`, { ...options, headers: { apikey: key, "Content-Type": "application/json", ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok && !quiet) throw new Error(data?.msg || data?.error_description || data?.message || "Authentication failed.");
  return response.ok ? data : null;
}

async function upsertProfile(userId, values) { await supabaseFetch("member_profiles?on_conflict=user_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ user_id: userId, ...values, updated_at: new Date().toISOString() }) }); }
async function upsertMembership(userId, values) { const response = await supabaseFetch("member_memberships?on_conflict=user_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ user_id: userId, ...values, updated_at: new Date().toISOString() }) }); if (!response.ok) throw new Error("Could not update membership in Supabase."); }
async function selectMany(path) { const response = await supabaseFetch(path); if (!response.ok) return []; return response.json(); }
async function selectOne(path) { const rows = await selectMany(path); return Array.isArray(rows) ? rows[0] || null : null; }
async function countRows(path) { const response = await supabaseFetch(`${path}&select=id`, { headers: { Prefer: "count=exact", Range: "0-0" } }); const range = response.headers.get("content-range") || "0/0"; return Number(range.split("/")[1] || 0); }

function supabaseFetch(path, options = {}) { requireSupabase(); const key = process.env.SUPABASE_SERVICE_ROLE_KEY; return fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}/rest/v1/${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(options.headers || {}) } }); }
function storageFetch(path, options = {}) { requireSupabase(); const key = process.env.SUPABASE_SERVICE_ROLE_KEY; return fetch(`${String(process.env.SUPABASE_URL).replace(/\/$/, "")}/storage/v1${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, ...(options.headers || {}) } }); }
function requireSupabase() { if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase member service is not configured."); }
function requireMethod(req, method) { if (req.method !== method) { const error = new Error("Method not allowed"); error.status = 405; throw error; } }
function memberAction(req) { const url = new URL(req.url, "http://local"); return clean(url.searchParams.get("action") || req.body?.action || "session", 50); }
function normalizeEmail(value) { const email = String(value || "").trim().toLowerCase(); return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : ""; }
function publicUser(user) { return user ? { id: user.id, email: user.email, fullName: user.user_metadata?.full_name || "", businessName: user.user_metadata?.business_name || "" } : null; }
function normalizeMembership(value) { return value ? { ...value, active: isMembershipActive(value) } : { status: "inactive", active: false, monthly_price: MEMBERSHIP_PRICE }; }
function isMembershipActive(value) { return ["active", "trialing"].includes(String(value?.status || "").toLowerCase()); }
function paypalMembershipStatus(status) { const value = String(status || "").toUpperCase(); if (value === "ACTIVE") return "active"; if (["SUSPENDED", "EXPIRED"].includes(value)) return "suspended"; if (value === "CANCELLED") return "cancelled"; return "approval_pending"; }
function cookie(req, name) { const match = String(req.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`)); return match ? decodeURIComponent(match.slice(name.length + 1)) : ""; }
function setAuthCookies(req, res, data) { const secure = !String(req.headers.host || "").includes("localhost") && !String(req.headers.host || "").includes("127.0.0.1"); res.setHeader("Set-Cookie", [authCookie(COOKIE_ACCESS, data.access_token, data.expires_in || 3600, secure), authCookie(COOKIE_REFRESH, data.refresh_token, 60 * 60 * 24 * 30, secure)]); }
function authCookie(name, value, maxAge, secure) { return `${name}=${encodeURIComponent(value || "")}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`; }
function expiredCookie(name) { return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`; }
function publicBaseUrl(req) { const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL; if (env) return String(env).startsWith("http") ? String(env).replace(/\/$/, "") : `https://${env}`; const host = req.headers.host || "localhost:4178"; return `${host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"}://${host}`; }
