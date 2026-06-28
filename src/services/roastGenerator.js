import { pickRandom } from '../utils/helpers.js';

const OPENERS = [
  'Scanning… please stand by while we judge your pixels.',
  'Connecting to the roast satellite. Signal: spicy.',
  'Downloading your website. Brace for constructive chaos.',
  'Running trend detectors. This might sting a little.',
];

const SCORE_ROASTS = {
  high: [
    'Not bad. We wanted to roast you, but you made it weirdly hard.',
    'Solid site. We found issues, but nothing that screams "GeoCities reunion".',
    'You are one rebrand away from being insufferably good.',
  ],
  mid: [
    'Your site is giving "I can fix him" energy.',
    'Not terrible. Not great. Very 2014 LinkedIn profile.',
    'The bones are there. The flesh needs a UX therapist.',
  ],
  low: [
    'This site looks like it was built during a power outage.',
    'We have seen MySpace pages with better structure.',
    'Your CSS and your priorities need a long vacation together.',
  ],
};

export function getLoadingMessage() {
  return pickRandom(OPENERS);
}

export function getScoreRoast(score) {
  if (score >= 80) return pickRandom(SCORE_ROASTS.high);
  if (score >= 55) return pickRandom(SCORE_ROASTS.mid);
  return pickRandom(SCORE_ROASTS.low);
}

export function getColorRoast(count) {
  if (count === 0) return 'No colors detected. Minimalist or broken? Jury is out.';
  if (count <= 4) return 'Restrained palette. Very Swiss. Very smug.';
  if (count <= 8) return `${count} colors. A palette, not a rainbow explosion. Acceptable.`;
  return `${count} colors?! Pick a lane. This is a website, not a bag of Skittles.`;
}

export function getCtaRoast(ctas) {
  if (ctas.length === 0) return 'Zero CTAs. Bold strategy. Users will guess what to do.';
  if (ctas.length <= 3) return `${ctas.length} CTAs. Focused. We respect the hustle.`;
  return `${ctas.length} CTAs screaming at once. Pick a main character.`;
}

export function getTrendRoast(present, missing) {
  const ratio = present / (present + missing || 1);
  if (ratio >= 0.8) return 'Trend-aware. You read a blog post in 2024 and it shows.';
  if (ratio >= 0.5) return 'Half modern, half museum. Schrödinger\'s website.';
  return 'Trends called. You did not pick up. That is okay — we wrote you a checklist.';
}

export function getClosingLine() {
  return pickRandom([
    'Roast complete. No data saved. Close tab, forget we ever met.',
    'That is the roast. Fix the easy wins first. You got this.',
    'We were mean. The suggestions are sincere. Go optimize something.',
  ]);
}
