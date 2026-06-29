import { pickRandom } from '../utils/helpers.js';

const OPENERS = [
  'Scanning… please stand by while we judge your pixels.',
  'Connecting to the roast satellite. Signal: spicy.',
  'Downloading your website. Brace for constructive chaos.',
  'Running trend detectors. This might sting a little.',
];

const SCORE_ROASTS = {
  high: [
    "Not bad. We wanted to roast you, but you made it weirdly hard. It's clean, but probably sterile and boring.",
    "Solid site. We found issues, but nothing that screams 'I coded this in MS Paint while half-asleep'.",
    "You are one rebrand away from being insufferably proud of yourself.",
    "Alright, you can build a webpage. Want a sticker? Go show your mom, she might pretend to care.",
    "This is annoyingly competent. We opened the page expecting chaos and got... standards.",
    "Your website survived the roast. Your ego, however, shouldn't.",
    "Congratulations. You built something that doesn't immediately offend our eyes.",
    "Your code probably has bugs, but at least your UI knows how to hide them.",
    "It's polished enough that people might actually assume you know what you're doing.",
    "This site has fewer red flags than your Git commit history."
  ],

  mid: [
    "Your site is giving 'I read one Medium article on web design and declared myself a UX expert' energy.",
    "Not terrible. Not great. The digital equivalent of lukewarm tap water.",
    "The bones are there. The flesh is decaying, and the design needs serious UX CPR.",
    "It works, but looking at it feels like being trapped in a Zoom meeting that should've been an email.",
    "Every section looks like it was designed by a different version of you.",
    "Your color palette is having an identity crisis.",
    "This site is one redesign away from being decent and three redesigns away from being memorable.",
    "You clearly discovered CSS Flexbox halfway through the project.",
    "The spacing is so inconsistent it feels personally offended by alignment.",
    "The UI isn't broken. It just seems deeply unmotivated.",
    "Your design says 'minimum viable product.' Unfortunately, it stopped at minimum.",
    "This website has commitment issues. It can't decide if it's modern, retro, or unfinished."
  ],

  low: [
    "This site looks like it was compiled during a power outage by a raccoon on espresso.",
    "We've seen early-2000s forum threads with better formatting and self-respect.",
    "Your CSS stylesheet and your life choices need to take a long, reflective walk together.",
    "It's like a digital dumpster fire, except the dumpster is nested inside three wrapper divs.",
    "This layout lost a fight with every design principle known to humanity.",
    "Your website loaded. We wish it hadn't.",
    "The only responsive thing here is our urge to close the tab.",
    "Every pixel looks like it filed for unemployment.",
    "Your margins are social distancing from each other.",
    "This page has more red flags than a production deployment on Friday evening.",
    "Looking at this UI feels like debugging CSS without DevTools.",
    "If confusion were a design language, you'd be winning awards.",
    "This website is held together by hope, absolute positioning, and stack overflow answers.",
    "The font choices look like they were selected by spinning a roulette wheel.",
    "The UX feels like it was beta-tested exclusively on your own laptop.",
    "This design has the confidence of Apple with the execution of a school PowerPoint.",
    "If HTML had feelings, it'd ask to be deleted after rendering this.",
    "Your website didn't just ignore best practices—it filed a restraining order against them.",
    "This UI is so chaotic it could be used as a CAPTCHA.",
    "We've roasted worse... but not recently."
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
