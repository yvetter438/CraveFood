/** Persist saved items on this device (localStorage + cookie backup, 30 days). */

const STORAGE_KEY = "craveSavedItemsPrototype1";
const COOKIE_NAME = "crave_saved_p1";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function readSavedCartObject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (typeof data === "object" && data !== null) return data;
    }
  } catch {
    /* fall through */
  }

  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    const data = JSON.parse(decodeURIComponent(match[1]));
    if (typeof data === "object" && data !== null) return data;
  } catch {
    return null;
  }
  return null;
}

export function writeSavedCartObject(obj) {
  const json = JSON.stringify(obj);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* ignore */
  }
  try {
    if (json.length < 3200) {
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(json)};path=/;max-age=${COOKIE_MAX_AGE_SEC};SameSite=Lax`;
    }
  } catch {
    /* ignore */
  }
}
