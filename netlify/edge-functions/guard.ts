import type { Config, Context } from "@netlify/edge-functions";
import {
  CAMPAIGN_COOKIE,
  CAMPAIGN_SCOPE,
  COOKIE,
  expectedCampaignPassword,
  expectedPassword,
  safeEqual,
  tokenFor,
} from "../shared/auth.ts";

// Keeps the one-sheet, its episode stills, the stats and the spec behind the password.
// Without a valid cookie, pages send people back to the splash to sign in,
// and everything else gets a plain 401.
// The case study needs the stills and stats too, so its cookie opens those files only.
export default async (req: Request, context: Context) => {
  const { pathname } = new URL(req.url);
  const expected = expectedPassword();
  const cookie = context.cookies.get(COOKIE) ?? "";
  let allowed = Boolean(expected && cookie && safeEqual(cookie, await tokenFor(expected)));

  if (!allowed && (pathname.startsWith("/img/ep") || pathname.startsWith("/data/"))) {
    const campaign = expectedCampaignPassword();
    const campaignCookie = context.cookies.get(CAMPAIGN_COOKIE) ?? "";
    allowed = Boolean(campaign && campaignCookie && safeEqual(campaignCookie, await tokenFor(campaign, CAMPAIGN_SCOPE)));
  }

  if (allowed) {
    const res = await context.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  if (pathname === "/onesheet" || pathname === "/onesheet.html") {
    return new Response(null, { status: 302, headers: { Location: "/", "Cache-Control": "no-store" } });
  }
  return new Response("Sign in on the home page first.", { status: 401, headers: { "Cache-Control": "no-store" } });
};

export const config: Config = {
  path: ["/onesheet", "/onesheet.html", "/img/ep*", "/data/*", "/HANDOFF.md"],
};
