import type { NavSection } from '@/types';

/** Section anchors in document order — also drives the header nav and scroll-spy. */
export const navSections: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'techstack', label: 'Tech Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Studied' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];
