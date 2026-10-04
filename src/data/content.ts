// ─────────────────────────────────────────────────────────────
// Every word, link and image on the site lives here.
// Search for "EDIT" to find the details that still need you.
// ─────────────────────────────────────────────────────────────

export const site = {
  url: 'https://arthikan.click',
  name: 'Arthikan Vettivel',
  first: 'ARTHIKAN',
  last: 'VETTIVEL',
  monogram: 'AV',
  title: 'Arthikan Vettivel — Digital Marketing Executive & Web Developer',
  tagline: { lead: 'Strategy', italic: 'with soul.', rest: 'Creative thinking, technical doing.' },
  location: 'Jaffna / Colombo, Sri Lanka',
  timeZone: 'Asia/Colombo',
  openToWork: true, // EDIT: set false to hide the green "Open to work" pill
  cv: '/cv/Arthikan-Vettivel-CV.pdf',
}

export const contact = {
  email: 'arthikandev@gmail.com',
  phone: '+94 71 938 3745',
  whatsapp: 'https://wa.me/94719383745',
  location: 'Colombo / Jaffna, Sri Lanka',
  // EDIT: paste your Formspree endpoint (https://formspree.io/f/xxxxxx).
  // While empty, the form opens a pre-filled email instead.
  formEndpoint: '',
}

export type Social = { label: string; handle: string; href: string; short: string }

export const socials: Social[] = [
  { label: 'LinkedIn', short: 'in', handle: 'arthikan-vettivel', href: 'https://www.linkedin.com/in/arthikan-vettivel-77a5b92b2' },
  { label: 'Instagram', short: 'ig', handle: '@arthi.zen', href: 'https://www.instagram.com/arthi.zen' },
  { label: 'X', short: 'x', handle: '@arthiv25', href: 'https://x.com/arthiv25' },
  { label: 'Threads', short: '@', handle: '@arthi.zen', href: 'https://www.threads.com/@arthi.zen' },
  { label: 'Facebook', short: 'fb', handle: 'Arthikan', href: 'https://www.facebook.com/share/18ucNfBJiB/' },
]

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'FYP', href: '#fyp' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  roles: ['Marketing Executive', 'Web Developer', 'Designer', 'Podcast Host', 'Storyteller'],
  secondary: 'Web Developer',
  ctaWork: 'View my work',
  ctaListen: 'Listen to FYP',
  portraits: {
    executive: { src: '/images/arthikan-suit', alt: 'Arthikan Vettivel in a black suit and tie against a grey studio wall' },
    creator: { src: '/images/arthikan-casual', alt: 'Arthikan Vettivel in a navy blazer and white t-shirt, head tilted, smiling' },
  },
}

export const ribbon = [
  'Social Media', 'Campaign Planning', 'Google Ads', 'Meta Ads', 'TikTok Ads', 'Bilingual Copy',
  'Graphic Design', 'UI/UX', 'React', 'Video Editing', 'Podcasting',
]

export const disciplines = [
  {
    n: '01',
    title: 'MARKET',
    line: 'Ideas, out in the world.',
    italic: 'out in the world.',
    body: 'Social calendars, paid campaigns and English–Tamil copy that speaks to people where they already are.',
    tools: ['Meta Business Suite', 'Google Ads', 'TikTok Ads Manager', 'Google Analytics'],
    demo: 'social' as const,
  },
  {
    n: '02',
    title: 'DESIGN',
    line: 'Design that tells the story.',
    italic: 'tells the story.',
    body: 'Posters, campaign creatives, brand identities and video edits, built on a grid and finished with feeling.',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'Adobe XD', 'Sketch', 'DaVinci Resolve'],
    demo: 'poster' as const,
  },
  {
    n: '03',
    title: 'BUILD',
    line: 'Design meets development.',
    italic: 'meets development.',
    body: 'Responsive React sites with real motion, shipped to Vercel. The same person who designs it also builds it.',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git', 'APIs', 'Vercel'],
    demo: 'code' as const,
  },
]

// Caption used in the MARKET demo (types in English, then flips to Tamil).
// EDIT: check the Tamil line. "ஆற்றல்" = potential / inner power.
export const bilingualCaption = {
  en: 'Find your potential. ✳',
  ta: 'உங்கள் ஆற்றலைக் கண்டறியுங்கள். ✳',
}

// ── Work ─────────────────────────────────────────────────────
export type Category = 'Marketing' | 'Design' | 'Web' | 'Podcast'
export type Img = { src: string; alt: string; label?: string; concept?: boolean }

export type Work = {
  id: string
  tag: string
  title: string
  italic: string
  role: string
  year: string
  result: string
  categories: Category[]
  cover: Img
  coverStyle?: 'poster' | 'logo' | 'ui' | 'award' | 'site'
  gallery: Img[]
  details: string[]
  link?: { href: string; label: string }
  route?: string
  note?: string
}

const p = (name: string) => `/work/${name}` // base path; components add -720.webp / -1400.webp

export const works: Work[] = [
  {
    id: 'fyp',
    tag: 'PODCAST · BRAND · WEB',
    title: 'FYP — Find Your Potential',
    italic: 'A podcast brand built from zero.',
    role: 'Founder & host',
    year: '2026',
    result: 'Identity, artwork, launch campaign and website, ahead of Episode 01.',
    categories: ['Podcast', 'Design', 'Web', 'Marketing'],
    cover: { src: p('fyp-episode-01'), alt: 'FYP Episode 01 poster: Why do we feel behind in life?' },
    coverStyle: 'poster',
    gallery: [
      { src: p('fyp-episode-01'), alt: 'Episode 01 poster', label: 'Episode 01 key art' },
      { src: p('fyp-coming-soon-spark'), alt: 'FYP coming soon poster with glowing lime sphere', label: 'Teaser — the spark' },
      { src: p('fyp-coming-soon-wave'), alt: 'FYP coming soon poster with sound waves', label: 'Teaser — the signal' },
      { src: p('fyp-banner'), alt: 'FYP Podcast channel banner', label: 'Channel banner' },
    ],
    details: [],
    route: '/work/fyp',
    link: { href: 'https://fyp-podcast.vercel.app/', label: 'Visit FYP' },
  },
  {
    id: 'synergy',
    tag: 'MARKETING · EDUCATION',
    title: 'Synergy Consultant & Solutions',
    italic: 'Study-abroad social campaigns.',
    role: 'Marketing Executive',
    year: '2026 → now',
    result: 'Posters, event creatives, English/Tamil captions, scripts and promo videos for overseas study programmes.',
    categories: ['Marketing', 'Design'],
    cover: { src: p('synergy-logo'), alt: 'Synergy Consultant logo' },
    coverStyle: 'logo',
    gallery: [{ src: p('synergy-logo'), alt: 'Synergy Consultant logo', label: 'Brand I work with' }],
    details: [
      'Plan and manage social content for overseas study opportunities, university programmes and student success stories.',
      'Design branded posters, banners, digital creatives and event materials.',
      'Write English and Tamil captions, promotional copy and video scripts.',
      'Edit promotional videos and short-form content.',
      'Support webinars, open days, student outreach and university partnership promotions.',
    ],
    note: 'EDIT: add 3–6 real Synergy creatives to /raw, run `npm run images`, and list them in this gallery. Add one real metric to the stats section.',
  },
  {
    id: 'campaigns',
    tag: 'CAMPAIGN CONCEPTS',
    title: 'Brand Campaign Concepts',
    italic: 'Big brands, my own briefs.',
    role: 'Art direction & design',
    year: '2026',
    result: 'Seven self-set campaign posters across sport, food, fashion, auto and luxury.',
    categories: ['Design', 'Marketing'],
    cover: { src: p('aura-gym'), alt: 'AURA Fitness Club poster: Built Beyond Limits' },
    coverStyle: 'poster',
    gallery: [
      { src: p('aura-gym'), alt: 'AURA Fitness Club — Built Beyond Limits', label: 'AURA Fitness — Built Beyond Limits' },
      { src: p('break-the-ordinary'), alt: 'Break the Ordinary — glass ring breaking a stone wall', label: 'Break the Ordinary — exploration 001' },
      { src: p('nolimit-style'), alt: 'NOLIMIT — Style Without Limits', label: 'NOLIMIT — Style Without Limits', concept: true },
      { src: p('kfc-crunch'), alt: 'KFC — Crunch. With Character.', label: 'KFC — Crunch. With Character.', concept: true },
      { src: p('redbull-momentum'), alt: 'Red Bull Racing — Maximum Momentum', label: 'Red Bull Racing — Maximum Momentum', concept: true },
      { src: p('tesla-electric'), alt: 'Tesla — Electric. By Design.', label: 'Tesla — Electric. By Design.', concept: true },
      { src: p('rolex-legacy'), alt: 'Rolex — A Legacy in Every Second', label: 'Rolex — A Legacy in Every Second', concept: true },
    ],
    details: [
      'Each poster starts from a one-line brief and a single message: one idea, one hero image, one headline.',
      'Typography carries the tone: condensed and loud for sport, serif and quiet for luxury, airy for tech.',
      'All brand pieces are unofficial concept work, not commissioned by or affiliated with the brands.',
    ],
  },
  {
    id: 'srilanka',
    tag: 'TRAVEL SERIES',
    title: 'Discover Sri Lanka',
    italic: 'One island, four postcards.',
    role: 'Design series',
    year: '2026',
    result: 'A calm editorial travel series: one serif system, one cream paper, four places.',
    categories: ['Design', 'Marketing'],
    cover: { src: p('sri-lanka'), alt: 'Discover Sri Lanka poster' },
    coverStyle: 'poster',
    gallery: [
      { src: p('sri-lanka'), alt: 'Discover Sri Lanka — One island. Endless wonder.', label: 'Sri Lanka — One island. Endless wonder.' },
      { src: p('colombo'), alt: 'Colombo — A city worth slowing down for.', label: 'Colombo — A city worth slowing down for.' },
      { src: p('kandy'), alt: 'Kandy — A quiet heart in the hills.', label: 'Kandy — A quiet heart in the hills.' },
      { src: p('galle'), alt: 'Galle — History, framed by the sea.', label: 'Galle — History, framed by the sea.' },
    ],
    details: [
      'A repeatable layout: country line, city in a large serif, one-line promise, three-word footer.',
      'Built to scale into a whole tourism campaign: social posts, stories and print.',
    ],
  },
  {
    id: 'ceylon',
    tag: 'PRODUCT · TWO DIRECTIONS',
    title: 'Ceylon Tea',
    italic: 'Heritage vs. hype.',
    role: 'Concept & design',
    year: '2026',
    result: 'The same product pitched two ways: a calm heritage story and a loud, Gen-Z colour direction.',
    categories: ['Design', 'Marketing'],
    cover: { src: p('ceylon-tea-steep'), alt: 'Ceylon Tea — Steep in Style poster' },
    coverStyle: 'poster',
    gallery: [
      { src: p('ceylon-tea-classic'), alt: 'Ceylon Tea — An island in every sip', label: 'Direction A — An island in every sip.' },
      { src: p('ceylon-tea-steep'), alt: 'Ceylon Tea — Steep in Style', label: 'Direction B — Steep in Style.' },
    ],
    details: ['Showing a client two clear directions makes the decision easier and the brief sharper.'],
  },
  {
    id: 'hht',
    tag: 'EVENT CONCEPT',
    title: 'Hiphop Tamizha — Sri Lanka',
    italic: 'One island. One sound.',
    role: 'Fan concept poster',
    year: '2026',
    result: 'A high-energy concert key visual mixing grunge textures, chrome type and the Colombo skyline.',
    categories: ['Design'],
    cover: { src: p('hht-adhi-concert'), alt: 'Hiphop Tamizha Adhi Sri Lanka concert concept poster' },
    coverStyle: 'poster',
    gallery: [{ src: p('hht-adhi-concert'), alt: 'Hiphop Tamizha Adhi concert concept', label: 'Unofficial fan concept, not an event announcement', concept: true }],
    details: ['Unofficial fan concept. Not an event announcement and not affiliated with the artist.'],
  },
  {
    id: 'site',
    tag: 'WEB · DESIGN + BUILD',
    title: 'arthikan.click',
    italic: 'This portfolio.',
    role: 'Design & development',
    year: '2026',
    result: 'React, GSAP, Three.js and Web Audio, deployed on Vercel. You are looking at it.',
    categories: ['Web', 'Design'],
    cover: { src: '', alt: 'arthikan.click' },
    coverStyle: 'site',
    gallery: [],
    details: [
      'Vite + React + TypeScript, Tailwind v4, GSAP ScrollTrigger, Lenis, Framer Motion and a single Three.js moment.',
      'Respects reduced motion, keyboard navigation and screen readers.',
    ],
  },
  {
    id: 'venomx',
    tag: 'UI/UX · CLIENT WORK',
    title: 'Venom X Technology',
    italic: 'Interfaces for clients.',
    role: 'UI/UX Designer',
    year: '2025 – 26',
    result: 'Wireframes, prototypes, usability tests and developer handoff for client projects.',
    categories: ['Design', 'Web'],
    cover: { src: '', alt: 'Venom X Technology UI/UX work' },
    coverStyle: 'ui',
    gallery: [],
    details: [
      'Designed user-centred interfaces, wireframes, prototypes and high-fidelity layouts.',
      'Ran user research and usability testing to refine journeys.',
      'Worked with developers to turn designs into accessible, functional interfaces.',
    ],
    note: 'EDIT: add 2–3 screens (NDA-safe) to the gallery.',
  },
  {
    id: 'award',
    tag: 'AWARD · UI/UX',
    title: 'UI/UX Design Competition',
    italic: 'Second Runner-Up.',
    role: 'ESOFT UNI, Jaffna',
    year: '9 Dec 2025',
    result: 'Placed third in the campus UI/UX design competition.',
    categories: ['Design'],
    cover: { src: '', alt: 'UI/UX competition award' },
    coverStyle: 'award',
    gallery: [],
    details: ['Second Runner-Up, UI/UX Design Competition, ESOFT UNI Jaffna, 9 December 2025.'],
    note: 'EDIT: add the competition entry screens.',
  },
]

// ── FYP ──────────────────────────────────────────────────────
export const fyp = {
  name: 'FYP — Find Your Potential',
  logo: '/fyp/fyp-logo.png',
  headline: 'A little pause. A bigger perspective.',
  sub: 'There’s no single timeline for becoming.',
  body: 'FYP is my podcast about motivation, personal growth and figuring life out: honest conversations for anyone who feels a step behind.',
  episode: {
    number: '01',
    title: 'Why do we feel behind in life?',
    // EDIT: confirm the launch date/time (Sri Lanka time, +05:30).
    launch: '2026-10-25T18:00:00+05:30',
    launchLabel: 'October 25',
    cover: '/work/fyp-episode-01',
    ideas: [
      { k: '01', t: 'The comparison trap', d: 'Why other people’s highlight reels feel like your deadline.' },
      { k: '02', t: 'Invisible deadlines', d: 'The timelines nobody wrote down but everyone seems to follow.' },
      { k: '03', t: 'Small next steps', d: 'Trading the big leap for the next honest move.' },
    ],
  },
  // EDIT: export a 30–45s trailer to public/fyp/trailer.mp3. Until it exists the
  // player shows "Trailer coming soon" with a simulated waveform.
  trailer: '/fyp/trailer.mp3',
  links: [
    { label: 'Visit FYP', href: 'https://fyp-podcast.vercel.app/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@the.fyppodcast' },
    { label: 'Instagram', href: 'https://www.instagram.com/the.fyppodcast' },
    // EDIT: FYP LinkedIn page URL
    { label: 'LinkedIn', href: '' }, // EDIT: FYP LinkedIn page URL (hidden while empty)
  ],
  roles: ['Founder', 'Host', 'Brand identity', 'Artwork', 'Web', 'Social strategy'],
  palette: [
    { name: 'Studio black', hex: '#10120F' },
    { name: 'Paper white', hex: '#F5F5F0' },
    { name: 'Potential lime', hex: '#BAF709' },
  ],
  // Scroll-stop microphone sequence (Part B · B4). Export frames as
  // public/fyp/mic/frame_001.webp … frame_120.webp, then set frames: 120.
  micFrames: 0,
}

// ── Stats ────────────────────────────────────────────────────
// Only true numbers. EDIT: once you have them, add Synergy results, e.g.
// { value: 40, prefix: '+', suffix: '%', label: 'engagement on Synergy pages' }
export const stats = [
  { value: 20, prefix: '', suffix: '+', label: 'posters & campaign creatives in this portfolio' },
  { value: 2, prefix: '', suffix: '', label: 'languages: English & Tamil copy' },
  { value: 1, prefix: '', suffix: '', label: 'podcast brand built from zero' },
  { value: 3, prefix: '', suffix: 'rd', label: 'place: UI/UX competition, ESOFT 2025' },
]

// EDIT: add 2–3 real quotes, e.g. { quote: '…', name: 'Name', role: 'Role, Company' }.
// The carousel stays hidden while this list is empty.
export const testimonials: { quote: string; name: string; role: string }[] = []

// ── Skills ───────────────────────────────────────────────────
export const skillGroups = [
  {
    name: 'Marketing',
    skills: ['Social media management', 'Campaign planning', 'Audience & competitor research', 'Performance monitoring', 'Bilingual copywriting'],
    tools: [
      { t: 'Meta Business Suite', how: 'Scheduling, ads and insights for Synergy’s pages.' },
      { t: 'Google Ads', how: 'Search and display campaigns for programme enquiries.' },
      { t: 'TikTok Ads Manager', how: 'Short-form reach for student audiences.' },
      { t: 'Google Analytics', how: 'Tracking what content turns into enquiries.' },
      { t: 'Copywriting EN/TA', how: 'Captions, scripts and promo copy in English and Tamil.' },
    ],
  },
  {
    name: 'Design & Video',
    skills: ['Graphic design', 'Branding', 'UI/UX', 'Prototyping', 'Video editing'],
    tools: [
      { t: 'Figma', how: 'UI design, prototypes and layout systems.' },
      { t: 'Photoshop', how: 'Campaign posters, compositing and retouching.' },
      { t: 'Illustrator', how: 'Logos, icons and vector brand assets.' },
      { t: 'Adobe XD', how: 'Wireframes and click-through prototypes.' },
      { t: 'Sketch', how: 'Interface layouts for client projects.' },
      { t: 'DaVinci Resolve', how: 'Promo videos, reels and podcast edits.' },
    ],
  },
  {
    name: 'Web Dev',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive layouts', 'Git', 'APIs'],
    tools: [
      { t: 'React', how: 'Component-based sites like this one and the FYP site.' },
      { t: 'JavaScript', how: 'Interaction, animation and API calls.' },
      { t: 'HTML & CSS', how: 'Accessible, responsive layouts.' },
      { t: 'Git', how: 'Version control and deploys from GitHub.' },
      { t: 'Vercel', how: 'Hosting and continuous deployment.' },
      { t: 'APIs', how: 'Foundational REST integration.' },
    ],
  },
]

export const languages = [
  { name: 'Tamil', level: 'Native', value: 1 },
  { name: 'English', level: 'Conversational', value: 0.68 },
]

// ── Journey ──────────────────────────────────────────────────
export const journey = [
  { when: 'Mar 2026 → Now', year: '2026', title: 'Marketing Executive', org: 'Synergy Consultant & Solutions (Pvt) Ltd, Jaffna', now: true },
  { when: '2026 → Now', year: '2026', title: 'Founder & Host', org: 'FYP — Find Your Potential (podcast)' },
  { when: '2026 → 2027', year: '2027', title: 'BSc (Hons) Software Engineering', org: 'Kingston University · in progress' },
  { when: '9 Dec 2025', year: '2025', title: 'Second Runner-Up', org: 'UI/UX Design Competition, ESOFT UNI Jaffna', award: true },
  { when: 'Feb 2025 → Apr 2026', year: '2025', title: 'Vice Secretary, Student Council', org: 'ESOFT UNI, Jaffna' },
  { when: 'Jan 2025 → Jan 2026', year: '2025', title: 'UI/UX Designer', org: 'Venom X Technology' },
  { when: '2024 → 2025', year: '2024', title: 'HND in Software Engineering', org: 'ESOFT UNI' },
  { when: '2011 → 2019', year: '2019', title: 'GCE O/L & A/L', org: 'J/Nelliady Central College' },
]

// ── About ────────────────────────────────────────────────────
export const about = {
  bio: [
    'I’m Arthikan, a marketer, designer and curious person figuring things out.',
    'By day I plan social campaigns, design creatives and write English–Tamil content for study-abroad programmes at Synergy.',
    'By night I design interfaces, write React, and host FYP, my podcast about finding your own pace.',
    'I like work where strategy and craft meet.',
  ],
  chips: [
    { icon: '📍', t: 'Jaffna, Sri Lanka' },
    { icon: '🎓', t: 'BSc SE @ Kingston (2027)' },
    { icon: '🎙', t: 'Hosting FYP' },
  ],
  // Optional living-portrait loop from Part B · B3 (muted mp4/webm, ≤ 1.5 MB).
  video: '',
}

export const contactCopy = {
  lead: 'Let’s make something',
  italic: 'worth sharing.',
  projectTypes: ['Marketing', 'Design', 'Website', 'Podcast collab'],
}
