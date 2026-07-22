export const DEMO_EMAIL = "admin@eclaria.dz";
export const DEMO_PASSWORD = "eclaria2026";
const KEY = "eclaria_auth_v1";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
