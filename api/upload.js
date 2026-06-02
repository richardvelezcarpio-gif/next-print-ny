const TO_EMAIL = "nextprintny@gmail.com";
const DEFAULT_FROM_EMAIL = "Next Print NY <onboarding@resend.dev>";
const MAX_FILE_SIZE_BASE64 = 5.6 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "RESEND_API_KEY missing" });
    return;
  }

  const { language, name, email, phone, notes, file } = req.body || {};
  const customerName = String(name || "").trim();
  const customerEmail = String(email || "").trim();
  const customerPhone = String(phone || "").trim();
  const orderNotes = String(notes || "").trim();
  const selectedLanguage = language === "en" ? "English" : "Español";

  if (!customerName || !customerEmail || !file?.name || !file?.content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (String(file.content).length > MAX_FILE_SIZE_BASE64) {
    res.status(413).json({ error: "File too large" });
    return;
  }

  const html = `
    <h2>Nuevo archivo recibido - Next Print NY</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(customerName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(customerPhone || "No incluido")}</p>
    <p><strong>Idioma:</strong> ${selectedLanguage}</p>
    <p><strong>Detalles:</strong></p>
    <p>${escapeHtml(orderNotes || "Sin detalles adicionales").replace(/\n/g, "<br>")}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: customerEmail,
        subject: `Archivo para imprimir - ${customerName}`,
        html,
        attachments: [
          {
            filename: String(file.name).slice(0, 180),
            content: file.content,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(500).json({ error: errorText });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
