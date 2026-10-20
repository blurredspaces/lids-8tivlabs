# Handoff Spec: LIDS splash + The Handoff one-sheet

## Overview
Two static pages, no build step.

- **`index.html` (splash).** A terminal-style prompt asks for the visitor's name, then a password. When the password is correct, it types back a thank-you and shows a link to the one-sheet. The name is only displayed on screen. It is never stored or sent anywhere.
- **`onesheet.html` (one-sheet).** A single-page summary of the Fits From The Streets x LIDS campaign, *The Handoff*: concept, mechanic, per-episode Instagram stats, timeline and the KPI. Content comes from `Lids-Fits_8tivLabs-Updated.pdf` (updated 10.13.26).

The source images live in `graphics/`, which is git-ignored. The web-sized copies the pages use are in `img/`.

## Password protection
- The password is the `ADMIN_PASSWORD` environment variable in Netlify. It is checked only on the server and never appears in the page source.
- `netlify/edge-functions/login.ts` handles `POST /api/login` with the body `{ "password": "..." }`. A correct password gets `200` plus an HttpOnly, Secure, SameSite=Lax cookie (`lids_auth`, 7 days). A wrong one gets `401`. If the variable isn't set, it returns `500`.
- `netlify/edge-functions/guard.ts` protects `/onesheet`, `/onesheet.html`, `/img/ep*` and `/HANDOFF.md`. Without a valid cookie, the page redirects to `/` and the files return `401`. Protected responses are sent with `Cache-Control: private, no-store`.
- The cookie stores a SHA-256 hash of the password, not the password itself. Changing `ADMIN_PASSWORD` signs everyone out.
- There is no lockout after repeated wrong guesses, so use a long password.
- Edge functions don't run on a plain local server, so `/api/login` fails there and the splash shows "Can't check the password right now." Use `netlify dev` to test the real flow locally.

## Layout
- Max content width is `--page-max` (1160px), centered. Side gutters are `--space-3` (16px) on mobile and `--space-5` (40px) from 760px up.
- One-sheet order: masthead, title + intro, five-step chain, Episodes grid, plan row (Timeline + How we measure it), footer.
- The splash is centered on both axes with CSS grid `place-items: center`.

## Design tokens
| Token | Value | Usage |
|---|---|---|
| `--paper` | #ffffff | Page background |
| `--ink` | #000000 | Text, rules, cursor |
| `--ink-2` | #555555 | Secondary text, dates, labels |
| `--tint` | #f2f2f2 | Reserved for empty image wells |
| `--live` | #d7262b | "Out now" status only. Red taken from the Fits logo. |
| `--font-display` | VT323 | Title, section heads, big numbers, EP tags, splash |
| `--font-body` | IBM Plex Sans 400/500/600 | Everything else |
| `--text-sm` / `--text-md` / `--text-lg` | 14 / 16 / 20px | Body scale |
| `--display-sm` / `--display-md` / `--display-xl` | 28 / 44px / clamp(72px, 15vw, 160px) | Display scale |
| `--space-1` … `--space-6` | 4 / 8 / 16 / 24 / 40 / 64px | All padding, margins and gaps |
| `--rule` | 2px solid ink | Section dividers. Inner rows use 1px ink or 1px #d9d9d9. |

## Components
| Component | Notes |
|---|---|
| Name prompt (`index.html`) | A real `<input>` sits invisibly behind a mirrored `<span>`. It has `maxlength="40"`, and empty input is ignored. Enter or the mobile Go key submits. |
| Chain | An `<ol>` of 5 steps with CSS counters. Numbering is used because the steps really are a sequence. |
| Episode card | A phone mockup (`img/iphone-frame.png` overlaid on the screen image), then a row with the EP tag, date and status, then views and a 7-stat grid. Rendered from the `EPISODES` array in `onesheet.html`. |
| Phone mockup | The frame is 1506×3102. Its transparent screen spans x 44–1466 and y 32–3069, inset as `left 2.92% / right 2.66% / top 1.03% / bottom 1.06%`, with `border-radius: 15% / 7.2%`. Max width is 260px. Screen images use `object-fit: cover` anchored to the bottom. |
| Status | Computed from each episode's `date` against the viewer's local date: "Out now" (red dot) on or after the date, otherwise "Coming up". |

## Updating stats
Edit the data block near the bottom of `onesheet.html`:
- Set `STATS_UPDATED` to the date the numbers were pulled. It drives both "Stats updated …" labels.
- For each episode, fill `stats` with `{ views, viewers, likes, comments, reposts, shares, saves, avgWatch, follows }`. Pass numbers as plain numbers, since commas are added automatically. `avgWatch` is a string such as `"8 sec"`.
- `image: null` shows "Still coming" on a black screen. `stats: null` shows "Stats arrive with the next update." once the episode is out, or "Stats start after launch on …" before then.
- New stills should be phone-shaped (about 9:19.5), around 640px wide, saved as JPG in `img/`.

## States and interactions
| Element | State | Behavior |
|---|---|---|
| Prompt cursor | Focused | Blinks, 1.1s `steps(1)` |
| Prompt cursor | Not focused | Static at 30% opacity, which tells the visitor to click to type. Clicking anywhere in the form focuses the input. |
| Password | Typing | Each character shows as `*`. A wrong password prints "Wrong password. Try again." and asks again. A network or server error prints "Can't check the password right now. Try again in a moment." |
| Reply | Correct password | Types 1 character every 38ms after a 350ms delay, then the one-sheet link fades in (opacity, 300ms ease-out) and takes focus, so a second Enter opens it |
| Links | Hover / focus-visible / active | Colors invert to black background with white text / 2px ink outline with 3px offset / 60% opacity |

## Responsive behavior
| Breakpoint | Changes |
|---|---|
| ≥1024px | 4 episode columns. Plan row is 1.6fr / 1fr. |
| 760–1023px | 2 episode columns. Intro becomes 2 columns. |
| <760px | Chain stacks vertically with the number inline. Plan stacks. The "Stats updated" date in the masthead is hidden, but it still appears in the Episodes header. |
| <480px | 1 episode column, with the phone capped at 260px wide and centered |
| Print | 4 episode columns, 12mm margins, sections avoid page breaks, and the "Start over" link is hidden |

## Edge cases
- **Long names:** capped at 40 characters, and the text wraps anywhere (`overflow-wrap: anywhere`).
- **Missing image or stats:** handled through the `null` values above. Undefined individual stats render as "–".
- **Fonts slow or blocked:** fall back to Courier New and system sans. `display=swap` avoids invisible text while fonts load.
- **No JavaScript:** the one-sheet's episode grid will be empty. Everything else is static HTML.

## Animation / motion
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Cursor | Always (while focused) | Opacity blink | 1.1s loop | steps(1) |
| Reply text | Submit | Typed out | 38ms/char | n/a |
| One-sheet link | Reply finished | Opacity 0→1 | 300ms | ease-out |

`prefers-reduced-motion: reduce` stops the blink, shows the reply instantly and removes the fade.

## Accessibility
- Splash focus order: name input (autofocused), then the same field as a password input (`type=password`, `autocomplete=current-password`), then the one-sheet link, which receives focus once it appears.
- The input has a `<label>` that contains the visible prompt. The transcript (`#log`) is `aria-live="polite"`. Cursors are `aria-hidden`.
- On the one-sheet, the chain has `aria-label="How the Handoff works"`, each episode is an `<article>` with `aria-label="Episode N"`, and the phone frame image has `alt=""` (decorative) while each screen image has descriptive alt text.
- Contrast: black on white is 21:1, and #555 on white is 7.5:1.

## Open items
- **Two campaign windows in the PDF.** Page 5 says Sep 4–Oct 30, and page 6 says Sep 14–Nov 8. The one-sheet says "eight-week run" until this is settled.
- **Episode 3 and 4 stats** are not in the PDF yet.
