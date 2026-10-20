// Shared by the login and guard edge functions.
// The cookie holds a hash of ADMIN_PASSWORD, never the password itself,
// so changing the password in Netlify signs everyone out.

export const COOKIE = "lids_auth";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

export async function tokenFor(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`lids-onesheet:${password}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compares two equal-length hex strings without exiting early.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function expectedPassword(): string | undefined {
  return Netlify.env.get("ADMIN_PASSWORD") || undefined;
}
