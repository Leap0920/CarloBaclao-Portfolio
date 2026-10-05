import type { NavSection } from '@/types';

/** Section anchors in document order — also drives the header nav and scroll-spy. */
export const navSections: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
