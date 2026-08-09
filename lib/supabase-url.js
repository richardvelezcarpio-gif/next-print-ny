export function normalizeSupabaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/^<\s*|\s*>$/g, "")
    .replace(/\/$/, "");
}

export function isValidSupabaseUrl(value) {
  try {
    const url = new URL(normalizeSupabaseUrl(value));
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
