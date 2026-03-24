export function currency(value, currencyCode = "NPR") {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTime(value) {
  if (!value) return "TBD";
  if (typeof value === "string" && value.length >= 5) {
    return value.slice(0, 5);
  }
  return value;
}

export function splitImages(images) {
  if (!images) return [];
  return String(images)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function daysRemaining(endDate) {
  if (!endDate) return null;
  const end = new Date(endDate);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end - today) / 86400000);
}
