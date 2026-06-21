const BUSINESS_CONTEXT = `
Eres el asistente oficial de Next Print NY en Brooklyn, NY.
Tu identidad es fuerte y consistente: eres atento, práctico, bilingüe, profesional y cercano.
Representas a un negocio ecuatoriano en Brooklyn que ayuda a clientes ocupados a imprimir, resolver trámites y completar tareas importantes.
Hablas español e inglés de forma clara, amable y profesional.
Si el cliente selecciona English, responde en inglés. Si selecciona Español, responde en español.
Servicios:
- Impresión: tarjetas de presentación, volantes, postales, perchas para puertas, banners, stickers, letreros, afiches, rotulación de vehículos, letreros para autos, camisetas, bordados, folletos, menús y facturas.
- Agente consultor: formularios y asistencia del DMV, registro de E-ZPass, formación de empresas LLC/S-Corp/Corporaciones, seguros, asistencia para discapacitados, préstamos, financiamiento, preparación de documentos, coordinación con abogados, registro de negocio, EIN, ITIN e inmigración.
- Multiservicios: traducciones inglés-español, pago de facturas, pago de tickets, formularios generales, servicios administrativos, referencias a notaría, soluciones E-ZPass y DMV.
Services in English:
- Printing: business cards, flyers, postcards, door hangers, banners, stickers, signs, posters, vehicle lettering, car signs, yard signs, t-shirt printing, embroidery, brochures, menus and invoices.
- Consulting agent: DMV forms and assistance, E-ZPass registration, business formation LLC/S-Corp/Corporations, insurance assistance, disability assistance, loans, financing, document preparation, attorney coordination, business registration, EIN, ITIN and immigration paperwork assistance.
- Multiservices: English-Spanish translations, bill payments, ticket payments, general forms, administrative services, notary referrals, E-ZPass and DMV solutions.
Contacto: 239 333 7935, nextprintny@gmail.com, 1510 Gates Ave, Brooklyn, NY 11237.
Reglas:
- No des precios fijos. Si preguntan por precios, pide detalles: servicio, cantidad, tamaño, material, diseño, acabado y fecha de entrega.
- No prometas resultados legales, migratorios o financieros. Recomienda llamar o visitar para confirmar detalles.
- Si recuerdas pedidos anteriores, menciónalos solo cuando ayuden a la conversación.
- Nunca inventes pedidos, fechas, precios ni datos personales.
- Si el cliente quiere enviar archivos, indícale usar el botón "Upload your files" en la página.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const action = String(req.body?.action || "chat");
  if (action === "image-search") {
    await searchPexelsImages(req, res);
    return;
  }

  if (action === "image-generate") {
    await generateEditorImage(req, res);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const message = String(req.body?.message || "").trim();
  const language = req.body?.language === "en" ? "English" : "Español";
  const customer = req.body?.customer || {};
  const conversation = buildConversationInput(req.body?.conversation, message);
  const customerContext = buildCustomerContext(customer);

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (!apiKey) {
    res.status(200).json({
      reply:
        language === "English"
          ? "The real AI is not connected yet. To activate it in Vercel, add the OPENAI_API_KEY variable. In the meantime, call 239 333 7935 or write your question with details."
          : "La IA real todavía no está conectada. Para activarla en Vercel, agrega la variable OPENAI_API_KEY. Mientras tanto, llama al 239 333 7935 o escribe tu consulta con detalles.",
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
        instructions: `${BUSINESS_CONTEXT}\nIdioma seleccionado por el cliente / Selected customer language: ${language}.\n${customerContext}`,
        input: conversation,
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
      (language === "English"
        ? "Thanks for contacting Next Print NY. What service do you need today?"
        : "Gracias por escribir a Next Print NY. ¿Qué servicio necesitas hoy?");

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function searchPexelsImages(req, res) {
  const query = safeText(req.body?.query).slice(0, 120);
  const apiKey = process.env.PEXELS_API_KEY;
  if (!query) {
    res.status(400).json({ error: "Enter an image search." });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ error: "PEXELS_API_KEY is not configured in Vercel." });
    return;
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`, {
      headers: { Authorization: apiKey },
    });
    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.error || "Could not search photos." });
      return;
    }
    const images = Array.isArray(data.photos)
      ? data.photos.map((photo) => ({
          id: String(photo.id || ""),
          preview: photo.src?.medium || photo.src?.large || "",
          src: photo.src?.large2x || photo.src?.large || photo.src?.original || "",
          alt: safeText(photo.alt || query),
          credit: safeText(photo.photographer || "Pexels"),
        })).filter((image) => image.src)
      : [];
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not search photos." });
  }
}

async function generateEditorImage(req, res) {
  const prompt = safeText(req.body?.prompt).slice(0, 600);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!prompt) {
    res.status(400).json({ error: "Describe the image you want to generate." });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY is not configured in Vercel." });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
        prompt: `Create a clean, print-ready marketing image. No text unless explicitly requested. ${prompt}`,
        size: "1024x1024",
        quality: "low",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || "Could not generate the image." });
      return;
    }
    const base64 = data.data?.[0]?.b64_json;
    if (!base64) {
      res.status(500).json({ error: "The image service did not return an image." });
      return;
    }
    res.status(200).json({
      images: [{
        id: `ai-${Date.now()}`,
        preview: `data:image/png;base64,${base64}`,
        src: `data:image/png;base64,${base64}`,
        alt: prompt,
        credit: "Generated with AI",
      }],
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Could not generate the image." });
  }
}

function buildCustomerContext(customer) {
  const name = safeText(customer.name);
  const deviceId = safeText(customer.deviceId);
  const lastVisit = safeText(customer.lastVisit);
  const recentQuestions = Array.isArray(customer.recentQuestions)
    ? customer.recentQuestions.map(safeText).filter(Boolean).slice(0, 5)
    : [];
  const recentOrders = Array.isArray(customer.recentOrders)
    ? customer.recentOrders.map(safeText).filter(Boolean).slice(0, 3)
    : [];

  return `
Memoria local del cliente:
- Nombre recordado: ${name || "No disponible"}
- Dispositivo reconocido: ${deviceId ? "Sí" : "No"}
- Última visita guardada: ${lastVisit || "No disponible"}
- Preguntas recientes recordadas: ${
    recentQuestions.length ? recentQuestions.join(" | ") : "No hay preguntas previas recordadas"
  }
- Pedidos o archivos recientes recordados: ${
    recentOrders.length ? recentOrders.join(" | ") : "No hay pedidos previos recordados"
  }
Usa esta memoria con naturalidad, sin decir que viene de localStorage.
Si el cliente pregunta si lo recuerdas, responde con su nombre, preguntas recientes o archivos recientes cuando estén disponibles.
`;
}

function buildConversationInput(conversation, message) {
  const messages = Array.isArray(conversation)
    ? conversation
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: safeText(item.content),
        }))
        .filter((item) => item.content)
        .slice(-10)
    : [];

  const lastMessage = messages.at(-1);
  if (!lastMessage || lastMessage.role !== "user" || lastMessage.content !== message) {
    messages.push({ role: "user", content: safeText(message) });
  }

  return messages.map((item) => ({
    role: item.role,
    content: item.content,
  }));
}

function safeText(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 300);
}
