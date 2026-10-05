import type { NavSection } from '@/types';

/** Section anchors in document order — also drives the header nav and scroll-spy. */
export const navSections: NavSection[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'activity', label: 'Activity' },
  { id: 'contact', label: 'Contact' },
];
