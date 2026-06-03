import { createSessionCookie, getAdminEmail, readSession, verifyPassword } from "./_admin-auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const session = readSession(req);
    res.status(200).json({
      authenticated: Boolean(session),
      email: session?.email || null,
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const adminEmail = getAdminEmail();
  const passwordCheck = verifyPassword(password);

  if (!passwordCheck.ok) {
    res.status(passwordCheck.error ? 500 : 401).json({
      error: passwordCheck.error || "Invalid credentials",
    });
    return;
  }

  if (process.env.ADMIN_EMAIL && email !== adminEmail) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.setHeader("Set-Cookie", createSessionCookie(email || adminEmail));
  res.status(200).json({ ok: true, email: email || adminEmail });
}
