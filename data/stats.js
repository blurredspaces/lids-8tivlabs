/*
  Update stats here. onesheet.html and campaign.html both read this file. Dates are YYYY-MM-DD.
  - `stats` holds the latest Instagram views, likes and comments. Views can be
    exact (28209) or rounded the way Instagram shows them ('21.2K').
  - `insights` holds the detailed Instagram Insights numbers. Leave out any you don't have,
    including likes in `stats`.
  - `asOf` on an episode overrides the dates below when its numbers were pulled on another day.
  - Leave `stats` as null until an episode has numbers, and `image` as null until there is a still.
*/
const STATS_UPDATED = '2026-10-30';     // Instagram views, likes, comments
const INSIGHTS_UPDATED = '2026-10-30';  // Instagram Insights detail
const YOUTUBE_UPDATED = '2026-10-20';   // YouTube Shorts on the @lids channel
const EPISODES = [
  {
    number: 1,
    title: 'Rule of Thirds',
    date: '2026-09-29',
    instagram: 'https://www.instagram.com/p/Dd4xDmvuIDm/',
    image: 'img/ep1.jpg',
    alt: 'Episode 1 Instagram post: subject in a black White Sox cap',
    stats: { views: 29847, likes: 942, comments: 145 },
    insights: { viewers: 20684, reposts: 67, shares: 69, saves: 44, avgWatchSec: 8, follows: 0 },
    youtube: { views: 350 },
  },
  {
    number: 2,
    title: 'Same Cap, Different Eye',
    date: '2026-10-06',
    instagram: 'https://www.instagram.com/p/DeKzZbSB7IN/',
    image: 'img/ep2.jpg',
    alt: 'Episode 2 Instagram post: subject in a burgundy leather coat, hands on her cap',
    stats: { views: 23645, likes: 694, comments: 161 },
    insights: { viewers: 15086, reposts: 52, shares: 49, saves: 40, avgWatchSec: 6, follows: 0 },
    youtube: { views: 550 },
  },
  {
    number: 3,
    title: 'Be Colorful, Not Careful',
    date: '2026-10-13',
    instagram: 'https://www.instagram.com/p/Dec17ezPuL8/',
    image: 'img/ep3.jpg',
    alt: 'Episode 3 subject in a blue 76ers cap',
    stats: { views: 21619, likes: 931, comments: 137 },
    insights: { viewers: 14917, reposts: 78, shares: 77, saves: 31, avgWatchSec: 10, follows: 0 },
    youtube: { views: 334 },
  },
  {
    number: 4,
    title: 'Like Father, Like Fit',
    date: '2026-10-20',
    instagram: 'https://www.instagram.com/reel/DevCrPsh7he/',
    image: 'img/ep4.jpg',
    alt: 'Episode 4 subject, a child in a red Cardinals World Series champions cap, at a ballfield fence',
    stats: { views: 18468, likes: 461, comments: 94 },
    insights: { viewers: 11010, reposts: 92, shares: 80, saves: 11, avgWatchSec: 7, follows: 0 },
    youtube: null,
  },
];

const TIMELINE = [
  { date: '2026-09-29', what: 'Episode 1', phase: 'Phase 1: Fashion Week / NFL kickoff' },
  { date: '2026-10-06', what: 'Episode 2', phase: 'Phase 1: Fashion Week / NFL kickoff' },
  { date: '2026-10-13', what: 'Episode 3', phase: 'Phase 2: Sports Equinox (NBA, NFL, MLB)' },
  { date: '2026-10-20', what: 'Episode 4', phase: 'Phase 2: Sports Equinox (NBA, NFL, MLB)' },
  { label: 'Preview ready', what: 'Long-form YouTube: Lids Hand Off (final graphics and edit in progress)' },
  { date: '2026-11-14', what: 'Long-form YouTube: Fits From The Streets x LIDS: NYC Pull Up shoot at Lids NYC' },
  { label: 'Date TBD', what: 'In-store activation, NYC' },
];
