# Handoff Spec: LIDS splash + The Handoff one-sheet

## Overview
Two static pages, no build step.

- **`index.html` (splash).** A terminal-style prompt asks for the visitor's name, then a password. The 8tivLabs logo sits above the prompt. When the password is correct, it types back a thank-you, waits 2 seconds and opens the one-sheet. The name is only displayed on screen. It is never stored or sent anywhere.
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
- The splash is black on white, centered on both axes with CSS grid `place-items: center`.
- The one-sheet's max content width is `--page-max` (1180px), centered. Side gutters are `--space-3` (16px) on mobile and `--space-5` (40px) from 760px up.
- One-sheet order: masthead (Fits x Lids lockup, "Prepared by 8tivLabs"), hero (title + intro), campaign totals band, five-step chain, episode stat slides, upcoming-episode cards, plan row (Timeline + How we measure it), footer.
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

Splash (`index.html`): `--paper` #ffffff, `--ink` #000000, VT323.

## Components
| Component | Notes |
|---|---|
| Name and password prompt (`index.html`) | A real `<input>` sits invisibly behind a mirrored `<span>`. It is a 40-character text field for the name, then becomes a password field. Empty input is ignored. Enter or the mobile Go key submits. |
| Totals band | Sums views, likes, comments and shares across every episode that has stats. Total views is shown in red. |
| Chain | An `<ol>` of 5 step cards numbered 01–05 in red, joined by red connectors. Numbering is used because the steps really are a sequence. |
| Episode slide | For episodes that have stats. A phone mockup on the left. On the right: episode name, date and status chip, views (`--num-xl`), viewers, a red bar, then a 4-column grid of 7 stats. |
| Upcoming card | For episodes without stats: a small phone with a status line. |
| Phone mockup | The frame is 1506×3102. Its transparent screen spans x 44–1466 and y 32–3069, inset as `left 2.92% / right 2.66% / top 1.03% / bottom 1.06%`, with `border-radius: 15% / 7.2%`. Screen images use `object-fit: cover` anchored to the bottom. |
| Status chip | Computed from each episode's `date` against the viewer's local date: "Out now" (red) on or after the date, otherwise "Coming up". |
| Timeline | Built from the `TIMELINE` array. The latest dated item that has already happened is red, earlier ones are filled gray, and later ones are hollow. |

## Updating stats
Edit the data block near the bottom of `onesheet.html`:
- Set `STATS_UPDATED` to the date the numbers were pulled. It drives every "as of" and "Pulled" label.
- For each episode, fill `stats` with `{ views, viewers, likes, comments, reposts, shares, saves, avgWatchSec, follows }`, all as plain numbers. Commas and the " sec" suffix are added automatically. Filling in `stats` moves the episode from an upcoming card to a full slide and adds it to the totals.
- `image: null` shows "Still coming" on a black screen. `stats: null` shows "Stats arrive with the next update." once the episode is out, or "Stats start after launch on …" before then.
- New stills should be phone-shaped (about 9:19.5), around 640px wide, saved as JPG in `img/`.

## States and interactions
| Element | State | Behavior |
|---|---|---|
| Prompt cursor | Focused | Blinks, 1.1s `steps(1)` |
| Prompt cursor | Not focused | Static at 30% opacity, which tells the visitor to click to type. Clicking anywhere in the form focuses the input. |
| Password | Typing | Each character shows as `*`. A wrong password prints "Wrong password. Try again." and asks again. A network or server error prints "Can't check the password right now. Try again in a moment." |
| Reply | Correct password | Types 1 character every 38ms after a 350ms delay. Then, after 2 seconds, the browser goes to `onesheet.html`. |
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
- **Fonts slow or blocked:** fall back to Courier New (splash), Arial Narrow (numbers) and system sans. `display=swap` avoids invisible text while fonts load.
- **No JavaScript:** the one-sheet's totals, episodes and timeline will be empty, and the splash can't submit.

## Animation / motion
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Splash cursor | While focused | Opacity blink | 1.1s loop | steps(1) |
| Splash reply | Correct password | Typed out, then auto-open after 2s | 38ms/char | n/a |
| One-sheet panels (`[data-reveal]`) | 25% of the panel enters the viewport, once | Fade in + rise 16px | 600ms opacity / 800ms transform | ease / cubic-bezier(0.22, 1.2, 0.36, 1) |
| Numbers (`[data-count]`) | Same trigger as their panel, once | Count from 0 to the final value | 1.4s + 80ms per digit | ease-out quart |

Only `opacity` and `transform` are animated. With `prefers-reduced-motion: reduce`, or in browsers without IntersectionObserver, everything shows at its final value with no motion.

## Accessibility
- Splash focus order: name input (autofocused), then the same field as a password input (`type=password`, `autocomplete=current-password`), then the one-sheet link, which receives focus once it appears.
- The input has a `<label>` that contains the visible prompt. The transcript (`#log`) is `aria-live="polite"`. Cursors are `aria-hidden`.
- On the one-sheet, the chain has `aria-label="How the Handoff works"`, each episode is an `<article>` with `aria-label="Episode N"`, and the phone frame image has `alt=""` (decorative) while each screen image has descriptive alt text.
- Contrast: on the splash, black on white is 21:1. On the one-sheet, #dcdcde on #1b1c1e is about 13:1, and the #8d8e94 labels on #232427 panels are about 4.7:1, which passes AA.
- The count-up text changes as the animation runs, but none of it is inside a live region, so screen readers aren't flooded.

## Open items
- **Two campaign windows in the PDF.** Page 5 says Sep 4–Oct 30, and page 6 says Sep 14–Nov 8. The one-sheet says "eight-week run" until this is settled.
- **Episode 3 and 4 stats** are not in the PDF yet.
