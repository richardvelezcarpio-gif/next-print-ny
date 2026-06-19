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
      ["Local Pickup", "Brooklyn service"],
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

const yardSignPrices = Array.from({ length: 100 }, (_, index) => {
  const quantity = index + 1;
  const unitPrice = quantity <= 25 ? 40 : quantity <= 50 ? 35 : 30;
  return [String(quantity), `$${(quantity * unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`];
});

const printingProducts = [
  { name: "Business Cards", category: "cards", prices: [["100", "$35.00"], ["250", "$55.00"], ["500", "$65.00"], ["1000", "$119.00"], ["2500", "$180.00"], ["5000", "$220.00"], ["10000", "$370.00"]] },
  { name: "Flyers 4x6", category: "flyers", prices: [["100", "$49.00"], ["250", "$79.00"], ["500", "$99.00"], ["1000", "$150.00"], ["2500", "$249.00"], ["5000", "$349.00"], ["10000", "$420.00"]] },
  { name: "Flyers 5x7", category: "flyers", prices: [["100", "$95.00"], ["250", "$140.00"], ["500", "$180.00"], ["1000", "$240.00"], ["2500", "$390.00"], ["5000", "$450.00"], ["10000", "$650.00"]] },
  { name: "Flyers 8.5x11", category: "flyers", prices: [["100", "$160.00"], ["250", "$200.00"], ["500", "$280.00"], ["1000", "$370.00"], ["2500", "$550.00"], ["5000", "$596.00"], ["10000", "$890.00"]] },
  { name: "Stickers round 2\"", category: "stickers", prices: [["100", "$70.00"], ["250", "$116.00"], ["500", "$130.00"], ["1000", "$190.00"], ["2500", "$280.00"], ["5000", "$380.00"], ["10000", "$580.00"]] },
  { name: "Stickers round 2.5\"", category: "stickers", prices: [["100", "$100.00"], ["250", "$180.00"], ["500", "$190.00"], ["1000", "$220.00"], ["2500", "$350.00"], ["5000", "$450.00"], ["10000", "$720.00"]] },
  { name: "Stickers 2x3.5", category: "stickers", prices: [["100", "$75.00"], ["250", "$110.00"], ["500", "$140.00"], ["1000", "$160.00"], ["2500", "$190.00"], ["5000", "$240.00"], ["10000", "$420.00"]] },
  { name: "Stickers 2x2", category: "stickers", prices: [["100", "$65.00"], ["250", "$95.00"], ["500", "$135.00"], ["1000", "$155.00"], ["2500", "$185.00"], ["5000", "$230.00"], ["10000", "$330.00"]] },
  { name: "Stickers 2x4", category: "stickers", prices: [["100", "$90.00"], ["250", "$135.00"], ["500", "$160.00"], ["1000", "$185.00"], ["2500", "$230.00"], ["5000", "$295.00"], ["10000", "$480.00"]] },
  { name: "Stickers 4x4", category: "stickers", prices: [["100", "$110.00"], ["250", "$170.00"], ["500", "$190.00"], ["1000", "$220.00"], ["2500", "$350.00"], ["5000", "$470.00"], ["10000", "$750.00"]] },
  { name: "Menus 8.5x11", category: "menus", prices: [["100", "$160.00"], ["250", "$200.00"], ["500", "$280.00"], ["1000", "$370.00"], ["2500", "$550.00"], ["5000", "$596.00"], ["10000", "$890.00"]] },
  { name: "Menus 11x17", category: "menus", prices: [["100", "$315.00"], ["250", "$450.00"], ["500", "$620.00"], ["1000", "$780.00"], ["2500", "$900.00"], ["5000", "$1,120.00"], ["10000", "$1,558.00"]] },
  { name: "Banner 2x4", category: "banners", prices: [["1", "$88.00"]] },
  { name: "Banner 2x6", category: "banners", prices: [["1", "$120.00"]] },
  { name: "Banner 3x6", category: "banners", prices: [["1", "$180.00"]] },
  { name: "Banner 2x8", category: "banners", prices: [["1", "$221.33"]] },
  { name: "Banner 2x10", category: "banners", prices: [["1", "$267.33"]] },
  { name: "Door Hangers 4x11", category: "hangers", prices: [["100", "$202.00"], ["250", "$236.00"], ["500", "$277.00"], ["1000", "$310.00"], ["2500", "$483.00"], ["5000", "$560.00"], ["10000", "$1,050.00"]] },
  { name: "Door Hangers 3.5x8.5", category: "hangers", prices: [["100", "$160.00"], ["250", "$197.00"], ["500", "$219.00"], ["1000", "$240.00"], ["2500", "$367.00"], ["5000", "$485.00"], ["10000", "$775.00"]] },
  { name: "Retractable Banner", category: "retractable", prices: [["1", "$180.00"], ["2", "$360.00"], ["3", "$540.00"], ["4", "$720.00"], ["5", "$900.00"], ["6", "$1,080.00"], ["7", "$1,260.00"], ["8", "$1,440.00"], ["9", "$1,620.00"], ["10", "$1,800.00"]] },
  { name: "Yard Sign", category: "yardSigns", prices: yardSignPrices },
  { name: "Gildan G500 T-Shirt", category: "shirts", prices: [["1", "$14.00"]] },
];

const productGroups = [
  { name: "Business Cards", category: "cards", variants: ["Business Cards"] },
  { name: "Flyers", category: "flyers", variants: ["Flyers 4x6", "Flyers 5x7", "Flyers 8.5x11"] },
  {
    name: "Stickers",
    category: "stickers",
    variants: ["Stickers round 2\"", "Stickers round 2.5\"", "Stickers 2x3.5", "Stickers 2x2", "Stickers 2x4", "Stickers 4x4"],
  },
  { name: "Menus", category: "menus", variants: ["Menus 8.5x11", "Menus 11x17"] },
  { name: "Banners", category: "banners", variants: ["Banner 2x4", "Banner 2x6", "Banner 3x6", "Banner 2x8", "Banner 2x10"] },
  { name: "Door Hangers", category: "hangers", variants: ["Door Hangers 4x11", "Door Hangers 3.5x8.5"] },
  { name: "Retractable Banners", category: "retractable", stock: 10, variants: ["Retractable Banner"] },
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
const productPrice = document.querySelector("#productPrice");
const productOrderLink = document.querySelector("#productOrderLink");
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

let selectedGroup = productGroups[0];
let selectedProduct = selectedGroup.variants[0];
let selectedPrice = selectedProduct.prices[0];

renderProductList();
renderProductGroup(groupNameFromHash() || selectedGroup.name, { updateHash: false });

window.addEventListener("hashchange", () => {
  const hashGroupName = groupNameFromHash();
  if (hashGroupName) renderProductGroup(hashGroupName, { updateHash: false });
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

[cardRoundedCorners, cardPrintedSide, cardPaperType, cardCoating, stickerFrontSide, stickerBackSide, stickerMaterial, menuFrontSide, menuBackSide, menuPaperStock, menuCoating, menuFolding, bannerFrontSide, bannerBackSide, bannerMaterial, bannerTreatment, hangerFrontSide, hangerBackSide, hangerPaperStock, hangerCoating, retractableDisplayOptions, retractableBannerStand, retractableFrontSide, retractableBackSide, retractableMaterial, retractablePanels, yardSignFrontSide, yardSignBackSide, yardSignMaterial, yardSignWire, yardSignGrommets].forEach((select) => {
  select?.addEventListener("change", updateSelectedPrice);
});

function renderProductList() {
  if (!productList) return;

  productList.innerHTML = productGroups
    .map(
      (group, index) => `
        <button class="${index === 0 ? "active" : ""}" type="button" data-product-group="${escapeAttribute(group.name)}" data-product-slug="${escapeAttribute(group.slug)}">
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

function renderProductOptions() {
  const isBusinessCards = selectedGroup.category === "cards";
  const isFlyers = selectedGroup.category === "flyers";
  const isStickers = selectedGroup.category === "stickers";
  const isMenus = selectedGroup.category === "menus";
  const isBanners = selectedGroup.category === "banners";
  const isHangers = selectedGroup.category === "hangers";
  const isRetractable = selectedGroup.category === "retractable";
  const isYardSigns = selectedGroup.category === "yardSigns";
  const isTshirts = selectedGroup.category === "shirts";
  const hasCardOrFlyerConfiguration = isBusinessCards || isFlyers;
  const hasConfiguration = hasCardOrFlyerConfiguration || isStickers || isMenus || isBanners || isHangers || isRetractable || isYardSigns;
  if (productConfigurationOptions) productConfigurationOptions.hidden = !hasCardOrFlyerConfiguration;
  if (stickerConfigurationOptions) stickerConfigurationOptions.hidden = !isStickers;
  if (menuConfigurationOptions) menuConfigurationOptions.hidden = !isMenus;
  if (bannerConfigurationOptions) bannerConfigurationOptions.hidden = !isBanners;
  if (hangerConfigurationOptions) hangerConfigurationOptions.hidden = !isHangers;
  if (retractableConfigurationOptions) retractableConfigurationOptions.hidden = !isRetractable;
  if (yardSignConfigurationOptions) yardSignConfigurationOptions.hidden = !isYardSigns;
  if (roundedCornersField) roundedCornersField.hidden = !isBusinessCards;
  productOrderPanel?.classList.toggle("configured-product-mode", hasConfiguration);
  productOrderPanel?.classList.toggle("shirt-product-mode", isTshirts);
}

function renderQuantityOptions() {
  if (!productQuantity) return;

  productQuantity.innerHTML = selectedProduct.prices
    .map(([quantity]) => `<option value="${escapeAttribute(quantity)}">${escapeHtml(quantity)}</option>`)
    .join("");
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
  if (productPrice) productPrice.textContent = selectedPrice[1];
  if (productOrderLink) {
    if (selectedGroup.category === "shirts") {
      productPrice.innerHTML = `$14.00 <small>${localStorage.getItem("preferredLanguage") === "es" ? "cada una" : "each"}</small>`;
      productOrderLink.href = "tshirt.html";
      productOrderLink.textContent = localStorage.getItem("preferredLanguage") === "es" ? "Diseñar camiseta" : "Design T-shirt";
      return;
    }
    productOrderLink.textContent = localStorage.getItem("preferredLanguage") === "es" ? "Iniciar orden con este producto" : "Start order with this product";
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
    if (selectedGroup.category === "banners") {
      configuration.push(
        `Front Side: ${bannerFrontSide?.value || "Full Color"}`,
        `Back Side: ${bannerBackSide?.value || "No Printing"}`,
        `Material: ${bannerMaterial?.value || "13 oz. Standard Vinyl"}`,
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
    const details = [
      `Product: ${selectedProduct.name}`,
      `Size: ${sizeLabel(selectedProduct.name, selectedGroup.name)}`,
      ...configuration,
      `Quantity: ${selectedPrice[0]}`,
      `Suggested sale price: ${selectedPrice[1]}`,
      `Product information: ${info.material}`,
    ].join("\n");
    const params = new URLSearchParams({
      service: "Printing",
      product: selectedProduct.name,
      quantity: selectedPrice[0],
      price: selectedPrice[1],
      details,
    });
    if (["cards", "flyers", "stickers"].includes(selectedGroup.category)) {
      productOrderLink.href = `print-products-editor.html?${params.toString()}`;
    } else if (["menus", "hangers"].includes(selectedGroup.category)) {
      productOrderLink.href = `print-products-upload.html?${params.toString()}`;
    } else if (selectedGroup.category === "banners" || selectedGroup.category === "retractable" || selectedGroup.category === "yardSigns") {
      productOrderLink.href = "banner-designer/designer";
    } else {
      productOrderLink.href = `order.html?${params.toString()}`;
    }
  }
}

function sizeLabel(productName, groupName) {
  if (groupName === "Business Cards") return '3.75" x 2.25" with bleed';
  if (groupName === "Menus") return `${productName.replace(/^Menus\s*/i, "").replace(/x/i, " x ")} Take Out Menus`;
  if (groupName === "Banners") {
    const [width, height] = productName.replace(/^Banner\s*/i, "").split("x");
    return `${Number(width) * 12} x ${Number(height) * 12}`;
  }
  if (groupName === "Retractable Banners") return '33.5" x 80"';
  if (groupName === "Yard Signs") return "18 x 24 inches";
  if (groupName === "T-Shirts") return "Gildan G500 Unisex Heavy Cotton";
  return productName.replace(/^Flyers\s*/i, "").replace(/^Stickers\s*/i, "").replace(/^Menus\s*/i, "").replace(/^Banner\s*/i, "").replace(/^Door Hangers\s*/i, "");
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
