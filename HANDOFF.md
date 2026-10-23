# Handoff Spec: LIDS splash + The Handoff one-sheet

## Overview
Two static pages, no build step.

- **`index.html` (sign-in).** Two steps in one visible, labeled field: "Your name" with a Next button, then "Password" with a Sign in button. Each entry is printed above the form like a terminal transcript. When the password is correct, it types back a thank-you, waits 2 seconds and opens the one-sheet. The name is only displayed on screen. It is never stored or sent anywhere.
- **`onesheet.html` (one-sheet).** A single-page summary of the Fits From The Streets x LIDS campaign, *The Handoff*: concept, campaign totals, mechanic, per-episode Instagram stats, timeline and the KPI. It uses a dark graphite theme with 8tivLabs red accents, and its numbers count up as they scroll into view. Content comes from `Lids-Fits_8tivLabs-Updated.pdf` (updated 10.13.26).

The source images live in `graphics/`, which is git-ignored. The web-sized copies the pages use are in `img/`.

## Password protection
- The password is the `ADMIN_PASSWORD` environment variable in Netlify. It is checked only on the server and never appears in the page source.
- `netlify/edge-functions/login.ts` handles `POST /api/login` with the body `{ "password": "..." }`. A correct password gets `200` plus an HttpOnly, Secure, SameSite=Lax cookie (`lids_auth`, 7 days). A wrong one gets `401`. If the variable isn't set, it returns `500`.
- `netlify/edge-functions/guard.ts` protects `/onesheet`, `/onesheet.html`, `/img/ep*` and `/HANDOFF.md`. Without a valid cookie, the page redirects to `/` and the files return `401`. Protected responses are sent with `Cache-Control: private, no-store`.
- The cookie stores a SHA-256 hash of the password, not the password itself. Changing `ADMIN_PASSWORD` signs everyone out.
- There is no lockout after repeated wrong guesses, so use a long password.
- Edge functions don't run on a plain local server, so `/api/login` fails there and the splash shows "Can't check the password right now." Use `netlify dev` to test the real flow locally.

## Layout
- The sign-in page is black on white: a centered 340px column with the logo, LIDS, the transcript, then the form.
- The one-sheet's max content width is `--page-max` (1180px), centered. Side gutters are `--space-3` (16px) on mobile and `--space-5` (40px) from 760px up.
- One-sheet order: masthead (Fits x Lids lockup, "Prepared by 8tivLabs"), hero (title + intro), campaign totals band, five-step chain, episode stat slides, upcoming-episode cards, plan row (Timeline + How we measure it), Long-form YouTube, footer.
- Depth has three layers: `--bg` for the page, `--surface` for panels and `--surface-2` for chips and stat cells.

## Design tokens
One-sheet (`onesheet.html`):

| Token | Value | Usage |
|---|---|---|
| `--bg` | #1b1c1e | Page base, with a faint red radial glow top-right and film grain |
| `--surface` | #232427 | Panels: totals, chain steps, slides, cards, timeline |
| `--surface-2` | #2c2d31 | Stat cells and chips |
| `--line` | rgba(255,255,255,.09) | Borders and dividers |
| `--text` / `--text-hi` / `--text-2` | #dcdcde / #f4f4f5 / #8d8e94 | Body / numbers and titles / labels |
| `--red` | #fa273d | 8tivLabs red, sampled from the logo. Total views, step numbers, connectors, the red bar under views, "Out now", the current timeline item and the KPI. |
| `--red-soft` | rgba(250,39,61,.14) | "Out now" chip background and the current-item halo |
| `--font-display` | Archivo, 68–75% width, 800–900 weight | Title, section heads and all numbers (tabular) |
| `--font-body` | IBM Plex Sans 400/500/600 | Everything else |
| `--num-sm` / `--num-md` / `--num-xl` / `--title` | 32px / clamp(40–56px) / clamp(64–120px) / clamp(64–152px) | Stat cells / totals and KPI / episode views / page title |
| `--space-1` … `--space-7` | 4 / 8 / 16 / 24 / 40 / 64 / 104px | All padding, margins and gaps |
| `--radius-lg` / `-md` / `-sm` | 20 / 12 / 8px | Panels / steps and stat cells / small images |
| `--shadow-panel` | inset top highlight + 2 soft black shadows | Every panel |

Sign-in (`index.html`): `--paper` #ffffff, `--ink` #000000, `--ink-dim` #6b6b6b, `--field-line` #b9b9b9, `--error` #b3001b. Type is the Mac OS X Aqua-era system font: `"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif`. It uses no web font, so Macs show Lucida Grande and Windows shows Lucida Sans Unicode. "LIDS" is 700 weight, clamp(40–60px). The field and button are both 52px tall with an 8px radius, and the field text is 17px.

## Components
| Component | Notes |
|---|---|
| Sign-in form (`index.html`) | A "Step 1 of 2" / "Step 2 of 2" line, a bold label, one visible text field with placeholder text ("Type your name", then "Type the password"), an error line (`role=alert`) and a full-width black button ("Next", then "Sign in"). The same field switches from name to password, so it keeps focus and the phone keyboard stays open. The buttons cancel `mousedown` so tapping them doesn't take focus. While the password is being checked, the field is `readOnly` (never `disabled`) and the button reads "Checking…". The password step has a Show/Hide toggle inside the field. |
| Totals band | Sits under the "All engagement is organic" chip. Shows Instagram views (red), YouTube Shorts views on @lids, Instagram likes and Instagram comments, each summed across the episodes that have numbers. The note under it says how many episodes each platform covers and when the numbers were pulled. |
| Chain | An `<ol>` of 5 step cards numbered 01–05 in red, joined by red connectors. Numbering is used because the steps really are a sequence. |
| Episode slide | For episodes that have Instagram stats. A phone mockup on the left. On the right: episode number, date, status chip and title, then Instagram views (`--num-xl`), a red bar, a 4-column grid with likes and comments followed by any Insights numbers, a dated note for the Insights, and the YouTube strip. |
| YouTube strip | A red-edged row with a play icon, "YouTube Shorts on the @lids channel" and the view count, which counts up. Shown on slides and upcoming cards for any episode with `youtube` data. |
| Upcoming card | For episodes without stats: a small phone, a status line and, when available, the YouTube strip. |
| Phone mockup | The frame is 1506×3102. Its transparent screen spans x 44–1466 and y 32–3069, inset as `left 2.92% / right 2.66% / top 1.03% / bottom 1.06%`, with `border-radius: 15% / 7.2%`. Screen images use `object-fit: cover` anchored to the bottom. |
| Status chip | Computed from each episode's `date` against the viewer's local date: "Out now" (red) on or after the date, otherwise "Coming up". |
| Long-form YouTube | The last section before the footer. Two cards ("Lids Hand Off" and "Fits From The Streets x LIDS: NYC Pull Up"), each with a red top edge, YouTube icon, "In development" chip and "Delivery TBD". It's static HTML, so edit the cards directly when dates are set, and update the matching `TIMELINE` rows. |
| Timeline | Built from the `TIMELINE` array. The latest dated item that has already happened is red, earlier ones are filled gray, and later ones are hollow. |

## Updating stats
Edit the data block near the bottom of `onesheet.html`:
- `STATS_UPDATED` is the date of the latest Instagram views, likes and comments, `INSIGHTS_UPDATED` is the date of the detailed Insights numbers, and `YOUTUBE_UPDATED` is the date of the @lids YouTube Shorts views. Every "as of" label reads from these.
- `stats: { views, likes, comments }` holds the latest Instagram numbers. Views can be exact (`28209`) or rounded the way Instagram shows them (`'21.2K'`). Rounded values display and total in K format, and if any episode is rounded, the Instagram views total is shown rounded too.
- `insights: { viewers, reposts, shares, saves, avgWatchSec, follows }` comes from Instagram Insights. Leave out any you don't have, or set the whole thing to `null`. When `INSIGHTS_UPDATED` differs from `STATS_UPDATED`, a note under the grid gives the Insights date.
- `youtube: { views }` is the @lids YouTube Shorts count. Use `null` until the Short is live.
- `title` is the YouTube Shorts title without the "The Handoff Ep. N" part.
- `asOf` on an episode gives that episode's numbers their own date, for when they were pulled on a different day. The slide and the totals note both say so.
- `stats.likes` can be left out. That episode then has no likes cell, and the totals note says its likes aren't counted.
- `video: { url, label }` adds a red button that opens the video in a new tab. Episode 4 uses it for the final cut on Vimeo.
- `instagram` is the post URL. It shows a "View on Instagram" pill that opens in a new tab.
- An episode with `stats` gets a full slide and counts toward the totals. One with `stats: null` shows as an upcoming card.
- `image: null` shows "Still coming" in the phone. New stills should be phone-shaped (about 9:19.5), around 640px wide, saved as JPG in `img/`.
- "All engagement is organic" appears above the totals and in the Episode stats note. Remove both if that stops being true.

## States and interactions
| Element | State | Behavior |
|---|---|---|
| Field | Hover / focus / invalid | Darker border / black border with a 3px soft ring / red border and ring, with the message underneath |
| Button | Hover / focus-visible / active / busy | Lifts 1px / 2px outline with 3px offset / presses 1px at 85% opacity / 55% opacity reading "Checking…" |
| Errors | Submit | Empty name: "Type your name, then tap Next." Empty password: "Type the password, then tap Sign in." Wrong password clears the field: "That password didn't work. Try again." Network or server failure: "Couldn't check the password. Try again in a moment." Typing clears the message. |
| Success | Correct password | The form hides, "Password? •••" is added to the transcript, and the thank-you types out at 38ms per character. Then, after 2 seconds, the browser goes to `onesheet.html`. |
| "Start over" link | Hover / focus-visible / active | Lifts 1px and brightens / 2px red outline / presses down 1px at 70% opacity |

## Responsive behavior
| Breakpoint | Changes |
|---|---|
| ≥1024px | Chain has 5 columns. Each slide is phone (200–280px) next to stats, with 4 stat columns. Upcoming cards sit side by side. Plan row is 1.6fr / 1fr. |
| 760–1023px | Chain has 3 columns. Slides use a 200px phone and 2 stat columns. Upcoming cards and the plan stack. |
| <760px | Totals become a 2×2 grid. |
| <680px | Chain stacks into rows. Slides stack with the phone (max 220px) above the stats. The "Prepared by" text is hidden, leaving the 8tivLabs logo. |
| Print | Grain removed, colors kept (`print-color-adjust: exact`), panels avoid page breaks, numbers print at their final values |

## Edge cases
- **Long names:** capped at 40 characters, and the text wraps anywhere (`overflow-wrap: anywhere`).
- **Missing image or stats:** handled through the `null` values above. An undefined individual stat renders as 0.
- **Fonts slow or blocked:** the splash uses only installed fonts (Lucida Grande, then Lucida Sans Unicode, Geneva or Verdana). The one-sheet falls back to Arial Narrow (numbers) and system sans. `display=swap` avoids invisible text while fonts load.
- **No JavaScript:** the one-sheet's totals, episodes and timeline will be empty, and the splash can't submit.

## Animation / motion
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Sign-in reply cursor | While the reply types | Opacity blink | 1.1s loop | steps(1) |
| Sign-in reply | Correct password | Typed out, then auto-open after 2s | 38ms/char | n/a |
| One-sheet panels (`[data-reveal]`) | 25% of the panel enters the viewport, once | Fade in + rise 16px | 600ms opacity / 800ms transform | ease / cubic-bezier(0.22, 1.2, 0.36, 1) |
| Numbers (`[data-count]`) | Same trigger as their panel, once | Count from 0 to the final value | 1.4s + 80ms per digit | ease-out quart |

Only `opacity` and `transform` are animated. With `prefers-reduced-motion: reduce`, or in browsers without IntersectionObserver, everything shows at its final value with no motion.

## Accessibility
- Sign-in focus order: the field (autofocused on desktop, since phones ignore autofocus), then Show/Hide on the password step, then the button. The field keeps focus across both steps.
- The field has a visible `<label>` that changes with the step, and it references the error line with `aria-describedby`. The error line is `role="alert"`, the transcript and reply are `aria-live="polite"`, and Show/Hide sets `aria-pressed`.
- On the one-sheet, the chain has `aria-label="How the Handoff works"`, each episode is an `<article>` with `aria-label="Episode N"`, and the phone frame image has `alt=""` (decorative) while each screen image has descriptive alt text.
- Contrast: on the splash, black on white is 21:1. On the one-sheet, #dcdcde on #1b1c1e is about 13:1, and the #8d8e94 labels on #232427 panels are about 4.7:1, which passes AA.
- The count-up text changes as the animation runs, but none of it is inside a live region, so screen readers aren't flooded.

## Open items
- **Two campaign windows in the PDF.** Page 5 says Sep 4–Oct 30, and page 6 says Sep 14–Nov 8. The one-sheet says "eight-week run" until this is settled.
- **Episode 3 and 4 stats** are not in the PDF yet.
