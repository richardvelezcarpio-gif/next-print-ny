export function normalizeSupabaseUrl(value) {
  return unwrapEnvironmentValue(value).replace(/\/$/, "");
}

export function normalizeSupabaseSecret(value) {
  return unwrapEnvironmentValue(value);
}

export function unwrapEnvironmentValue(value) {
  return String(value || "").trim().replace(/^<\s*|\s*>$/g, "");
}

export function isValidSupabaseUrl(value) {
  try {
    const url = new URL(normalizeSupabaseUrl(value));
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
