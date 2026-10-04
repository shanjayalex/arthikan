# arthikan.click

Portfolio of **Arthikan Vettivel**: Digital Marketing Executive, designer and web developer, and host of **FYP — Find Your Potential**.

Vite + React 19 + TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis · Framer Motion · React Three Fiber · Web Audio.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into /dist
npm run preview    # serve the build
```

You need Node 20+ (https://nodejs.org).

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. On vercel.com: **Add New → Project**, import the repo. Vercel detects Vite. Keep the defaults and deploy.
3. **Settings → Domains**: add `arthikan.click`.
4. Optional: add `VITE_GA_ID` under **Settings → Environment Variables** for Google Analytics 4. Vercel Analytics works automatically once you enable it in the project's **Analytics** tab.

`vercel.json` already handles the `/work/fyp` route and long-term image caching.

## Where things live

| What | Where |
| --- | --- |
| **All copy, links, work items, journey, skills** | `src/data/content.ts` |
| Colours, fonts, global CSS | `src/styles/index.css` |
| Sections | `src/components/*` (one file per section) |
| FYP case study page | `src/pages/FypCase.tsx` |
| Animation helper (reduced-motion aware) | `src/lib/motion.ts` → `useGsap()` |
| Portraits | `public/images/` |
| Posters / work images | `public/work/` |
| FYP logo, trailer, mic frames | `public/fyp/` |
| CV | `public/cv/Arthikan-Vettivel-CV.pdf` |

## Replacing / adding images

Source images go in `/raw` as PNG or JPG. Then run:

```bash
npm run images
```

That writes `name-720.webp` and `name-1400.webp` into `public/work/` (portraits go to `public/images/`), rebuilds the transparent FYP logo, and regenerates `public/og-image.jpg`.

Then reference the image in `src/data/content.ts` **without** the size suffix, e.g. `src: '/work/synergy-open-day'`.

- **New project card**: add an object to `works` in `content.ts`. `coverStyle: 'poster'` uses the image; `gallery` fills the case pop-up and the poster archive.
- **Portrait cut-outs (Part B · B1)**: save as `raw/arthikan-suit.png` / `raw/arthikan-casual.png` and re-run `npm run images`.

## Things still marked `EDIT`

Search the code for `EDIT`. The main ones:

- [ ] **Synergy creatives**: add 3–6 real posters to the Synergy gallery, plus one real metric to `stats`.
- [ ] **Venom X / competition screens**: add to their `gallery` arrays (placeholder art shows until then).
- [ ] **FYP trailer**: export 30–45s as `public/fyp/trailer.mp3`. The player switches from "Trailer coming soon" to live playback automatically, and the waves across the site react to the audio.
- [ ] **Episode 01 date**: `fyp.episode.launch` (currently 25 Oct 2026, 6 PM Sri Lanka time). After it passes, the countdown becomes "Now streaming".
- [ ] **FYP LinkedIn page**: `fyp.links` (the button stays hidden while it's empty).
- [ ] **Contact form**: create a free form on formspree.io and paste the endpoint into `contact.formEndpoint`. Until then the form opens a pre-filled email.
- [ ] **Tamil caption**: `bilingualCaption.ta` in `content.ts`.
- [ ] **FYP case-study copy**: `src/pages/FypCase.tsx`. It's a first draft, so rewrite it in your own voice.
- [ ] **Testimonials**: add to `testimonials` (the carousel stays hidden while it's empty).
- [ ] **Living portrait (B3)**: put the loop in `public/` and set `about.video`.
- [ ] **Scroll-stop mic (B4)**: export ~120 frames as `public/fyp/mic/frame_001.webp …` (+ `mic.mp4` for mobile) and set `fyp.micFrames: 120`.

## Easter egg

Type `fyp` anywhere on the page.
