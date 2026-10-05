import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'dcph-tracker',
    name: 'DCPH Tracker',
    subtitle: 'Community tracking platform for Detective Conan PH',
    description:
      'A tracking platform for a fan community: episode, movie and OVA progress with cross-device sync, a story-arc watch guide, leaderboards, themed chat rooms, and a searchable case and character index. Built and maintained for a live audience.',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
    image: '/images/projects/dcph/cover.png',
    url: 'https://dcphtracker.vercel.app',
    urlLabel: 'dcphtracker.vercel.app',
    year: '2026',
    featured: true,
    category: 'Web app',
  },
  {
    slug: 'attendance',
    name: 'Attendance Management System',
    subtitle: 'Full-stack IoT deployment on a Raspberry Pi',
    description:
      'An end-to-end attendance system built for a real client environment: a Spring Boot API, a React front end, and PostgreSQL, all running on a Raspberry Pi. It handles Flyway database migrations, SMTP notifications, network whitelisting, and ships with a Windows installer for the client.',
    tech: [
      'Java',
      'Spring Boot',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Flyway',
      'Raspberry Pi',
      'Linux',
    ],
    image: '/images/projects/attendance/cover.png',
    url: 'https://eattendease.vercel.app',
    urlLabel: 'eattendease.vercel.app',
    year: '2026',
    featured: true,
    category: 'Full stack',
  },
  {
    slug: 'devcard',
    name: 'DevCard',
    subtitle: 'GitHub profile README builder',
    description:
      'A visual builder for GitHub profile READMEs. Pick a tech stack, drag sections into place, and the markdown renders live exactly as GitHub will show it. Copy or download in one click.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    image: '/images/projects/devcard/cover.png',
    url: 'https://hubgenerator.vercel.app/',
    urlLabel: 'hubgenerator.vercel.app',
    year: '2026',
    featured: true,
    category: 'Web app',
  },
  {
    slug: 'loophabit',
    name: 'LoopHabit',
    subtitle: 'Native Android habit tracker',
    description:
      'An Android habit tracker built in Android Studio with Kotlin. Daily streaks, reminders, and a deliberately quiet interface. Distributed through the project site and Google Play.',
    tech: ['Kotlin', 'Android Studio', 'Java'],
    image: '/images/projects/loophabit/banner.jpg',
    url: 'https://loop-habit-website.vercel.app/',
    urlLabel: 'loop-habit-website.vercel.app',
    year: '2026',
    featured: true,
    category: 'Mobile',
  },
  {
    slug: 'wallet',
    name: 'Wallet',
    subtitle: 'Digital wallet app',
    description:
      'A digital wallet built with Next.js and MongoDB for tracking balances, transfers, and payment history.',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    image: '/images/projects/wallet/cover.png',
    url: 'https://nothingwallet.vercel.app',
    urlLabel: 'nothingwallet.vercel.app',
    year: '2026',
    category: 'Web app',
  },
  {
    slug: 'accounting',
    name: 'Accounting & Finance System',
    subtitle: 'Coursework · financial records',
    description:
      'A PHP and MySQL accounting system for recording transactions, generating statements, and managing ledgers. Built for a systems integration course.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    image: '/images/projects/accounting/cover.png',
    url: 'https://github.com/Leap0920/accounting-and-finance-Sia2-',
    urlLabel: 'github.com/Leap0920',
    year: '2025',
    category: 'Web app',
  },
  {
    slug: 'tally-dcph',
    name: 'Tally DCPH',
    subtitle: 'Competition scoring dashboard',
    description:
      'A scoring and record-keeping dashboard for tracking competition results, with a simple admin view for entering scores.',
    tech: ['JavaScript', 'HTML', 'CSS', 'MySQL'],
    image: '/images/projects/tally/cover.png',
    url: 'https://leap0920.github.io/Tally-DCPH/',
    urlLabel: 'leap0920.github.io/Tally-DCPH',
    year: '2024',
    category: 'Web app',
  },
  {
    slug: 'lecuisine',
    name: 'LECUISINE',
    subtitle: 'Responsive marketing site',
    description:
      'A responsive restaurant site built from scratch with vanilla JavaScript and CSS, deployed on GitHub Pages.',
    tech: ['JavaScript', 'HTML', 'CSS', 'GitHub Pages'],
    image: '/images/projects/lecuisine/cover.png',
    url: 'https://leap0920.github.io/LECUISINE/',
    urlLabel: 'leap0920.github.io/LECUISINE',
    year: '2024',
    category: 'Site',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const otherProjects = projects.filter((project) => !project.featured);

/** Every distinct technology across all projects, most used first. */
export const projectTech = Array.from(new Set(projects.flatMap((project) => project.tech))).sort(
  (a, b) => {
    const countA = projects.filter((project) => project.tech.includes(a)).length;
    const countB = projects.filter((project) => project.tech.includes(b)).length;
    return countB - countA || a.localeCompare(b);
  },
);
