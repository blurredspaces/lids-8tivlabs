import type { Config, Context } from "@netlify/edge-functions";
import { COOKIE, expectedPassword, safeEqual, tokenFor } from "../shared/auth.ts";

// Keeps the one-sheet, its episode stills and the spec behind the password.
// Without a valid cookie, pages send people back to the splash to sign in,
// and everything else gets a plain 401.
export default async (req: Request, context: Context) => {
  const expected = expectedPassword();
  const cookie = context.cookies.get(COOKIE) ?? "";

  if (expected && cookie && safeEqual(cookie, await tokenFor(expected))) {
    const res = await context.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const { pathname } = new URL(req.url);
  if (pathname === "/onesheet" || pathname === "/onesheet.html") {
    return new Response(null, { status: 302, headers: { Location: "/", "Cache-Control": "no-store" } });
  }
  return new Response("Sign in on the home page first.", { status: 401, headers: { "Cache-Control": "no-store" } });
};

export const config: Config = {
  path: ["/onesheet", "/onesheet.html", "/img/ep*", "/HANDOFF.md"],
};
