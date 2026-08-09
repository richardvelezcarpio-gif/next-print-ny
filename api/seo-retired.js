const RETIRED_ROUTES = new Set(["blog", "support", "digital-signature"]);

export default function handler(req, res) {
  const route = String(req.query?.route || "");

  if (!RETIRED_ROUTES.has(route)) {
    res.status(404).send("Not found");
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.status(410).send("This page has been permanently removed.");
}
