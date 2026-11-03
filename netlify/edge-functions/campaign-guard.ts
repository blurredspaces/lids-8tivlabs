import type { Config, Context } from "@netlify/edge-functions";
import { CAMPAIGN_COOKIE, CAMPAIGN_SCOPE, expectedCampaignPassword, safeEqual, tokenFor } from "../shared/auth.ts";

// Keeps the case study behind its own password. Without a valid cookie, /campaign
// shows the sign-in page at the same address, so the link people were sent stays put.
export default async (req: Request, context: Context) => {
  const expected = expectedCampaignPassword();
  const cookie = context.cookies.get(CAMPAIGN_COOKIE) ?? "";

  if (expected && cookie && safeEqual(cookie, await tokenFor(expected, CAMPAIGN_SCOPE))) {
    const res = await context.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  return new URL("/campaign-signin.html", req.url);
};

export const config: Config = {
  path: ["/campaign", "/campaign/", "/campaign.html"],
};
