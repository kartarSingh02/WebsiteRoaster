import { clampScore, uniqueList } from '../utils/helpers.js';

const BUZZWORDS = [
  { word: 'synergy', roast: 'Using "synergy" tells us you have never actually completed a project without middle management holding your hand.' },
  { word: 'results-driven', roast: 'As opposed to what? "Disaster-driven"? Drop the filler.' },
  { word: 'dynamic', roast: 'A "dynamic professional" usually means you change your mind every five minutes.' },
  { word: 'thought leader', roast: 'If you have to call yourself a thought leader, you are definitely not one.' },
  { word: 'detail-oriented', roast: 'You claim to be detail-oriented, yet you used a generic resume builder template.' },
  { word: 'team player', roast: 'Translation: "I do not want to be held individually accountable for my work."' },
  { word: 'proactive', roast: 'Everyone writes proactive. Start describing actual projects instead of listing adjectives.' },
  { word: 'self-motivated', roast: 'Translation: "I did not get fired from my last job for playing video games all day."' },
  { word: 'out of the box', roast: 'Using "out of the box" is the most inside-the-box phrasing possible.' },
  { word: 'go-getter', roast: 'This is not 1985. Nobody uses "go-getter" unless they are selling door-to-door knives.' },
  { word: 'leverage', roast: '"Leverage your skillsets"? Just say "use". Plain English is okay, we promise.' },
  { word: 'passionate', roast: 'Passionate about React hooks? Let us be real. You are passionate about paying rent.' },
  { word: 'growth hacker', roast: 'Growth hacker? Unless you grew a business by 10,000% using a Raspberry Pi and a dream, you are just a regular marketer.' },
  { word: 'ninja', roast: 'Calling yourself a "ninja" developer suggests you write unmaintainable code in the dark and disappear.' },
  { word: 'rockstar', roast: 'Calling yourself a "rockstar" developer means you are a nightmare in pull request code reviews.' },
  { word: 'wizard', roast: 'Wizard? The only magic trick here is how fast this resume is going into the recycling bin.' },
  { word: 'disruptive', roast: 'Disruptive? The only thing you disrupted is your last engineering manager\'s sleep schedule.' },
  { word: 'innovative', roast: '"Innovative" is a label others give you. Claiming it yourself just means you used a library someone else built.' },
  { word: 'fast learner', roast: 'Fast learner? Translation: "I do not know the tech stack and I am hoping you will not test me on it during the interview."' }
];

const BASIC_SKILLS = [
  { match: /\b(?:microsoft\s+)?word\b/i, label: 'Microsoft Word', roast: 'Listing Microsoft Word is like listing "breathing" or "knowing how to double-click".' },
  { match: /\b(?:microsoft\s+)?excel\b/i, label: 'Microsoft Excel', roast: 'Unless you are writing complex VBA macros or financial models, listing Excel is not a skill.' },
  { match: /\b(?:microsoft\s+)?powerpoint\b/i, label: 'PowerPoint', roast: 'You can make slides. Congratulations, so can a fifth grader.' },
  { match: /\bslack\b/i, label: 'Slack', roast: 'Slack is a chat client. Typing messages in a channel is not a technical competency.' },
  { match: /\bzoom\b/i, label: 'Zoom', roast: 'If "joining a video call" is a highlighted skill, we are in serious trouble.' },
  { match: /\bemail\b/i, label: 'Email', roast: 'Everyone sends emails. It is a baseline expectation of modern society, not a resume highlight.' },
  { match: /\bgoogle(?:\s+search)?\b/i, label: 'Google Search', roast: 'We know developer search skills are critical, but putting it on your resume is just telling on yourself.' },
  { match: /\btyping\b/i, label: 'Typing', roast: 'Unless you type 150 WPM on a stenograph, please remove this.' },
  { match: /\b(?:chat\s*gpt|chatgpt|openai)\b/i, label: 'ChatGPT / AI Prompting', roast: 'Listing ChatGPT is bragging that you know how to copy-paste prompts into a search bar.' },
  { match: /\bcanva\b/i, label: 'Canva', roast: 'Canva? Graphic designers are crying. Keep it off technical developer resumes.' },
  { match: /\b(?:mac\s*os|macos|windows|linux\s+desktop)\b/i, label: 'Desktop OS (MacOS/Windows)', roast: 'Operating systems are not skills unless you are writing kernel drivers. We assume you know how to boot a PC.' },
  { match: /\bsocial\s*media\b/i, label: 'Social Media', roast: 'Social media? Scrolling TikTok or posting on your personal Instagram is not a professional competency.' }
];

const CLICHES = [
  { id: 'references', pattern: /references\s+(?:available\s+)?upon\s+request/i, label: 'References statement', roast: 'Of course references are available upon request. That is standard procedure, not a special bonus.' },
  { id: 'objective', pattern: /\bobjective\b/i, label: 'Objective statement', roast: 'The "Objective" section is dead. Recruiters know your objective: to get hired and get paid. Use a Summary instead.' },
];

const UNPROFESSIONAL_EMAILS = [
  { pattern: /(?:gamer|sexy|cool|ninja|boss|badboy|slayer|party|swag|king|queen|love|cutie)/i, label: 'unprofessional username', roast: 'Your email username sounds like an Xbox Live gamertag from 2011.' },
  { pattern: /@hotmail\.com/i, label: 'Hotmail account', roast: 'A Hotmail address tells recruiters you have not updated your email since the dot-com bubble.' },
  { pattern: /@aol\.com/i, label: 'AOL account', roast: 'An AOL address? Did you fax this resume over?' },
  { pattern: /@yahoo\.com/i, label: 'Yahoo account', roast: 'Yahoo Mail? Please, let us move into the modern era and get a simple Gmail or custom domain.' }
];

const ACTIVE_VERBS = [
  'led', 'created', 'managed', 'designed', 'built', 'developed', 'optimized',
  'solved', 'initiated', 'improved', 'spearheaded', 'launched', 'directed',
  'engineered', 'implemented', 'orchestrated', 'streamlined', 'restructured'
];

const PASSIVE_VERBS = [
  'assisted', 'helped', 'worked on', 'responsible for', 'participated', 'supported',
  'duties included', 'served as', 'involved in', 'aided', 'contributed'
];

const MARKET_SKILLS = [
  { name: 'Git / GitHub', pattern: /\bgit(?:hub|lab)?\b/i },
  { name: 'Docker / Containers', pattern: /\bdocker\b/i },
  { name: 'Databases / SQL', pattern: /\b(?:postgres|mysql|sqlite|mongodb|sql|nosql|database)\b/i },
  { name: 'APIs (REST/GraphQL)', pattern: /\b(?:api|apis|rest|graphql)\b/i },
  { name: 'CI/CD Pipelines', pattern: /\b(?:ci\/?cd|jenkins|actions|pipeline)\b/i },
  { name: 'Testing (Jest/QA)', pattern: /\b(?:testing|unit\s+tests|jest|cypress|mocha|tdd|bdd)\b/i },
  { name: 'Cloud Services (AWS/GCP)', pattern: /\b(?:aws|amazon\s+web\s+services|gcp|google\s+cloud|azure|vercel|netlify)\b/i },
  { name: 'TypeScript', pattern: /\b(?:typescript|ts)\b/i }
];

const REDUNDANT_TITLE_RE = /\b(?:curriculum\s+vitae|resume|c\.v\.)\b/i;

export function analyzeResume(fileName, fileSize, text) {
  const normalizedText = text.toLowerCase();
  
  // Basic stats
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = text.length;

  let score = 100;
  const suggestions = [];

  // 1. Length Check
  let lengthVerdict = 'Perfect length';
  if (wordCount < 150) {
    score -= 25;
    lengthVerdict = 'Too short / Minimalist placeholder';
    suggestions.push({
      id: 'length',
      type: 'add',
      label: 'Flesh out experience',
      description: 'Your resume is under 150 words. It looks like a placeholder. Add details about your projects, responsibilities, and key accomplishments.'
    });
  } else if (wordCount < 300) {
    score -= 10;
    lengthVerdict = 'Slightly thin';
    suggestions.push({
      id: 'length',
      type: 'add',
      label: 'Expand descriptions',
      description: 'Expand your bullet points. Use the STAR method (Situation, Task, Action, Result) to explain the impact of your actions.'
    });
  } else if (wordCount > 1200) {
    score -= 15;
    lengthVerdict = 'Novel length / Word salad';
    suggestions.push({
      id: 'length',
      type: 'remove',
      label: 'Trim the fat',
      description: 'Your resume is over 1200 words. Recruiters read resumes in 6 seconds. Condense your bullet points and keep only your best achievements.'
    });
  }

  // 2. Buzzwords Check
  const foundBuzzwords = [];
  for (const item of BUZZWORDS) {
    const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      foundBuzzwords.push({ word: item.word, count: matches.length, roast: item.roast });
      score -= 4 * matches.length;
    }
  }

  if (foundBuzzwords.length > 0) {
    suggestions.push({
      id: 'buzzwords',
      type: 'remove',
      label: 'Remove generic buzzwords',
      description: `Replace filler words like ${foundBuzzwords.slice(0, 3).map(b => `"${b.word}"`).join(', ')} with specific actions and data.`
    });
  }

  // 3. Basic Skills Check
  const foundBasicSkills = [];
  for (const item of BASIC_SKILLS) {
    if (item.match.test(normalizedText)) {
      foundBasicSkills.push({ name: item.label, roast: item.roast });
      score -= 6;
    }
  }

  if (foundBasicSkills.length > 0) {
    suggestions.push({
      id: 'basic-skills',
      type: 'remove',
      label: 'Remove baseline computer skills',
      description: `Remove basic tools like ${foundBasicSkills.slice(0, 3).map(s => `"${s.name}"`).join(', ')}. Recruiters assume you know these.`
    });
  }

  // 4. Contact Details
  const hasEmail = /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(normalizedText);
  const hasPhone = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}/.test(normalizedText);
  const hasLinkedin = /linkedin\.com/i.test(normalizedText);
  const hasGithub = /github\.com/i.test(normalizedText);

  let contactRoast = 'Contact info found. Good job not hiding.';
  if (!hasEmail) {
    score -= 15;
    contactRoast = 'No email address found. Do you want to be hired or are you in witness protection?';
    suggestions.push({
      id: 'no-email',
      type: 'add',
      label: 'Add contact email',
      description: 'Make sure your email address is visible and clearly formatted at the top of your resume.'
    });
  }
  if (!hasPhone) {
    score -= 5;
  }
  if (!hasLinkedin && !hasGithub) {
    score -= 5;
    suggestions.push({
      id: 'socials',
      type: 'add',
      label: 'Add LinkedIn or Portfolio links',
      description: 'Add links to your professional social presence (LinkedIn, GitHub, or a personal website) to show your work.'
    });
  }

  // Check unprofessional emails
  let unprofessionalEmailMatch = null;
  const emails = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g);
  if (emails) {
    for (const email of emails) {
      for (const item of UNPROFESSIONAL_EMAILS) {
        if (item.pattern.test(email)) {
          unprofessionalEmailMatch = { email, roast: item.roast };
          score -= 12;
          suggestions.push({
            id: 'unprofessional-email',
            type: 'optimize',
            label: 'Upgrade your email address',
            description: `Replace "${email}" with a simple, professional format (e.g., first.last@gmail.com).`
          });
          break;
        }
      }
      if (unprofessionalEmailMatch) break;
    }
  }

  // 5. Clichés Check
  const foundCliches = [];
  for (const item of CLICHES) {
    if (item.pattern.test(normalizedText)) {
      foundCliches.push({ id: item.id, label: item.label, roast: item.roast });
      score -= 8;
      
      if (item.id === 'references') {
        suggestions.push({
          id: 'references-cliche',
          type: 'remove',
          label: 'Delete "References" statement',
          description: 'Remove "References available upon request". It is outdated and takes up precious page space.'
        });
      }
      if (item.id === 'objective') {
        suggestions.push({
          id: 'objective-cliche',
          type: 'optimize',
          label: 'Replace Objective with Summary',
          description: 'Swap out the self-centered "Objective" statement for a high-impact professional "Summary" outlining your value proposition.'
        });
      }
    }
  }

  // 6. Action Verbs Check
  let activeCount = 0;
  let passiveCount = 0;

  for (const verb of ACTIVE_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) activeCount += matches.length;
  }

  for (const verb of PASSIVE_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) passiveCount += matches.length;
  }

  let verbsVerdict = 'Balanced voice';
  let verbsTip = 'Solid mix of action verbs. Keep quantifying your impact.';
  if (activeCount === 0 && passiveCount === 0) {
    verbsVerdict = 'No verbs detected';
    verbsTip = 'We could not detect clear project bullet points. Start each bullet point with a strong action verb (e.g., "Led", "Engineered").';
  } else if (passiveCount > activeCount) {
    score -= 10;
    verbsVerdict = 'Weak/Passive voice';
    verbsTip = 'Your resume relies on passive phrases like "assisted with" or "responsible for". Rewrite these to show ownership (e.g. "Spearheaded").';
    suggestions.push({
      id: 'passive-voice',
      type: 'optimize',
      label: 'Use strong action verbs',
      description: 'Rewrite passive bullet points (e.g., "Responsible for writing code") into active statements (e.g., "Engineered responsive web applications").'
    });
  }

  // 7. Market Skills Check (Relevant tools)
  const foundMarketSkills = [];
  const missingMarketSkills = [];
  for (const item of MARKET_SKILLS) {
    if (item.pattern.test(normalizedText)) {
      foundMarketSkills.push(item.name);
    } else {
      missingMarketSkills.push(item.name);
    }
  }

  let marketRoast = '';
  const skillsCount = foundMarketSkills.length;
  if (skillsCount === 0) {
    score -= 25;
    marketRoast = 'Zero modern market tools detected. No Git, no databases, no cloud, no testing. Are you coding on a typewriter?';
    suggestions.push({
      id: 'market-skills',
      type: 'add',
      label: 'Add core industry tools',
      description: 'Your resume lacks reference to standard modern technologies (Git, databases, REST APIs, or cloud platforms). Learn and add these.'
    });
  } else if (skillsCount <= 3) {
    score -= 10;
    marketRoast = `Only ${skillsCount} modern market tool(s) detected. Feels like bootcamp week 1. Add more core tooling like Git, SQL, or Docker.`;
    suggestions.push({
      id: 'market-skills-low',
      type: 'add',
      label: 'Expand technical toolkit',
      description: 'Most modern teams expect version control (Git), API design, and simple database experience. List these if you have them.'
    });
  } else if (skillsCount >= 6) {
    marketRoast = `Listed ${skillsCount} modern technologies. We get it, you copy-pasted the entire CNCF landscape. Make sure you actually know them.`;
  } else {
    marketRoast = 'Solid list of relevant tools. High market alignment. We wanted to complain, but you actually know what teams use.';
  }

  // 8. Redundant Title Check
  let hasRedundantTitle = false;
  if (REDUNDANT_TITLE_RE.test(normalizedText)) {
    hasRedundantTitle = true;
    score -= 6;
    suggestions.push({
      id: 'redundant-title',
      type: 'remove',
      label: 'Delete "RESUME/CV" labels',
      description: 'Remove "RESUME" or "CURRICULUM VITAE" from the top. It is redundant and wastes header space.'
    });
  }

  // Ensure score is clamped
  score = clampScore(score);

  // Verdict selection
  let verdict = { tier: 'Corporate Drone', emoji: '💼' };
  let customRoast = 'Your resume is a standard, average corporate script. It won\'t get you fired, but it won\'t get you noticed either.';
  
  if (score >= 85) {
    verdict = { tier: 'Unicorn Candidate (Highly Suspect)', emoji: '🦄' };
    customRoast = 'Not bad. We wanted to tear you apart, but you made it weirdly hard. It\'s clean, concise, and lacks obvious red flags. Are you human?';
  } else if (score >= 70) {
    verdict = { tier: 'Overqualified Fluff', emoji: '📄' };
    customRoast = 'You have skills, but your resume is trying to sell us a bridge. The buzzwords are doing heavy lifting and it feels like an essay.';
  } else if (score >= 50) {
    verdict = { tier: 'Generic Template Enjoyer', emoji: '🤡' };
    customRoast = 'It\'s the Honda Civic of resumes. Very 2014 LinkedIn profile. A lot of standard sentences and zero unique personality.';
  } else if (score >= 30) {
    verdict = { tier: 'Unemployed Vibes', emoji: '💸' };
    customRoast = 'This resume looks like it was written during a power outage. Key links are missing or your formatting choices are deeply concerning.';
  } else {
    verdict = { tier: 'Resume Disaster Area', emoji: '🔥' };
    customRoast = 'If a recruiter opens this, their spam filter might delete it out of pure self-preservation. This is less a resume and more a cry for help.';
  }

  return {
    fileName,
    fileSize,
    wordCount,
    characterCount,
    score,
    verdict,
    customRoast,
    lengthVerdict,
    buzzwords: {
      found: foundBuzzwords,
    },
    basicSkills: {
      found: foundBasicSkills,
    },
    cliches: foundCliches,
    contactInfo: {
      hasEmail,
      hasPhone,
      hasLinkedin,
      hasGithub,
      unprofessionalEmail: unprofessionalEmailMatch,
      roast: contactRoast
    },
    verbs: {
      activeCount,
      passiveCount,
      verdict: verbsVerdict,
      tip: verbsTip
    },
    marketSkills: {
      found: foundMarketSkills,
      missing: missingMarketSkills,
      roast: marketRoast,
      count: skillsCount
    },
    hasRedundantTitle,
    suggestions,
  };
}
