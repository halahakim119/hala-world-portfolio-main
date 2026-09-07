// ---------------------------------------------------------------------------
// This is the only file you should need to edit to make the world "yours".
// Replace every [bracketed] placeholder with real content from your CV.
// Nothing here is invented for you — bullets are left as prompts on purpose
// so no fake dates, employers, or numbers slip into the published site.
// ---------------------------------------------------------------------------

export const hero = {
  name: 'Hala Abdul Hakeem Neamah',
  // TODO: one line, shown under the name on the sign-in island and Simple view.
  title: '[Your role, e.g. "Frontend Developer"]',
  // TODO: 1–2 sentences of introduction.
  intro:
    '[A short introduction — who you are and what kind of work you do.]',
};

export type ZoneId = 'about' | 'experience' | 'projects' | 'skills' | 'contact';

export interface PortfolioZone {
  id: ZoneId;
  /** Shown on the in-world signpost and the HUD panel title. */
  title: string;
  /** One short line under the title. */
  tagline: string;
  /** Bullet points shown when the rover parks at this stop. */
  bullets: string[];
  /** Accent color for this stop's beacon, signpost, and HUD panel. */
  color: string;
}

export const zones: PortfolioZone[] = [
  {
    id: 'about',
    title: 'About',
    tagline: 'Who I am',
    bullets: [
      '[A couple of sentences about your background.]',
      '[What you are currently focused on or looking for.]',
    ],
    color: '#F4A261',
  },
  {
    id: 'experience',
    title: 'Experience',
    tagline: 'Where I have worked',
    bullets: [
      '[Role — Company, dates from your CV]',
      '[Role — Company, dates from your CV]',
    ],
    color: '#4A9DAE',
  },
  {
    id: 'projects',
    title: 'Projects',
    tagline: 'What I have built',
    bullets: [
      '[Project name — one line on what it does and your contribution]',
      '[Project name — one line on what it does and your contribution]',
    ],
    color: '#E8622C',
  },
  {
    id: 'skills',
    title: 'Skills',
    tagline: 'Tools I work with',
    bullets: [
      '[Languages / frameworks from your CV]',
      '[Other tools, e.g. design, data, ops]',
    ],
    color: '#D9A441',
  },
  {
    id: 'contact',
    title: 'Contact',
    tagline: 'Get in touch',
    bullets: [
      '[Email address]',
      '[LinkedIn / GitHub / other links you want listed]',
    ],
    color: '#C9667B',
  },
];
