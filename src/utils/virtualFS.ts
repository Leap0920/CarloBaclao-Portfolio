// Virtual Filesystem for Carlo's Portfolio CLI Terminal

export interface VFile {
  name: string;
  type: 'file';
  size: string;
  permissions: string;
  updatedAt: string;
  content: string;
}

export interface VDirectory {
  name: string;
  type: 'dir';
  permissions: string;
  updatedAt: string;
  children: Record<string, VFile | VDirectory>;
}

export type VNode = VFile | VDirectory;

export const VIRTUAL_FS: VDirectory = {
  name: '~',
  type: 'dir',
  permissions: 'drwxr-xr-x',
  updatedAt: '2026-07-28 12:00',
  children: {
    'about.txt': {
      name: 'about.txt',
      type: 'file',
      size: '512B',
      permissions: '-rw-r--r--',
      updatedAt: '2026-07-28 10:00',
      content: `Carlo C. Baclao — Full-Stack Developer & 4th Year BS IT Student @ Quezon City University.
Specializing in React, Next.js, TypeScript, Spring Boot, Flutter, and IoT deployments with 5+ years of programming experience.`,
    },
    'skills.json': {
      name: 'skills.json',
      type: 'file',
      size: '1.2KB',
      permissions: '-rw-r--r--',
      updatedAt: '2026-07-28 10:05',
      content: JSON.stringify(
        {
          languages: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C++', 'SQL', 'Dart'],
          frameworks: ['React 19', 'Next.js 16', 'Spring Boot', 'Flutter', 'Tailwind CSS', 'Framer Motion'],
          tools: ['PostgreSQL', 'Git', 'Docker', 'Flyway', 'Raspberry Pi', 'Linux'],
          database: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
        },
        null,
        2
      ),
    },
    'contact.cfg': {
      name: 'contact.cfg',
      type: 'file',
      size: '256B',
      permissions: '-rw-r--r--',
      updatedAt: '2026-07-28 10:10',
      content: `[CONTACT]
email = baclao.carlo.cometa@gmail.com
phone = 09686890263
location = Quezon City, Metro Manila, Philippines
status = Available for Web Dev / IT Internships & Hiring`,
    },
    'secret_key.gpg': {
      name: 'secret_key.gpg',
      type: 'file',
      size: '128B',
      permissions: '-r--------',
      updatedAt: '2026-07-28 11:11',
      content: `-----BEGIN PGP MESSAGE-----
Version: CarloCrypto 4.0
Quote: "The happiness of your life depends upon the quality of your thoughts." — Marcus Aurelius
EasterEgg: You found the secret terminal key! Hire Carlo today 🚀
-----END PGP MESSAGE-----`,
    },
    projects: {
      name: 'projects',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      updatedAt: '2026-07-28 11:30',
      children: {
        'attendease.md': {
          name: 'attendease.md',
          type: 'file',
          size: '340B',
          permissions: '-rw-r--r--',
          updatedAt: '2026-07-28 11:31',
          content: `# Attendance Management System (AttendEase)
- Stack: React, Next.js, Spring Boot, PostgreSQL, Tailwind CSS
- URL: https://Eattendease.vercel.app
- Description: Full-featured automated attendance tracking system for institutions.`,
        },
        'tally-dcph.md': {
          name: 'tally-dcph.md',
          type: 'file',
          size: '280B',
          permissions: '-rw-r--r--',
          updatedAt: '2026-07-28 11:32',
          content: `# Tally DCPH
- Stack: React, TypeScript, Tailwind CSS
- URL: https://leap0920.github.io/Tally-DCPH
- Description: Specialized tallying and score management web app.`,
        },
        'nothing-wallet.md': {
          name: 'nothing-wallet.md',
          type: 'file',
          size: '290B',
          permissions: '-rw-r--r--',
          updatedAt: '2026-07-28 11:33',
          content: `# Nothing Wallet
- Stack: Next.js, Tailwind CSS, Framer Motion
- URL: https://nothingwallet.vercel.app
- Description: Sleek, dot-matrix inspired digital wallet interface.`,
        },
      },
    },
  },
};
