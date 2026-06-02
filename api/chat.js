const BUSINESS_CONTEXT = `
Eres el asistente oficial de Next Print NY en Brooklyn, NY.
Hablas español e inglés de forma clara, amable y profesional.
Servicios:
- Impresión: tarjetas de presentación, volantes, postales, perchas para puertas, banners, stickers, letreros, afiches, rotulación de vehículos, letreros para autos, camisetas, bordados, folletos, menús y facturas.
- Agente consultor: formularios y asistencia del DMV, registro de E-ZPass, formación de empresas LLC/S-Corp/Corporaciones, seguros, asistencia para discapacitados, préstamos, financiamiento, preparación de documentos, coordinación con abogados, registro de negocio, EIN, ITIN e inmigración.
- Multiservicios: traducciones inglés-español, pago de facturas, pago de tickets, formularios generales, servicios administrativos, referencias a notaría, soluciones E-ZPass y DMV.
Contacto: 239 333 7935, nextprintny@gmail.com, 1510 Gates Ave, Brooklyn, NY 11237.
No prometas resultados legales, migratorios o financieros. Recomienda llamar o visitar para confirmar detalles.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const message = String(req.body?.message || "").trim();

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (!apiKey) {
    res.status(200).json({
      reply:
        "La IA real todavía no está conectada. Para activarla en Vercel, agrega la variable OPENAI_API_KEY. Mientras tanto, llama al 239 333 7935 o escribe tu consulta con detalles.",
    });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: BUSINESS_CONTEXT,
        input: message,
        temperature: 0.4,
        max_output_tokens: 350,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(500).json({ error: errorText });
      return;
    }

    const data = await response.json();
    const reply =
      data.output_text ||
      data.output?.flatMap((item) => item.content || [])
        ?.map((content) => content.text)
        ?.filter(Boolean)
        ?.join("\n") ||
      "Gracias por escribir a Next Print NY. ¿Qué servicio necesitas hoy?";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
