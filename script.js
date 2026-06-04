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
    "home.hero.title1": "Todo lo que tu negocio necesita",
    "home.hero.title2": "en un solo lugar",
    "home.hero.copy": "Impresión de alta calidad, servicios esenciales y asesoría profesional para crecer tu negocio en USA.",
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
    "printingPage.kicker": "Departamento de impresión",
    "printingPage.heroTitle": "Impresión que hace que tu negocio se vea listo.",
    "printingPage.heroCopy":
      "Desde copias diarias hasta tarjetas, banners, letreros, camisetas y pedidos personalizados, Next Print NY te ayuda a preparar materiales profesionales rápido en Brooklyn.",
    "printingPage.quote": "Pedir cotización",
    "printingPage.upload": "Subir archivos",
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
    "zelle.kicker": "Pago por Zelle",
    "zelle.title": "Paga con Zelle",
    "zelle.copy": "Envía el pago después de que confirmemos el total. Agrega tu número de orden en la nota.",
    "zelle.sendTo": "Enviar a",
    "zelle.note": "Nota de Zelle",
    "zelle.copyEmail": "Copiar teléfono de Zelle",
    "zelle.copyOrder": "Copiar número de orden",
    "zelle.payButton": "Pagar con Zelle",
    "zelle.pageTitle": "Pagos por Zelle",
    "zelle.pageCopy": "Para pagar por Zelle, envía el total confirmado a Next Print NY y escribe tu número de orden en la nota.",
    "zelle.step1": "Confirma el total con Next Print NY.",
    "zelle.step2": "Envía el pago por Zelle a 2393337935.",
    "zelle.step3": "Escribe tu número de orden en la nota.",
    "zelle.step4": "Cuando recibamos el pago, cambiaremos tu estado a Pago recibido.",
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
    "home.hero.title1": "Everything your business needs",
    "home.hero.title2": "in one place",
    "home.hero.copy": "High quality printing, essential services and professional advice to grow your business in USA.",
    "home.viewServices": "View Services",
    "home.printing.title": "Printing",
    "home.printing.item1": "Business Cards",
    "home.printing.item2": "Flyers & Brochures",
    "home.printing.item3": "Banners & Signs",
    "home.printing.item4": "Window Vinyl",
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
    "printingPage.kicker": "Printing Department",
    "printingPage.heroTitle": "Printing that makes your business look ready.",
    "printingPage.heroCopy":
      "From everyday copies to business cards, banners, signs, shirts and custom orders, Next Print NY helps you prepare professional materials fast in Brooklyn.",
    "printingPage.quote": "Request a quote",
    "printingPage.upload": "Upload files",
    "printingPage.sectionKicker": "What we print",
    "printingPage.sectionTitle": "Business, event and everyday printing",
    "printingPage.card1Title": "Business Materials",
    "printingPage.card1Item1": "Business cards",
    "printingPage.card1Item2": "Flyers and brochures",
    "printingPage.card1Item3": "Postcards and menus",
    "printingPage.card1Item4": "Invoices and forms",
    "printingPage.card2Title": "Signs and Display",
    "printingPage.card2Item1": "Banners and posters",
    "printingPage.card2Item2": "Window vinyl",
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
    "zelle.kicker": "Zelle payment",
    "zelle.title": "Pay with Zelle",
    "zelle.copy": "Send payment after we confirm your total. Add your order number in the note.",
    "zelle.sendTo": "Send to",
    "zelle.note": "Zelle note",
    "zelle.copyEmail": "Copy Zelle phone",
    "zelle.copyOrder": "Copy order number",
    "zelle.payButton": "Pay with Zelle",
    "zelle.pageTitle": "Zelle Payments",
    "zelle.pageCopy": "To pay with Zelle, send the confirmed total to Next Print NY and write your order number in the note.",
    "zelle.step1": "Confirm the total with Next Print NY.",
    "zelle.step2": "Send the Zelle payment to 2393337935.",
    "zelle.step3": "Write your order number in the note.",
    "zelle.step4": "When we receive payment, we will update your status to Payment received.",
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
  const file = uploadFile?.files?.[0];

  if (!uploadTrigger) return;

  if (!file) {
    uploadTrigger.textContent = t("upload.button");
    return;
  }

  uploadTrigger.textContent = t("upload.sendSelected");
  setUploadStatus(`${t("upload.selected")} ${file.name}. ${t("upload.ready")}`);
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

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateChatWelcome();
  updateUploadLanguageState();
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
  const file = uploadFile.files?.[0];

  if (!file) {
    setUploadStatus("");
    if (uploadTrigger) uploadTrigger.textContent = t("upload.button");
    return;
  }

  if (file.size > maxUploadSize) {
    uploadFile.value = "";
    setUploadStatus(t("upload.sizeError"), "error");
    if (uploadTrigger) uploadTrigger.textContent = t("upload.button");
    return;
  }

  setUploadStatus(`${t("upload.selected")} ${file.name}. ${t("upload.ready")}`);
  if (uploadTrigger) uploadTrigger.textContent = t("upload.sendSelected");
});

uploadTrigger?.addEventListener("click", () => {
  if (!uploadFile?.files?.[0]) {
    uploadFile?.click();
    return;
  }

  uploadForm?.requestSubmit();
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = uploadFile.files?.[0];

  if (!file) {
    uploadFile.click();
    return;
  }

  if (file.size > maxUploadSize) {
    setUploadStatus(t("upload.sizeError"), "error");
    return;
  }

  const formData = new FormData(uploadForm);
  const submitButtonText = uploadForm.querySelector(".upload-submit");
  const originalButtonText = submitButtonText?.textContent || t("upload.button");

  setUploadStatus(t("upload.sending"));
  uploadForm.querySelectorAll("input, textarea").forEach((field) => {
    field.disabled = true;
  });
  if (submitButtonText) submitButtonText.textContent = t("upload.sending");
  if (uploadTrigger) uploadTrigger.disabled = true;

  try {
    const fileContent = await fileToBase64(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: currentLanguage,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        notes: formData.get("notes"),
        file: {
          name: file.name,
          type: file.type || "application/octet-stream",
          content: fileContent,
        },
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
        fileName: file.name,
        notes: String(formData.get("notes") || "").slice(0, 140),
      },
      ...customerMemory.orders,
    ].slice(0, 5);
    saveCustomerMemory();
    setUploadStatus(t("upload.success"), "success");
  } catch (error) {
    const message =
      error.message === "RESEND_API_KEY missing" ? t("upload.configError") : t("upload.error");
    setUploadStatus(message, "error");
  } finally {
    uploadForm.querySelectorAll("input, textarea").forEach((field) => {
      field.disabled = false;
    });
    if (uploadTrigger) uploadTrigger.disabled = false;
    if (submitButtonText) {
      submitButtonText.textContent = uploadFile.files?.[0] ? originalButtonText : t("upload.button");
    }
  }
});

createQuickActionBar();
applyLanguage(customerMemory.language || currentLanguage);
renderConversationHistory();
