import type { Config } from "@netlify/edge-functions";
import { CAMPAIGN_COOKIE, CAMPAIGN_SCOPE, MAX_AGE, expectedCampaignPassword, safeEqual, tokenFor } from "../shared/auth.ts";

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });

  const expected = expectedCampaignPassword();
  if (!expected) return json({ error: "not_configured" }, 500);

  let password = "";
  try {
    password = String((await req.json())?.password ?? "");
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const [given, wanted] = await Promise.all([tokenFor(password, CAMPAIGN_SCOPE), tokenFor(expected, CAMPAIGN_SCOPE)]);
  if (!safeEqual(given, wanted)) return json({ ok: false }, 401);

  return json({ ok: true }, 200, {
    "Set-Cookie": `${CAMPAIGN_COOKIE}=${wanted}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  });
};

export const config: Config = { path: "/api/campaign-login" };
