/** Shared content types for the portfolio. */

export type IconName =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'tiktok'
  | 'mail'
  | 'globe'
  | 'external';

/** An ISO-ish month: `YYYY-MM`. Kept as a string so data stays serializable. */
export type Month = string;

export interface DateRange {
  start: Month;
  /** Omitted means "Present". */
  end?: Month;
}

export interface SocialLink {
  id: string;
  label: string;
  /** The handle or subtitle shown beneath the label. */
  handle: string;
  url: string;
  icon: IconName;
  /** Shown in the header and hero as a primary route to reach out. */
  primary?: boolean;
}

export interface Profile {
  name: string;
  /** What he is, in the shortest honest form. */
  role: string;
  /** One sentence used for SEO and social previews. */
  pitch: string;
  /** Longer first-person intro used in the hero. */
  intro: string;
  email: string;
  phone: string;
  location: string;
  /** Spoken languages, e.g. rendered as a short list. */
  spokenLanguages: string[];
  github: string;
  linkedin: string;
  /** Path to the résumé PDF served from `public/`. */
  resumeUrl: string;
  /** The year he started writing code, used in the hero stat strip. */
  codingSince: number;
  focusAreas: string[];
  /** Short list of what he's looking for, shown as the availability badge. */
  availability: string;
  socials: SocialLink[];
}

export interface FocusArea {
  title: string;
  detail: string;
}

export interface ValueItem {
  label: string;
  detail: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  range: DateRange;
  location?: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  range: DateRange;
  /** Shown as a small note, e.g. coursework focus. */
  note?: string;
}

export interface SkillCategory {
  category: string;
  /** One line describing how the group is used in practice. */
  summary: string;
  skills: string[];
  /**
   * Self-assessed proficiency per skill, 1 (learning) to 5 (daily
   * driver). Sparse on purpose: a skill with no entry is shown as
   * unrated rather than being given an invented number, and the values
   * are Carlo's own assessment, editable in `src/data/resume.ts`.
   */
  levels?: Record<string, number>;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  image: string;
  /** Issue date, `YYYY-MM`. Omitted when it has not been supplied yet. */
  date?: string;
  /** Public verification URL for the credential. Omitted until supplied. */
  verify?: string;
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  /**
   * The impact line for the showcase card: what the project does and
   * who it does it for, in one or two sentences. This is the first
   * sentence or two of `description`, kept verbatim, and it is what
   * the plate leads with. `description` remains the long form for the
   * dialog.
   */
  impact: string;
  tech: string[];
  image: string;
  /** The live, deployed URL. */
  url: string;
  urlLabel: string;
  /** Optional public repository, rendered as a separate "GitHub" link. */
  repo?: string;
  year: string;
  /** Rendered larger, in the featured band at the top of the section. */
  featured?: boolean;
  /** A short noun for the kind of build, used as a filter label. */
  category: ProjectCategory;
}

export type ProjectCategory = 'Web app' | 'Mobile' | 'Full stack' | 'Site';

export interface NavSection {
  id: string;
  label: string;
}
