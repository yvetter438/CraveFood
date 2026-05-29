export function formatMoney(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
