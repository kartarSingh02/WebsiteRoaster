import { clampScore, uniqueList } from '../utils/helpers.js';

const CTA_KEYWORDS = [
  'buy', 'shop', 'get started', 'start', 'sign up', 'signup', 'register',
  'subscribe', 'download', 'try', 'learn more', 'contact', 'book', 'order',
  'join', 'claim', 'free trial', 'add to cart', 'checkout', 'donate',
];

const OUTDATED_PATTERNS = [
  { id: 'marquee', regex: /<marquee\b/i, label: 'Marquee tags', roast: 'Your text is sliding across the page like a Windows 95 screensaver. Make it stop.' },
  { id: 'blink', regex: /<blink\b/i, label: 'Blink tags', roast: 'Blink tags? My eyes are filing a formal HR complaint.' },
  { id: 'frameset', regex: /<frameset\b/i, label: 'Framesets', roast: 'Framesets belong in a history museum next to floppy disks.' },
  { id: 'font-tag', regex: /<font\b/i, label: '<font> tags', roast: 'Using inline font tags in 2026? CSS is crying in the corner.' },
  { id: 'center-tag', regex: /<center\b/i, label: '<center> tags', roast: 'Center tags? Use Flexbox or Grid. Center is a relic of Netscape.' },
  { id: 'guestbook', regex: /guestbook|sign our guest/i, label: 'Guestbook vibes', roast: 'A guestbook? Who is signing this, your grandmother?' },
  { id: 'under-construction', regex: /under construction|coming soon/i, label: '"Under construction"', roast: 'Still "under construction"? The internet grew up and moved out while you were building this.' },
  { id: 'hit-counter', regex: /hit counter|visitor counter|you are visitor/i, label: 'Hit counter', roast: 'A hit counter? GeoCities called, they want their single digit traffic indicator back.' },
  { id: 'flash', regex: /swfobject|\.swf|adobe flash/i, label: 'Flash content', roast: 'Flash is so dead it\'s fossilized. Let it go.' },
  { id: 'table-layout', regex: /<table[^>]*>[\s\S]*?<\/table>/gi, label: 'Table layouts', roast: 'Using tables for layouts? What is next, inline spacers and transparent GIFs?', check: (html, doc) => doc.querySelectorAll('table').length >= 3 },
  { id: 'ie-conditional', regex: /<!--\[if IE\]/i, label: 'IE conditional comments', roast: 'Internet Explorer conditional checks? Even Microsoft abandoned IE. You should too.' },
  { id: 'jquery-old', regex: /jquery[-.]?(1\.[0-9]|2\.[0-4])/i, label: 'Ancient jQuery', roast: 'Your jQuery version remembers the dawn of the smartphone era.' },
  { id: 'dead-links', regex: /href=["']#["']/i, label: 'Dead links', roast: 'Overuse of href="#". Clicking links shouldn\'t just scroll me back to the top of my disappointment.', check: (html, doc) => doc.querySelectorAll('a[href="#"]').length >= 4 },
  { id: 'lazy-title', regex: /<title>(?:Vite\s*\+\s*React|Document|Webpack\s*App)<\/title>/i, label: 'Lazy default title', roast: 'Leaving the default template title? Tells us you finished this in 5 minutes and didn\'t care.' },
  { id: 'div-soup', regex: /<div/i, label: 'Div soup', roast: 'Your HTML is 90% divs. Semantic elements are free, we promise.', check: (html, doc) => {
      const divs = doc.querySelectorAll('div').length;
      const semantic = doc.querySelectorAll('main, nav, header, footer, section, article').length;
      return divs > 15 && divs > semantic * 4;
    }},
];

const TREND_CHECKS = [
  { id: 'viewport', test: (doc) => !!doc.querySelector('meta[name="viewport"]'), label: 'Responsive viewport meta', tip: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' },
  { id: 'og', test: (doc) => !!doc.querySelector('meta[property^="og:"]'), label: 'Open Graph tags', tip: 'Add og:title, og:description, og:image for social sharing' },
  { id: 'favicon', test: (doc) => !!doc.querySelector('link[rel*="icon"]'), label: 'Favicon', tip: 'Add a favicon so tabs do not look abandoned' },
  { id: 'lazy', test: (doc) => doc.querySelector('img[loading="lazy"]') !== null, label: 'Lazy-loaded images', tip: 'Use loading="lazy" on below-the-fold images' },
  { id: 'aria', test: (doc) => doc.querySelector('[aria-label], [role]') !== null, label: 'ARIA accessibility hints', tip: 'Add aria-labels and roles for screen readers' },
  { id: 'semantic', test: (doc) => doc.querySelector('main, nav, header, footer, section, article') !== null, label: 'Semantic HTML5 tags', tip: 'Replace div soup with main, nav, header, footer' },
  { id: 'dark-mode', test: (doc, html) => /prefers-color-scheme|color-scheme:\s*dark/i.test(html), label: 'Dark mode support', tip: 'Consider prefers-color-scheme or a theme toggle' },
  { id: 'https', test: (_doc, _html, url) => url.startsWith('https://'), label: 'HTTPS', tip: 'Serve over HTTPS for trust and SEO' },
  { id: 'meta-desc', test: (doc) => !!doc.querySelector('meta[name="description"]'), label: 'Meta description', tip: 'Write a compelling meta description (120–160 chars)' },
  { id: 'canonical', test: (doc) => !!doc.querySelector('link[rel="canonical"]'), label: 'Canonical URL', tip: 'Add link rel="canonical" to avoid duplicate content issues' },
];

const CRINGE_FONTS = [
  { match: /comic\s*sans/i, name: 'Comic Sans', roast: 'Comic Sans is for birthday invites, not brands.' },
  { match: /papyrus/i, name: 'Papyrus', roast: 'Avatar made billions. Your site should not use Papyrus.' },
  { match: /courier\s*new/i, name: 'Courier New', roast: 'Courier New screams "printed receipt".' },
  { match: /impact/i, name: 'Impact', roast: 'Impact font = meme energy. Choose wisely.' },
];

const COLOR_REGEX = /#([0-9a-fA-F]{3,8})\b|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;

const NAMED_COLORS = [
  'white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple',
  'pink', 'gray', 'grey', 'navy', 'teal', 'aqua', 'lime', 'maroon',
];

function parseDocument(html) {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

function parseColorValue(color) {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length < 6) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b, hex: `#${hex.toLowerCase()}`, raw: color };
  }

  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    return { r, g, b, hex, raw: color };
  }

  return null;
}

function getLuminance(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function classifyColor(parsed) {
  const lum = getLuminance(parsed.r, parsed.g, parsed.b);
  const spread = Math.max(parsed.r, parsed.g, parsed.b) - Math.min(parsed.r, parsed.g, parsed.b);

  let tone = 'mid';
  if (lum >= 200) tone = 'light';
  else if (lum <= 60) tone = 'dark';

  const type = spread < 25 ? 'neutral' : tone;
  return { luminance: Math.round(lum), tone, type };
}

function analyzeColors(html) {
  const hexMatches = [...html.matchAll(COLOR_REGEX)].map((m) => {
    if (m[0].startsWith('#')) return m[0].toLowerCase();
    return `rgb(${m[2]}, ${m[3]}, ${m[4]})`;
  });

  const namedMatches = NAMED_COLORS.flatMap((name) => {
    const regex = new RegExp(`\\b(color|background(?:-color)?|border(?:-color)?|fill|stroke)\\s*:\\s*${name}\\b`, 'gi');
    return [...html.matchAll(regex)].map(() => name);
  });

  const parsed = uniqueList([...hexMatches, ...namedMatches])
    .map((raw) => {
      const value = raw.startsWith('#') || raw.startsWith('rgb') ? parseColorValue(raw) : null;
      if (value) {
        const meta = classifyColor(value);
        return { raw: value.raw, hex: value.hex, ...meta };
      }
      return { raw, hex: raw, luminance: 128, tone: 'mid', type: 'named' };
    })
    .slice(0, 24);

  const uniqueHex = uniqueList(parsed.map((c) => c.hex));
  const dark = parsed.filter((c) => c.tone === 'dark').length;
  const light = parsed.filter((c) => c.tone === 'light').length;
  const neutrals = parsed.filter((c) => c.type === 'neutral').length;

  let verdict = 'Balanced palette';
  let tip = 'Good range of light and dark tones for hierarchy.';

  if (parsed.length === 0) {
    verdict = 'Invisible palette';
    tip = 'No colors detected in HTML. Styles may live in external CSS we cannot see.';
  } else if (parsed.length > 10) {
    verdict = 'Rainbow overload';
    tip = 'Trim to 3–5 core colors plus neutrals. Consistency builds trust.';
  } else if (parsed.length <= 3) {
    verdict = 'Minimalist core';
    tip = 'Clean base — add one accent color for buttons and links.';
  } else if (dark === 0 || light === 0) {
    verdict = 'Low contrast risk';
    tip = 'Mix light backgrounds with darker text (or vice versa) for readability.';
  }

  return {
    swatches: parsed,
    stats: {
      total: parsed.length,
      unique: uniqueHex.length,
      dark,
      light,
      neutrals,
      verdict,
      tip,
    },
  };
}

function extractFonts(html, doc) {
  const fonts = [];
  const fontFace = [...html.matchAll(/font-family\s*:\s*([^;}"']+)/gi)].map((m) => m[1].trim());
  const linkFonts = [...doc.querySelectorAll('link[href*="fonts.googleapis"]')].map((el) => el.href);
  fonts.push(...fontFace, ...linkFonts);
  return uniqueList(fonts).slice(0, 12);
}

function extractCTAs(doc) {
  const elements = [...doc.querySelectorAll('a, button, input[type="submit"], input[type="button"]')];
  const ctas = [];

  for (const el of elements) {
    const text = (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
    if (!text || text.length > 60) continue;

    const lower = text.toLowerCase();
    const isCta = CTA_KEYWORDS.some((kw) => lower.includes(kw)) || el.tagName === 'BUTTON';

    if (isCta) {
      ctas.push({
        text,
        tag: el.tagName.toLowerCase(),
        href: el.getAttribute('href') || null,
      });
    }
  }

  return ctas.slice(0, 12);
}

function analyzeImages(doc) {
  const images = [...doc.querySelectorAll('img')];
  const missingAlt = images.filter((img) => !img.getAttribute('alt')?.trim()).length;
  return { total: images.length, missingAlt };
}

function analyzeScripts(html) {
  const inlineScripts = (html.match(/<script(?![^>]*src=)[^>]*>/gi) || []).length;
  const externalScripts = (html.match(/<script[^>]*src=/gi) || []).length;
  return { inlineScripts, externalScripts };
}

function analyzeStyles(html, doc) {
  const inlineStyles = (html.match(/style\s*=/gi) || []).length;
  const styleTags = doc.querySelectorAll('style').length;
  return { inlineStyles, styleTags };
}

function detectOutdated(html, doc) {
  return OUTDATED_PATTERNS.filter((pattern) => {
    if (pattern.check) return pattern.check(html, doc);
    return pattern.regex.test(html);
  }).map(({ id, label, roast }) => ({ id, label, roast }));
}

function detectTrends(doc, html, url) {
  const present = [];
  const missing = [];

  for (const check of TREND_CHECKS) {
    const passed = check.test(doc, html, url);
    if (passed) present.push({ id: check.id, label: check.label });
    else missing.push({ id: check.id, label: check.label, tip: check.tip });
  }

  return { present, missing };
}

function detectFontRoasts(fonts) {
  return CRINGE_FONTS.filter(({ match }) => fonts.some((f) => match.test(f))).map(
    ({ name, roast }) => ({ name, roast })
  );
}

function analyzePerformance(doc, html, size, fetchTimeMs) {
  const scripts = [...doc.querySelectorAll('script')];
  const stylesheets = [...doc.querySelectorAll('link[rel="stylesheet"]')];
  const images = [...doc.querySelectorAll('img')];
  const head = doc.querySelector('head');

  const renderBlockingJs = scripts.filter((s) => {
    if (!s.getAttribute('src') && !s.textContent?.trim()) return false;
    const inHead = head?.contains(s);
    const hasDefer = s.hasAttribute('defer') || s.hasAttribute('async') || s.getAttribute('type') === 'module';
    return inHead && !hasDefer;
  }).length;

  const renderBlockingCss = stylesheets.filter((link) => head?.contains(link)).length;
  const scriptsWithoutDefer = scripts.filter((s) => s.getAttribute('src') && !s.hasAttribute('defer') && !s.hasAttribute('async')).length;
  const imagesMissingDimensions = images.filter((img) => !img.getAttribute('width') && !img.getAttribute('height')).length;
  const preloadHints = doc.querySelectorAll('link[rel="preload"], link[rel="preconnect"], link[rel="dns-prefetch"]').length;
  const domElements = doc.querySelectorAll('*').length;
  const inlineStyleBytes = (html.match(/style\s*=\s*"[^"]*"/gi) || []).join('').length;

  let complexityScore = clampScore(
    100
    - Math.min(Math.floor(size / 50000), 25)
    - renderBlockingJs * 4
    - Math.min(renderBlockingCss * 2, 12)
    - Math.min(scriptsWithoutDefer * 2, 16)
    - Math.min(Math.floor(domElements / 800), 15)
    - Math.min(imagesMissingDimensions * 2, 10)
    + Math.min(preloadHints * 3, 9)
    - (fetchTimeMs > 3000 ? 10 : fetchTimeMs > 1500 ? 5 : 0)
  );

  const signals = [
    {
      id: 'fetch',
      label: 'HTML fetch time',
      value: `${fetchTimeMs}ms`,
      status: fetchTimeMs <= 800 ? 'good' : fetchTimeMs <= 2000 ? 'warn' : 'bad',
      tip: 'Slow initial response delays everything — optimize server, CDN, and caching.',
      note: 'Proxy fetch time, not true TTFB.',
    },
    {
      id: 'html-size',
      label: 'HTML payload',
      value: size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : size >= 1024 ? `${Math.round(size / 1024)} KB` : `${size} B`,
      status: size <= 100000 ? 'good' : size <= 300000 ? 'warn' : 'bad',
      tip: 'Bloated HTML slows parsing. Remove unused markup and inline cruft.',
    },
    {
      id: 'dom',
      label: 'DOM elements',
      value: domElements.toLocaleString(),
      status: domElements <= 1500 ? 'good' : domElements <= 3000 ? 'warn' : 'bad',
      tip: 'Huge DOMs hurt rendering. Simplify nested divs.',
    },
    {
      id: 'blocking-js',
      label: 'Render-blocking JS (head)',
      value: String(renderBlockingJs),
      status: renderBlockingJs === 0 ? 'good' : renderBlockingJs <= 2 ? 'warn' : 'bad',
      tip: 'Move scripts to end of body or add defer/async.',
    },
    {
      id: 'blocking-css',
      label: 'Stylesheets in head',
      value: String(renderBlockingCss),
      status: renderBlockingCss <= 3 ? 'good' : renderBlockingCss <= 6 ? 'warn' : 'bad',
      tip: 'Combine CSS files and remove unused styles.',
    },
    {
      id: 'cls-risk',
      label: 'Images missing size attrs',
      value: `${imagesMissingDimensions}/${images.length}`,
      status: imagesMissingDimensions === 0 ? 'good' : imagesMissingDimensions <= 3 ? 'warn' : 'bad',
      tip: 'Missing width/height causes layout shift (CLS). Add dimensions or aspect-ratio.',
      note: 'Layout shift hurts Core Web Vitals.',
    },
    {
      id: 'hints',
      label: 'Preload / preconnect hints',
      value: String(preloadHints),
      status: preloadHints >= 2 ? 'good' : preloadHints === 1 ? 'warn' : 'bad',
      tip: 'Preconnect to fonts/CDN domains for faster loads.',
    },
    {
      id: 'inline-style',
      label: 'Inline style weight',
      value: inlineStyleBytes >= 1024 ? `${Math.round(inlineStyleBytes / 1024)} KB` : `${inlineStyleBytes} B`,
      status: inlineStyleBytes <= 5000 ? 'good' : inlineStyleBytes <= 20000 ? 'warn' : 'bad',
      tip: 'Heavy inline styles bloat HTML and block reuse.',
    },
  ];

  return {
    fetchTimeMs,
    complexityScore,
    domElements,
    resources: {
      scripts: scripts.length,
      stylesheets: stylesheets.length,
      images: images.length,
    },
    renderBlockingJs,
    renderBlockingCss,
    imagesMissingDimensions,
    preloadHints,
    signals,
  };
}

function analyzeSeo(doc) {
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const h1s = [...doc.querySelectorAll('h1')].map((el) => el.textContent.trim()).filter(Boolean);
  const lang = doc.documentElement.getAttribute('lang');
  const headings = {
    h1: doc.querySelectorAll('h1').length,
    h2: doc.querySelectorAll('h2').length,
    h3: doc.querySelectorAll('h3').length,
  };

  const checks = [
    {
      id: 'title-len',
      label: 'Title length',
      value: `${title.length} chars`,
      status: title.length >= 30 && title.length <= 60 ? 'good' : title.length > 0 ? 'warn' : 'bad',
      tip: title.length === 0 ? 'Add a <title> tag.' : 'Aim for 30–60 characters for search snippets.',
    },
    {
      id: 'meta-len',
      label: 'Meta description',
      value: metaDesc ? `${metaDesc.length} chars` : 'Missing',
      status: metaDesc.length >= 120 && metaDesc.length <= 160 ? 'good' : metaDesc ? 'warn' : 'bad',
      tip: 'Write a unique 120–160 char description for each page.',
    },
    {
      id: 'h1',
      label: 'H1 headings',
      value: String(headings.h1),
      status: headings.h1 === 1 ? 'good' : headings.h1 === 0 ? 'bad' : 'warn',
      tip: headings.h1 === 1 ? 'One H1 — chef\'s kiss for SEO structure.' : 'Use exactly one clear H1 per page.',
    },
    {
      id: 'lang',
      label: 'Language attribute',
      value: lang || 'Missing',
      status: lang ? 'good' : 'warn',
      tip: 'Add lang="en" (or your locale) on <html> for accessibility and SEO.',
    },
  ];

  return { title, metaDesc, h1s, headings, lang, checks };
}

function buildSummary({ score, trends, performance, seo, colors, ctas, outdated, images }) {
  const wins = [];
  const fixes = [];

  if (trends.present.length >= 5) {
    wins.push({ label: 'Trend-ready', detail: `${trends.present.length} modern signals detected.` });
  }
  if (performance.complexityScore >= 75) {
    wins.push({ label: 'Lean markup', detail: `Complexity score ${performance.complexityScore}/100.` });
  }
  if (seo.checks.find((c) => c.id === 'h1')?.status === 'good') {
    wins.push({ label: 'Clean H1 structure', detail: seo.h1s[0]?.slice(0, 60) || 'Single H1 found.' });
  }
  if (ctas.length >= 1 && ctas.length <= 4) {
    wins.push({ label: 'Focused CTAs', detail: `${ctas.length} call(s) to action — not overwhelming.` });
  }
  if (colors.stats.total > 0 && colors.stats.total <= 8) {
    wins.push({ label: 'Sensible palette', detail: colors.stats.verdict });
  }
  if (images.total > 0 && images.missingAlt === 0) {
    wins.push({ label: 'Image accessibility', detail: 'All images have alt text.' });
  }

  performance.signals
    .filter((s) => s.status === 'bad')
    .slice(0, 2)
    .forEach((s) => fixes.push({ label: s.label, detail: s.tip, priority: 'high' }));

  trends.missing.slice(0, 2).forEach(({ label, tip }) => {
    fixes.push({ label, detail: tip, priority: 'medium' });
  });

  outdated.slice(0, 2).forEach(({ label, roast }) => {
    fixes.push({ label, detail: roast, priority: 'high' });
  });

  if (images.missingAlt > 0) {
    fixes.push({
      label: 'Missing alt text',
      detail: `${images.missingAlt} image(s) need alt attributes.`,
      priority: 'medium',
    });
  }

  if (colors.stats.total > 10) {
    fixes.push({ label: 'Too many colors', detail: colors.stats.tip, priority: 'medium' });
  }

  if (wins.length === 0) {
    wins.push({ label: 'You showed up', detail: 'The site loaded. That is step one. Now let us polish.' });
  }

  const headline =
    score >= 80
      ? 'Solid foundation — a few tweaks from greatness.'
      : score >= 60
        ? 'Mixed bag — fix the red flags first, then the nice-to-haves.'
        : 'Needs work — but every issue here is fixable. Start with the summary below.';

  return {
    headline,
    wins: wins.slice(0, 4),
    fixes: fixes.slice(0, 5),
  };
}

function buildSuggestions({ trends, colors, ctas, images, styles, scripts, outdated, fonts, performance }) {
  const add = [];
  const remove = [];
  const optimize = [];

  trends.missing.forEach(({ label, tip }) => add.push({ label, tip }));

  if (colors.stats.total > 8) {
    remove.push({ label: 'Color overload', tip: `You use ${colors.stats.total} colors. Pick a palette of 3–5 and commit.` });
  }

  if (colors.stats.total <= 2) {
    add.push({ label: 'More visual hierarchy', tip: 'Add accent colors for CTAs and highlights so users know where to click.' });
  }

  if (ctas.length === 0) {
    add.push({ label: 'Clear call-to-action', tip: 'Add one obvious button: "Get Started", "Shop Now", or "Contact Us".' });
  } else if (ctas.length > 6) {
    remove.push({ label: 'CTA clutter', tip: `${ctas.length} CTAs fighting for attention. Pick your champion.` });
  }

  if (images.missingAlt > 0) {
    optimize.push({ label: 'Image alt text', tip: `${images.missingAlt} image(s) missing alt text. SEO and accessibility will thank you.` });
  }

  if (styles.inlineStyles > 40) {
    remove.push({ label: 'Inline style spaghetti', tip: `${styles.inlineStyles} inline styles detected. Move styles to CSS classes.` });
  }

  if (scripts.inlineScripts > 5) {
    optimize.push({ label: 'Script bundling', tip: 'Too many inline scripts. Bundle and defer non-critical JS.' });
  }

  if (performance.renderBlockingJs > 0) {
    optimize.push({ label: 'Defer JavaScript', tip: `${performance.renderBlockingJs} head script(s) block rendering. Add defer or move to body end.` });
  }

  if (performance.imagesMissingDimensions > 0) {
    optimize.push({ label: 'Prevent layout shift', tip: 'Add width/height to images to improve CLS and perceived speed.' });
  }

  outdated.forEach(({ label, roast }) => {
    remove.push({ label, tip: roast });
  });

  fonts.filter((f) => /comic|papyrus/i.test(f)).forEach((f) => {
    remove.push({ label: 'Font choice', tip: `"${f.slice(0, 40)}" is hurting your credibility.` });
  });

  optimize.push(
    { label: 'Performance', tip: 'Compress images, minify CSS/JS, and enable caching.' },
    { label: 'Mobile-first', tip: 'Test on a phone. If you need to pinch-zoom, your users already left.' },
    { label: 'Above-the-fold clarity', tip: 'Visitors should know what you do in 3 seconds. No treasure hunts.' }
  );

  return { add, remove, optimize };
}

function computeScore({ trends, outdated, images, styles, ctas, colors, performance }) {
  let score = 72;

  score += trends.present.length * 3;
  score -= trends.missing.length * 4;
  score -= outdated.length * 8;
  score -= Math.min(images.missingAlt * 3, 15);
  score -= Math.min(Math.floor(styles.inlineStyles / 20), 10);
  score += ctas.length >= 1 && ctas.length <= 4 ? 5 : 0;
  score -= ctas.length > 6 ? 8 : 0;
  score -= colors.stats.total > 10 ? 6 : 0;
  score += Math.floor(performance.complexityScore / 20);

  return clampScore(score);
}

function getVerdict(score) {
  if (score >= 85) return { tier: 'Almost Respectable', emoji: '😎' };
  if (score >= 70) return { tier: 'Chaos With Potential', emoji: '🫠' };
  if (score >= 50) return { tier: 'Needs a Design Hug', emoji: '💀' };
  return { tier: 'Digital Archaeology', emoji: '🦕' };
}

export function analyzeWebsite(url, html, size, fetchTimeMs = 0) {
  const doc = parseDocument(html);
  const seo = analyzeSeo(doc);
  const title = seo.title || 'Untitled Mystery Page';
  const metaDesc = seo.metaDesc;

  const colors = analyzeColors(html);
  const fonts = extractFonts(html, doc);
  const ctas = extractCTAs(doc);
  const images = analyzeImages(doc);
  const scripts = analyzeScripts(html);
  const styles = analyzeStyles(html, doc);
  const outdated = detectOutdated(html, doc);
  const trends = detectTrends(doc, html, url);
  const performance = analyzePerformance(doc, html, size, fetchTimeMs);
  const fontRoasts = detectFontRoasts(fonts);
  const suggestions = buildSuggestions({ trends, colors, ctas, images, styles, scripts, outdated, fonts, performance });
  const score = computeScore({ trends, outdated, images, styles, ctas, colors, performance });
  const verdict = getVerdict(score);
  const summary = buildSummary({ score, trends, performance, seo, colors, ctas, outdated, images });

  return {
    url,
    title,
    metaDesc,
    size,
    score,
    verdict,
    summary,
    colors,
    fonts,
    ctas,
    images,
    scripts,
    styles,
    performance,
    seo,
    outdated,
    trends,
    fontRoasts,
    suggestions,
    analyzedAt: new Date().toISOString(),
  };
}
