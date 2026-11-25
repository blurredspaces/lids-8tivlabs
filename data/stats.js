/*
  Update stats here. onesheet.html and campaign.html both read this file. Dates are YYYY-MM-DD.
  - `stats` holds the latest Instagram views, likes and comments. Views can be
    exact (28209) or rounded the way Instagram shows them ('21.2K').
  - `insights` holds the detailed Instagram Insights numbers. Leave out any you don't have,
    including likes in `stats`.
  - `asOf` on an episode overrides the dates below when its numbers were pulled on another day.
  - Leave `stats` as null until an episode has numbers, and `image` as null until there is a still.
*/
const STATS_UPDATED = '2026-11-25';     // Instagram views, likes, comments
const INSIGHTS_UPDATED = '2026-11-25';  // Instagram Insights detail
const YOUTUBE_UPDATED = '2026-11-25';   // YouTube Shorts on the @lids channel
const EPISODES = [
  {
    number: 1,
    title: 'Rule of Thirds',
    date: '2026-09-29',
    instagram: 'https://www.instagram.com/p/Dd4xDmvuIDm/',
    image: 'img/ep1.jpg',
    alt: 'Episode 1 Instagram post: subject in a black White Sox cap',
    stats: { views: 33315, likes: 998, comments: 146 },
    insights: { viewers: 23588, reposts: 70, shares: 71, saves: 48, avgWatchSec: 7, follows: 0 },
    youtube: { views: 395 },
  },
  {
    number: 2,
    title: 'Same Cap, Different Eye',
    date: '2026-10-06',
    instagram: 'https://www.instagram.com/p/DeKzZbSB7IN/',
    image: 'img/ep2.jpg',
    alt: 'Episode 2 Instagram post: subject in a burgundy leather coat, hands on her cap',
    stats: { views: 32582, likes: 829, comments: 162 },
    insights: { viewers: 22609, reposts: 57, shares: 59, saves: 55, avgWatchSec: 6, follows: 0 },
    youtube: { views: 354 },
  },
  {
    number: 3,
    title: 'Be Colorful, Not Careful',
    date: '2026-10-13',
    instagram: 'https://www.instagram.com/p/Dec17ezPuL8/',
    image: 'img/ep3.jpg',
    alt: 'Episode 3 subject in a blue 76ers cap',
    stats: { views: 28209, likes: '1K', comments: 140 },
    insights: { viewers: 20767, reposts: 83, shares: 82, saves: 38, avgWatchSec: 9, follows: 0 },
    youtube: { views: 419 },
  },
  {
    number: 4,
    title: 'Like Father, Like Fit',
    date: '2026-10-20',
    instagram: 'https://www.instagram.com/reel/DevCrPsh7he/',
    image: 'img/ep4.jpg',
    alt: 'Episode 4 subject, a child in a red Cardinals World Series champions cap, at a ballfield fence',
    stats: { views: 27119, likes: 574, comments: 96 },
    insights: { viewers: 18829, reposts: 91, shares: 84, saves: 11, avgWatchSec: 6, follows: 0 },
    youtube: null,
    youtubeNote: 'Not uploaded', // shown on the one-sheet in place of a view count
  },
];

const TIMELINE = [
  { date: '2026-09-29', what: 'Episode 1', phase: 'Phase 1: Fashion Week / NFL kickoff' },
  { date: '2026-10-06', what: 'Episode 2', phase: 'Phase 1: Fashion Week / NFL kickoff' },
  { date: '2026-10-13', what: 'Episode 3', phase: 'Phase 2: Sports Equinox (NBA, NFL, MLB)' },
  { date: '2026-10-20', what: 'Episode 4', phase: 'Phase 2: Sports Equinox (NBA, NFL, MLB)' },
  { date: '2026-11-14', what: 'In-store activation, NYC' },
  { label: 'Live', live: true, what: 'Long-form YouTube EP1: Lids Hand Off, on the @lids channel' },
  { label: 'In production', what: 'Long-form YouTube EP2: Fits From The Streets x LIDS: NYC Pull Up' },
];
