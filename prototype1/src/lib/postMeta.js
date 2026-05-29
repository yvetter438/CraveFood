/** True when a post field should render (non-empty, not placeholder dash). */
export function hasPostText(value) {
  if (value == null) return false;
  const t = String(value).trim();
  if (!t) return false;
  if (t === "—" || t === "-" || t === "–" || t === "n/a" || t === "N/A") return false;
  return true;
}
