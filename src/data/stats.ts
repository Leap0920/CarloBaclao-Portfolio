import { projects } from './projects';
import { certifications, skills } from './resume';
import { profile } from './profile';

/** Every distinct technology across skills and projects. */
export const allTechnologies = Array.from(
  new Set([...skills.flatMap((group) => group.skills), ...projects.flatMap((p) => p.tech)]),
).sort((a, b) => a.localeCompare(b));

/** Headline numbers. All derived from the data so they cannot drift out of date. */
export const stats = [
  { value: String(projects.length), label: 'Projects built', hint: 'shipped or deployed' },
  { value: String(certifications.length), label: 'Certificates', hint: 'across 6 issuers' },
  { value: String(allTechnologies.length), label: 'Technologies', hint: 'in regular use' },
  { value: String(profile.codingSince), label: 'Writing code since', hint: 'senior high school' },
];

/**
 * The stack the hero leads with, ordered by how often it is reached for rather
 * than alphabetically — the front of the list is what most of the work is built
 * with. Every name also appears in `skills`, so the tag rows below stay the
 * single source of truth.
 */
export const coreStack = [
  'TypeScript',
  'React',
  'Next.js',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Tailwind CSS',
  'Flutter',
  'Linux',
  'Raspberry Pi',
];
