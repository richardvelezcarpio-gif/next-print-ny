const productDetails = {
  cards: {
    visual: "cards",
    image: "assets/catalog-business-cards.png",
    material: "Premium cardstock. Available with glossy, matte or uncoated style depending on the finish confirmed before production.",
    hook: "Make the first impression feel professional. Perfect for networking, deliveries, front desks and every customer handoff.",
    benefits: ["Easy to carry and share", "Professional brand presentation", "Great for repeat customers"],
  },
  flyers: {
    visual: "flyers",
    image: "assets/catalog-flyers.png",
    material: "Full color flyer paper. Good for handouts, events, promotions, grand openings and local marketing.",
    hook: "Put your offer directly in people's hands. Flyers are fast, affordable and powerful for local promotion.",
    benefits: ["Great for events and promotions", "Easy to distribute", "Strong local marketing tool"],
  },
  stickers: {
    visual: "stickers",
    image: "assets/catalog-stickers.png",
    material: "Adhesive sticker material for labels, packaging, product branding, events and giveaways.",
    hook: "Turn every bag, box, cup or package into brand exposure. Stickers make simple products feel custom.",
    benefits: ["Ideal for packaging", "Adds brand identity quickly", "Works for giveaways and labels"],
  },
  menus: {
    visual: "menus",
    image: "assets/catalog-menus.png",
    material: "Full color menu prints for restaurants, cafes, food trucks and service lists. Lamination can be quoted if needed.",
    hook: "Make your menu clear, clean and easy to sell from. A better menu helps customers choose faster.",
    benefits: ["Great for restaurants and services", "Easy to read", "Helps present prices professionally"],
  },
  banners: {
    visual: "banners",
    image: "assets/catalog-banners.png",
    material: "Durable banner material for indoor or outdoor display. Grommets or finishing can be confirmed before production.",
    hook: "Get seen from farther away. Banners are perfect for storefronts, events, sales and announcements.",
    benefits: ["Large and visible", "Good for indoor or outdoor use", "Reusable for repeated promotions"],
  },
  backdrops: {
    visual: "banners",
    image: "assets/catalog-banners.png",
    material: "Large-format backdrop graphics for stages, events, photo moments, pop-ups and branded displays.",
    hook: "Create a clean branded background for events, photos, presentations and product launches.",
    benefits: ["Large event display", "Great for photos and stages", "Professional brand presence"],
  },
  hangers: {
    visual: "hangers",
    image: "assets/catalog-door-hangers.png",
    material: "Door hanger stock for neighborhood campaigns, real estate, menus, cleaning services and local offers.",
    hook: "Reach homes and apartments directly. Door hangers are a strong way to promote services block by block.",
    benefits: ["Direct neighborhood marketing", "Perfect for service businesses", "Easy for customers to keep"],
  },
  retractable: {
    visual: "retractable",
    image: "assets/catalog-retractable-banners.png",
    material: "Complete retractable display with a standard 33-inch stand and a full-color, 13 oz. smooth blockout vinyl banner.",
    hook: "Make a professional impression anywhere. Retractable banners set up in seconds and travel easily to events, offices, presentations and promotions.",
    benefits: ["Stand and printed banner included", "Portable and easy to set up", "High-impact full-color display"],
  },
  yardSigns: {
    visual: "yard-signs",
    image: "assets/catalog-yard-signs.png",
    material: "Weather-resistant 4 mm coroplast board with a sturdy H-wire stake for easy outdoor installation.",
    hook: "Put your message where customers can see it. Yard signs are ideal for real estate, events, contractors, campaigns and neighborhood promotions.",
    benefits: ["Weather-resistant outdoor display", "H-wire stake included", "Vibrant full-color printing"],
  },
  shirts: {
    visual: "shirts",
    image: "assets/tshirt-showcase.png",
    material: "Gildan G500 Unisex Heavy Cotton. Left chest print area 4 x 4 inches and back print area 14 x 14 inches.",
    hook: "Professional custom T-shirts with left chest and back print options. Start here, then choose up to 10 basic colors, sizes and quantities in the online designer.",
    benefits: ["10 basic shirt colors", "Left chest and back design", "Automatic 7-day delivery date"],
  },
};

const productSlugs = {
  cards: "business-cards",
  flyers: "flyers",
  stickers: "stickers",
  menus: "menus",
  banners: "banners",
  backdrops: "backdrops",
  hangers: "door-hangers",
  retractable: "retractable-banners",
  yardSigns: "yard-signs",
  shirts: "t-shirts",
};

const productTemplateContent = {
  cards: {
    kicker: "Business printing",
    titleTop: "Business",
    titleBottom: "Cards",
    copy: "Make every introduction feel professional with sharp, durable business cards prepared for everyday handouts, deliveries and front desk use.",
    images: ["assets/printing-business-cards-ai.webp", "assets/catalog-business-cards.png"],
    imageAlt: ["Business card samples", "Business card detail"],
    benefits: [
      ["Premium Cardstock", "Glossy or matte finish"],
      ["Front & Back", "Clean contact details"],
      ["Fast Reorders", "Easy repeat runs"],
      ["Shipping", "Calculated at checkout"],
    ],
    perfectFor: ["Networking", "Front desks", "Deliveries", "Realtors", "Startups", "Local Shops"],
    sectionKicker: "Business materials",
    sectionTitle: "Cards that make your brand easy to remember",
    cards: [
      ["Professional Identity", ["Business cards", "Appointment cards", "Loyalty cards"]],
      ["Finish Options", ["High gloss", "Matte", "Rounded corners"]],
      ["Best Uses", ["Networking", "Package inserts", "Local promotions"]],
    ],
    steps: ["Choose size and finish", "Upload or design artwork", "Approve the final proof", "Print and pick up locally"],
    ctaTitle: "Need business cards fast?",
    ctaCopy: "Send your logo, contact details and quantity so we can prepare the cleanest option.",
    ctaButton: "Contact Next Print NY",
  },
  flyers: {
    kicker: "Local promotion",
    titleTop: "Flyers",
    titleBottom: "That Get Seen",
    copy: "Promote events, specials, menus, grand openings and services with bright full-color flyers in the most requested sizes.",
    images: ["assets/printing-flyers-ai.webp", "assets/catalog-flyers.png"],
    imageAlt: ["Flyer print samples", "Flyer design sample"],
    benefits: [
      ["4x6, 5x7, 8.5x11", "Popular flyer sizes"],
      ["Full Color", "Strong visual impact"],
      ["Bulk Pricing", "Save on quantity"],
      ["Fast Events", "Ready for handouts"],
    ],
    perfectFor: ["Events", "Promotions", "Restaurants", "Churches", "Openings", "Coupons"],
    sectionKicker: "Flyer campaigns",
    sectionTitle: "Handouts, promos and event prints made simple",
    cards: [
      ["Promotion Ready", ["Grand openings", "Sales events", "Community events"]],
      ["Size Options", ["4x6 flyers", "5x7 flyers", "8.5x11 flyers"]],
      ["Print Finishes", ["Full color", "Front and back", "Gloss or matte"]],
    ],
    steps: ["Pick flyer size", "Choose quantity and finish", "Approve artwork", "Print for pickup or delivery"],
    ctaTitle: "Need flyers for an event?",
    ctaCopy: "Tell us the event date, size and quantity so we can recommend the right print run.",
    ctaButton: "Request Flyer Help",
  },
  stickers: {
    kicker: "Labels and decals",
    titleTop: "Custom",
    titleBottom: "Stickers",
    copy: "Add your brand to packaging, cups, bags, boxes and giveaways with round, square and rectangle sticker options.",
    images: ["assets/printing-stickers-ai.webp", "assets/catalog-stickers.png"],
    imageAlt: ["Sticker print samples", "Sticker shapes"],
    benefits: [
      ["Multiple Shapes", "Round and rectangle"],
      ["Outdoor Vinyl", "Durable material"],
      ["Brand Labels", "Packaging ready"],
      ["Bulk Runs", "Better unit pricing"],
    ],
    perfectFor: ["Packaging", "Food brands", "Giveaways", "Events", "Labels", "Small Business"],
    sectionKicker: "Sticker products",
    sectionTitle: "Labels and stickers for products, bags and promotions",
    cards: [
      ["Popular Shapes", ["Round 2 inch", "Square 2x2", "Rectangle 2x3.5"]],
      ["Common Uses", ["Product labels", "Cup stickers", "Package branding"]],
      ["Material", ["High gloss vinyl", "Full color", "No back printing"]],
    ],
    steps: ["Choose sticker shape", "Select quantity", "Upload artwork", "Approve and print"],
    ctaTitle: "Need sticker sizing advice?",
    ctaCopy: "Send a photo of your package or label area and we can recommend the best sticker size.",
    ctaButton: "Ask About Stickers",
  },
  menus: {
    kicker: "Restaurant printing",
    titleTop: "Menus",
    titleBottom: "Made Clear",
    copy: "Print clean menus for restaurants, cafes, food trucks and takeout orders with folding and paper options.",
    images: ["assets/printing-menus-ai.webp", "assets/catalog-menus.png"],
    imageAlt: ["Restaurant menu printing", "Menu sample"],
    benefits: [
      ["Takeout Menus", "8.5x11 and 11x17"],
      ["Folding Options", "Half, tri and more"],
      ["Full Color", "Both sides available"],
      ["Food Service", "Easy customer reading"],
    ],
    perfectFor: ["Restaurants", "Food trucks", "Cafes", "Catering", "Delivery", "Promotions"],
    sectionKicker: "Menu printing",
    sectionTitle: "Menus that help customers choose faster",
    cards: [
      ["Menu Types", ["Takeout menus", "Service menus", "Promo inserts"]],
      ["Folds", ["Half fold", "Tri-fold", "Gate fold"]],
      ["Restaurant Needs", ["Clear prices", "Food photos", "Special offers"]],
    ],
    steps: ["Choose menu size", "Select fold and finish", "Upload file", "Print and prepare"],
    ctaTitle: "Need help setting up a menu?",
    ctaCopy: "Send your menu file, page count and folding style and we will help prepare it.",
    ctaButton: "Request Menu Help",
  },
  banners: {
    kicker: "Large format printing",
    titleTop: "Vinyl",
    titleBottom: "Banners",
    copy: "Get noticed from farther away with durable banners for storefronts, events, sales and announcements.",
    images: ["assets/catalog-banners.png", "assets/printing-banners-ai.webp"],
    imageAlt: ["Vinyl banner printing", "Large format banner"],
    benefits: [
      ["Large Sizes", "2x4 to 2x10"],
      ["Outdoor Ready", "Vinyl material"],
      ["Finishing", "Grommets available"],
      ["High Visibility", "Strong storefront impact"],
    ],
    perfectFor: ["Storefronts", "Events", "Sales", "Real Estate", "Churches", "Campaigns"],
    sectionKicker: "Banner printing",
    sectionTitle: "Durable signs and banners for big announcements",
    cards: [
      ["Banner Uses", ["Grand openings", "Street promotions", "Event signage"]],
      ["Finishing", ["Hem with grommets", "Pole pockets", "No treatment"]],
      ["Production", ["Full color", "Indoor and outdoor", "Custom sizing"]],
    ],
    steps: ["Choose banner size", "Design or upload artwork", "Confirm finishing", "Print and prepare"],
    ctaTitle: "Need help with a banner?",
    ctaCopy: "Tell us where the banner will go and we will help with size, material and finishing.",
    ctaButton: "Request Banner Help",
  },
  backdrops: {
    kicker: "Event display",
    titleTop: "Custom",
    titleBottom: "Backdrops",
    copy: "Create branded backgrounds for stages, photos, pop-ups, events and presentations.",
    images: ["assets/catalog-banners.png", "assets/printing-banners-ai.webp"],
    imageAlt: ["Backdrop display printing", "Large format backdrop"],
    benefits: [
      ["Large Sizes", "Event-ready widths"],
      ["Photo Ready", "Clean brand background"],
      ["Full Color", "Sharp display graphics"],
      ["Professional Look", "Great for stages and booths"],
    ],
    perfectFor: ["Events", "Photo Booths", "Stages", "Pop-ups", "Launches", "Trade Shows"],
    sectionKicker: "Backdrop printing",
    sectionTitle: "Large branded backdrops for events and photos",
    cards: [
      ["Popular Uses", ["Photo moments", "Stage backgrounds", "Vendor booths"]],
      ["Display Sizes", ["60x96", "96x96", "120x96", "144x96", "240x96"]],
      ["Production", ["Full color", "Large format", "Event ready"]],
    ],
    steps: ["Choose backdrop size", "Upload or design artwork", "Confirm details", "Print and prepare"],
    ctaTitle: "Need an event backdrop?",
    ctaCopy: "Tell us the event date, size and artwork needs so we can prepare the right backdrop.",
    ctaButton: "Request Backdrop Help",
  },
  hangers: {
    kicker: "Neighborhood marketing",
    titleTop: "Door",
    titleBottom: "Hangers",
    copy: "Reach homes, apartments and local neighborhoods directly with door hangers for service offers and promotions.",
    images: ["assets/printing-door-hangers-ai.webp", "assets/catalog-door-hangers.png"],
    imageAlt: ["Door hanger marketing", "Door hanger print sample"],
    benefits: [
      ["Direct Outreach", "Neighborhood campaigns"],
      ["Two Sizes", "4x11 and 3.5x8.5"],
      ["Full Color", "Both sides available"],
      ["Service Leads", "Easy local promotion"],
    ],
    perfectFor: ["Contractors", "Cleaning", "Real Estate", "Restaurants", "Landscaping", "Local Services"],
    sectionKicker: "Door hanger campaigns",
    sectionTitle: "Neighborhood print marketing that lands at the door",
    cards: [
      ["Best For", ["Service offers", "Local specials", "Real estate farming"]],
      ["Setup", ["Front and back", "14 pt. cardstock", "High gloss UV"]],
      ["Distribution", ["Neighborhood routes", "Apartments", "Storefront areas"]],
    ],
    steps: ["Choose hanger size", "Confirm quantity", "Upload file", "Print for distribution"],
    ctaTitle: "Planning a local campaign?",
    ctaCopy: "Send the neighborhood, quantity and deadline so we can help quote door hangers correctly.",
    ctaButton: "Ask About Door Hangers",
  },
  retractable: {
    kicker: "Trade show display",
    titleTop: "Retractable",
    titleBottom: "Banners",
    copy: "Professional pull-up displays with stand and printed banner, ready for events, offices and presentations.",
    images: ["assets/catalog-retractable-banners.png", "assets/catalog-banners.png"],
    imageAlt: ["Retractable banner display", "Banner display detail"],
    benefits: [
      ["Stand Included", "Portable display"],
      ["33.5 x 80", "Standard size"],
      ["Blockout Vinyl", "Smooth material"],
      ["Event Ready", "Set up quickly"],
    ],
    perfectFor: ["Trade shows", "Offices", "Events", "Presentations", "Lobbies", "Pop-ups"],
    sectionKicker: "Display graphics",
    sectionTitle: "Portable banners for professional presentations",
    cards: [
      ["Included", ["Stand", "Printed banner", "Single sided display"]],
      ["Use Cases", ["Trade shows", "Office lobbies", "Vendor tables"]],
      ["Material", ["Smooth blockout vinyl", "Full color", "One panel"]],
    ],
    steps: ["Select quantity", "Upload banner design", "Approve proof", "Pick up display"],
    ctaTitle: "Need a retractable display?",
    ctaCopy: "Send the event date and artwork size so we can prepare the stand and banner.",
    ctaButton: "Request Display Help",
  },
  yardSigns: {
    kicker: "Outdoor signs",
    titleTop: "Yard",
    titleBottom: "Signs",
    copy: "Weather-resistant coroplast signs for campaigns, real estate, contractors, events and local visibility.",
    images: ["assets/catalog-yard-signs.png", "assets/catalog-banners.png"],
    imageAlt: ["Yard sign printing", "Outdoor sign display"],
    benefits: [
      ["18 x 24", "Popular outdoor size"],
      ["H-Wire", "Stake included"],
      ["Coroplast", "Weather resistant"],
      ["High Visibility", "Street level marketing"],
    ],
    perfectFor: ["Real Estate", "Campaigns", "Contractors", "Events", "Schools", "Local Ads"],
    sectionKicker: "Outdoor signage",
    sectionTitle: "Yard signs for streets, lawns and local promotions",
    cards: [
      ["Materials", ["4 mm coroplast", "Full color", "Outdoor display"]],
      ["Install", ["H-wire stake", "Easy placement", "Lightweight"]],
      ["Best For", ["Real estate", "Political signs", "Contractor ads"]],
    ],
    steps: ["Pick quantity", "Confirm single or double side", "Upload file", "Print and prepare signs"],
    ctaTitle: "Need yard signs?",
    ctaCopy: "Tell us quantity, single or double sided, and deadline for the best recommendation.",
    ctaButton: "Ask About Yard Signs",
  },
  shirts: {
    kicker: "Custom apparel",
    titleTop: "Custom",
    titleBottom: "T-Shirts",
    copy: "Start a shirt order with Gildan G500 tees, front left chest and back print options, then finish in the T-shirt designer.",
    images: ["assets/tshirt-showcase.png", "assets/customtshirts.png"],
    imageAlt: ["Custom T-shirt printing", "Custom shirt examples"],
    benefits: [
      ["Gildan G500", "Heavy cotton"],
      ["10 Colors", "Basic color options"],
      ["Front & Back", "Left chest and back"],
      ["Online Designer", "Build your order"],
    ],
    perfectFor: ["Teams", "Events", "Schools", "Churches", "Businesses", "Organizations"],
    sectionKicker: "Apparel printing",
    sectionTitle: "Custom shirts connected to the online designer",
    cards: [
      ["Shirt Setup", ["Gildan G500", "Front left chest", "Back print"]],
      ["Order Options", ["Sizes S to 5XL", "Multiple colors", "Quantity matrix"]],
      ["Checkout", ["Customer info", "Shipping or pickup", "PayPal ready"]],
    ],
    steps: ["Open shirt designer", "Choose colors and sizes", "Approve design", "Checkout securely"],
    ctaTitle: "Need shirts for a group?",
    ctaCopy: "Use the T-shirt designer to build your order, or contact us for larger group pricing.",
    ctaButton: "Start T-Shirt Order",
    ctaHref: "tshirt.html",
  },
};

const printCatalogOverview = {
  en: {
    hero: {
      kicker: "Business Printing",
      titleTop: "Print Products",
      titleBottom: "Made To Impress",
      copy: "Business cards, flyers, menus, stickers and marketing prints prepared with clean color, sharp details and fast local service in Brooklyn.",
      benefits: [
        ["Premium Cardstock", "Glossy or matte finish"],
        ["Flyers & Menus", "Promote events fast"],
        ["Sharp Full Color", "Clean brand presentation"],
        ["Local Turnaround", "Brooklyn pickup available"]
      ],
      perfectFor: ["Businesses", "Events", "Restaurants", "Promotions", "Local Shops"]
    },
    detail: {
      kicker: "Choose a product",
      title: "Explore Print Products",
      hook: "Choose a product from the menu to compare options, quantities and pricing before starting your order.",
      material: "Business cards, flyers, stickers, menus, banners, door hangers, retractable displays, yard signs and custom apparel.",
      benefits: ["Choose the product category", "Compare sizes and quantities", "Start your order when ready"]
    },
    service: {
      title: "Business, Event and Everyday Printing",
      cards: [
        ["Business Materials", "Business cards\nFlyers and brochures\nPostcards and menus\nInvoices and forms"],
        ["Signs and Display", "Banners and posters\nBackdrops\nYard signs\nCar signs and lettering"],
        ["Custom Products", "Stickers and labels\nT-shirts\nEmbroidery coordination\nSpecial print requests"]
      ],
      steps: [
        ["1", "Send your file or idea"],
        ["2", "Confirm size, quantity and finish"],
        ["3", "Approve and print"],
        ["4", "Pick up or coordinate delivery"]
      ],
      cta: "Need a price?"
    }
  },
  es: {
    hero: {
      kicker: "Impresion Comercial",
      titleTop: "Productos de Impresion",
      titleBottom: "Que Impactan",
      copy: "Tarjetas, flyers, menus, stickers y materiales promocionales con color limpio, detalles definidos y servicio local rapido en Brooklyn.",
      benefits: [
        ["Cartulina Premium", "Acabado brillante o mate"],
        ["Flyers y Menus", "Promociona eventos rapido"],
        ["Color de Alta Calidad", "Presentacion clara de marca"],
        ["Entrega Local", "Recogida disponible en Brooklyn"]
      ],
      perfectFor: ["Negocios", "Eventos", "Restaurantes", "Promociones", "Tiendas locales"]
    },
    detail: {
      kicker: "Elige un producto",
      title: "Explora Productos de Impresion",
      hook: "Elige un producto del menu para comparar opciones, cantidades y precios antes de iniciar tu orden.",
      material: "Tarjetas, flyers, stickers, menus, banners, door hangers, displays retractables, yard signs y ropa personalizada.",
      benefits: ["Elige la categoria", "Compara medidas y cantidades", "Inicia tu orden cuando estes listo"]
    },
    service: {
      title: "Impresion para Negocios, Eventos y Cada Dia",
      cards: [
        ["Materiales Comerciales", "Tarjetas de negocio\nFlyers y folletos\nPostales y menus\nFacturas y formularios"],
        ["Letreros y Exhibidores", "Banners y posters\nBackdrops\nYard signs\nRotulacion de autos"],
        ["Productos Personalizados", "Stickers y etiquetas\nT-shirts\nCoordinacion de bordado\nPedidos especiales"]
      ],
      steps: [
        ["1", "Envia tu archivo o idea"],
        ["2", "Confirma medida, cantidad y acabado"],
        ["3", "Aprueba e imprime"],
        ["4", "Recoge o coordina entrega"]
      ],
      cta: "Necesitas un precio?"
    }
  }
};

const bannerProducts = [
  { name: "Banner 24x36", category: "banners", memberPrices: [["1", "$18.95"]], prices: [["1", "$23.95"]] },
  { name: "Banner 48x24", category: "banners", memberPrices: [["1", "$23.50"]], prices: [["1", "$29.95"]] },
  { name: "Banner 60x36", category: "banners", memberPrices: [["1", "$36.50"]], prices: [["1", "$45.95"]] },
  { name: "Banner 72x24", category: "banners", memberPrices: [["1", "$44.99"]], prices: [["1", "$55.95"]] },
  { name: "Banner 72x36", category: "banners", memberPrices: [["1", "$45.99"]], prices: [["1", "$57.95"]] },
  { name: "Banner 72x48", category: "banners", memberPrices: [["1", "$47.19"]], prices: [["1", "$58.95"]] },
  { name: "Banner 96x24", category: "banners", memberPrices: [["1", "$48.95"]], prices: [["1", "$60.95"]] },
  { name: "Banner 96x36", category: "banners", memberPrices: [["1", "$58.99"]], prices: [["1", "$73.95"]] },
  { name: "Banner 96x48", category: "banners", memberPrices: [["1", "$76.99"]], prices: [["1", "$95.95"]] },
  { name: "Banner 120x36", category: "banners", memberPrices: [["1", "$82.99"]], prices: [["1", "$103.95"]] },
  { name: "Banner 120x60", category: "banners", memberPrices: [["1", "$114.99"]], prices: [["1", "$143.95"]] },
];

const retractableProducts = [
  { name: "Retractable Banner 22x80", category: "retractable", memberPrices: [["1", "$120.00"]], prices: [["1", "$149.95"]] },
  { name: "Retractable Banner 33x80", category: "retractable", memberPrices: [["1", "$152.00"]], prices: [["1", "$189.95"]] },
];

const backdropProducts = [
  { name: "Backdrop 60x96", category: "backdrops", memberPrices: [["1", "$107.99"]], prices: [["1", "$134.95"]] },
  { name: "Backdrop 96x96", category: "backdrops", memberPrices: [["1", "$165.99"]], prices: [["1", "$207.95"]] },
  { name: "Backdrop 120x96", category: "backdrops", memberPrices: [["1", "$204.99"]], prices: [["1", "$255.95"]] },
  { name: "Backdrop 144x96", category: "backdrops", memberPrices: [["1", "$243.50"]], prices: [["1", "$304.95"]] },
  { name: "Backdrop 240x96", category: "backdrops", memberPrices: [["1", "$399.49"]], prices: [["1", "$499.95"]] },
];

const yardSignPrices = [["1", "$33.95"], ["5", "$100.95"], ["10", "$180.95"], ["15", "$265.95"], ["20", "$353.95"], ["30", "$509.95"], ["40", "$677.95"], ["50", "$815.95"]];
const yardSignMemberPrices = [["1", "$26.99"], ["5", "$80.99"], ["10", "$144.99"], ["15", "$212.99"], ["20", "$282.99"], ["30", "$407.99"], ["40", "$541.99"], ["50", "$652.99"]];

const printingProducts = [
  { name: "Business Cards", category: "cards", memberPrices: [["100", "$25.75"], ["250", "$29.87"], ["500", "$31.93"], ["1000", "$42.28"], ["2500", "$85.50"], ["5000", "$116.40"], ["10000", "$254.40"]], prices: [["100", "$35.00"], ["250", "$45.00"], ["500", "$55.00"], ["1000", "$70.00"], ["2500", "$110.00"], ["5000", "$155.00"], ["10000", "$303.00"]] },
  { name: "Flyers 4x6", category: "flyers", memberPrices: [["100", "$28.84"], ["250", "$50.43"], ["500", "$58.67"], ["1000", "$69.02"], ["2500", "$149.35"], ["5000", "$178.22"], ["10000", "$278.81"]], prices: [["100", "$41.00"], ["250", "$65.00"], ["500", "$75.00"], ["1000", "$85.00"], ["2500", "$170.00"], ["5000", "$210.00"], ["10000", "$340.00"]] },
  { name: "Flyers 5x7", category: "flyers", memberPrices: [["100", "$59.70"], ["250", "$87.51"], ["500", "$102.95"], ["1000", "$118.46"], ["2500", "$227.62"], ["5000", "$295.28"], ["10000", "$413.02"]], prices: [["100", "$75.00"], ["250", "$104.00"], ["500", "$126.00"], ["1000", "$149.00"], ["2500", "$285.00"], ["5000", "$371.00"], ["10000", "$523.00"]] },
  { name: "Flyers 8.5x11", category: "flyers", memberPrices: [["100", "$130.21"], ["250", "$147.74"], ["500", "$164.29"], ["1000", "$220.10"], ["2500", "$335.76"], ["5000", "$380.03"], ["10000", "$665.32"]], prices: [["100", "$160.00"], ["250", "$200.00"], ["500", "$280.00"], ["1000", "$370.00"], ["2500", "$550.00"], ["5000", "$596.00"], ["10000", "$890.00"]] },
  { name: "Stickers round 2\"", category: "stickers", memberPrices: [["100", "$42.25"], ["250", "$74.12"], ["500", "$62.79"], ["1000", "$72.06"], ["2500", "$113.31"], ["5000", "$184.32"], ["10000", "$322.01"]], prices: [["100", "$52.00"], ["250", "$85.00"], ["500", "$90.00"], ["1000", "$96.00"], ["2500", "$145.00"], ["5000", "$226.00"], ["10000", "$399.00"]] },
  { name: "Stickers round 2.5\"", category: "stickers", memberPrices: [["100", "$52.49"], ["250", "$102.95"], ["500", "$107.08"], ["1000", "$115.37"], ["2500", "$166.84"], ["5000", "$255.43"], ["10000", "$425.39"]], prices: [["100", "$62.00"], ["250", "$123.00"], ["500", "$128.00"], ["1000", "$138.00"], ["2500", "$204.00"], ["5000", "$314.00"], ["10000", "$533.00"]] },
  { name: "Stickers 2x3.5", category: "stickers", memberPrices: [["100", "$27.78"], ["250", "$46.31"], ["500", "$48.37"], ["1000", "$52.49"], ["2500", "$80.30"], ["5000", "$125.64"], ["10000", "$216.27"]], prices: [["100", "$38.00"], ["250", "$56.00"], ["500", "$62.00"], ["1000", "$65.00"], ["2500", "$110.00"], ["5000", "$153.00"], ["10000", "$267.00"]] },
  { name: "Stickers 2x2", category: "stickers", memberPrices: [["100", "$23.66"], ["250", "$31.93"], ["500", "$32.97"], ["1000", "$37.05"], ["2500", "$57.64"], ["5000", "$90.60"], ["10000", "$156.51"]], prices: [["100", "$28.00"], ["250", "$38.00"], ["500", "$48.00"], ["1000", "$56.00"], ["2500", "$70.00"], ["5000", "$109.00"], ["10000", "$191.00"]] },
  { name: "Stickers 4x4", category: "stickers", memberPrices: [["100", "$53.52"], ["250", "$94.72"], ["500", "$99.88"], ["1000", "$109.86"], ["2500", "$169.90"], ["5000", "$261.56"], ["10000", "$435.61"]], prices: [["100", "$65.00"], ["250", "$115.00"], ["500", "$123.00"], ["1000", "$133.00"], ["2500", "$207.00"], ["5000", "$322.00"], ["10000", "$542.00"]] },
  { name: "Menus 8.5x11", category: "menus", memberPrices: [["100", "$130.21"], ["250", "$147.74"], ["500", "$164.29"], ["1000", "$220.10"], ["2500", "$335.76"], ["5000", "$380.03"], ["10000", "$665.32"]], prices: [["100", "$160.00"], ["250", "$200.00"], ["500", "$280.00"], ["1000", "$370.00"], ["2500", "$550.00"], ["5000", "$596.00"], ["10000", "$890.00"]] },
  { name: "Menus 11x17", category: "menus", memberPrices: [["100", "$268.39"], ["250", "$363.72"], ["500", "$485.55"], ["1000", "$556.97"], ["2500", "$720.19"], ["5000", "$871.89"], ["10000", "$1,290.45"]], prices: [["100", "$333.00"], ["250", "$453.00"], ["500", "$606.00"], ["1000", "$696.00"], ["2500", "$904.00"], ["5000", "$1,096.00"], ["10000", "$1,622.00"]] },
  ...bannerProducts,
  { name: "Door Hangers 4x11", category: "hangers", memberPrices: [["100", "$110.90"], ["250", "$144.36"], ["500", "$166.35"], ["1000", "$184.16"], ["2500", "$367.43"], ["5000", "$412.48"], ["10000", "$813.31"]], prices: [["100", "$133.00"], ["250", "$174.00"], ["500", "$201.00"], ["1000", "$223.00"], ["2500", "$451.00"], ["5000", "$508.00"], ["10000", "$1,007.00"]] },
  { name: "Door Hangers 3.5x8.5", category: "hangers", memberPrices: [["100", "$83.64"], ["250", "$107.73"], ["500", "$123.40"], ["1000", "$134.96"], ["2500", "$269.86"], ["5000", "$301.98"], ["10000", "$594.31"]], prices: [["100", "$127.00"], ["250", "$166.00"], ["500", "$192.00"], ["1000", "$213.00"], ["2500", "$428.00"], ["5000", "$483.00"], ["10000", "$958.00"]] },
  ...retractableProducts,
  ...backdropProducts,
  { name: "Yard Sign", category: "yardSigns", memberPrices: yardSignMemberPrices, prices: yardSignPrices },
  { name: "Gildan G500 T-Shirt", category: "shirts", memberPrices: [["1", "$15.00"]], prices: [["1", "$35.00"]] },
];

const productGroups = [
  { name: "Business Cards", category: "cards", variants: ["Business Cards"] },
  { name: "Flyers", category: "flyers", variants: ["Flyers 4x6", "Flyers 5x7", "Flyers 8.5x11"] },
  {
    name: "Stickers",
    category: "stickers",
    variants: ["Stickers round 2\"", "Stickers round 2.5\"", "Stickers 2x3.5", "Stickers 2x2", "Stickers 4x4"],
  },
  { name: "Menus", category: "menus", variants: ["Menus 8.5x11", "Menus 11x17"] },
  { name: "Banners", category: "banners", variants: bannerProducts.map((product) => product.name) },
  { name: "Backdrops", category: "backdrops", variants: backdropProducts.map((product) => product.name) },
  { name: "Door Hangers", category: "hangers", variants: ["Door Hangers 4x11", "Door Hangers 3.5x8.5"] },
  { name: "Retractable Banners", category: "retractable", variants: retractableProducts.map((product) => product.name) },
  { name: "Yard Signs", category: "yardSigns", variants: ["Yard Sign"] },
  { name: "T-Shirts", category: "shirts", variants: ["Gildan G500 T-Shirt"] },
].map((group) => ({
  ...group,
  slug: productSlugs[group.category] || slugify(group.name),
  variants: group.variants.map((name) => printingProducts.find((product) => product.name === name)).filter(Boolean),
}));

const productList = document.querySelector("#productList");
const productTitle = document.querySelector("#productTitle");
const productKicker = document.querySelector("#productKicker");
const productArt = document.querySelector("#productArt");
const productHook = document.querySelector("#productHook");
const productMaterial = document.querySelector("#productMaterial");
const productBenefits = document.querySelector("#productBenefits");
const productSize = document.querySelector("#productSize");
const productQuantity = document.querySelector("#productQuantity");
const bannerCustomSizeFields = document.querySelector("#bannerCustomSizeFields");
const bannerCustomWidth = document.querySelector("#bannerCustomWidth");
const bannerCustomHeight = document.querySelector("#bannerCustomHeight");
const bannerCustomQuantity = document.querySelector("#bannerCustomQuantity");
const productPrice = document.querySelector("#productPrice");
const productOrderLink = document.querySelector("#productOrderLink");
const productUploadLink = document.querySelector("#productUploadLink");
const productOrderPanel = document.querySelector(".product-order-panel");
const productConfigurationOptions = document.querySelector("#productConfigurationOptions");
const roundedCornersField = document.querySelector("#roundedCornersField");
const cardRoundedCorners = document.querySelector("#cardRoundedCorners");
const cardPrintedSide = document.querySelector("#cardPrintedSide");
const cardPaperType = document.querySelector("#cardPaperType");
const cardCoating = document.querySelector("#cardCoating");
const stickerConfigurationOptions = document.querySelector("#stickerConfigurationOptions");
const stickerFrontSide = document.querySelector("#stickerFrontSide");
const stickerBackSide = document.querySelector("#stickerBackSide");
const stickerMaterial = document.querySelector("#stickerMaterial");
const menuConfigurationOptions = document.querySelector("#menuConfigurationOptions");
const menuFrontSide = document.querySelector("#menuFrontSide");
const menuBackSide = document.querySelector("#menuBackSide");
const menuPaperStock = document.querySelector("#menuPaperStock");
const menuCoating = document.querySelector("#menuCoating");
const menuFolding = document.querySelector("#menuFolding");
const bannerConfigurationOptions = document.querySelector("#bannerConfigurationOptions");
const bannerFrontSide = document.querySelector("#bannerFrontSide");
const bannerBackSide = document.querySelector("#bannerBackSide");
const bannerMaterial = document.querySelector("#bannerMaterial");
const bannerTreatment = document.querySelector("#bannerTreatment");
const hangerConfigurationOptions = document.querySelector("#hangerConfigurationOptions");
const hangerFrontSide = document.querySelector("#hangerFrontSide");
const hangerBackSide = document.querySelector("#hangerBackSide");
const hangerPaperStock = document.querySelector("#hangerPaperStock");
const hangerCoating = document.querySelector("#hangerCoating");
const retractableConfigurationOptions = document.querySelector("#retractableConfigurationOptions");
const retractableDisplayOptions = document.querySelector("#retractableDisplayOptions");
const retractableBannerStand = document.querySelector("#retractableBannerStand");
const retractableFrontSide = document.querySelector("#retractableFrontSide");
const retractableBackSide = document.querySelector("#retractableBackSide");
const retractableMaterial = document.querySelector("#retractableMaterial");
const retractablePanels = document.querySelector("#retractablePanels");
const yardSignConfigurationOptions = document.querySelector("#yardSignConfigurationOptions");
const yardSignFrontSide = document.querySelector("#yardSignFrontSide");
const yardSignBackSide = document.querySelector("#yardSignBackSide");
const yardSignMaterial = document.querySelector("#yardSignMaterial");
const yardSignWire = document.querySelector("#yardSignWire");
const yardSignGrommets = document.querySelector("#yardSignGrommets");
const printingHeroKicker = document.querySelector("#printingHeroKicker");
const printingHeroTitleTop = document.querySelector("#printingHeroTitleTop");
const printingHeroTitleBottom = document.querySelector("#printingHeroTitleBottom");
const printingHeroCopy = document.querySelector("#printingHeroCopy");
const printingHeroBenefits = document.querySelector("#printingHeroBenefits");
const printingHeroPrimary = document.querySelector("#printingHeroPrimary");
const printingHeroSecondary = document.querySelector("#printingHeroSecondary");
const printingHeroRating = document.querySelector("#printingHeroRating");
const printingHeroImageOne = document.querySelector("#printingHeroImageOne");
const printingHeroImageTwo = document.querySelector("#printingHeroImageTwo");
const printingPerfectFor = document.querySelector("#printingPerfectFor");
const printingSectionKicker = document.querySelector("#printingSectionKicker");
const printingSectionTitle = document.querySelector("#printingSectionTitle");
const printingServiceCards = document.querySelector("#printingServiceCards");
const printingProcessSteps = document.querySelector("#printingProcessSteps");
const printingCtaTitle = document.querySelector("#printingCtaTitle");
const printingCtaCopy = document.querySelector("#printingCtaCopy");
const printingCtaButton = document.querySelector("#printingCtaButton");

let selectedGroup = null;
let selectedProduct = null;
let selectedPrice = null;

renderProductList();
const initialGroupName = groupNameFromHash();
if (initialGroupName) {
  renderProductGroup(initialGroupName, { updateHash: false });
} else {
  renderCatalogOverview();
}

window.addEventListener("hashchange", () => {
  const hashGroupName = groupNameFromHash();
  if (hashGroupName) {
    renderProductGroup(hashGroupName, { updateHash: false });
  } else {
    renderCatalogOverview();
  }
});

productSize?.addEventListener("change", () => {
  selectedProduct = selectedGroup.variants.find((item) => item.name === productSize.value) || selectedGroup.variants[0];
  selectedPrice = selectedProduct.prices[0];
  renderQuantityOptions();
  updateSelectedPrice();
});

productQuantity?.addEventListener("change", () => {
  selectedPrice = selectedProduct.prices.find((item) => item[0] === productQuantity.value) || selectedProduct.prices[0];
  updateSelectedPrice();
});

[bannerCustomWidth, bannerCustomHeight, bannerCustomQuantity].forEach((input) => {
  input?.addEventListener("input", () => {
    if (!isCustomBannerGroup()) return;
    selectedPrice = customBannerPrice();
    updateSelectedPrice();
  });
});

[cardRoundedCorners, cardPrintedSide, cardPaperType, cardCoating, stickerFrontSide, stickerBackSide, stickerMaterial, menuFrontSide, menuBackSide, menuPaperStock, menuCoating, menuFolding, bannerFrontSide, bannerBackSide, bannerMaterial, bannerTreatment, hangerFrontSide, hangerBackSide, hangerPaperStock, hangerCoating, retractableDisplayOptions, retractableBannerStand, retractableFrontSide, retractableBackSide, retractableMaterial, retractablePanels, yardSignFrontSide, yardSignBackSide, yardSignMaterial, yardSignWire, yardSignGrommets].forEach((select) => {
  select?.addEventListener("change", () => {
    updateSelectedPrice();
  });
});

function renderProductList() {
  if (!productList) return;

  productList.innerHTML = productGroups
    .map(
      (group) => `
        <button class="${selectedGroup?.name === group.name ? "active" : ""}" type="button" data-product-group="${escapeAttribute(group.name)}" data-product-slug="${escapeAttribute(group.slug)}">
          <span>${escapeHtml(group.name)}</span>
          ${group.stock ? `<small class="product-stock">Stock: ${escapeHtml(group.stock)}</small>` : ""}
        </button>
      `
    )
    .join("");

  productList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product-group]");
    if (!button) return;
    renderProductGroup(button.dataset.productGroup, { updateHash: true });
  });
}

function renderProductGroup(groupName, options = {}) {
  selectedGroup = productGroups.find((group) => group.name === groupName) || productGroups[0];
  selectedProduct = selectedGroup.variants[0];
  selectedPrice = selectedProduct.prices[0];
  if (productOrderPanel) productOrderPanel.hidden = false;

  productList?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.productGroup === selectedGroup.name);
  });

  if (productTitle) productTitle.textContent = selectedGroup.name;
  if (productKicker) {
    productKicker.textContent = `${selectedGroup.variants.length} size ${selectedGroup.variants.length === 1 ? "option" : "options"}`;
  }
  renderProductDetails(selectedProduct);
  renderProductTemplate(selectedGroup);
  renderProductOptions();

  if (productSize) {
    productSize.innerHTML = selectedGroup.variants
      .map((variant) => `<option value="${escapeAttribute(variant.name)}">${escapeHtml(sizeLabel(variant.name, selectedGroup.name))}</option>`)
      .join("");
  }

  renderQuantityOptions();
  updateSelectedPrice();
  updateHashForGroup(options);
}

function renderCatalogOverview() {
  const language = localStorage.getItem("preferredLanguage") === "es" ? "es" : "en";
  const overview = printCatalogOverview[language];
  selectedGroup = null;
  selectedProduct = null;
  selectedPrice = null;

  productList?.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
  if (productOrderPanel) {
    productOrderPanel.hidden = true;
    productOrderPanel.classList.remove("configured-product-mode", "shirt-product-mode");
  }
  [
    productConfigurationOptions,
    stickerConfigurationOptions,
    menuConfigurationOptions,
    bannerConfigurationOptions,
    hangerConfigurationOptions,
    retractableConfigurationOptions,
    yardSignConfigurationOptions,
    roundedCornersField
  ].forEach((element) => {
    if (element) element.hidden = true;
  });

  setText(printingHeroKicker, overview.hero.kicker);
  setText(printingHeroTitleTop, overview.hero.titleTop);
  setText(printingHeroTitleBottom, overview.hero.titleBottom);
  setText(printingHeroCopy, overview.hero.copy);
  setText(printingHeroRating, language === "es" ? "Con la confianza de negocios locales y equipos de eventos" : "Trusted by local businesses and event teams");
  if (printingHeroBenefits) {
    printingHeroBenefits.innerHTML = overview.hero.benefits
      .map(([title, copy]) => `<span><b>${escapeHtml(title)}</b><small>${escapeHtml(copy)}</small></span>`)
      .join("");
  }
  if (printingHeroPrimary) {
    printingHeroPrimary.href = "#productList";
    printingHeroPrimary.textContent = language === "es" ? "Elige un producto" : "Choose product";
  }
  if (printingHeroSecondary) {
    printingHeroSecondary.href = "quote.html";
    printingHeroSecondary.textContent = language === "es" ? "Solicita un presupuesto" : "Request a quote";
  }
  setImage(printingHeroImageOne, "assets/printing-business-cards-ai.webp", "Print products preview");
  setImage(printingHeroImageTwo, "assets/printing-flyers-ai.webp", "Print products preview");
  if (printingPerfectFor) {
    printingPerfectFor.innerHTML = `<strong>${language === "es" ? "Perfecto para" : "Perfect for"}</strong>${overview.hero.perfectFor
      .map((label) => `<span>${escapeHtml(label)}</span>`)
      .join("")}`;
  }

  if (productArt) {
    productArt.className = "product-art product-art-overview";
    productArt.innerHTML = `
      <img src="assets/printing-business-cards-ai.webp" alt="Business cards" loading="lazy" />
      <img src="assets/printing-flyers-ai.webp" alt="Flyers" loading="lazy" />
      <img src="assets/printing-stickers-ai.webp" alt="Stickers" loading="lazy" />
    `;
  }
  setText(productKicker, overview.detail.kicker);
  setText(productTitle, overview.detail.title);
  setText(productHook, overview.detail.hook);
  setText(productMaterial, overview.detail.material);
  if (productBenefits) {
    productBenefits.innerHTML = overview.detail.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("");
  }

  setText(printingSectionKicker, language === "es" ? "Lo que imprimimos" : "What we print");
  setText(printingSectionTitle, overview.service.title);
  if (printingServiceCards) {
    printingServiceCards.innerHTML = overview.service.cards
      .map(
        ([title, items]) => `
          <article>
            <h3>${escapeHtml(title)}</h3>
            <ul>${items.split("\n").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
        `
      )
      .join("");
  }
  if (printingProcessSteps) {
    printingProcessSteps.innerHTML = overview.service.steps
      .map(
        ([number, label]) => `
          <div>
            <strong>${escapeHtml(number)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `
      )
      .join("");
  }
  setText(printingCtaTitle, overview.service.cta);
  setText(
    printingCtaCopy,
    language === "es"
      ? "Envia cantidad, medida, material, colores y fecha limite para darte un presupuesto correcto."
      : "Send quantity, size, material, colors and deadline so we can quote it correctly."
  );
  if (printingCtaButton) {
    printingCtaButton.href = "contact.html";
    printingCtaButton.textContent = language === "es" ? "Contacta Next Print NY" : "Contact Next Print NY";
  }
}

function renderProductOptions() {
  const isBusinessCards = selectedGroup.category === "cards";
  const isFlyers = selectedGroup.category === "flyers";
  const isStickers = selectedGroup.category === "stickers";
  const isMenus = selectedGroup.category === "menus";
  const isBanners = selectedGroup.category === "banners";
  const isBackdrops = selectedGroup.category === "backdrops";
  const isHangers = selectedGroup.category === "hangers";
  const isRetractable = selectedGroup.category === "retractable";
  const isYardSigns = selectedGroup.category === "yardSigns";
  const isTshirts = selectedGroup.category === "shirts";
  const hasCardOrFlyerConfiguration = isBusinessCards || isFlyers;
  const hasConfiguration = hasCardOrFlyerConfiguration || isStickers || isMenus || isBanners || isBackdrops || isHangers || isRetractable || isYardSigns;
  if (productConfigurationOptions) productConfigurationOptions.hidden = !hasCardOrFlyerConfiguration;
  if (stickerConfigurationOptions) stickerConfigurationOptions.hidden = !isStickers;
  if (menuConfigurationOptions) menuConfigurationOptions.hidden = !isMenus;
  if (bannerConfigurationOptions) bannerConfigurationOptions.hidden = !(isBanners || isBackdrops);
  if (hangerConfigurationOptions) hangerConfigurationOptions.hidden = !isHangers;
  if (retractableConfigurationOptions) retractableConfigurationOptions.hidden = !isRetractable;
  if (yardSignConfigurationOptions) yardSignConfigurationOptions.hidden = !isYardSigns;
  if (roundedCornersField) roundedCornersField.hidden = !isBusinessCards;
  if (bannerCustomSizeFields) bannerCustomSizeFields.hidden = !isCustomBannerGroup();
  if (productSize?.closest("label")) productSize.closest("label").hidden = isCustomBannerGroup();
  if (productQuantity?.closest("label")) productQuantity.closest("label").hidden = isCustomBannerGroup();
  productOrderPanel?.classList.toggle("configured-product-mode", hasConfiguration);
  productOrderPanel?.classList.toggle("shirt-product-mode", isTshirts);
}

function renderQuantityOptions() {
  if (!productQuantity) return;

  if (isCustomBannerGroup()) {
    productQuantity.innerHTML = '<option value="1">1</option>';
    return;
  }

  productQuantity.innerHTML = selectedProduct.prices
    .map(([quantity]) => `<option value="${escapeAttribute(quantity)}">${escapeHtml(quantity)}</option>`)
    .join("");
}

function isCustomBannerGroup() {
  return Boolean(selectedGroup?.customSize);
}

function customBannerDimensions() {
  return {
    width: Math.max(1, Number(bannerCustomWidth?.value || 2)),
    height: Math.max(1, Number(bannerCustomHeight?.value || 4)),
    quantity: Math.max(1, Math.round(Number(bannerCustomQuantity?.value || 1))),
  };
}

function customBannerPrice() {
  const { width, height, quantity } = customBannerDimensions();
  const total = width * height * 9 * quantity;
  return [String(quantity), `$${total.toFixed(2)}`];
}

function customBannerMemberPrice() {
  const { width, height, quantity } = customBannerDimensions();
  const total = width * height * 7 * quantity;
  return [String(quantity), `$${total.toFixed(2)}`];
}

function selectedMemberPrice() {
  if (!selectedProduct) return selectedPrice;
  if (isCustomBannerGroup()) return customBannerMemberPrice();
  const prices = selectedProduct.memberPrices || selectedProduct.prices;
  return prices.find((item) => item[0] === selectedPrice?.[0]) || prices[0] || selectedPrice;
}

function moneyNumber(value) {
  return Number(String(value || "").replace(/[^0-9.]/g, ""));
}

function moneyDiff(regular, member) {
  const amount = Math.max(0, moneyNumber(regular) - moneyNumber(member));
  return `$${amount.toFixed(2)}`;
}

function renderProductDetails(product) {
  const details = productDetails[product.category] || productDetails.cards;

  if (productArt) {
    productArt.className = `product-art product-art-${details.visual}`;
    productArt.innerHTML = details.image
      ? `<img src="${escapeAttribute(details.image)}" alt="${escapeAttribute(product.name)} product preview" loading="lazy" />`
      : renderProductVisual(details.visual);
  }
  if (productHook) productHook.textContent = details.hook;
  if (productMaterial) productMaterial.textContent = details.material;
  if (productBenefits) {
    productBenefits.innerHTML = details.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("");
  }
}

function renderProductTemplate(group) {
  const template = productTemplateContent[group.category] || productTemplateContent.cards;

  setText(printingHeroKicker, template.kicker);
  setText(printingHeroTitleTop, template.titleTop);
  setText(printingHeroTitleBottom, template.titleBottom);
  setText(printingHeroCopy, template.copy);
  setText(printingHeroRating, template.rating || "Trusted by local businesses and event teams");

  if (printingHeroBenefits) {
    printingHeroBenefits.innerHTML = template.benefits
      .map(([title, copy]) => `<span><b>${escapeHtml(title)}</b><small>${escapeHtml(copy)}</small></span>`)
      .join("");
  }

  if (printingHeroPrimary) {
    printingHeroPrimary.href = "#productList";
    printingHeroPrimary.textContent = "Choose product";
  }

  if (printingHeroSecondary) {
    printingHeroSecondary.href = template.quoteHref || "quote.html";
    printingHeroSecondary.textContent = template.secondaryText || "Request a quote";
  }

  const [imageOne, imageTwo] = template.images || [];
  const [altOne, altTwo] = template.imageAlt || [];
  setImage(printingHeroImageOne, imageOne, altOne || group.name);
  setImage(printingHeroImageTwo, imageTwo || imageOne, altTwo || group.name);

  if (printingPerfectFor) {
    const chips = (template.perfectFor || []).map((label) => `<span>${escapeHtml(label)}</span>`).join("");
    printingPerfectFor.innerHTML = `<strong>${escapeHtml(template.perfectForTitle || "Perfect for")}</strong>${chips}`;
  }

  setText(printingSectionKicker, template.sectionKicker);
  setText(printingSectionTitle, template.sectionTitle);

  if (printingServiceCards) {
    printingServiceCards.innerHTML = template.cards
      .map(
        ([title, items]) => `
          <article>
            <h3>${escapeHtml(title)}</h3>
            <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
        `
      )
      .join("");
  }

  if (printingProcessSteps) {
    printingProcessSteps.innerHTML = template.steps
      .map(
        (step, index) => `
          <div>
            <strong>${index + 1}</strong>
            <span>${escapeHtml(step)}</span>
          </div>
        `
      )
      .join("");
  }

  setText(printingCtaTitle, template.ctaTitle);
  setText(printingCtaCopy, template.ctaCopy);
  if (printingCtaButton) {
    printingCtaButton.href = template.ctaHref || "contact.html";
    printingCtaButton.textContent = template.ctaButton || "Contact Next Print NY";
  }
}

function renderProductVisual(type) {
  const visuals = {
    cards: `<div class="mockup-card-stack"><span>NP</span><span></span><span></span></div>`,
    flyers: `<div class="mockup-flyers"><span>SALE</span><strong>NP</strong><em>Print-ready flyers</em></div>`,
    stickers: `<div class="mockup-stickers"><span>NP</span><span>NY</span><span>PRINT</span></div>`,
    menus: `<div class="mockup-menu"><strong>MENU</strong><span></span><span></span><span></span><em>Next Print NY</em></div>`,
    banners: `<div class="mockup-banner"><span>GRAND OPENING</span><strong>NEXT PRINT NY</strong></div>`,
    hangers: `<div class="mockup-hanger"><span></span><strong>DOOR OFFER</strong><em>Scan - Call - Visit</em></div>`,
    shirts: `<div class="mockup-shirt"><span>YOUR DESIGN</span></div>`,
  };
  return visuals[type] || visuals.cards;
}

function setText(element, text) {
  if (element && text) element.textContent = text;
}

function setImage(image, src, alt) {
  if (!image || !src) return;
  image.src = src;
  image.alt = alt || "";
}

function updateSelectedPrice() {
  if (isCustomBannerGroup()) selectedPrice = customBannerPrice();
  if (productPrice) productPrice.textContent = selectedPrice[1];
  if (productOrderLink) {
    if (selectedGroup.category === "shirts") {
      productPrice.innerHTML = `$35.00 <small>${localStorage.getItem("preferredLanguage") === "es" ? "regular" : "regular"}</small>`;
      productOrderLink.href = "tshirt.html";
      productOrderLink.textContent = localStorage.getItem("preferredLanguage") === "es" ? "Diseñar camiseta" : "Design T-shirt";
      if (productUploadLink) productUploadLink.hidden = true;
      return;
    }
    productOrderLink.textContent = localStorage.getItem("preferredLanguage") === "es" ? "Diseñar en línea" : "Design online";
    const info = productDetails[selectedProduct.category] || productDetails.cards;
    const configuration = [];
    if (selectedGroup.category === "cards") {
      configuration.push(`Rounded Corners: ${cardRoundedCorners?.value || "No"}`);
    }
    if (selectedGroup.category === "cards" || selectedGroup.category === "flyers") {
      configuration.push(
        `Printed Side: ${cardPrintedSide?.value || "Front and Back"}`,
        `Paper Type: ${cardPaperType?.value || "14 pt. Cardstock"}`,
        `Coating: ${cardCoating?.value || "High Gloss"}`
      );
    }
    if (selectedGroup.category === "stickers") {
      configuration.push(
        `Front Side: ${stickerFrontSide?.value || "Full Color"}`,
        `Back Side: ${stickerBackSide?.value || "No Printing"}`,
        `Material: ${stickerMaterial?.value || "High Gloss White Outdoor Vinyl"}`
      );
    }
    if (selectedGroup.category === "menus") {
      configuration.push(
        `Front Side: ${menuFrontSide?.value || "Full Color"}`,
        `Back Side: ${menuBackSide?.value || "Full Color"}`,
        `Paper Stock: ${menuPaperStock?.value || "80 lb. Paper"}`,
        `Coating: ${menuCoating?.value || "Gloss Both Sides"}`,
        `Folding Option: ${menuFolding?.value || "Half Fold"}`
      );
    }
    if (selectedGroup.category === "banners" || selectedGroup.category === "backdrops") {
      configuration.push(
        `Front Side: ${bannerFrontSide?.value || "Full Color"}`,
        `Back Side: ${bannerBackSide?.value || "No Printing"}`,
        `Material: ${selectedGroup.category === "backdrops" ? "Backdrop Material" : bannerMaterial?.value || "13 oz. Standard Vinyl"}`,
        `Treatment: ${bannerTreatment?.value || "None"}`
      );
    }
    if (selectedGroup.category === "hangers") {
      configuration.push(
        `Front Side: ${hangerFrontSide?.value || "Full Color"}`,
        `Back Side: ${hangerBackSide?.value || "Full Color"}`,
        `Paper Stock: ${hangerPaperStock?.value || "14 pt. Cardstock"}`,
        `Coating: ${hangerCoating?.value || "High Gloss UV"}`
      );
    }
    if (selectedGroup.category === "retractable") {
      configuration.push(
        `Display Options: ${retractableDisplayOptions?.value || "Stand + 1 Banner (Single Sided)"}`,
        `Banner Stand: ${retractableBannerStand?.value || 'Standard Retractable 33"'}`,
        `Front Side: ${retractableFrontSide?.value || "Full Color"}`,
        `Back Side: ${retractableBackSide?.value || "No Printing"}`,
        `Paper Stock: ${retractableMaterial?.value || "13 oz. Smooth Blockout Vinyl"}`,
        `Panels: ${retractablePanels?.value || "1 Panel"}`
      );
    }
    if (selectedGroup.category === "yardSigns") {
      configuration.push(
        `Front Side: ${yardSignFrontSide?.value || "Full Color"}`,
        `Back Side: ${yardSignBackSide?.value || "No Printing"}`,
        `Material: ${yardSignMaterial?.value || "4 mm Coroplast Board"}`,
        `H-Wire: ${yardSignWire?.value || 'XL 9 Gauge H-Wire (24" tall x 10" wide)'}`,
        `Grommets: ${yardSignGrommets?.value || "None"}`
      );
    }
    const bannerSize = isCustomBannerGroup() ? `${customBannerDimensions().width} ft x ${customBannerDimensions().height} ft` : sizeLabel(selectedProduct.name, selectedGroup.name);
    const bannerProduct = isCustomBannerGroup() ? `${bannerMaterial?.value || "13 oz. Standard Vinyl"} ${bannerSize}` : selectedProduct.name;
    const memberPrice = selectedMemberPrice();
    const memberSavings = moneyDiff(selectedPrice[1], memberPrice?.[1]);
    const details = [
      `Product: ${bannerProduct}`,
      `Size: ${bannerSize}`,
      ...configuration,
      `Quantity: ${selectedPrice[0]}`,
      `Regular customer price: ${selectedPrice[1]}`,
      memberPrice?.[1] ? `Member price: ${memberPrice[1]}` : "",
      memberPrice?.[1] ? `Membership savings: ${memberSavings}` : "",
      `Product information: ${info.material}`,
    ].filter(Boolean).join("\n");
    const params = new URLSearchParams({
      service: "Printing",
      product: bannerProduct,
      quantity: selectedPrice[0],
      price: selectedPrice[1],
      memberPrice: memberPrice?.[1] || selectedPrice[1],
      details,
    });
    params.set("roundedCorners", cardRoundedCorners?.value || "No");
    params.set("printedSide", cardPrintedSide?.value || "Front and Back");
    params.set("paperType", cardPaperType?.value || "14 pt. Cardstock");
    params.set("coating", cardCoating?.value || "High Gloss");
    if (["cards", "flyers", "stickers", "menus", "hangers"].includes(selectedGroup.category)) {
      productOrderLink.href = `print-products-upload.html?${params.toString()}`;
      if (productUploadLink) productUploadLink.hidden = true;
    } else if (selectedGroup.category === "banners" || selectedGroup.category === "backdrops") {
      const banner = customBannerDimensions();
      if (isCustomBannerGroup()) {
        params.set("customBanner", "1");
        params.set("width", banner.width);
        params.set("height", banner.height);
        params.set("quantity", banner.quantity);
        params.set("material", bannerMaterial?.value || "13 oz. Standard Vinyl");
        params.set("treatment", bannerTreatment?.value || "None");
      }
      productOrderLink.href = `print-products-upload.html?${params.toString()}`;
      if (productUploadLink) productUploadLink.hidden = true;
    } else if (selectedGroup.category === "retractable" || selectedGroup.category === "yardSigns") {
      productOrderLink.href = `print-products-upload.html?${params.toString()}`;
      if (productUploadLink) productUploadLink.hidden = true;
    } else {
      productOrderLink.href = `order.html?${params.toString()}`;
      if (productUploadLink) productUploadLink.hidden = true;
    }
  }
}

function sizeLabel(productName, groupName) {
  if (groupName === "Business Cards") return '3.75" x 2.25" with bleed';
  if (groupName === "Menus") return `${productName.replace(/^Menus\s*/i, "").replace(/x/i, " x ")} Take Out Menus`;
  if (groupName === "Banners") {
    const [width, height] = productName.replace(/^Banner\s*/i, "").split("x");
    return `${width} x ${height}`;
  }
  if (groupName === "Backdrops") return productName.replace(/^Backdrop\s*/i, "").replace(/x/i, " x ");
  if (groupName === "Retractable Banners") return productName.replace(/^Retractable Banner\s*/i, "").replace(/x/i, " x ");
  if (groupName === "Yard Signs") return "18 x 24 inches";
  if (groupName === "T-Shirts") return "Gildan G500 Unisex Heavy Cotton";
  return productName.replace(/^Flyers\s*/i, "").replace(/^Stickers\s*/i, "").replace(/^Menus\s*/i, "").replace(/^Banner\s*/i, "").replace(/^Door Hangers\s*/i, "");
}

function bannerDesignerHref(product, category) {
  const params = new URLSearchParams(signDesignerParams(product, category));
  return `banner-designer/designer?${params.toString()}`;
}

function signDesignerParams(product, category) {
  if (category === "banners") {
    const [width = "4", height = "4"] = String(product?.name || "")
      .replace(/^Banner\s*/i, "")
      .split("x")
      .map((value) => value.trim())
      .filter(Boolean);

    return { product: "Banner", width, height };
  }

  if (category === "retractable") {
    return { product: "Retractable Banner", width: "3", height: "7" };
  }

  if (category === "yardSigns") {
    return { product: "Yard Sign", width: "1.5", height: "2" };
  }

  return { product: "Banner", width: "4", height: "4" };
}

function groupNameFromHash() {
  const hash = decodeURIComponent(window.location.hash || "").replace(/^#/, "").trim();
  if (!hash) return "";
  const normalized = slugify(hash);
  const group = productGroups.find((item) => item.slug === normalized || slugify(item.name) === normalized || slugify(item.category) === normalized);
  return group?.name || "";
}

function updateHashForGroup(options = {}) {
  if (options.updateHash !== true || !selectedGroup?.slug) return;
  const nextHash = `#${selectedGroup.slug}`;
  if (window.location.hash === nextHash) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
}

function slugify(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
