import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const origin = "https://www.nextprintnyc.com";
const socialImage = `${origin}/assets/logohero.png`;

const publicPages = {
  "index.html": ["Printing Services in New York | Next Print NY", "Professional printing for business cards, flyers, banners, signs, custom apparel and more in New York. Order online with Next Print NY.", "/"],
  "printing.html": ["Printing Products in New York | Next Print NY", "Professional business cards, flyers, menus, stickers, banners and commercial printing products from Next Print NY in Brooklyn, New York.", "/printing.html"],
  "tshirt.html": ["Custom T-Shirt Printing in New York | Next Print NY", "Custom T-shirt printing and apparel for businesses, events and organizations in New York from Next Print NY.", "/tshirt.html"],
  "services.html": ["Printing & Business Services in New York | Next Print NY", "Professional printing, signage, apparel and business services for New York businesses from Next Print NY.", "/services.html"],
  "consulting-agent.html": ["Business Consulting Services | Next Print NY", "Get practical guidance for business paperwork, registrations and day-to-day administrative needs from Next Print NY.", "/consulting-agent.html"],
  "multiservices.html": ["Business Multiservices in Brooklyn | Next Print NY", "Access document, translation, DMV, E-ZPass and business support services from Next Print NY in Brooklyn.", "/multiservices.html"],
  "contact.html": ["Contact Next Print NY | Printing Services in New York", "Contact Next Print NY at 1510 Gates Ave in Brooklyn for printing, signs, custom apparel, websites and business services.", "/contact.html"],
  "membership.html": ["Printing Membership for Businesses | Next Print NY", "Save designs, organize files, review orders and access member pricing with the Next Print NY business printing membership.", "/membership.html"],
  "business-cards.html": ["Business Card Printing in New York | Next Print NY", "Custom business card printing in New York for professionals and businesses. Choose your options and start your order online with Next Print NY.", "/business-cards.html"],
  "flyers.html": ["Flyer Printing in New York | Next Print NY", "Professional flyer printing for business promotions, events, restaurants and local marketing in New York.", "/flyers.html"],
  "banners.html": ["Custom Banner Printing in New York | Next Print NY", "Custom vinyl banner printing for storefronts, events, sales and announcements in New York.", "/banners.html"],
  "stickers.html": ["Custom Sticker Printing in New York | Next Print NY", "Custom stickers and labels for packaging, products, events and local brands in New York.", "/stickers.html"],
  "menus.html": ["Menu Printing in New York | Next Print NY", "Professional menu printing for restaurants, cafes, food trucks and takeout service in New York.", "/menus.html"],
  "yard-signs.html": ["Custom Yard Sign Printing in New York | Next Print NY", "Custom weather-resistant yard signs for real estate, events, contractors and local promotions in New York.", "/yard-signs.html"],
};

function htmlFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", ".vercel", "node_modules", "assets"].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && full.startsWith(path.join(root, "websites-demo") + path.sep) && full !== path.join(root, "websites-demo")) return [];
    return entry.isDirectory() ? htmlFiles(full) : entry.name.endsWith(".html") ? [full] : [];
  });
}

function upsertSeo(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  let html = fs.readFileSync(file, "utf8");
  if (!/<head[\s>]/i.test(html)) return;
  const page = publicPages[relative];
  const currentTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/<[^>]+>/g, "").trim() || "Next Print NY";
  const title = page?.[0] || currentTitle;
  const description = page?.[1] || "This operational page is part of the secure Next Print NY customer and order workflow.";
  const canonical = page ? `${origin}${page[2]}` : "";
  const robots = page ? "index, follow" : "noindex, follow";

  html = html
    .replace(/\s*<meta[^>]+(?:name|property)=["'](?:description|robots|twitter:card|twitter:title|twitter:description|twitter:image|og:type|og:site_name|og:title|og:description|og:url|og:image)["'][^>]*\/?\s*>/gi, "")
    .replace(/\s*<link[^>]+rel=["']canonical["'][^>]*\/?\s*>/gi, "")
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  const tags = [
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    ...(canonical ? [`<link rel="canonical" href="${canonical}" />`] : []),
    ...(page ? [
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Next Print NY" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:image" content="${socialImage}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      `<meta name="twitter:image" content="${socialImage}" />`,
    ] : []),
  ].join("\n    ");
  html = html.replace(/(<head[^>]*>)/i, `$1\n    ${tags}`);
  fs.writeFileSync(file, html);
}

function validate() {
  const errors = [];
  const pages = htmlFiles();
  for (const file of pages) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    const html = fs.readFileSync(file, "utf8");
    const required = publicPages[relative];
    const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1];
    if (!robots) errors.push(`${relative}: missing robots meta`);
    for (const singleton of ["robots", "description", "canonical"]) {
      const pattern = singleton === "canonical" ? /<link[^>]+rel=["']canonical["']/gi : new RegExp(`<meta[^>]+name=["']${singleton}["']`, "gi");
      const count = html.match(pattern)?.length || 0;
      if (count > 1) errors.push(`${relative}: duplicate ${singleton} tags`);
    }
    if (required) {
      for (const token of ["description", "canonical", "og:title", "twitter:card"]) {
        if (!html.includes(token)) errors.push(`${relative}: missing ${token}`);
      }
      if (!/index,\s*follow/i.test(robots)) errors.push(`${relative}: should be index, follow`);
      const h1s = html.match(/<h1\b/gi)?.length || 0;
      if (h1s !== 1) errors.push(`${relative}: expected one H1, found ${h1s}`);
    } else if (!/noindex,\s*follow/i.test(robots)) {
      errors.push(`${relative}: operational/private page should be noindex, follow`);
    }

    for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
      const href = match[1];
      if (!href || /^(?:https?:|mailto:|tel:|javascript:|#)/i.test(href) || href.includes("${")) continue;
      const pathname = href.split(/[?#]/)[0];
      if (!pathname || pathname.startsWith("/api/")) continue;
      if (pathname.replace(/^\//, "") === "banner-designer/designer") continue; // Vercel rewrite to banner-designer/index.html.
      const target = pathname.startsWith("/") ? path.join(root, pathname) : path.resolve(path.dirname(file), pathname);
      const candidates = [target, `${target}.html`, path.join(target, "index.html")];
      if (!candidates.some((candidate) => fs.existsSync(candidate))) errors.push(`${relative}: broken internal link ${href}`);
    }
  }

  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  for (const [, , route] of Object.values(publicPages)) {
    if (!sitemap.includes(`<loc>${origin}${route}</loc>`)) errors.push(`sitemap: missing ${route}`);
  }
  if ((sitemap.match(/<loc>/g)?.length || 0) !== Object.keys(publicPages).length) errors.push("sitemap: unexpected URL count");

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`SEO validation passed: ${pages.length} HTML pages checked; ${Object.keys(publicPages).length} public URLs are indexable.`);
}

if (process.argv.includes("--fix")) htmlFiles().forEach(upsertSeo);
else validate();
