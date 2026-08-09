const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");
const uploadForm = document.querySelector("#uploadForm");
const uploadFile = document.querySelector("#uploadFile");
const uploadTrigger = document.querySelector("#uploadTrigger");
const uploadStatus = document.querySelector("#uploadStatus");
const languageButtons = document.querySelectorAll("[data-lang]");
const maxUploadSize = 4 * 1024 * 1024;
const maxUploadTotalSize = 12 * 1024 * 1024;
const memoryKey = "nextPrintCustomerMemory";
const conversationKey = "nextPrintConversation";
const maxConversationMessages = 16;
const maxRememberedQuestions = 8;

const translations = {
  es: {
    "nav.print": "Impresión",
    "nav.consultant": "Agente consultor",
    "nav.multi": "Multiservicios",
    "nav.ai": "Asistente IA",
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.gallery": "Galería",
    "nav.testimonials": "Testimonios",
    "nav.faq": "FAQ",
    "nav.contact": "Contáctanos",
    "nav.aiButton": "Chat con IA",
    "nav.telegram": "Chat en Telegram",
    "hero.badge": "Orgullosamente ecuatorianos",
    "hero.title": "Imprimimos. Te ayudamos. Hacemos que las cosas sucedan.",
    "hero.copy":
      "Servicios de impresión, trámites, DMV, E-ZPass, documentos, pagos, traducciones y asistencia personalizada en Brooklyn.",
    "hero.call": "Llamar ahora",
    "hero.ask": "Preguntar a la IA",
    "hero.quality": "Alta calidad",
    "hero.fast": "Entrega rápida",
    "hero.prices": "Precios excelentes",
    "hero.bilingual": "Bilingüe ES / EN",
    "upload.eyebrow": "Ordena tus copias",
    "upload.title": "Sube tus archivos",
    "upload.subtitle": "Full color / blanco y negro",
    "upload.name": "Nombre",
    "upload.email": "Email",
    "upload.phone": "Teléfono",
    "upload.notes": "Detalles del pedido",
    "upload.notesPlaceholder": "Cantidad, tamaño, color, fecha...",
    "upload.choose": "Escoger archivo",
    "upload.button": "Escoger archivos para subir",
    "upload.selected": "Archivo seleccionado:",
    "upload.ready": "Archivo listo. Presiona el botón otra vez para enviarlo.",
    "upload.sendSelected": "Enviar archivo seleccionado",
    "upload.sending": "Enviando archivo...",
    "upload.success": "Listo. Tu archivo fue enviado a Next Print NY.",
    "upload.error": "No se pudo enviar. Llama al 239 333 7935 o intenta de nuevo.",
    "upload.configError": "El formulario está listo, pero falta configurar RESEND_API_KEY en Vercel.",
    "upload.sizeError": "El archivo debe pesar menos de 4 MB.",
    "copies.title": "Ordena copias online",
    "copies.copy": "Sube tus archivos y escoge las especificaciones de tus copias.",
    "copies.chooseFiles": "Escoger varios archivos",
    "copies.send": "Enviar orden de copias",
    "copies.color": "Tipo de impresión",
    "copies.bw": "Blanco y negro",
    "copies.fullColor": "Color",
    "copies.size": "Tamaño del papel",
    "copies.paper": "Papel",
    "copies.quantity": "Copias por archivo",
    "copies.notes": "Notas: páginas, un lado o ambos lados, acabado, detalles de recogida...",
    "tabs.print": "🖨️ Impresión",
    "tabs.consultant": "🤝 Agente consultor",
    "tabs.multi": "👥 Multiservicios",
    "services.eyebrow": "Todo en un solo lugar",
    "services.title": "Servicios principales",
    "print.title": "Servicios de impresión",
    "print.item1": "Tarjetas de presentación",
    "print.item2": "Volantes, postales y banners",
    "print.item3": "Perchas para puertas y stickers",
    "print.item4": "Letreros, afiches y menús",
    "print.item5": "Rotulación de vehículos",
    "print.item6": "Letreros para autos y jardín",
    "print.item7": "Impresión en camisetas",
    "print.item8": "Bordados, folletos y facturas",
    "print.note": "Alta calidad, entrega rápida, precios excelentes.",
    "consultant.title": "Servicios de agente consultor",
    "consultant.item1": "Formularios y asistencia del DMV",
    "consultant.item2": "Registro de E-ZPass",
    "consultant.item3": "Formación de empresas LLC, S-Corp y Corporaciones",
    "consultant.item4": "Asistencia de seguros",
    "consultant.item5": "Orientación de préstamos y financiamiento",
    "consultant.item6": "Preparación de documentos",
    "consultant.item7": "Coordinación con abogados",
    "consultant.item8": "Registro de negocio, EIN e ITIN",
    "consultant.item9": "Asistencia con trámites de inmigración",
    "multi.title": "Multiservicios",
    "multi.item1": "Traducciones inglés - español",
    "multi.item2": "Pago de facturas",
    "multi.item3": "Pago de tickets de tránsito y estacionamiento",
    "multi.item4": "Asistencia con formularios generales",
    "multi.item5": "Servicios administrativos",
    "multi.item6": "Referencias a notaría",
    "multi.item7": "Soluciones de E-ZPass y DMV",
    "multi.item8": "Y mucho más",
    "multi.note": "Sirviendo con calidad y compromiso.",
    "support.dmv": "Asistencia para formularios, pagos y orientación.",
    "support.insuranceTitle": "Seguros",
    "support.insurance": "Compensación laboral y responsabilidad civil.",
    "support.housingTitle": "Servicios de vivienda",
    "support.housing": "Compramos casas en efectivo y vendemos casas.",
    "support.loansTitle": "Préstamos y financiamiento",
    "support.loans": "Te guiamos para obtener el financiamiento que necesitas.",
    "ai.eyebrow": "Asistente IA",
    "ai.title": "Pregunta lo que necesites",
    "ai.item1": "Respuestas rápidas sobre servicios",
    "ai.item2": "Soporte 24/7 cuando esté conectado a Vercel",
    "ai.item3": "Bilingüe español e inglés",
    "ai.item4": "Cotizaciones iniciales al instante",
    "chat.title": "Chat con IA",
    "chat.identity": "Identidad: Next Print NY",
    "chat.welcome":
      "Hola, soy el asistente de Next Print NY. ¿Cuál es tu nombre y prefieres español o inglés?",
    "chat.label": "Escribe tu pregunta",
    "chat.placeholder": "Pregunta ahora...",
    "chat.send": "Enviar",
    "chat.loading": "Escribiendo respuesta...",
    "chat.returning":
      "Hola de nuevo, {name}. Recuerdo tu preferencia de idioma y puedo ayudarte con impresión, DMV, E-ZPass, documentos, pagos, traducciones y pedidos anteriores.",
    "chat.nameSaved": "Mucho gusto, {name}. Ya guardé tu nombre para la próxima visita. ¿Cómo puedo ayudarte hoy?",
    "chat.askName": "Para atenderte mejor, dime tu nombre por favor.",
    "contact.eyebrow": "Estamos aquí para ayudarte",
    "contact.title": "Ahorra tiempo. Ahorra dinero. Obtén resultados.",
    "contact.telegram": "💬 Chat en Telegram",
    "contact.ai": "🤖 Chat con IA",
    "map.eyebrow": "Visítanos",
    "map.title": "Encuéntranos en Google Maps",
    "map.button": "Cómo llegar",
    "footer.tagline": "Impresiones de calidad. A tiempo. Siempre.",
    "home.nav.home": "Inicio",
    "home.nav.services": "Servicios",
    "home.nav.about": "Nosotros",
    "home.nav.testimonials": "Testimonios",
    "home.nav.blog": "Blog",
    "home.nav.contact": "Contacto",
    "home.nav.signs": "Letreros y banners",
    "home.nav.bannerDesigner": "Diseñador de banners",
    "home.nav.shirts": "Camisetas y ropa",
    "home.nav.copies": "Copias por volumen",
    "home.nav.products": "Productos impresos",
    "home.nav.websites": "Websites",
    "home.reseller.title": "🔥 Programa de revendedores disponible",
    "home.reseller.copy": "Obtén precios al por mayor y haz crecer tu propio negocio de impresión.",
    "home.reseller.button": "Solicitar precio mayorista",
    "home.hero.title1": "Haz que tu negocio",
    "home.hero.title2": "se vea profesional",
    "home.hero.copy": "Letreros, banners, camisetas, copias por volumen y materiales de marketing fabricados en Brooklyn, NY.",
    "home.badge.same": "Servicio el mismo día disponible",
    "home.badge.wholesale": "Precios al por mayor",
    "home.badge.pickup": "Recogida local en Brooklyn",
    "home.badge.reseller": "Programa reseller disponible",
    "home.hero.primary": "Empezar orden",
    "home.hero.secondary": "Ver precios wholesale",
    "home.hero.rating": "4.9/5 de más de 500 clientes",
    "home.signs.title": "Letreros y banners",
    "home.signs.copy": "Impresión grande de alta calidad para que tu negocio destaque.",
    "home.signs.button": "Diseñar banners online",
    "home.tshirts.title": "Camisetas personalizadas",
    "home.tshirts.copy": "Impresión DTF premium para eventos, negocios y organizaciones.",
    "home.tshirts.button": "Diseñar camisetas",
    "home.copiesCard.title": "Copias por volumen",
    "home.copiesCard.copy": "Copias rápidas y económicas para tu negocio u organización.",
    "home.copiesCard.button": "Subir archivos y ordenar",
    "home.websitesCard.title": "Websites e IA Automation",
    "home.websitesCard.copy": "Páginas web profesionales que ayudan a crecer tu negocio.",
    "home.websitesCard.item1": "Websites para negocios",
    "home.websitesCard.item2": "Formularios online",
    "home.websitesCard.item3": "Chatbots con IA",
    "home.websitesCard.item4": "Agenda de citas",
    "home.websitesCard.item5": "Portales para clientes",
    "home.websitesCard.item6": "Sistemas CRM",
    "home.websitesCard.button": "Crear tu website",
    "home.products.title": "Productos impresos",
    "home.products.viewAll": "Ver todo",
    "home.why.title": "Por qué los negocios locales escogen Next Print NY",
    "home.why.fast": "Entrega rápida",
    "home.why.fastText": "La mayoría de órdenes listas en 24-48 horas.",
    "home.why.wholesale": "Precios wholesale",
    "home.why.wholesaleText": "Ahorra más con nuestro programa reseller.",
    "home.why.minimum": "Sin mínimos",
    "home.why.minimumText": "Ordena solo lo que necesitas.",
    "home.why.pickup": "Recogida local",
    "home.why.pickupText": "Recogida conveniente en Brooklyn, NY.",
    "home.why.ai": "Asistente IA 24/7",
    "home.why.aiText": "Respuestas y soporte a cualquier hora.",
    "home.why.human": "Soporte humano real",
    "home.why.humanText": "Estamos aquí para ayudarte a crecer.",
    "home.memberships.title": "Membresías mensuales de copias",
    "home.memberships.copy": "Perfecto para iglesias, escuelas, oficinas, contratistas y más.",
    "home.memberships.customTitle": "¿Necesitas algo custom?",
    "home.memberships.customCopy": "Contáctanos para volumen y precios personalizados.",
    "home.memberships.quote": "Pedir cotización",
    "home.resellerPanel.title": "Programa reseller",
    "home.resellerPanel.headline": "Tú vendes. Nosotros imprimimos.",
    "home.resellerPanel.copy": "Empieza tu propio negocio de impresión sin comprar equipos.",
    "home.resellerPanel.button": "Aplicar para cuenta wholesale",
    "home.viewServices": "Ver servicios",
    "home.printing.title": "Impresión",
    "home.printing.item1": "Tarjetas de presentación",
    "home.printing.item2": "Volantes y brochures",
    "home.printing.item3": "Banners y letreros",
    "home.printing.item4": "Vinyl para ventanas",
    "home.printing.item5": "Rotulación de autos",
    "home.printing.item6": "Camisetas y más",
    "home.multi.title": "Multiservicios",
    "home.multi.item1": "Configuración de E-ZPass",
    "home.multi.item2": "Formación de LLC",
    "home.multi.item3": "Asistencia DMV",
    "home.multi.item4": "Pago de tickets",
    "home.multi.item5": "Servicios notariales",
    "home.multi.item6": "Renovación de permisos",
    "home.multi.item7": "Y más...",
    "home.consulting.title": "Agente consultor",
    "home.consulting.item1": "Consultoría de negocios",
    "home.consulting.item2": "Estrategias de crecimiento",
    "home.consulting.item3": "Automatización con IA",
    "home.consulting.item4": "Marketing digital",
    "home.consulting.item5": "Planes de negocio",
    "home.consulting.item6": "Soluciones personalizadas",
    "home.feature.fast": "Respuesta rápida",
    "home.feature.fastText": "Cotizaciones en minutos",
    "home.feature.secure": "100% seguro",
    "home.feature.secureText": "Tus datos están protegidos",
    "home.feature.tech": "Tecnología e IA",
    "home.feature.techText": "Soluciones inteligentes 24/7",
    "home.feature.ecuador": "Orgullosamente ecuatorianos",
    "home.feature.ecuadorText": "Hablamos tu idioma",
    "home.upload.formats": "PDF, JPG, PNG (Máx. 4MB cada uno)",
    "home.upload.title": "Sube tus documentos",
    "home.upload.copy": "Comparte tus archivos de forma segura",
    "home.upload.safe": "Seguro y protegido",
    "home.upload.safeText": "Tu privacidad es nuestra prioridad",
    "home.upload.fast": "Proceso rápido",
    "home.upload.fastText": "Procesamos tus documentos rápido",
    "home.upload.easy": "Fácil y conveniente",
    "home.upload.easyText": "Sube desde cualquier dispositivo",
    "home.upload.notesPlaceholder": "Notas: ¿qué necesitas hacer?",
    "home.chat.title": "Asistente chat IA",
    "home.chat.online": "Online 24/7",
    "home.chat.copy": "Recibe respuestas, recomendaciones y ayuda personalizada 24/7.",
    "home.chat.button": "Chatear ahora",
    "home.chat.powered": "Impulsado por Next Print AI",
    "home.shirts.title": "Ordena tus camisetas impresas aquí",
    "home.shirts.copy": "Escoge colores, tallas y cantidades, luego diseña tu camiseta online.",
    "home.shirts.button": "Empezar orden",
    "home.trust.kicker": "Negocios locales confían en nosotros",
    "home.trust.title": "Qué dicen nuestros clientes",
    "home.review.one": "\"Servicio rápido y gran calidad.\"",
    "home.review.two": "\"Los mejores precios en Brooklyn.\"",
    "home.founder.kicker": "Conoce a Richard Velez",
    "home.founder.title": "Fundador de Next Print NY",
    "home.founder.copy": "Más de 20 años de experiencia en impresión y servicio al cliente. Ayudamos a los negocios a verse profesionales y crecer.",
    "home.visit.title": "Visítanos",
    "home.visit.week": "Lun - Sáb:",
    "home.visit.sunday": "Domingo:",
    "home.visit.closed": "Cerrado",
    "home.visit.maps": "Ver en Google Maps",
    "home.visit.directions": "Cómo llegar",
    "home.contact.title": "Contáctanos",
    "home.contact.follow": "Síguenos",
    "home.mini.payments": "Pagos online",
    "home.mini.paymentsText": "Pagos seguros",
    "home.mini.signature": "Firma digital",
    "home.mini.signatureText": "Documentos online",
    "home.mini.tracking": "Seguimiento en tiempo real",
    "home.mini.trackingText": "Rastrea tus solicitudes",
    "home.mini.alerts": "Alertas email y SMS",
    "home.mini.alertsText": "Actualizaciones al instante",
    "home.mini.support": "Soporte multilingüe",
    "home.mini.supportText": "Hablamos tu idioma",
    "home.footer.rights": "© 2026 Next Print NY. Todos los derechos reservados.",
    "home.footer.privacy": "Política de privacidad",
    "home.footer.terms": "Términos de servicio",
    "printingPage.breadcrumb": "Inicio > Productos impresos",
    "printingPage.kicker": "Impresión para negocios",
    "printingPage.heroTitleTop": "Productos impresos",
    "printingPage.heroTitleBottom": "Hechos para impresionar",
    "printingPage.heroCopy":
      "Tarjetas de presentación, volantes, menús, stickers y materiales de marketing con color limpio, detalles nítidos y servicio rápido en Brooklyn.",
    "printingPage.benefit1Title": "Cartulina premium",
    "printingPage.benefit1Text": "Acabado brillante o mate",
    "printingPage.benefit2Title": "Volantes y menús",
    "printingPage.benefit2Text": "Promociona eventos rápido",
    "printingPage.benefit3Title": "Full color nítido",
    "printingPage.benefit3Text": "Presentación profesional",
    "printingPage.benefit4Title": "Entrega local",
    "printingPage.benefit4Text": "Pickup disponible en Brooklyn",
    "printingPage.quote": "Elegir producto",
    "printingPage.upload": "Pedir cotización",
    "printingPage.rating": "Confiado por negocios locales y equipos de eventos",
    "printingPage.perfectFor": "Perfecto para",
    "printingPage.sectionKicker": "Qué imprimimos",
    "printingPage.sectionTitle": "Impresión para negocios, eventos y uso diario",
    "printingPage.card1Title": "Materiales de negocio",
    "printingPage.card1Item1": "Tarjetas de presentación",
    "printingPage.card1Item2": "Volantes y brochures",
    "printingPage.card1Item3": "Postales y menús",
    "printingPage.card1Item4": "Facturas y formularios",
    "printingPage.card2Title": "Letreros y exhibición",
    "printingPage.card2Item1": "Banners y afiches",
    "printingPage.card2Item2": "Vinyl para ventanas",
    "printingPage.card2Item3": "Letreros para jardín",
    "printingPage.card2Item4": "Letreros y rotulación para autos",
    "printingPage.card3Title": "Productos personalizados",
    "printingPage.card3Item1": "Stickers y etiquetas",
    "printingPage.card3Item2": "Camisetas",
    "printingPage.card3Item3": "Coordinación de bordados",
    "printingPage.card3Item4": "Pedidos especiales de impresión",
    "printingPage.step1": "Envía tu archivo o idea",
    "printingPage.step2": "Confirma tamaño, cantidad y acabado",
    "printingPage.step3": "Aprueba e imprimimos",
    "printingPage.step4": "Recoge o coordinamos entrega",
    "printingPage.ctaTitle": "¿Necesitas precio?",
    "printingPage.ctaCopy": "Envía cantidad, tamaño, material, colores y fecha para cotizar correctamente.",
    "printingPage.ctaButton": "Contactar a Next Print NY",
    "printingCatalog.products": "Productos",
    "printingCatalog.copy": "Selecciona un producto y cantidad para ver el precio sugerido. Inicia la orden y confirmaremos los detalles antes de producir.",
    "printingCatalog.size": "Tamaño",
    "printingCatalog.rounded": "Esquinas redondeadas",
    "printingCatalog.no": "No",
    "printingCatalog.yes": "Sí",
    "printingCatalog.printedSide": "Lados impresos",
    "printingCatalog.frontOnly": "Solo frente",
    "printingCatalog.frontBack": "Frente y reverso",
    "printingCatalog.paperType": "Tipo de papel",
    "printingCatalog.coating": "Acabado",
    "printingCatalog.highGloss": "Alto brillo",
    "printingCatalog.matte": "Mate",
    "printingCatalog.frontSide": "Lado frontal",
    "printingCatalog.backSide": "Lado posterior",
    "printingCatalog.fullColor": "Full color",
    "printingCatalog.noPrinting": "Sin impresión",
    "printingCatalog.material": "Material",
    "printingCatalog.outdoorVinyl": "Vinyl blanco exterior alto brillo",
    "printingCatalog.paperStock": "Tipo de papel",
    "printingCatalog.glossBothSides": "Brillo en ambos lados",
    "printingCatalog.folding": "Opción de doblado",
    "printingCatalog.halfFold": "Doblado a la mitad",
    "printingCatalog.triFold": "Tríptico",
    "printingCatalog.zFold": "Doblado en Z",
    "printingCatalog.gateFold": "Doblado tipo puerta",
    "printingCatalog.frenchFold": "Doblado francés",
    "printingCatalog.doubleParallelFold": "Doblado paralelo doble",
    "printingCatalog.parallelMapFold": "Doblado de mapa paralelo",
    "printingCatalog.treatments": "Terminación",
    "printingCatalog.none": "Ninguna",
    "printingCatalog.hemGrommets": "Dobladillo con ojales",
    "printingCatalog.hemNoGrommets": "Dobladillo sin ojales",
    "printingCatalog.polePockets": "Bolsillos para poste",
    "printingCatalog.highGlossUv": "Alto brillo UV",
    "printingCatalog.displayOptions": "Opciones de exhibición",
    "printingCatalog.bannerStand": "Base del banner",
    "printingCatalog.singleSidedStand": "Base + 1 banner (un solo lado)",
    "printingCatalog.standardRetractable": "Retráctil estándar de 33 pulgadas",
    "printingCatalog.smoothBlockoutVinyl": "Vinyl blockout liso de 13 oz.",
    "printingCatalog.panels": "Paneles",
    "printingCatalog.onePanel": "1 panel",
    "printingCatalog.coroplastBoard": "Tablero coroplast de 4 mm",
    "printingCatalog.hWire": "Estaca H-Wire",
    "printingCatalog.xlHWire": "H-Wire XL calibre 9 (24 pulgadas alto x 10 pulgadas ancho)",
    "printingCatalog.grommets": "Ojales",
    "printingCatalog.quantity": "Cantidad",
    "printingCatalog.suggested": "Precio sugerido",
    "printingCatalog.start": "Iniciar orden con este producto",
    "multiPage.kicker": "Área de multiservicios",
    "multiPage.heroTitle": "Un solo lugar para los trámites que te quitan tiempo.",
    "multiPage.heroCopy":
      "Ayudamos con documentos, pagos, formularios, traducciones y solicitudes de servicios para que los clientes avancen más rápido y eviten confusiones.",
    "multiPage.help": "Pedir ayuda",
    "multiPage.sectionKicker": "Cómo ayudamos",
    "multiPage.sectionTitle": "Servicios diarios para personas y negocios ocupados",
    "multiPage.card1Title": "DMV y E-ZPass",
    "multiPage.card1Item1": "Formularios y asistencia DMV",
    "multiPage.card1Item2": "Apoyo con registro E-ZPass",
    "multiPage.card1Item3": "Guía para renovación de permisos",
    "multiPage.card1Item4": "Formularios generales de transporte",
    "multiPage.card2Title": "Pagos y tickets",
    "multiPage.card2Item1": "Asistencia con pago de facturas",
    "multiPage.card2Item2": "Apoyo con tickets de tránsito",
    "multiPage.card2Item3": "Apoyo con tickets de parqueo",
    "multiPage.card2Item4": "Organización de recibos",
    "multiPage.card3Title": "Documentos",
    "multiPage.card3Item1": "Traducciones inglés-español",
    "multiPage.card3Item2": "Formularios administrativos",
    "multiPage.card3Item3": "Referencias a notaría",
    "multiPage.card3Item4": "Apoyo en preparación de documentos",
    "multiPage.step1": "Cuéntanos qué necesitas",
    "multiPage.step2": "Trae o sube tus documentos",
    "multiPage.step3": "Revisamos los detalles",
    "multiPage.step4": "Apruebas el próximo paso",
    "multiPage.ctaTitle": "Trae los documentos. Te ayudamos a organizar el próximo paso.",
    "multiPage.ctaCopy":
      "Para asuntos legales, migratorios o financieros, ayudamos a preparar y coordinar, pero no prometemos resultados.",
    "multiPage.ctaButton": "Iniciar solicitud",
    "consultingPage.kicker": "Agente consultor",
    "consultingPage.heroTitle": "Guía para negocios, documentos y crecimiento.",
    "consultingPage.heroCopy":
      "Ayudamos a emprendedores y familias a organizar formación de negocios, planificación, automatización, marketing y documentos con apoyo práctico y bilingüe.",
    "consultingPage.book": "Reservar consulta",
    "consultingPage.ai": "Preguntar a la IA",
    "consultingPage.sectionKicker": "Apoyo empresarial",
    "consultingPage.sectionTitle": "De la idea a una operación organizada",
    "consultingPage.card1Title": "Creación de negocio",
    "consultingPage.card1Item1": "Guía para LLC, S-Corp y corporaciones",
    "consultingPage.card1Item2": "Apoyo con EIN y registro de negocio",
    "consultingPage.card1Item3": "Planes de negocio",
    "consultingPage.card1Item4": "Preparación de documentos",
    "consultingPage.card2Title": "Crecimiento y marketing",
    "consultingPage.card2Item1": "Estrategias de crecimiento",
    "consultingPage.card2Item2": "Dirección de marketing digital",
    "consultingPage.card2Item3": "Coordinación de marca e impresión",
    "consultingPage.card2Item4": "Ideas de comunicación con clientes",
    "consultingPage.card3Title": "Automatización y coordinación",
    "consultingPage.card3Item1": "Planificación de automatización con IA",
    "consultingPage.card3Item2": "Organización de flujos de trabajo",
    "consultingPage.card3Item3": "Coordinación con abogados",
    "consultingPage.card3Item4": "Referencias de seguros y financiamiento",
    "consultingPage.step1": "Comparte la meta",
    "consultingPage.step2": "Revisamos documentos y necesidades",
    "consultingPage.step3": "Creamos la lista de acción",
    "consultingPage.step4": "Coordinamos próximos pasos",
    "consultingPage.ctaTitle": "¿Necesitas organizar mejor el negocio?",
    "consultingPage.ctaCopy": "Podemos ayudarte a mapear el próximo paso y conectar los servicios que tu negocio necesita.",
    "consultingPage.ctaButton": "Hablar con nosotros",
    "order.nav": "Iniciar orden",
    "order.homeTitle": "Ordena tus productos de impresión",
    "order.homeCopy": "Elige Business Cards, Flyers, Stickers, Banners, Menus o Door Hangers, revisa cantidad y precio, y envía tu orden.",
    "order.printingButton": "Ordenar Printing",
    "order.kicker": "Solicitud rápida en línea",
    "order.title": "Inicia tu orden de impresión.",
    "order.copy": "Confirma tu producto de impresión, agrega detalles, sube tus archivos y recibe un número de orden para seguimiento.",
    "order.whatsapp": "WhatsApp",
    "order.stepService": "Servicio",
    "order.stepDetails": "Detalles",
    "order.stepFile": "Archivo",
    "order.stepContact": "Contacto",
    "order.serviceTitle": "¿Qué necesitas?",
    "order.servicePrinting": "Impresión",
    "order.serviceMulti": "Multiservicios",
    "order.serviceConsulting": "Agente consultor",
    "order.detailsTitle": "Detalles de impresión",
    "order.detailsLabel": "Cuéntanos qué necesitas",
    "order.detailsPlaceholder": "Ejemplo: 500 tarjetas de presentación, full color, acabado matte, para el viernes.",
    "order.dueDate": "Fecha de entrega",
    "order.orderDate": "Fecha del pedido",
    "order.deliveryDate": "Fecha de entrega",
    "order.budget": "Precio",
    "order.budgetPlaceholder": "Opcional",
    "order.fileTitle": "Subir archivo",
    "order.fileButton": "Escoger archivo",
    "order.fileHint": "PDF, JPG, PNG o archivos de diseño. Opcional.",
    "order.contactTitle": "Información de contacto",
    "order.submit": "Enviar orden",
    "order.successKicker": "Orden recibida",
    "order.successTitle": "Recibimos tu solicitud.",
    "order.successCopy": "Tu número de orden es",
    "order.whatsappFollow": "Dar seguimiento por WhatsApp",
    "order.track": "Rastrear orden",
    "payment.kicker": "Pago seguro",
    "payment.title": "Checkout online",
    "payment.copy": "Usa tu número de orden para abrir el checkout después de que confirmemos el total.",
    "payment.orderNumber": "Número de orden",
    "payment.copyOrder": "Copiar número de orden",
    "payment.payButton": "Abrir checkout",
    "payment.pageTitle": "Checkout online seguro",
    "payment.pageCopy": "Confirma tu número de orden para abrir el checkout seguro cuando el total esté listo.",
    "payment.checkoutStatus": "Estado del checkout",
    "payment.checkoutPending": "Checkout de PayPal listo",
    "payment.step1": "Confirma el total con Next Print NY.",
    "payment.step2": "Abre el link de checkout seguro de tu orden.",
    "payment.step3": "Completa el pago online.",
    "payment.step4": "Cuando el pago se confirme, el estado cambiará a Pago recibido.",
    "tracking.nav": "Rastrear orden",
    "tracking.kicker": "Seguimiento de orden",
    "tracking.title": "Revisa el estado de tu orden.",
    "tracking.copy": "Escribe tu número de orden para ver el estado más reciente y el próximo paso.",
    "tracking.label": "Número de orden",
    "tracking.placeholder": "NP-260603-123456",
    "tracking.button": "Rastrear orden",
    "tracking.resultKicker": "Estado actual",
    "tracking.customer": "Cliente",
    "tracking.updated": "Última actualización",
    "tracking.amount": "Monto pendiente",
    "tracking.status.new": "Recibida",
    "tracking.status.in_progress": "En revisión",
    "tracking.status.waiting": "Esperando",
    "tracking.status.paid": "Pago recibido",
    "tracking.status.completed": "Completada",
    "tracking.whatsapp": "Preguntar por WhatsApp",
    "quick.call": "Llamar",
    "floatingWhatsapp.title": "¿Necesitas algo personalizado?",
    "floatingWhatsapp.copy": "Escríbeme por WhatsApp. Los precios pueden variar según el trabajo.",
    "floatingWhatsapp.note": "Solo mensajes de texto. Respondo rápido.",
    "floatingWhatsapp.button": "Escríbeme",
    "floatingWhatsapp.close": "Cerrar asistencia por WhatsApp",
    "floatingWhatsapp.open": "Abrir asistencia por WhatsApp",
    "quick.whatsapp": "WhatsApp",
    "quick.order": "Orden",
    "quick.track": "Rastrear",
  },
  en: {
    "nav.print": "Printing",
    "nav.consultant": "Consulting agent",
    "nav.multi": "Multiservices",
    "nav.ai": "AI assistant",
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.testimonials": "Testimonials",
    "nav.faq": "FAQ",
    "nav.contact": "Contact us",
    "nav.aiButton": "Chat with AI",
    "nav.telegram": "Chat on Telegram",
    "hero.badge": "Proudly Ecuadorian",
    "hero.title": "We print. We help. We make things happen.",
    "hero.copy":
      "Printing, DMV, E-ZPass, documents, payments, translations and personalized assistance in Brooklyn.",
    "hero.call": "Call now",
    "hero.ask": "Ask the AI",
    "hero.quality": "High quality",
    "hero.fast": "Fast delivery",
    "hero.prices": "Excellent prices",
    "hero.bilingual": "Bilingual ES / EN",
    "upload.eyebrow": "Order your copies",
    "upload.title": "Upload your files",
    "upload.subtitle": "Full color / black and white",
    "upload.name": "Name",
    "upload.email": "Email",
    "upload.phone": "Phone",
    "upload.notes": "Order details",
    "upload.notesPlaceholder": "Quantity, size, color, date...",
    "upload.choose": "Choose file",
    "upload.button": "Choose files to upload",
    "upload.selected": "Selected file:",
    "upload.ready": "File ready. Press the button again to send it.",
    "upload.sendSelected": "Send selected file",
    "upload.sending": "Sending file...",
    "upload.success": "Done. Your file was sent to Next Print NY.",
    "upload.error": "Could not send. Call 239 333 7935 or try again.",
    "upload.configError": "The form is ready, but RESEND_API_KEY must be configured in Vercel.",
    "upload.sizeError": "The file must be under 4 MB.",
    "copies.title": "Order Copies Online",
    "copies.copy": "Upload your files and choose your copy specifications.",
    "copies.chooseFiles": "Choose multiple files",
    "copies.send": "Send Copy Order",
    "copies.color": "Print type",
    "copies.bw": "Black & White",
    "copies.fullColor": "Color",
    "copies.size": "Paper size",
    "copies.paper": "Paper",
    "copies.quantity": "Copies per file",
    "copies.notes": "Notes: page range, one or two sided, finishing, pickup details...",
    "tabs.print": "🖨️ Printing",
    "tabs.consultant": "🤝 Consulting agent",
    "tabs.multi": "👥 Multiservices",
    "services.eyebrow": "Everything in one place",
    "services.title": "Main services",
    "print.title": "Printing services",
    "print.item1": "Business cards",
    "print.item2": "Flyers, postcards and banners",
    "print.item3": "Door hangers and stickers",
    "print.item4": "Signs, posters and menus",
    "print.item5": "Vehicle lettering",
    "print.item6": "Car and yard signs",
    "print.item7": "T-shirt printing",
    "print.item8": "Embroidery, brochures and invoices",
    "print.note": "High quality, fast delivery, excellent prices.",
    "consultant.title": "Consulting agent services",
    "consultant.item1": "DMV forms and assistance",
    "consultant.item2": "E-ZPass registration",
    "consultant.item3": "Business formation: LLC, S-Corp and Corporations",
    "consultant.item4": "Insurance assistance",
    "consultant.item5": "Loan and financing guidance",
    "consultant.item6": "Document preparation",
    "consultant.item7": "Coordination with attorneys",
    "consultant.item8": "Business registration, EIN and ITIN",
    "consultant.item9": "Immigration paperwork assistance",
    "multi.title": "Multiservices",
    "multi.item1": "English - Spanish translations",
    "multi.item2": "Bill payments",
    "multi.item3": "Traffic and parking ticket payments",
    "multi.item4": "General form assistance",
    "multi.item5": "Administrative services",
    "multi.item6": "Notary referrals",
    "multi.item7": "E-ZPass and DMV solutions",
    "multi.item8": "And much more",
    "multi.note": "Serving with quality and commitment.",
    "support.dmv": "Assistance with forms, payments and guidance.",
    "support.insuranceTitle": "Insurance",
    "support.insurance": "Workers compensation and general liability.",
    "support.housingTitle": "Housing services",
    "support.housing": "We buy houses for cash and sell homes.",
    "support.loansTitle": "Loans and financing",
    "support.loans": "We guide you to obtain the financing you need.",
    "ai.eyebrow": "AI Assistant",
    "ai.title": "Ask what you need",
    "ai.item1": "Fast answers about services",
    "ai.item2": "24/7 support when connected to Vercel",
    "ai.item3": "Bilingual Spanish and English",
    "ai.item4": "Instant initial quotes",
    "chat.title": "Chat with AI",
    "chat.identity": "Identity: Next Print NY",
    "chat.welcome":
      "Hi, I am the Next Print NY assistant. What is your name, and do you prefer English or Spanish?",
    "chat.label": "Type your question",
    "chat.placeholder": "Ask now...",
    "chat.send": "Send",
    "chat.loading": "Writing response...",
    "chat.returning":
      "Welcome back, {name}. I remember your language preference and can help with printing, DMV, E-ZPass, documents, payments, translations and previous orders.",
    "chat.nameSaved": "Nice to meet you, {name}. I saved your name for next time. How can I help today?",
    "chat.askName": "To help you better, please tell me your name.",
    "contact.eyebrow": "We are here to help",
    "contact.title": "Save time. Save money. Get results.",
    "contact.telegram": "💬 Chat on Telegram",
    "contact.ai": "🤖 Chat with AI",
    "map.eyebrow": "Visit us",
    "map.title": "Find us on Google Maps",
    "map.button": "Get directions",
    "footer.tagline": "Quality prints. On time. Always.",
    "home.nav.home": "Home",
    "home.nav.services": "Services",
    "home.nav.about": "About Us",
    "home.nav.testimonials": "Testimonials",
    "home.nav.blog": "Blog",
    "home.nav.contact": "Contact",
    "home.nav.signs": "Signs & Banners",
    "home.nav.bannerDesigner": "Banner Designer",
    "home.nav.shirts": "T-Shirts & Apparel",
    "home.nav.copies": "Bulk Copies",
    "home.nav.products": "Print Products",
    "home.nav.websites": "Websites",
    "home.reseller.title": "🔥 Reseller Program Available",
    "home.reseller.copy": "Get wholesale pricing and grow your own print business.",
    "home.reseller.button": "Apply for Wholesale",
    "home.hero.title1": "Make your business",
    "home.hero.title2": "look professional",
    "home.hero.copy": "Signs, banners, T-shirts, bulk copies and marketing materials fabricated in Brooklyn, NY.",
    "home.badge.same": "Same day service available",
    "home.badge.wholesale": "Wholesale pricing",
    "home.badge.pickup": "Local pickup in Brooklyn",
    "home.badge.reseller": "Reseller program available",
    "home.hero.primary": "Start your order",
    "home.hero.secondary": "Get wholesale pricing",
    "home.hero.rating": "4.9/5 from 500+ customers",
    "home.signs.title": "Signs & Banners",
    "home.signs.copy": "High quality large format printing that gets you noticed.",
    "home.signs.button": "Design Banners Online",
    "home.tshirts.title": "Custom T-Shirts",
    "home.tshirts.copy": "Premium DTF printing for any event, business or organization.",
    "home.tshirts.button": "Design Your Shirts",
    "home.copiesCard.title": "Bulk Copies",
    "home.copiesCard.copy": "Fast, affordable copies for your business or organization.",
    "home.copiesCard.button": "Upload Files & Order",
    "home.websitesCard.title": "Websites & AI Automation",
    "home.websitesCard.copy": "Professional websites that help your business grow.",
    "home.websitesCard.item1": "Business Websites",
    "home.websitesCard.item2": "Online Forms",
    "home.websitesCard.item3": "AI Chatbots",
    "home.websitesCard.item4": "Appointment Scheduling",
    "home.websitesCard.item5": "Customer Portals",
    "home.websitesCard.item6": "CRM Systems",
    "home.websitesCard.button": "Build Your Website",
    "home.products.title": "Print Products",
    "home.products.viewAll": "View All",
    "home.why.title": "Why local businesses choose Next Print NY",
    "home.why.fast": "Fast Turnaround",
    "home.why.fastText": "Most orders ready in 24-48 hours.",
    "home.why.wholesale": "Wholesale Prices",
    "home.why.wholesaleText": "Save more with our reseller program.",
    "home.why.minimum": "No Minimum Orders",
    "home.why.minimumText": "Order only what you need.",
    "home.why.pickup": "Local Pickup",
    "home.why.pickupText": "Convenient pickup in Brooklyn, NY.",
    "home.why.ai": "AI Assistant 24/7",
    "home.why.aiText": "Get answers and support anytime.",
    "home.why.human": "Real Human Support",
    "home.why.humanText": "We are here to help you succeed.",
    "home.memberships.title": "Monthly Copy Memberships",
    "home.memberships.copy": "Perfect for churches, schools, offices, contractors and more.",
    "home.memberships.customTitle": "Need something custom?",
    "home.memberships.customCopy": "Contact us for custom volumes and pricing for your business.",
    "home.memberships.quote": "Request a Quote",
    "home.resellerPanel.title": "Reseller Program",
    "home.resellerPanel.headline": "You sell. We print.",
    "home.resellerPanel.copy": "Start your own printing business without buying equipment.",
    "home.resellerPanel.button": "Apply for Wholesale Account",
    "home.viewServices": "View Services",
    "home.printing.title": "Printing",
    "home.printing.item1": "Business Cards",
    "home.printing.item2": "Flyers & Brochures",
    "home.printing.item3": "Banners & Signs",
    "home.printing.item4": "Backdrops",
    "home.printing.item5": "Car Wraps",
    "home.printing.item6": "T-Shirts & More",
    "home.multi.title": "Multiservices",
    "home.multi.item1": "EZ Pass Setup",
    "home.multi.item2": "LLC Formation",
    "home.multi.item3": "DMV Assistance",
    "home.multi.item4": "Ticket Payments",
    "home.multi.item5": "Notary Services",
    "home.multi.item6": "Permit Renewals",
    "home.multi.item7": "And More...",
    "home.consulting.title": "Consulting Agent",
    "home.consulting.item1": "Business Consulting",
    "home.consulting.item2": "Growth Strategies",
    "home.consulting.item3": "AI Automation",
    "home.consulting.item4": "Digital Marketing",
    "home.consulting.item5": "Business Plans",
    "home.consulting.item6": "Customized Solutions",
    "home.feature.fast": "Fast Response",
    "home.feature.fastText": "Quotes in minutes",
    "home.feature.secure": "100% Secure",
    "home.feature.secureText": "Your data is protected",
    "home.feature.tech": "Technology & AI",
    "home.feature.techText": "Smart solutions 24/7",
    "home.feature.ecuador": "Proudly Ecuadorian",
    "home.feature.ecuadorText": "We speak your language",
    "home.upload.formats": "PDF, JPG, PNG (Max. 4MB each)",
    "home.upload.title": "Upload your documents",
    "home.upload.copy": "Share your files securely",
    "home.upload.safe": "Safe & Secure",
    "home.upload.safeText": "Your privacy is our priority",
    "home.upload.fast": "Fast Processing",
    "home.upload.fastText": "We handle your documents quickly",
    "home.upload.easy": "Easy & Convenient",
    "home.upload.easyText": "Upload from any device, anytime",
    "home.upload.notesPlaceholder": "Notes: what do you need?",
    "home.chat.title": "AI Chat Assistant",
    "home.chat.online": "Online 24/7",
    "home.chat.copy": "Get answers, recommendations and personalized help 24/7.",
    "home.chat.button": "Chat Now",
    "home.chat.powered": "Powered by Next Print AI",
    "home.shirts.title": "Order your printed shirts here",
    "home.shirts.copy": "Choose colors, sizes and quantities, then design your shirt online.",
    "home.shirts.button": "Start your order",
    "home.trust.kicker": "Trusted by local businesses",
    "home.trust.title": "What Our Customers Say",
    "home.review.one": "\"Fast service and great quality.\"",
    "home.review.two": "\"Best prices in Brooklyn.\"",
    "home.founder.kicker": "Meet Richard Velez",
    "home.founder.title": "Founder of Next Print NY",
    "home.founder.copy": "Over 20 years of experience in printing and customer service. We help businesses look professional and grow.",
    "home.visit.title": "Visit Us",
    "home.visit.week": "Mon - Sat:",
    "home.visit.sunday": "Sunday:",
    "home.visit.closed": "Closed",
    "home.visit.maps": "View on Google Maps",
    "home.visit.directions": "Get Directions",
    "home.contact.title": "Contact Us",
    "home.contact.follow": "Follow Us",
    "home.mini.payments": "Online Payments",
    "home.mini.paymentsText": "Secure payments",
    "home.mini.signature": "Digital Signature",
    "home.mini.signatureText": "Documents online",
    "home.mini.tracking": "Real-Time Tracking",
    "home.mini.trackingText": "Track your requests",
    "home.mini.alerts": "Email & SMS Alerts",
    "home.mini.alertsText": "Updates instantly",
    "home.mini.support": "Multilingual Support",
    "home.mini.supportText": "We speak your language",
    "home.footer.rights": "© 2026 Next Print NY. All rights reserved.",
    "home.footer.privacy": "Privacy Policy",
    "home.footer.terms": "Terms of Service",
    "printingPage.breadcrumb": "Home > Print Products",
    "printingPage.kicker": "Business printing",
    "printingPage.heroTitleTop": "Print Products",
    "printingPage.heroTitleBottom": "Made To Impress",
    "printingPage.heroCopy":
      "Business cards, flyers, menus, stickers and marketing prints prepared with clean color, sharp details and fast local service in Brooklyn.",
    "printingPage.benefit1Title": "Premium Cardstock",
    "printingPage.benefit1Text": "Glossy or matte finish",
    "printingPage.benefit2Title": "Flyers & Menus",
    "printingPage.benefit2Text": "Promote events fast",
    "printingPage.benefit3Title": "Sharp Full Color",
    "printingPage.benefit3Text": "Clean brand presentation",
    "printingPage.benefit4Title": "Local Turnaround",
    "printingPage.benefit4Text": "Brooklyn pickup available",
    "printingPage.quote": "Choose product",
    "printingPage.upload": "Request a quote",
    "printingPage.rating": "Trusted by local businesses and event teams",
    "printingPage.perfectFor": "Perfect for",
    "printingPage.sectionKicker": "What we print",
    "printingPage.sectionTitle": "Business, event and everyday printing",
    "printingPage.card1Title": "Business Materials",
    "printingPage.card1Item1": "Business cards",
    "printingPage.card1Item2": "Flyers and brochures",
    "printingPage.card1Item3": "Postcards and menus",
    "printingPage.card1Item4": "Invoices and forms",
    "printingPage.card2Title": "Signs and Display",
    "printingPage.card2Item1": "Banners and posters",
    "printingPage.card2Item2": "Backdrops",
    "printingPage.card2Item3": "Yard signs",
    "printingPage.card2Item4": "Car signs and lettering",
    "printingPage.card3Title": "Custom Products",
    "printingPage.card3Item1": "Stickers and labels",
    "printingPage.card3Item2": "T-shirts",
    "printingPage.card3Item3": "Embroidery coordination",
    "printingPage.card3Item4": "Special print requests",
    "printingPage.step1": "Send your file or idea",
    "printingPage.step2": "Confirm size, quantity and finish",
    "printingPage.step3": "Approve and print",
    "printingPage.step4": "Pick up or coordinate delivery",
    "printingPage.ctaTitle": "Need a price?",
    "printingPage.ctaCopy": "Send quantity, size, material, colors and deadline so we can quote it correctly.",
    "printingPage.ctaButton": "Contact Next Print NY",
    "printingCatalog.products": "Products",
    "printingCatalog.copy": "Select a product and quantity to see the suggested sale price. Start an order and we will confirm details before production.",
    "printingCatalog.size": "Size",
    "printingCatalog.rounded": "Rounded Corners",
    "printingCatalog.no": "No",
    "printingCatalog.yes": "Yes",
    "printingCatalog.printedSide": "Printed Side",
    "printingCatalog.frontOnly": "Front Only",
    "printingCatalog.frontBack": "Front and Back",
    "printingCatalog.paperType": "Paper Type",
    "printingCatalog.coating": "Coating",
    "printingCatalog.highGloss": "High Gloss",
    "printingCatalog.matte": "Matte",
    "printingCatalog.frontSide": "Front Side",
    "printingCatalog.backSide": "Back Side",
    "printingCatalog.fullColor": "Full Color",
    "printingCatalog.noPrinting": "No Printing",
    "printingCatalog.material": "Material",
    "printingCatalog.outdoorVinyl": "High Gloss White Outdoor Vinyl",
    "printingCatalog.paperStock": "Paper Stock",
    "printingCatalog.glossBothSides": "Gloss Both Sides",
    "printingCatalog.folding": "Folding Option",
    "printingCatalog.halfFold": "Half Fold",
    "printingCatalog.triFold": "Tri-Fold",
    "printingCatalog.zFold": "Z-Fold",
    "printingCatalog.gateFold": "Gate Fold",
    "printingCatalog.frenchFold": "French Fold",
    "printingCatalog.doubleParallelFold": "Double Parallel Fold",
    "printingCatalog.parallelMapFold": "Parallel Map Fold",
    "printingCatalog.treatments": "Treatments",
    "printingCatalog.none": "None",
    "printingCatalog.hemGrommets": "Hem with Grommets",
    "printingCatalog.hemNoGrommets": "Hem without Grommets",
    "printingCatalog.polePockets": "Pole Pockets",
    "printingCatalog.highGlossUv": "High Gloss UV",
    "printingCatalog.displayOptions": "Display Options",
    "printingCatalog.bannerStand": "Banner Stand",
    "printingCatalog.singleSidedStand": "Stand + 1 Banner (Single Sided)",
    "printingCatalog.standardRetractable": "Standard Retractable 33 inches",
    "printingCatalog.smoothBlockoutVinyl": "13 oz. Smooth Blockout Vinyl",
    "printingCatalog.panels": "Panels",
    "printingCatalog.onePanel": "1 Panel",
    "printingCatalog.coroplastBoard": "4 mm Coroplast Board",
    "printingCatalog.hWire": "H-Wire",
    "printingCatalog.xlHWire": "XL 9 Gauge H-Wire (24 inches tall x 10 inches wide)",
    "printingCatalog.grommets": "Grommets",
    "printingCatalog.quantity": "Quantity",
    "printingCatalog.suggested": "Suggested sale price",
    "printingCatalog.start": "Start order with this product",
    "multiPage.kicker": "Multiservices Desk",
    "multiPage.heroTitle": "One place for the errands that slow your day down.",
    "multiPage.heroCopy":
      "We help with practical paperwork, payments, forms, translations and service requests so customers can move faster and avoid confusion.",
    "multiPage.help": "Ask for help",
    "multiPage.sectionKicker": "How we help",
    "multiPage.sectionTitle": "Daily services for busy people and businesses",
    "multiPage.card1Title": "DMV and E-ZPass",
    "multiPage.card1Item1": "DMV forms and assistance",
    "multiPage.card1Item2": "E-ZPass registration support",
    "multiPage.card1Item3": "Permit renewal guidance",
    "multiPage.card1Item4": "General transportation forms",
    "multiPage.card2Title": "Payments and Tickets",
    "multiPage.card2Item1": "Bill payment assistance",
    "multiPage.card2Item2": "Traffic ticket support",
    "multiPage.card2Item3": "Parking ticket support",
    "multiPage.card2Item4": "Receipt organization",
    "multiPage.card3Title": "Documents",
    "multiPage.card3Item1": "English-Spanish translations",
    "multiPage.card3Item2": "Administrative forms",
    "multiPage.card3Item3": "Notary referrals",
    "multiPage.card3Item4": "Document preparation support",
    "multiPage.step1": "Tell us what you need",
    "multiPage.step2": "Bring or upload documents",
    "multiPage.step3": "We review the details",
    "multiPage.step4": "You approve the next step",
    "multiPage.ctaTitle": "Bring the paperwork. We help organize the next step.",
    "multiPage.ctaCopy":
      "For legal, immigration or financial matters, we help prepare and coordinate but do not promise outcomes.",
    "multiPage.ctaButton": "Start a request",
    "consultingPage.kicker": "Consulting Agent",
    "consultingPage.heroTitle": "Guidance for business moves, paperwork and growth.",
    "consultingPage.heroCopy":
      "We help entrepreneurs and families organize business formation, planning, automation, marketing and document workflows with practical, bilingual support.",
    "consultingPage.book": "Book a consultation",
    "consultingPage.ai": "Ask the AI assistant",
    "consultingPage.sectionKicker": "Business support",
    "consultingPage.sectionTitle": "From idea to organized operation",
    "consultingPage.card1Title": "Business Setup",
    "consultingPage.card1Item1": "LLC, S-Corp and corporation guidance",
    "consultingPage.card1Item2": "EIN and business registration support",
    "consultingPage.card1Item3": "Business plans",
    "consultingPage.card1Item4": "Document preparation",
    "consultingPage.card2Title": "Growth and Marketing",
    "consultingPage.card2Item1": "Growth strategies",
    "consultingPage.card2Item2": "Digital marketing direction",
    "consultingPage.card2Item3": "Brand and print coordination",
    "consultingPage.card2Item4": "Customer communication ideas",
    "consultingPage.card3Title": "Automation and Coordination",
    "consultingPage.card3Item1": "AI automation planning",
    "consultingPage.card3Item2": "Workflow organization",
    "consultingPage.card3Item3": "Attorney coordination",
    "consultingPage.card3Item4": "Insurance and finance referrals",
    "consultingPage.step1": "Share the goal",
    "consultingPage.step2": "Review documents and needs",
    "consultingPage.step3": "Build the action list",
    "consultingPage.step4": "Coordinate next steps",
    "consultingPage.ctaTitle": "Need help making the business more organized?",
    "consultingPage.ctaCopy": "We can help you map the next step and connect the services your business needs.",
    "consultingPage.ctaButton": "Talk to us",
    "order.nav": "Start Order",
    "order.homeTitle": "Order your printing products",
    "order.homeCopy": "Choose Business Cards, Flyers, Stickers, Banners, Menus or Door Hangers, review quantity and price, and send your order.",
    "order.printingButton": "Start Printing Order",
    "order.kicker": "Fast online request",
    "order.title": "Start your printing order.",
    "order.copy": "Confirm your printing product, add details, upload your files and receive an order number for follow-up.",
    "order.whatsapp": "WhatsApp",
    "order.stepService": "Service",
    "order.stepDetails": "Details",
    "order.stepFile": "File",
    "order.stepContact": "Contact",
    "order.serviceTitle": "What do you need?",
    "order.servicePrinting": "Printing",
    "order.serviceMulti": "Multiservices",
    "order.serviceConsulting": "Consulting Agent",
    "order.detailsTitle": "Printing details",
    "order.detailsLabel": "Tell us what you need",
    "order.detailsPlaceholder": "Example: 500 business cards, full color, matte finish, needed Friday.",
    "order.dueDate": "Delivery date",
    "order.orderDate": "Order date",
    "order.deliveryDate": "Delivery date",
    "order.budget": "Price",
    "order.budgetPlaceholder": "Optional",
    "order.fileTitle": "Upload file",
    "order.fileButton": "Choose file",
    "order.fileHint": "PDF, JPG, PNG or design files. Optional.",
    "order.contactTitle": "Contact information",
    "order.submit": "Send order",
    "order.successKicker": "Order received",
    "order.successTitle": "We received your request.",
    "order.successCopy": "Your order number is",
    "order.whatsappFollow": "Follow up on WhatsApp",
    "order.track": "Track order",
    "payment.kicker": "Secure payment",
    "payment.title": "Online checkout",
    "payment.copy": "Use your order number to open checkout after we confirm your total.",
    "payment.orderNumber": "Order number",
    "payment.copyOrder": "Copy order number",
    "payment.payButton": "Open checkout",
    "payment.pageTitle": "Secure Online Checkout",
    "payment.pageCopy": "Enter or confirm your order number to open the secure checkout once your total is ready.",
    "payment.checkoutStatus": "Checkout status",
    "payment.checkoutPending": "PayPal checkout ready",
    "payment.step1": "Confirm the total with Next Print NY.",
    "payment.step2": "Open the secure checkout link for your order.",
    "payment.step3": "Complete payment online.",
    "payment.step4": "When payment is confirmed, your order status updates to Payment received.",
    "tracking.nav": "Track Order",
    "tracking.kicker": "Order tracking",
    "tracking.title": "Check your order status.",
    "tracking.copy": "Enter your order number to see the latest status and next step.",
    "tracking.label": "Order number",
    "tracking.placeholder": "NP-260603-123456",
    "tracking.button": "Track order",
    "tracking.resultKicker": "Current status",
    "tracking.customer": "Customer",
    "tracking.updated": "Last updated",
    "tracking.amount": "Amount due",
    "tracking.status.new": "Received",
    "tracking.status.in_progress": "In review",
    "tracking.status.waiting": "Waiting",
    "tracking.status.paid": "Payment received",
    "tracking.status.completed": "Completed",
    "tracking.whatsapp": "Ask on WhatsApp",
    "quick.call": "Call",
    "floatingWhatsapp.title": "Need something custom?",
    "floatingWhatsapp.copy": "Message me on WhatsApp. Prices may vary by project.",
    "floatingWhatsapp.note": "Text messages only. I respond quickly.",
    "floatingWhatsapp.button": "Message Me",
    "floatingWhatsapp.close": "Close WhatsApp assistance",
    "floatingWhatsapp.open": "Open WhatsApp assistance",
    "quick.whatsapp": "WhatsApp",
    "quick.order": "Order",
    "quick.track": "Track",
  },
};

const fallbackAnswers = {
  es: [
    {
      keywords: ["precio", "cotizacion", "cotización", "quote"],
      answer:
        "Para una cotización rápida, dime el servicio, cantidad, tamaño, material y fecha que lo necesitas. También puedes llamar al 239 333 7935.",
    },
    {
      keywords: ["dmv", "ezpass", "e-zpass", "ticket"],
      answer:
        "Podemos ayudarte con formularios del DMV, E-ZPass y pagos de tickets. Visítanos en 1510 Gates Ave, Brooklyn, NY 11237 o llama al 239 333 7935.",
    },
    {
      keywords: ["traduccion", "traducción", "translate", "english", "español"],
      answer:
        "Ofrecemos asistencia con traducciones inglés - español. Cuéntame qué documento tienes y para cuándo lo necesitas.",
    },
    {
      keywords: ["tarjeta", "volante", "banner", "camiseta", "sticker", "impresion", "impresión"],
      answer:
        "Hacemos tarjetas, volantes, banners, stickers, letreros, camisetas, bordados y más. Para cotizar, comparte cantidad, tamaño y fecha de entrega.",
    },
  ],
  en: [
    {
      keywords: ["price", "quote", "estimate", "cost", "cotizacion", "cotización"],
      answer:
        "For a quick quote, tell me the service, quantity, size, material and deadline. You can also call 239 333 7935.",
    },
    {
      keywords: ["dmv", "ezpass", "e-zpass", "ticket"],
      answer:
        "We can help with DMV forms, E-ZPass and ticket payments. Visit us at 1510 Gates Ave, Brooklyn, NY 11237 or call 239 333 7935.",
    },
    {
      keywords: ["translation", "translate", "english", "spanish", "español"],
      answer:
        "We offer English - Spanish translation assistance. Tell me what document you have and when you need it.",
    },
    {
      keywords: ["card", "flyer", "banner", "shirt", "sticker", "print", "printing"],
      answer:
        "We print business cards, flyers, banners, stickers, signs, shirts, embroidery and more. For a quote, share quantity, size and delivery date.",
    },
  ],
};

let currentLanguage = localStorage.getItem("preferredLanguage") || "en";
let customerMemory = loadCustomerMemory();
let conversationHistory = loadConversationHistory();

/* Presentation-only copy for pages that predate data-i18n attributes. */
const presentationTranslations = {
  es: {
    "Printing Made Simple.": "Imprimir nunca fue tan fácil.",
    "Professional printing, signs and apparel for New York businesses.": "Impresión profesional, letreros y ropa para negocios de Nueva York.",
    "Trusted by 500+ Business Owners": "La confianza de más de 500 negocios",
    "Wholesale Pricing": "Precios mayoristas", "Save Hundreds Every Year": "Ahorra cientos cada año", "One-Click Reordering": "Reordenar con un clic", "Store Your Designs Forever": "Guarda tus diseños para siempre",
    "Join Membership": "Únete a la membresía", "Order Without Membership": "Ordenar sin membresía", "Starting at only": "Desde solo", "/month": "/mes", "Cancel anytime.": "Cancela cuando quieras.", "No contract.": "Sin contrato.",
    "Exclusive Member Pricing": "Precios exclusivos para miembros", "Special prices on all eligible products.": "Precios especiales en productos elegibles.", "Professional Online Editors": "Editores profesionales en línea", "Powerful tools included with your membership.": "Herramientas potentes incluidas con tu membresía.", "Free Shipping Fast Coast Orders*": "Envío gratis en pedidos de la Costa Este*", "On eligible products.": "En productos elegibles.", "Store & Organize Your Files": "Guarda y organiza tus archivos", "Access your designs anytime, anywhere.": "Accede a tus diseños en cualquier momento.", "One Membership. Unlimited Savings.": "Una membresía. Ahorros ilimitados.", "More savings. More growth.": "Más ahorro. Más crecimiento.",
    "Signs & Banners": "Letreros y banners", "High quality large format printing that gets you noticed.": "Impresión de gran formato de alta calidad para destacar.", "Yard Signs": "Letreros de jardín", "Banners": "Banners", "Backdrops": "Fondos", "Retractable Banners": "Banners retráctiles", "Design Banners Online": "Diseña banners en línea", "Custom T-Shirts": "Camisetas personalizadas", "Design Your Shirts": "Diseña tus camisetas", "Everything You Can Print": "Todo lo que puedes imprimir", "Upload Files & Order": "Sube archivos y ordena",
    "Print Products": "Productos impresos", "Made To Impress": "que impresionan", "High quality printing for your business or personal needs.": "Impresión de alta calidad para tu negocio o necesidades personales.", "Business Cards": "Tarjetas de presentación", "Flyers": "Volantes", "Stickers & Labels": "Stickers y etiquetas", "Posters": "Pósteres", "Door Hangers": "Colgadores de puerta", "View All Print Products": "Ver todos los productos impresos",
    "Print Products Made To Impress": "Productos impresos que impresionan", "Shop by Category": "Comprar por categoría", "Choose Product": "Elegir producto", "Choose product": "Elegir producto", "Member Price": "Precio de miembro", "Regular price": "Precio regular", "Free Shipping": "Envío gratis", "Shipping": "Envío", "Calculated at checkout": "Calculado al finalizar la compra",
    "No print product selected": "No se seleccionó un producto impreso", "Please choose a print product first.": "Primero elige un producto impreso.", "Selected Product": "Producto seleccionado", "Choose Options": "Elige opciones", "Design Online": "Diseñar en línea", "Checkout": "Finalizar compra", "Print & Delivery": "Impresión y entrega", "Premium Quality": "Calidad premium", "Your total": "Tu total", "Upload print-ready file": "Sube un archivo listo para imprimir", "Choose file": "Elegir archivo", "No file selected": "Ningún archivo seleccionado", "Continue to Checkout": "Continuar al pago", "Order date": "Fecha del pedido", "Delivery date": "Fecha de entrega", "Total today": "Total de hoy",
    "Finish your print order": "Finaliza tu pedido de impresión", "Confirm your contact and delivery details, then pay securely with card, wallet, or PayPal.": "Confirma tus datos de contacto y envío; después paga de forma segura con PayPal.", "No print product design found": "No se encontró un diseño de producto impreso", "Please design or choose a print product first.": "Primero diseña o elige un producto impreso.", "Track order": "Rastrear pedido", "Start another print order": "Iniciar otro pedido de impresión", "Customer information": "Información del cliente", "Delivery option": "Opción de envío", "Standard Shipping": "Envío estándar", "Express Shipping": "Envío exprés", "Calculated by weight": "Calculado por peso", "Faster delivery + extra charge": "Entrega más rápida + cargo adicional", "Street address": "Dirección", "Apt / Suite": "Apartamento / Suite", "City": "Ciudad", "State": "Estado", "ZIP code": "Código postal", "Full name": "Nombre completo", "Subtotal": "Subtotal", "Tax": "Impuesto", "Total due today": "Total a pagar hoy", "Product": "Producto", "Size": "Tamaño", "Quantity": "Cantidad", "Sides": "Lados", "Pay with PayPal": "Pagar con PayPal", "Use PayPal checkout if you prefer PayPal.": "Usa PayPal si lo prefieres.", "Preparing checkout...": "Preparando el pago...", "Could not prepare checkout. Please try again.": "No se pudo preparar el pago. Inténtalo de nuevo.",
    "Quick Links": "Enlaces rápidos", "Main Site": "Sitio principal", "Banner Designer": "Diseñador de banners", "Contact Us": "Contáctanos", "Services": "Servicios", "Vinyl Banners": "Banners de vinilo", "Decals & Stickers": "Calcomanías y stickers", "Printing & Copies": "Impresión y copias", "Contact": "Contacto", "Why Next Print NY?": "¿Por qué Next Print NY?", "High Quality Printing": "Impresión de alta calidad", "Fast Turnaround": "Entrega rápida", "Competitive Pricing": "Precios competitivos", "Excellent Customer Service": "Excelente servicio al cliente", "Proudly Ecuadorian-Owned": "Orgullosamente ecuatoriano", "Printing, Signs, Banners & Custom Design Solutions for your business, events and brand.": "Impresión, letreros, banners y soluciones de diseño para tu negocio, eventos y marca."
  }
};
Object.assign(translations.en, Object.fromEntries(Object.keys(presentationTranslations.es).map((key) => [key, key])));
Object.assign(translations.es, presentationTranslations.es);
const salesFlowResidualCopy = {
  "Premium DTF printing for any event, business or organization.": "Impresión DTF premium para cualquier evento, negocio u organización.",
  "Business Uniforms": "Uniformes de negocio", "Team & Sports Apparel": "Ropa para equipos y deportes", "Custom Transfers": "Transferencias personalizadas",
  "Fast, affordable printing for your business or personal needs.": "Impresión rápida y económica para tu negocio o necesidades personales.", "Flyers & Menus": "Volantes y menús", "Posters & Door Hangers": "Pósteres y colgadores de puerta",
  "Premium cards that leave a lasting impression.": "Tarjetas premium que dejan una impresión duradera.", "Eye-catching flyers to promote your business.": "Volantes atractivos para promocionar tu negocio.", "Custom stickers and labels for every need.": "Stickers y etiquetas personalizadas para cada necesidad.", "Professional invoices and forms to keep you organized.": "Facturas y formularios profesionales para mantenerte organizado.", "High quality tickets for events, raffles and more.": "Boletos de alta calidad para eventos, rifas y más.", "Vibrant posters to grab attention anywhere.": "Pósteres vibrantes que atraen miradas en cualquier lugar.", "Custom door hangers that get noticed.": "Colgadores de puerta personalizados que destacan.",
  "Best Value": "Mejor valor", "JOIN NEXT PRINT NY MEMBERSHIP": "ÚNETE A LA MEMBRESÍA DE NEXT PRINT NY", "Save hundreds every year with exclusive member pricing.": "Ahorra cientos cada año con precios exclusivos para miembros.", "Happy Members": "Miembros satisfechos", "UNLOCK MEMBER BENEFITS": "DESBLOQUEA BENEFICIOS DE MEMBRESÍA", "More savings. More tools. More growth for your business.": "Más ahorro. Más herramientas. Más crecimiento para tu negocio.", "Use advanced tools to create stunning designs.": "Usa herramientas avanzadas para crear diseños increíbles.", "Reorder 1 Click": "Reordenar con un clic", "Reorder your favorite items in just one click.": "Reordena tus artículos favoritos con un solo clic.", "Get special member-only prices on all products.": "Obtén precios exclusivos para miembros en todos los productos.", "Order History & Tracking": "Historial y seguimiento de pedidos", "View your order history and track every step.": "Ve tu historial y sigue cada paso.", "Permanent Design Storage": "Almacenamiento permanente de diseños", "Save and access your project anytime.": "Guarda y accede a tu proyecto en cualquier momento.", "Artwork & File Library": "Biblioteca de arte y archivos", "Store and organize your artwork securely.": "Guarda y organiza tu arte de forma segura.", "New": "Nuevo", "AI Design Assistant": "Asistente de diseño con IA", "Get design ideas, resize and enhance your projects with AI.": "Obtén ideas, redimensiona y mejora tus proyectos con IA.",
  "Same Day Printing": "Impresión el mismo día", "Most orders ready in 2-4 hours.": "La mayoría de los pedidos están listos en 2-4 horas.", "Wholesale Prices": "Precios mayoristas", "Save more with our reseller program.": "Ahorra más con nuestro programa de revendedores.", "No Minimum Orders": "Sin pedidos mínimos", "Order only what you need.": "Ordena solo lo que necesitas.", "Local Pickup": "Recogida local", "Convenient pickup in Brooklyn, NY.": "Recogida conveniente en Brooklyn, NY.", "AI Assistant 24/7": "Asistente de IA 24/7", "Get answers and support anytime.": "Obtén respuestas y ayuda en cualquier momento.", "Real Human Support": "Soporte humano real", "We are here to help you succeed.": "Estamos aquí para ayudarte a tener éxito.",
  "Excellent quality and super fast service. They always deliver on time!": "Excelente calidad y servicio muy rápido. Siempre entregan a tiempo.", "Best printing service in Brooklyn. The membership saves me a lot!": "El mejor servicio de impresión en Brooklyn. ¡La membresía me ahorra mucho!", "Amazing customer service and high quality work every time.": "Increíble servicio al cliente y trabajo de alta calidad siempre.", "reviews on Google": "reseñas en Google",
  "High quality printing for your business, events and everyday needs. Choose a product below to get started.": "Impresión de alta calidad para tu negocio, eventos y necesidades diarias. Elige un producto para comenzar.", "Top materials": "Materiales de primera", "Get it when you need it": "Listo cuando lo necesitas", "Save more with membership": "Ahorra más con la membresía", "Start Your Order": "Comienza tu pedido", "Upload Your File": "Sube tu archivo", "Trusted by businesses in NY": "La confianza de negocios en NY"
};
Object.assign(translations.en, Object.fromEntries(Object.keys(salesFlowResidualCopy).map((key) => [key, key])));
Object.assign(translations.es, salesFlowResidualCopy);
/*
 * Presentation labels for the print-product configurator.  The configurator
 * deliberately keeps these English source strings as its internal option
 * values, because they are serialized into the existing order payload.  This
 * map is used only for text shown to the customer.
 */
const printUploadOptionLabels = {
  "Product": "Producto", "Size": "Tamaño", "Quantity": "Cantidad",
  "Rounded Corners": "Esquinas redondeadas", "Printed Side": "Lado impreso",
  "Paper Stock": "Tipo de papel", "Paper Type": "Tipo de papel", "Coating": "Acabado",
  "Folding Option": "Opción de plegado", "Regular Customer Price": "Precio regular",
  "Member Price": "Precio de miembro", "Membership Savings": "Ahorro de membresía",
  "Display Options": "Opciones de exhibición", "Banner Stand": "Soporte para banner",
  "Front Side": "Lado frontal", "Back Side": "Lado posterior", "Material": "Material",
  "Panels": "Paneles", "H-Wire": "Soporte en H", "Grommets": "Ojales", "Treatment": "Tratamiento",
  "No": "No", "Yes": "Sí", "None": "Ninguno", "Front and Back": "Frente y reverso",
  "Front Only": "Solo frente", "Full Color": "A todo color", "No Printing": "Sin impresión",
  "High Gloss": "Brillo alto", "Matte": "Mate", "No Coating": "Sin acabado",
  "Tri-fold": "Tríptico", "Half-fold": "Doble pliegue", "No Fold": "Sin pliegue",
  "14 pt. Cardstock": "Cartulina de 14 pt", "Premium Sticker": "Sticker premium",
  "Premium Poster": "Póster premium", "Gloss Text": "Papel text brillante",
  "13 oz. Standard Vinyl": "Vinilo estándar de 13 oz", "13 oz. Smooth Blockout Vinyl": "Vinilo blockout liso de 13 oz",
  "4 mm Coroplast Board": "Cartón Coroplast de 4 mm", "Backdrop Material": "Material para fondo",
  "Stand + 1 Banner": "Soporte + 1 banner", "Standard Retractable": "Retráctil estándar",
  "1 Panel": "1 panel", 'XL 9 Gauge H-Wire (24" tall x 10" wide)': 'Soporte en H XL calibre 9 (24" alto x 10" ancho)',
  "Customize your": "Personaliza tu", "size options": "opciones de tamaño", "Selected size option": "Opción de tamaño seleccionada",
  "No file selected": "Ningún archivo seleccionado", "files selected": "archivos seleccionados",
  "Preparing checkout...": "Preparando el pago...", "Could not prepare checkout. Please try again.": "No se pudo preparar el pago. Inténtalo de nuevo.",
  "Please upload 6 files or fewer.": "Sube 6 archivos o menos.",
  "Files are too large together. Please keep the upload under 12MB.": "Los archivos juntos son demasiado grandes. Mantén la carga por debajo de 12 MB.",
  "is too large. Please keep each file under 6MB.": "es demasiado grande. Mantén cada archivo por debajo de 6 MB.",
  "Could not read": "No se pudo leer", "Ready in 3 business days. Member free shipping on eligible products in the East USA.": "Listo en 3 días hábiles. Envío gratis para miembros en productos elegibles del este de EE. UU.",
  "Ready in 3 business days. Shipping is calculated by size and delivery area.": "Listo en 3 días hábiles. El envío se calcula según el tamaño y el área de entrega.",
  "Make the first impression feel professional with sharp cards, premium finish, and fast local service.": "Da una primera impresión profesional con tarjetas nítidas, acabado premium y servicio local rápido.",
  "Promote events, specials, and services with full color flyers that are ready to share.": "Promociona eventos, ofertas y servicios con volantes a todo color listos para compartir.",
  "Custom stickers and labels for packaging, branding, giveaways, and daily business needs.": "Stickers y etiquetas personalizados para empaque, marca, regalos y necesidades diarias de tu negocio.",
  "Clean, full color menus for restaurants, takeout, cafes, and food service promotions.": "Menús limpios a todo color para restaurantes, comida para llevar, cafés y promociones de alimentos.",
  "Door hangers designed to get noticed in neighborhoods, buildings, and local campaigns.": "Colgadores de puerta diseñados para destacar en vecindarios, edificios y campañas locales.",
  "Vibrant posters for events, storefronts, promotions, announcements, and displays.": "Pósteres vibrantes para eventos, escaparates, promociones, anuncios y exhibiciones.",
  "Professional invoice and form printing for organized business paperwork.": "Impresión profesional de facturas y formularios para documentos empresariales organizados.",
  "Folded brochures with clear information, strong presentation, and premium color.": "Folletos plegados con información clara, presentación sólida y color premium.",
  "Large branded backdrops for events, photos, stages, pop-ups, and displays.": "Fondos de gran formato con marca para eventos, fotos, escenarios, pop-ups y exhibiciones.",
  "Large format printing for storefronts, events, promotions, and brand visibility.": "Impresión de gran formato para escaparates, eventos, promociones y visibilidad de marca.",
  "Durable yard signs for campaigns, real estate, events, and local advertising.": "Letreros de jardín duraderos para campañas, bienes raíces, eventos y publicidad local.",
  "Review your print order, compare member savings, and choose design online or file upload.": "Revisa tu pedido de impresión, compara los ahorros de membresía y elige diseño en línea o carga de archivo.",
  "Business Cards": "Tarjetas de presentación", "Flyers": "Volantes", "Stickers": "Stickers", "Menus": "Menús", "Banners": "Banners", "Backdrops": "Fondos", "Retractable Banners": "Banners retráctiles", "Yard Signs": "Letreros de jardín", "Door Hangers": "Colgadores de puerta", "Posters": "Pósteres", "Brochures": "Folletos", "Bookmarks": "Separadores",
};
Object.assign(translations.en, Object.fromEntries(Object.keys(printUploadOptionLabels).map((key) => [key, key])));
Object.assign(translations.es, printUploadOptionLabels);
/* Remaining visible sales-flow copy. This stays in the same central runtime
 * dictionary; it never changes product, option, order, or payment values. */
const salesFlowDomCopy = {
  "Invoices & Forms": "Facturas y formularios", "Tickets": "Boletos",
  "Join Next Print NY Membership": "Únete a la membresía de Next Print NY",
  "Unlock Member Benefits": "Desbloquea beneficios de membresía",
  "APLICAR PARA WHOLESALE": "SOLICITAR PRECIO MAYORISTA",
  "WHOLESALE": "MAYORISTA",
  "JOIN NEXT PRINT NY MEMBERSHIP": "ÚNETE A LA MEMBRESÍA DE NEXT PRINT NY",
  "★★★★★ 500+ Happy Members": "★★★★★ Más de 500 miembros satisfechos",
  "UNLOCK MEMBER BENEFITS": "DESBLOQUEA BENEFICIOS DE MEMBRESÍA",
  "500+ reviews on Google": "Más de 500 reseñas en Google",
  "T-Shirts & Apparel": "Camisetas y ropa",
  "INVOICES & FORMS": "FACTURAS Y FORMULARIOS", "TICKETS": "BOLETOS",
  "✔ High Quality Printing": "✔ Impresión de alta calidad", "✔ Fast Turnaround": "✔ Entrega rápida",
  "© 2026 Next Print NY. All Rights Reserved.": "© 2026 Next Print NY. Todos los derechos reservados.",
  "Home  ›  Print Products": "Inicio  ›  Productos impresos", "PRINT PRODUCTS": "PRODUCTOS IMPRESOS",
  "G ★★★★★ 4.9 (500+ reviews) La confianza de negocios en NY": "G ★★★★★ 4.9 (más de 500 reseñas) La confianza de negocios en NY",
  "Members Save More": "Los miembros ahorran más", "Exclusive pricing": "Precios exclusivos", "Free shipping": "Envío gratis", "Save your designs": "Guarda tus diseños",
  "Happy Customers": "Clientes satisfechos", "Google Reviews": "Reseñas de Google", "Orders Printed": "Pedidos impresos", "Satisfaction Guaranteed": "Satisfacción garantizada",
  "View All Products": "Ver todos los productos", "NEED A CUSTOM QUOTE?": "¿NECESITAS UNA COTIZACIÓN PERSONALIZADA?",
  "Bulk pricing, custom sizes and special requests available.": "Precios por volumen, tamaños personalizados y solicitudes especiales disponibles.", "REQUEST A QUOTE": "SOLICITAR COTIZACIÓN",
  "BECOME A NEXT PRINT MEMBER & SAVE BIG!": "¡HAZTE MIEMBRO DE NEXT PRINT Y AHORRA MÁS!", "Members save with exclusive pricing, free shipping on select products, priority support and easy reorders.": "Los miembros ahorran con precios exclusivos, envío gratis en productos seleccionados, soporte prioritario y reordenes fáciles.",
  "ONLY": "SOLO", "BECOME A MEMBER": "HAZTE MIEMBRO", "ON SELECT PRODUCTS": "EN PRODUCTOS SELECCIONADOS", "EAST COAST USA": "COSTA ESTE DE EE. UU.",
  "Applies to: Business Cards, Flyers, Stickers, Menus, Posters, Brochures and Door Hangers": "Aplica a: tarjetas de presentación, volantes, stickers, menús, pósteres, folletos y colgadores de puerta",
  "REGULAR PRICE": "PRECIO REGULAR", "SAVE": "AHORRA", "FREE SHIPPING": "ENVÍO GRATIS", "East Coast USA": "Costa Este de EE. UU.", "SHIPPING": "ENVÍO",
  "Beautiful menus that showcase your brand.": "Menús atractivos que muestran tu marca.", "Durable banners for any event or occasion.": "Banners duraderos para cualquier evento u ocasión.", "High quality signs to get noticed.": "Letreros de alta calidad para destacar.", "Portable, professional and easy to setup.": "Portátil, profesional y fácil de instalar.", "Custom printed apparel for any occasion.": "Ropa personalizada impresa para cualquier ocasión.", "Professional brochures that tell your story.": "Folletos profesionales que cuentan tu historia.", "Branded backgrounds for events, photos and displays.": "Fondos con tu marca para eventos, fotos y exhibiciones.",
  "Free Design Help": "Ayuda de diseño gratis", "Our team is here to help you succeed.": "Nuestro equipo está aquí para ayudarte a tener éxito.", "Shipping Available": "Envío disponible", "Shipping calculated by product size and destination.": "El envío se calcula según el tamaño del producto y el destino.", "Save more with reseller program.": "Ahorra más con el programa de revendedores.", "Secure Checkout": "Pago seguro", "Your payment information is safe.": "Tu información de pago está segura.", "Save More with Membership": "Ahorra más con la membresía", "Access exclusive member pricing, save your designs, reorder in one click and more.": "Accede a precios exclusivos de miembro, guarda tus diseños, reordena con un clic y más.", "What Our Customers Say": "Lo que dicen nuestros clientes", "500+ Google Reviews": "Más de 500 reseñas de Google",
  "🔥 RESELLER PROGRAM AVAILABLE": "🔥 PROGRAMA DE REVENDEDORES DISPONIBLE", "Get wholesale pricing and grow your own print business.": "Obtén precios al por mayor y haz crecer tu propio negocio de impresión.", "APPLY FOR RESELLER": "SOLICITAR COMO REVENDEDOR", "HOME": "INICIO", "TRACK ORDER": "RASTREAR ORDEN", "ABOUT US": "NOSOTROS", "Home": "Inicio",
  "1 Choose Options": "1 Elige opciones", "2 Design Online": "2 Diseña en línea", "3 Checkout": "3 Finalizar compra", "4 Print & Delivery": "4 Impresión y entrega", "Ready when you need it": "Listo cuando lo necesitas", "Member Pricing": "Precios de miembro", "Save every order": "Ahorra en cada pedido", "RETAIL PRICE": "PRECIO REGULAR", "YOU SAVE": "TÚ AHORRAS", "Unlock exclusive pricing and save more with membership.": "Desbloquea precios exclusivos y ahorra más con la membresía.", "CUSTOMIZE YOUR ORDER": "PERSONALIZA TU PEDIDO", "These choices came from the product page. Price updates automatically from the selected product and quantity.": "Estas opciones vienen de la página del producto. El precio se actualiza automáticamente según el producto y la cantidad seleccionados.",
  "Order date": "Fecha del pedido", "Delivery date": "Fecha de entrega", "Total today": "Total de hoy", "↻ PRICE AND MEMBERSHIP SAVINGS UPDATE FROM YOUR SELECTED PRODUCT OPTIONS.": "↻ EL PRECIO Y EL AHORRO DE MEMBRESÍA SE ACTUALIZAN SEGÚN LAS OPCIONES SELECCIONADAS.", "PDF, JPG, PNG, AI, PSD, EPS, SVG, or ZIP files accepted.": "Se aceptan archivos PDF, JPG, PNG, AI, PSD, EPS, SVG o ZIP.", "Secure checkout. PayPal, cards, and shipping options continue on the next page.": "Pago seguro. PayPal y las opciones de envío continúan en la siguiente página.", "Members save more": "Los miembros ahorran más", "Join Next Print NY Membership and save on every reorder.": "Únete a la membresía de Next Print NY y ahorra en cada reorden.", "WITHOUT MEMBERSHIP": "SIN MEMBRESÍA", "WITH MEMBERSHIP": "CON MEMBRESÍA", "Price": "Precio", "File Upload": "Carga de archivo", "Upload every time": "Sube cada vez", "Saved for reorder": "Guardado para reordenar", "Design Storage": "Almacenamiento de diseños", "Not available": "No disponible", "Unlimited storage": "Almacenamiento ilimitado", "Exclusive Discounts": "Descuentos exclusivos", "Standard process": "Proceso estándar", "Member-only pricing": "Precios exclusivos para miembros", "Exclusive pricing, saved designs, faster reorders, and priority support.": "Precios exclusivos, diseños guardados, reordenes más rápidas y soporte prioritario.", "Most orders ready fast.": "La mayoría de los pedidos están listos rápidamente.", "Save more with membership.": "Ahorra más con la membresía.", "Your information is safe.": "Tu información está segura.", "Your one-stop shop for printing, websites, and marketing solutions in Brooklyn, NY.": "Tu tienda integral de impresión y soluciones de marketing en Brooklyn, NY.", "✔ Member Pricing": "✔ Precios de miembro",
  "SECURE PRINT PRODUCTS CHECKOUT": "PAGO SEGURO DE PRODUCTOS IMPRESOS", "PROUDLY ECUADORIAN-OWNED": "ORGULLOSAMENTE ECUATORIANO", "🕘 Mon - Sat: 9AM - 7PM": "🕘 Lun - sáb: 9 a. m. - 7 p. m."
  ,"NEED A CUSTOM QUOTE?": "¿NECESITAS UNA COTIZACIÓN PERSONALIZADA?", "REQUEST A QUOTE": "SOLICITAR COTIZACIÓN", "BECOME A NEXT PRINT MEMBER & SAVE BIG!": "¡HAZTE MIEMBRO DE NEXT PRINT Y AHORRA MÁS!", "ONLY": "SOLO", "BECOME A MEMBER": "HAZTE MIEMBRO", "ON SELECT PRODUCTS": "EN PRODUCTOS SELECCIONADOS", "SAVE": "AHORRA", "FREE SHIPPING": "ENVÍO GRATIS", "SHIPPING": "ENVÍO", "Need a custom quote?": "¿Necesitas una cotización personalizada?", "Request a Quote": "Solicitar cotización", "Become a Next Print Member & Save Big!": "¡Hazte miembro de Next Print y ahorra más!", "Become a Member": "Hazte miembro", "On select products": "En productos seleccionados", "Search products": "Buscar productos", "Lowest Price": "Precio más bajo", "Save": "Ahorra", "Vibrant posters that grab attention.": "Pósteres vibrantes que atraen miradas.", "“Excellent quality and super fast service. They always deliver on time!”": "“Excelente calidad y servicio muy rápido. Siempre entregan a tiempo.”", "“Best printing service in Brooklyn. The membership saves me a lot!”": "“El mejor servicio de impresión en Brooklyn. ¡La membresía me ahorra mucho!”", "“Amazing customer service and high quality work every time.”": "“Increíble servicio al cliente y trabajo de alta calidad siempre.”"
};
Object.assign(translations.en, Object.fromEntries(Object.keys(salesFlowDomCopy).map((key) => [key, key])));
Object.assign(translations.es, salesFlowDomCopy);

/* SEO product landings use the same preferredLanguage system as the public site. */
const productLandingTranslations = {
  "Business Printing": "Impresión comercial", "Local Marketing": "Marketing local", "Large Format Printing": "Impresión de gran formato", "Labels and Packaging": "Etiquetas y empaques", "Restaurant Printing": "Impresión para restaurantes", "Outdoor Signs": "Letreros exteriores", "Promotional Printing": "Impresión promocional", "Trade Show Display": "Exhibición para ferias",
  "Professional Business Card Printing": "Impresión profesional de tarjetas de presentación", "Make Your First Impression Count.": "Haz que tu primera impresión cuente.", "Sharp, professional business cards for meetings, front desks, deliveries and everyday customer handoffs in New York.": "Tarjetas de presentación nítidas y profesionales para reuniones, recepciones, entregas y atención diaria al cliente en Nueva York.",
  "Professional Flyer Printing": "Impresión profesional de volantes", "Put Your Business in Their Hands.": "Pon tu negocio en sus manos.", "Full-color flyers for business promotions, events, restaurants, grand openings and local marketing campaigns.": "Volantes a todo color para promociones, eventos, restaurantes, inauguraciones y campañas de marketing local.",
  "Custom Banner Printing": "Impresión de banners personalizados", "Get Your Business Seen.": "Haz que tu negocio se vea.", "Durable vinyl banners for storefronts, events, sales, announcements and high-visibility local promotions.": "Banners de vinilo duraderos para vitrinas, eventos, ofertas, anuncios y promociones locales de alta visibilidad.",
  "Custom Stickers & Labels": "Stickers y etiquetas personalizados", "Make Your Brand Stick.": "Haz que tu marca se quede.", "Custom stickers and labels for product packaging, bags, boxes, cups, giveaways and everyday brand visibility.": "Stickers y etiquetas para empaques, bolsas, cajas, vasos, regalos y visibilidad diaria de tu marca.",
  "Professional Menu Printing": "Impresión profesional de menús", "Make Every Dish Look Better.": "Haz que cada plato luzca mejor.", "Clear, full-color menus for restaurants, cafes, food trucks, catering and takeout service in New York.": "Menús claros y a todo color para restaurantes, cafeterías, food trucks, catering y servicio para llevar en Nueva York.",
  "Custom Yard Signs": "Letreros de jardín personalizados", "Get Seen From the Street.": "Hazte ver desde la calle.", "Weather-resistant outdoor signs for real estate, contractors, events, campaigns and neighborhood promotions.": "Letreros exteriores resistentes al clima para bienes raíces, contratistas, eventos, campañas y promociones de barrio.",
  "Professional Poster Printing": "Impresión profesional de pósteres", "Make Your Message Impossible to Miss.": "Haz que tu mensaje sea imposible de ignorar.", "Vibrant full-color posters for promotions, events, storefront displays and local marketing in New York.": "Pósteres vibrantes a todo color para promociones, eventos, exhibiciones en vitrinas y marketing local en Nueva York.",
  "Retractable Banner Printing": "Impresión de banners retráctiles", "Stand Tall. Get Noticed.": "Destaca. Hazte notar.", "Portable pull-up displays with a printed banner and stand for events, offices, presentations and pop-ups.": "Exhibiciones portátiles con banner impreso y soporte para eventos, oficinas, presentaciones y pop-ups.",
  "Professional Brochure Printing": "Impresión profesional de folletos", "Tell Your Story. Beautifully Printed.": "Cuenta tu historia. Impresa con belleza.", "Professional brochures for services, business introductions, local marketing and detailed product information.": "Folletos profesionales para servicios, presentaciones de negocio, marketing local e información detallada de productos.",
  "Starting at": "Desde", "Start Your Order": "Comienza tu pedido", "Print Products": "Productos impresos", "Home": "Inicio", "Why Next Print NY": "Por qué Next Print NY", "Next Print NY ·": "Next Print NY ·",
  "Business cards built for everyday introductions": "Tarjetas pensadas para presentaciones diarias", "Professional presentation": "Presentación profesional", "Front and back printing": "Impresión por ambos lados", "Ready for repeat orders": "Listas para pedidos repetidos", "Available business card options": "Opciones disponibles de tarjetas", "Paper stock": "Tipo de papel", "Print setup": "Configuración de impresión",
  "Handouts that help your promotion travel": "Volantes que llevan tu promoción más lejos", "Full color": "A todo color", "Popular sizes": "Tamaños populares", "Built for quantity": "Preparados para cantidad", "Great for local marketing": "Ideales para marketing local", "Business promotions": "Promociones comerciales", "Events and openings": "Eventos e inauguraciones", "Restaurants": "Restaurantes",
  "Large-format printing for big announcements": "Impresión de gran formato para anuncios importantes", "Vinyl material": "Material de vinilo", "Visible messaging": "Mensaje visible", "Finishing options": "Opciones de acabado", "Where banners work best": "Dónde funcionan mejor los banners", "Storefronts": "Vitrinas", "Events": "Eventos", "Sales and announcements": "Ofertas y anuncios",
  "Turn ordinary packaging into a branded touchpoint": "Convierte un empaque común en un punto de contacto de marca", "Popular shapes": "Formas populares", "Bulk-friendly": "Ideal para volumen", "Useful for brands and local businesses": "Útiles para marcas y negocios locales", "Product labels": "Etiquetas de producto", "Daily promotion": "Promoción diaria",
  "Menus designed for clear choices": "Menús diseñados para elegir con claridad", "Food service ready": "Listos para servicio de comida", "Folding options": "Opciones de doblado", "Built for restaurants and service lists": "Hechos para restaurantes y listas de servicio", "Restaurants and cafes": "Restaurantes y cafeterías", "Food trucks": "Food trucks", "Catering and takeout": "Catering y comida para llevar",
  "Outdoor signs for local visibility": "Letreros exteriores para visibilidad local", "Weather-resistant coroplast": "Coroplast resistente al clima", "H-wire stake": "Estaca de alambre H", "Useful for local campaigns": "Útiles para campañas locales", "Real estate": "Bienes raíces", "Contractors": "Contratistas", "Events and promotions": "Eventos y promociones",
  "Posters that earn attention": "Pósteres que ganan atención", "Full-color graphics": "Gráficos a todo color", "11 x 17 active option": "Opción activa 11 x 17", "Promotion ready": "Listos para promoción", "Made for messages worth displaying": "Hechos para mensajes que merecen mostrarse", "Retail displays": "Exhibiciones comerciales", "Community promotion": "Promoción comunitaria",
  "A professional display that travels easily": "Una exhibición profesional que viaja fácilmente", "Stand included": "Soporte incluido", "22 x 80 option": "Opción 22 x 80", "Full-color display": "Exhibición a todo color", "Built for professional spaces": "Hechos para espacios profesionales", "Trade shows": "Ferias comerciales", "Offices and lobbies": "Oficinas y recepciones", "Presentations": "Presentaciones",
  "More room for the story behind your business": "Más espacio para la historia de tu negocio", "8.5 x 11 format": "Formato 8.5 x 11", "Tri-fold option": "Opción de tríptico", "Gloss text stock": "Papel texturado brillante", "Give customers something useful to keep": "Dale a tus clientes algo útil para guardar", "Service information": "Información de servicios", "Business introductions": "Presentaciones de negocio", "Local marketing": "Marketing local"
};
Object.assign(translations.en, Object.fromEntries(Object.keys(productLandingTranslations).map((key) => [key, key])));
Object.assign(translations.es, productLandingTranslations);

/* Detail copy for the six public SEO landings. These remain presentation-only;
   product values and transactional query parameters stay unchanged. */
const productLandingDetailTranslations = {
  "Give customers clear contact details and a polished first impression.": "Da a tus clientes datos de contacto claros y una primera impresión profesional.",
  "Use both sides for your brand, services, appointment details or promotion.": "Usa ambos lados para tu marca, servicios, detalles de citas o promoción.",
  "Keep a dependable format for networking, deliveries and customer visits.": "Mantén un formato confiable para networking, entregas y visitas de clientes.",
  "3.75 x 2.25 inches with bleed.": "3.75 x 2.25 pulgadas con sangrado.",
  "14 pt. cardstock with high gloss coating.": "Cartulina de 14 pt. con acabado de alto brillo.",
  "Front and back printing; rounded corners can be selected in the order flow.": "Impresión por ambos lados; puedes seleccionar esquinas redondeadas durante el pedido.",
  "Make your contact details easy to keep": "Haz que sea fácil guardar tus datos de contacto",
  "Start with the verified business card configuration, then upload artwork or continue through the existing print order flow.": "Comienza con la configuración verificada de tarjetas, luego sube tu arte o continúa con el flujo de pedido existente.",

  "Make offers, events and services easier to notice.": "Haz que las ofertas, eventos y servicios sean más fáciles de notar.",
  "Choose from the active 4x6, 5x7 and 8.5x11 flyer options.": "Elige entre las opciones activas de volantes 4x6, 5x7 y 8.5x11.",
  "Prepare a print run for handouts, counters, mailers or neighborhood outreach.": "Prepara una tirada para folletos, mostradores, correo o alcance en tu vecindario.",
  "Share sales, new services and limited-time offers.": "Comparte ofertas, nuevos servicios y promociones por tiempo limitado.",
  "Promote a grand opening, community event or special date.": "Promociona una inauguración, evento comunitario o fecha especial.",
  "Present menus, delivery offers and local specials.": "Presenta menús, ofertas de entrega y especiales locales.",
  "Start with a flyer format people can take with them": "Comienza con un formato de volante que las personas puedan llevarse",
  "Select the current 4x6 flyer configuration and continue through the existing upload flow.": "Selecciona la configuración actual de volante 4x6 y continúa con el flujo de carga existente.",

  "Use the active 13 oz. standard vinyl option for your banner order.": "Usa la opción activa de vinilo estándar de 13 oz. para tu pedido de banners.",
  "Make promotions, directions and storefront messages easier to see.": "Haz que las promociones, indicaciones y mensajes de vitrina sean más fáciles de ver.",
  "Confirm grommets, treatment and production details in the existing flow.": "Confirma ojales, tratamiento y detalles de producción en el flujo existente.",
  "Announce offers, openings and services from the street.": "Anuncia ofertas, inauguraciones y servicios desde la calle.",
  "Guide guests, promote sponsors or build a branded event space.": "Guía a los invitados, promociona patrocinadores o crea un espacio de evento con tu marca.",
  "Give campaigns a format designed for visibility.": "Dale a tus campañas un formato diseñado para llamar la atención.",
  "Choose a banner size and finish for your space": "Elige un tamaño y acabado de banner para tu espacio",
  "Start with the active 24x36 banner configuration or continue to the existing banner order flow.": "Comienza con la configuración activa de banner 24x36 o continúa con el flujo de pedido existente.",

  "Active sticker choices include round, square and rectangle options.": "Las opciones activas de stickers incluyen formatos redondos, cuadrados y rectangulares.",
  "Present logos, product names and simple instructions clearly.": "Presenta logos, nombres de productos e instrucciones sencillas con claridad.",
  "Prepare labels for repeat packaging, events and giveaways.": "Prepara etiquetas para empaques repetidos, eventos y obsequios.",
  "Use stickers on bags, boxes, jars and packaging.": "Usa stickers en bolsas, cajas, frascos y empaques.",
  "Add a branded detail to handouts, cups and giveaways.": "Agrega un detalle de marca a folletos, vasos y obsequios.",
  "Keep your logo visible wherever customers take your product.": "Mantén tu logo visible dondequiera que tus clientes lleven tu producto.",
  "Choose a sticker format for your next run": "Elige un formato de sticker para tu próxima tirada",
  "Start with the verified round 2-inch sticker configuration and upload your artwork in the existing order flow.": "Comienza con la configuración verificada de sticker redondo de 2 pulgadas y sube tu arte en el flujo de pedido existente.",

  "Present dishes, prices, specials and service details in a readable format.": "Presenta platos, precios, especiales y detalles de servicio en un formato fácil de leer.",
  "Full color printing": "Impresión a todo color",
  "Use photos, categories and brand colors to support your service.": "Usa fotos, categorías y colores de marca para apoyar tu servicio.",
  "Confirm the active folding and finish options during your order.": "Confirma las opciones activas de doblado y acabado durante tu pedido.",
  "Make menu items and pricing easy to scan.": "Haz que los platos y precios sean fáciles de consultar.",
  "Food trucks": "Camiones de comida",
  "Provide a compact menu for busy service.": "Ofrece un menú compacto para un servicio con mucho movimiento.",
  "Share packages, specials and ordering information.": "Comparte paquetes, especiales e información para ordenar.",
  "Start your menu print order": "Comienza tu pedido de impresión de menús",
  "Begin with the active 8.5x11 menu configuration, then continue with artwork and order details.": "Comienza con la configuración activa de menú 8.5x11 y continúa con el arte y los detalles del pedido.",

  "18 x 24 inches": "18 x 24 pulgadas",
  "Use the active standard yard sign size for street-level messaging.": "Usa el tamaño estándar activo de letrero de jardín para mensajes a nivel de calle.",
  "4 mm coroplast board supports outdoor display.": "El panel de coroplast de 4 mm permite exhibición en exteriores.",
  "The active configuration includes a sturdy H-wire stake.": "La configuración activa incluye una resistente estaca de alambre H.",
  "Show listings, open houses and agent information.": "Muestra propiedades, casas abiertas e información de agentes.",
  "Keep your service, phone number and message visible on site.": "Mantén tu servicio, teléfono y mensaje visibles en el lugar.",
  "Direct visitors or promote a neighborhood event.": "Dirige a los visitantes o promociona un evento del vecindario.",
  "Put your message where customers can see it": "Pon tu mensaje donde los clientes puedan verlo",
  "Begin with the current yard sign configuration and continue with artwork and printing details.": "Comienza con la configuración actual de letrero de jardín y continúa con el arte y detalles de impresión."
};
Object.assign(translations.en, Object.fromEntries(Object.keys(productLandingDetailTranslations).map((key) => [key, key])));
Object.assign(translations.es, productLandingDetailTranslations);
const i18nTextOriginals = new WeakMap();
let applyingPresentationTranslations = false;
function applyPresentationTranslations(root = document.body) {
  if (!root) return;
  applyingPresentationTranslations = true;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const original = i18nTextOriginals.get(node) ?? node.nodeValue;
    i18nTextOriginals.set(node, original);
    // HTML indentation often becomes part of a text node. Match labels on
    // their trimmed content while restoring the original surrounding space.
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const content = original.trim();
    const translated = translations[currentLanguage]?.[original]
      || translations[currentLanguage]?.[content]
      || original;
    node.nodeValue = translated === original ? original : `${leading}${translated}${trailing}`;
  }
  applyingPresentationTranslations = false;
}

function t(key) {
  return translations[currentLanguage][key] || translations.es[key] || key;
}

function formatText(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, valueKey) => values[valueKey] || "");
}

function loadCustomerMemory() {
  try {
    const savedMemory = JSON.parse(localStorage.getItem(memoryKey) || "{}");
    return {
      name: savedMemory.name || "",
      language: savedMemory.language || currentLanguage,
      orders: Array.isArray(savedMemory.orders) ? savedMemory.orders.slice(0, 5) : [],
      deviceId: savedMemory.deviceId || createDeviceId(),
      lastVisit: savedMemory.lastVisit || "",
      questions: Array.isArray(savedMemory.questions)
        ? savedMemory.questions.slice(0, maxRememberedQuestions)
        : [],
    };
  } catch {
    return {
      name: "",
      language: currentLanguage,
      orders: [],
      deviceId: createDeviceId(),
      lastVisit: "",
      questions: [],
    };
  }
}

function saveCustomerMemory() {
  customerMemory.language = currentLanguage;
  customerMemory.lastVisit = new Date().toISOString();
  localStorage.setItem(memoryKey, JSON.stringify(customerMemory));
}

function createDeviceId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function rememberQuestion(text) {
  const question = String(text || "").trim().slice(0, 160);

  if (!question) return;

  customerMemory.questions = [
    {
      date: new Date().toLocaleDateString(currentLanguage === "en" ? "en-US" : "es-US"),
      text: question,
    },
    ...(customerMemory.questions || []).filter((item) => item.text !== question),
  ].slice(0, maxRememberedQuestions);
  saveCustomerMemory();
}

function loadConversationHistory() {
  try {
    const savedConversation = JSON.parse(localStorage.getItem(conversationKey) || "[]");
    return Array.isArray(savedConversation) ? savedConversation.slice(-maxConversationMessages) : [];
  } catch {
    return [];
  }
}

function saveConversationHistory() {
  conversationHistory = conversationHistory.slice(-maxConversationMessages);
  localStorage.setItem(conversationKey, JSON.stringify(conversationHistory));
}

function sanitizeName(value) {
  return String(value || "")
    .replace(/[^a-zA-ZÀ-ÿñÑ\s'-]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
}

function looksLikeName(value) {
  const name = sanitizeName(value);
  const words = name.split(/\s+/).filter(Boolean);
  const serviceWords = [
    "imprimir",
    "impresion",
    "impresión",
    "print",
    "printing",
    "dmv",
    "ezpass",
    "e-zpass",
    "ticket",
    "traduccion",
    "translation",
    "cotizacion",
    "quote",
    "precio",
    "price",
  ];

  return (
    name.length >= 2 &&
    name.length <= 40 &&
    words.length <= 3 &&
    !serviceWords.some((word) => value.toLowerCase().includes(word))
  );
}

function renderMessageText(message, text, type) {
  message.textContent = "";
  const body = document.createElement("span");
  body.textContent = text;
  message.appendChild(body);

  if (type === "bot") {
    const signature = document.createElement("small");
    signature.className = "message-signature";
    signature.textContent = "Richard Velez consultor";
    message.appendChild(signature);
  }
}

function updateChatWelcome() {
  const welcome = chatMessages?.querySelector("[data-i18n='chat.welcome']");

  if (!welcome) return;

  const welcomeText = customerMemory.name
    ? formatText("chat.returning", { name: customerMemory.name })
    : t("chat.welcome");
  renderMessageText(welcome, welcomeText, "bot");
}

function updateUploadLanguageState() {
  const files = Array.from(uploadFile?.files || []);

  if (!uploadTrigger) return;

  if (files.length === 0) {
    uploadTrigger.textContent = t("copies.chooseFiles");
    return;
  }

  uploadTrigger.textContent = t("copies.send");
  setUploadStatus(`${files.length} ${currentLanguage === "en" ? "files selected" : "archivos seleccionados"}. ${t("upload.ready")}`);
}

function renderConversationHistory() {
  if (!chatMessages || conversationHistory.length === 0) return;

  const welcome = chatMessages.querySelector("[data-i18n='chat.welcome']");
  chatMessages.innerHTML = "";
  if (welcome) chatMessages.appendChild(welcome);

  conversationHistory.forEach((item) => {
    addMessage(item.content, item.role === "assistant" ? "bot" : "user", false);
  });
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "es";
  localStorage.setItem("preferredLanguage", currentLanguage);
  customerMemory.language = currentLanguage;
  saveCustomerMemory();
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.setAttribute("placeholder", t(key));
  });

  ["aria-label", "title", "alt"].forEach((attribute) => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    });
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = button.dataset.lang === "en" ? "🇺🇸 EN" : "🇪🇨 ES";
  });

  updateChatWelcome();
  updateUploadLanguageState();
  applyPresentationTranslations();
  document.dispatchEvent(new CustomEvent("nextprintlanguagechange", { detail: { language: currentLanguage } }));
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    menu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

function createQuickActionBar() {
  if (document.querySelector(".quick-action-bar")) return;

  const bar = document.createElement("nav");
  bar.className = "quick-action-bar";
  bar.setAttribute("aria-label", "Quick actions");
  bar.innerHTML = `
    <a href="tel:+12393337935">
      <span class="quick-icon" aria-hidden="true">☎</span>
      <span data-i18n="quick.call">Call</span>
    </a>
    <a href="https://wa.me/12393337935" target="_blank" rel="noreferrer">
      <span class="quick-icon" aria-hidden="true">WA</span>
      <span data-i18n="quick.whatsapp">WhatsApp</span>
    </a>
    <a href="order.html">
      <span class="quick-icon" aria-hidden="true">+</span>
      <span data-i18n="quick.order">Order</span>
    </a>
    <a href="tracking.html">
      <span class="quick-icon" aria-hidden="true">#</span>
      <span data-i18n="quick.track">Track</span>
    </a>
  `;
  document.body.appendChild(bar);
}

function createFloatingWhatsApp() {
  if (document.querySelector(".floating-whatsapp")) return;

  const message = "Hi! I need help with a custom print project.";
  const sessionKey = "nextPrintFloatingWhatsAppCollapsed";
  const panel = document.createElement("aside");
  panel.className = "floating-whatsapp";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <button class="floating-whatsapp-close" type="button" data-i18n-aria-label="floatingWhatsapp.close" aria-label="Close WhatsApp assistance">×</button>
    <img class="floating-whatsapp-photo" src="assets/whatsapp-richard.png" alt="" />
    <div class="floating-whatsapp-copy">
      <strong data-i18n="floatingWhatsapp.title">Need something custom?</strong>
      <span data-i18n="floatingWhatsapp.copy">Message me on WhatsApp. Prices may vary by project.</span>
      <small data-i18n="floatingWhatsapp.note">Text messages only. I respond quickly.</small>
      <a href="https://wa.me/12393337935?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer" data-i18n="floatingWhatsapp.button">Message Me</a>
    </div>
  `;
  const launcher = document.createElement("button");
  launcher.className = "floating-whatsapp-launcher";
  launcher.type = "button";
  launcher.hidden = true;
  launcher.setAttribute("data-i18n-aria-label", "floatingWhatsapp.open");
  launcher.setAttribute("aria-label", "Open WhatsApp assistance");
  launcher.innerHTML = '<span aria-hidden="true">WA</span>';

  const setCollapsed = (collapsed) => {
    panel.hidden = collapsed;
    launcher.hidden = !collapsed;
    sessionStorage.setItem(sessionKey, collapsed ? "true" : "false");
  };
  panel.querySelector(".floating-whatsapp-close")?.addEventListener("click", () => setCollapsed(true));
  launcher.addEventListener("click", () => setCollapsed(false));
  document.body.appendChild(panel);
  document.body.appendChild(launcher);
  setCollapsed(sessionStorage.getItem(sessionKey) === "true");
}

function addMessage(text, type, shouldSave = true) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  renderMessageText(message, text, type);
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (shouldSave && (type === "user" || type === "bot")) {
    conversationHistory.push({
      role: type === "user" ? "user" : "assistant",
      content: text,
    });
    saveConversationHistory();
  }
}

function localReply(text) {
  const normalized = text.toLowerCase();
  const asksMemory = [
    "te acuerdas",
    "te recuerdas",
    "me recuerdas",
    "recuerdas de mi",
    "recuerdas de mí",
    "remember me",
    "do you remember",
    "you remember me",
  ].some((phrase) => normalized.includes(phrase));

  if (asksMemory) {
    return buildLocalMemoryReply();
  }

  const answers = fallbackAnswers[currentLanguage] || fallbackAnswers.es;
  const match = answers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    match?.answer ||
    (currentLanguage === "en"
      ? "Thanks for contacting Next Print NY. I can guide you with printing, consulting services, DMV, E-ZPass, payments, translations and paperwork. What do you need today?"
      : "Gracias por escribir a Next Print NY. Puedo orientarte sobre impresión, agente consultor, DMV, E-ZPass, pagos, traducciones y trámites. ¿Qué necesitas hacer hoy?")
  );
}

function buildLocalMemoryReply() {
  const rememberedName = customerMemory.name;
  const recentQuestion = customerMemory.questions?.[0]?.text;
  const recentOrder = customerMemory.orders?.[0]?.fileName;

  if (currentLanguage === "en") {
    if (!rememberedName && !recentQuestion && !recentOrder) {
      return "I do not have your name saved on this device yet. Tell me your name once, and I will remember it here for your next visit.";
    }

    return [
      rememberedName ? `Yes, I remember you as ${rememberedName}.` : "Yes, I recognize this device.",
      recentQuestion ? `Your last question was about: ${recentQuestion}.` : "",
      recentOrder ? `I also see your recent uploaded file: ${recentOrder}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (!rememberedName && !recentQuestion && !recentOrder) {
    return "Todavía no tengo tu nombre guardado en este dispositivo. Dime tu nombre una vez y lo recordaré aquí para tu próxima visita.";
  }

  return [
    rememberedName ? `Sí, te recuerdo como ${rememberedName}.` : "Sí, reconozco este dispositivo.",
    recentQuestion ? `Tu última pregunta fue sobre: ${recentQuestion}.` : "",
    recentOrder ? `También veo tu archivo reciente: ${recentOrder}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildMemorySummary() {
  const orders = customerMemory.orders
    .slice(0, 3)
    .map((order) => `${order.date}: ${order.fileName}${order.notes ? ` - ${order.notes}` : ""}`);

  return {
    name: customerMemory.name,
    language: currentLanguage,
    deviceId: customerMemory.deviceId,
    lastVisit: customerMemory.lastVisit,
    recentQuestions: (customerMemory.questions || [])
      .slice(0, 5)
      .map((item) => `${item.date}: ${item.text}`),
    recentOrders: orders,
  };
}

async function askAssistant(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        language: currentLanguage,
        customer: buildMemorySummary(),
        conversation: conversationHistory.slice(-10),
      }),
    });

    if (!response.ok) {
      throw new Error("AI endpoint unavailable");
    }

    const data = await response.json();
    return data.reply || localReply(message);
  } catch {
    return localReply(message);
  }
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";
  chatInput.disabled = true;

  if (!customerMemory.name) {
    if (looksLikeName(message)) {
      customerMemory.name = sanitizeName(message);
      saveCustomerMemory();
      addMessage(formatText("chat.nameSaved", { name: customerMemory.name }), "bot");
    } else {
      addMessage(t("chat.askName"), "bot");
    }

    chatInput.disabled = false;
    chatInput.focus();
    return;
  }

  addMessage(t("chat.loading"), "bot");
  const loadingMessage = chatMessages.lastElementChild;
  conversationHistory.pop();
  saveConversationHistory();
  const reply = await askAssistant(message);
  renderMessageText(loadingMessage, reply, "bot");
  conversationHistory.push({ role: "assistant", content: reply });
  saveConversationHistory();
  rememberQuestion(message);

  chatInput.disabled = false;
  chatInput.focus();
});

function setUploadStatus(text, type = "") {
  if (!uploadStatus) return;
  uploadStatus.textContent = text;
  uploadStatus.className = `upload-status ${type}`.trim();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

uploadFile?.addEventListener("change", () => {
  const files = Array.from(uploadFile.files || []);

  if (files.length === 0) {
    setUploadStatus("");
    if (uploadTrigger) uploadTrigger.textContent = t("copies.chooseFiles");
    return;
  }

  if (files.some((file) => file.size > maxUploadSize)) {
    uploadFile.value = "";
    setUploadStatus(t("upload.sizeError"), "error");
    if (uploadTrigger) uploadTrigger.textContent = t("copies.chooseFiles");
    return;
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > maxUploadTotalSize) {
    uploadFile.value = "";
    setUploadStatus(currentLanguage === "en" ? "The selected files exceed the 12 MB total limit." : "Los archivos seleccionados superan el límite total de 12 MB.", "error");
    if (uploadTrigger) uploadTrigger.textContent = t("copies.chooseFiles");
    return;
  }

  setUploadStatus(`${files.length} ${currentLanguage === "en" ? "files selected" : "archivos seleccionados"}. ${t("upload.ready")}`);
  if (uploadTrigger) uploadTrigger.textContent = t("copies.send");
});

uploadTrigger?.addEventListener("click", () => {
  if (!uploadFile?.files?.length) {
    uploadFile?.click();
    return;
  }

  uploadForm?.requestSubmit();
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const files = Array.from(uploadFile.files || []);

  if (files.length === 0) {
    uploadFile.click();
    return;
  }

  if (files.some((file) => file.size > maxUploadSize)) {
    setUploadStatus(t("upload.sizeError"), "error");
    return;
  }

  const formData = new FormData(uploadForm);
  const submitButtonText = uploadForm.querySelector(".upload-submit");
  const originalButtonText = submitButtonText?.textContent || t("upload.button");

  setUploadStatus(t("upload.sending"));
  uploadForm.querySelectorAll("input, textarea, select").forEach((field) => {
    field.disabled = true;
  });
  if (submitButtonText) submitButtonText.textContent = t("upload.sending");
  if (uploadTrigger) uploadTrigger.disabled = true;

  try {
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        content: await fileToBase64(file),
      }))
    );
    const orderDate = new Date();
    const dueDate = new Date(orderDate);
    dueDate.setDate(orderDate.getDate() + 7);
    const details = [
      `Print type: ${formData.get("printType")}`,
      `Paper size: ${formData.get("paperSize")}`,
      `Paper: ${formData.get("paper")}`,
      `Copies per file: ${formData.get("quantity")}`,
      `Files: ${files.map((file) => file.name).join(", ")}`,
      formData.get("notes") ? `Notes: ${formData.get("notes")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: currentLanguage,
        service: "Copies",
        details,
        orderDate: toLocalDateValue(orderDate),
        dueDate: toLocalDateValue(dueDate),
        budget: "",
        quantity: formData.get("quantity"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        files: encodedFiles,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    uploadForm.reset();
    customerMemory.name = sanitizeName(formData.get("name")) || customerMemory.name;
    customerMemory.orders = [
      {
        date: new Date().toLocaleDateString(currentLanguage === "en" ? "en-US" : "es-US"),
        fileName: files.map((file) => file.name).join(", "),
        notes: details.slice(0, 140),
      },
      ...customerMemory.orders,
    ].slice(0, 5);
    saveCustomerMemory();
    setUploadStatus(
      currentLanguage === "en"
        ? `Copy order received. Order number: ${data.orderNumber}`
        : `Orden de copias recibida. Número de orden: ${data.orderNumber}`,
      "success"
    );
  } catch (error) {
    const message =
      error.message === "RESEND_API_KEY missing" ? t("upload.configError") : t("upload.error");
    setUploadStatus(message, "error");
  } finally {
    uploadForm.querySelectorAll("input, textarea, select").forEach((field) => {
      field.disabled = false;
    });
    if (uploadTrigger) uploadTrigger.disabled = false;
    if (submitButtonText) {
      submitButtonText.textContent = uploadFile.files?.length ? originalButtonText : t("copies.chooseFiles");
    }
  }
});

function toLocalDateValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

createQuickActionBar();
createFloatingWhatsApp();
applyLanguage(customerMemory.language || currentLanguage);
renderConversationHistory();

window.NextPrintI18n = { t, getLanguage: () => currentLanguage, applyLanguage, applyPresentationTranslations };
new MutationObserver((records) => {
  if (applyingPresentationTranslations || currentLanguage !== "es") return;
  records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) applyPresentationTranslations(node.parentElement);
    else if (node.nodeType === Node.ELEMENT_NODE) applyPresentationTranslations(node);
  }));
}).observe(document.body, { childList: true, subtree: true });
