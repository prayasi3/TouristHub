const API_BASE_URL = "http://localhost:5000/api";
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const campaignFallbackImage = "/banners/kathmandu_valley.jpg";

export function resolveAssetUrl(value, fallback = campaignFallbackImage) {
  const raw = String(value || "").trim();

  if (!raw) return fallback;
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  if (raw.startsWith("/banners/") || raw.startsWith("/images/")) {
    return raw;
  }

  if (raw.startsWith("banners/") || raw.startsWith("images/")) {
    return `/${raw}`;
  }

  return `${BACKEND_ORIGIN}/${raw.replace(/^\/+/, "")}`;
}
