import type {
  Certification,
  EducationItem,
  ExperienceItem,
  FocusArea,
  SkillCategory,
  ValueItem,
} from '@/types';

export const experience: ExperienceItem[] = [
  {
    id: 'enov8tive',
    company: 'Enov8tive',
    position: 'Software Developer',
    range: { start: '2026-08', end: '2026-10' },
    location: 'Philippines',
    description: [
      'Built and maintained frontend interface features, turning requirements into working UI.',
      'Ran QA regression passes after each change to confirm nothing that already worked had broken.',
    ],
    technologies: ['Frontend Development', 'QA Regression Testing'],
  },
  {
    id: 'state-lab-clinics',
    company: 'State Lab Clinics and Diagnostic Center',
    position: 'Data Encoder',
    range: { start: '2022-04', end: '2022-06' },
    location: 'Philippines',
    description: [
      'Encoded patient records, lab results, and billing data into the clinic system for diagnosis and billing.',
      'Organized digital and physical files while holding to strict confidentiality rules under data privacy standards.',
    ],
    technologies: ['Data Entry', 'Database Management', 'Information Security'],
  },
];

export const education: EducationItem[] = [
  {
    id: 'qcu',
    institution: 'Quezon City University',
    degree: 'Bachelor of Science',
    field: 'Information Technology',
    range: { start: '2023-08' },
    note: 'Coursework in systems integration, database management, networking, and software engineering.',
  },
  {
    id: 'aics',
    institution: 'Asian Institute of Computer Studies',
    degree: 'Senior High School',
    field: 'Information Technology',
    range: { start: '2021-08', end: '2023-06' },
    note: 'Where I wrote my first programs and decided to keep going.',
  },
];

/**
 * The tech-stack strip groups. The brief fixes four groups — Frontend,
 * Backend, Tools, Design — so the former Languages / Frameworks / Data /
 * Platforms split was re-cut onto those four; every technology carries over
 * exactly once, and Design adds the two interface competencies the portfolio
 * itself demonstrates (responsive layout and accessibility).
 *
 * `levels` is Carlo's own proficiency, 1 (learning) to 5 (daily driver), and
 * it drives the tooltip and the depth bar on each tile. Edit the numbers
 * here and the tech section follows; a skill left out of `levels` renders
 * unrated rather than being given an invented score.
 */
export const skills: SkillCategory[] = [
  {
    category: 'Frontend',
    summary: 'The frameworks and languages the interfaces are built in.',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Flutter', 'Dart'],
    levels: {
      React: 5,
      'Next.js': 5,
      JavaScript: 5,
      TypeScript: 4,
      Flutter: 3,
      Dart: 3,
    },
  },
  {
    category: 'Backend',
    summary: 'APIs, data stores, and the migrations that keep them honest.',
    skills: [
      'Java',
      'Python',
      'C++',
      'Go',
      'SQL',
      'Spring Boot',
      '.NET',
      'GraphQL',
      'PostgreSQL',
      'MongoDB',
      'SQLite',
      'Flyway',
      'Firebase',
    ],
    levels: {
      SQL: 5,
      Java: 4,
      Python: 4,
      'Spring Boot': 4,
      PostgreSQL: 4,
      'C++': 3,
      MongoDB: 3,
      SQLite: 3,
      Flyway: 3,
      Firebase: 3,
      Go: 2,
      '.NET': 2,
      GraphQL: 2,
    },
  },
  {
    category: 'Tools',
    summary: 'Where the work is written, versioned, containerised, and run.',
    skills: [
      'Git',
      'GitHub',
      'Docker',
      'Linux',
      'Raspberry Pi',
      'IntelliJ IDEA',
      'VS Code',
      'Android Studio',
      'Windows Deployment',
    ],
    levels: {
      Git: 5,
      GitHub: 5,
      'VS Code': 5,
      Linux: 4,
      'Raspberry Pi': 4,
      'IntelliJ IDEA': 4,
      Docker: 3,
      'Android Studio': 3,
      'Windows Deployment': 3,
    },
  },
  {
    category: 'Design',
    summary: 'The layer that makes an interface feel considered.',
    skills: ['Tailwind CSS', 'Framer Motion', 'Responsive Design', 'Accessibility'],
    levels: {
      'Tailwind CSS': 5,
      'Responsive Design': 5,
      Accessibility: 4,
      'Framer Motion': 3,
    },
  },
];

export const focusAreas: FocusArea[] = [
  {
    title: 'Full-stack web',
    detail: 'React and Next.js up front, Spring Boot APIs behind, PostgreSQL or MongoDB underneath.',
  },
  {
    title: 'Android & cross-platform',
    detail: 'Native Android in Kotlin, and Flutter when one codebase must serve both platforms.',
  },
  {
    title: 'Deployment on real hardware',
    detail:
      'Running a stack on a Raspberry Pi: Linux, systemd services, database migrations surviving reboot.',
  },
];

export const values: ValueItem[] = [
  {
    label: 'Short term',
    detail: 'Finish my degree and earn real production experience through an internship.',
  },
  {
    label: 'Long term',
    detail: 'Own a system end to end: design, build, deploy, and run it.',
  },
];

export const interests = [
  {
    label: 'Outside of code',
    detail: 'Video games, films, walking unfamiliar parts of the city, reading philosophy and psychology.',
  },
];

export const certifications: Certification[] = [
  {
    id: 'hackerrank-sql-advanced',
    name: 'SQL (Advanced) Certificate',
    issuer: 'HackerRank',
    image: '/images/Certification/SQL (Advanced) Certificate.png',
  },
  {
    id: 'hackerrank-java-basic',
    name: 'Java (Basic) Certificate',
    issuer: 'HackerRank',
    image: '/images/Certification/Java (Basic) Certificate.png',
  },
  {
    id: 'fortinet-nse1',
    name: 'NSE 1 Network Security Associate',
    issuer: 'Fortinet',
    image: '/images/Certification/NSE 1 Network Security Associate.png',
  },
  {
    id: 'fortinet-nse2',
    name: 'NSE 2 Network Security Associate',
    issuer: 'Fortinet',
    image: '/images/Certification/NSE 2 Network Security Associate.png',
  },
  {
    id: 'cisco-technical-intro',
    name: 'Technical Introduction to Cybersecurity 3.0',
    issuer: 'Cisco',
    image: '/images/Certification/Technical Introduction to Cybersecurity 3.0 Self-Paced.png',
  },
  {
    id: 'cisco-threat-landscape',
    name: 'Introduction to the Threat Landscape 3.0',
    issuer: 'Cisco',
    image: '/images/Certification/Introduction to the Threat Landscape 3.0 Self-Paced.png',
  },
  {
    id: 'cisco-getting-started',
    name: 'Getting Started in Cybersecurity 3.0',
    issuer: 'Cisco',
    image: '/images/Certification/Getting Started in Cybersecurity 3.0 Self-Paced.png',
  },
  {
    id: 'fcc-responsive-web',
    name: 'Legacy Responsive Web Design V8',
    issuer: 'freeCodeCamp',
    image: '/images/Certification/Legacy Responsive Web Design V8 Certification.png',
  },
  {
    id: 'tesda-sci',
    name: 'Security, Compliance, and Identity Fundamentals',
    issuer: 'TESDA',
    image:
      '/images/Certification/Microsoft Cybersecurity Course Security, Compliance, and Identity Fundamentals.jpeg',
  },
  {
    id: 'udemy-mongodb',
    name: 'The Complete MongoDB Developers Course',
    issuer: 'Udemy',
    image: '/images/Certification/MongoDB - The Complete MongoDB Developers Course.jpg',
  },
  {
    id: 'udemy-pyscript',
    name: 'PyScript Fundamentals 101 - Run Python in your Browser',
    issuer: 'Udemy',
    image:
      "/images/Certification/PyScript Fundamentals 101- Run Python in your Browser's HTML.jpg",
  },
  {
    id: 'udemy-flutter',
    name: 'Dart & Flutter - The Complete Flutter Development Course',
    issuer: 'Udemy',
    image: '/images/Certification/Dart & Flutter  The Complete Flutter Development Course.jpg',
  },
  {
    id: 'udemy-python-success',
    name: 'Python Programming - The Complete Course for Success',
    issuer: 'Udemy',
    image: '/images/Certification/Python Programming The Complete Course for Success.jpg',
  },
  {
    id: 'udemy-java-beginners',
    name: 'Java Training Crash Course for Java Beginners',
    issuer: 'Udemy',
    image: '/images/Certification/Java Training Crash Course for Java Beginners.jpg',
  },
  {
    id: 'udemy-cpp-java',
    name: 'C++ And Java Training Crash Course for Beginners',
    issuer: 'Udemy',
    image: '/images/Certification/C++ And Java Training Crash Course for Beginners.jpg',
  },
  {
    id: 'udemy-python-tasks',
    name: 'Python Complete Course with 30+ Hands-on Tasks',
    issuer: 'Udemy',
    image: '/images/Certification/Python Complete Course with 30+ Hands on Tasks and Solution.jpg',
  },
  {
    id: 'udemy-js-fullstack',
    name: 'JavaScript Fundamentals to Advanced - Full Stack Development',
    issuer: 'Udemy',
    image:
      '/images/Certification/JavaScript Fundamentals to Advanced- Full Stack Development.jpg',
  },
  {
    id: 'udemy-php-mysql',
    name: 'Build 13 Projects with PHP, MySQL, Bootstrap and PDO',
    issuer: 'Udemy',
    image: '/images/Certification/Build 13 Projects with PHP MySQL Bootstrap and PDO.jpg',
  },
  {
    id: 'udemy-git',
    name: 'GIT, GitLab, GitHub Fundamentals for Software Developers',
    issuer: 'Udemy',
    image: '/images/Certification/GIT, GitLab, GitHub Fundamentals for Software Developers.jpg',
  },
  {
    id: 'udemy-project-management',
    name: 'Professional Certificate in Project Management',
    issuer: 'Udemy',
    image: '/images/Certification/Professional Certificate in Project Management.jpg',
  },
  {
    id: 'udemy-software-engineering',
    name: 'Introduction to Software Engineering',
    issuer: 'Udemy',
    image: '/images/Certification/Introduction to Software Engineering.jpg',
  },
  {
    id: 'mastering-cpp',
    name: 'Mastering C++ Language - C++ Programming For Beginners',
    issuer: 'Udemy',
    image: '/images/Certification/Mastering C++ Language - C++ Programming For Beginners.jpg',
  },
  {
    id: 'web3-blockchain-pm',
    name: 'Web3 Blockchain Project Manager Certification Course',
    issuer: 'Udemy',
    image: '/images/Certification/Web3  Blockchain Project Manager Certification Course.jpg',
  },
];

/**
 * The certificates that earn a hero card, capped at three because the
 * brief caps the featured set at "2-3 max", and listed in the order they
 * must render: flagship first.
 *
 * Everything else renders as a compact text list. Twenty-three equally loud
 * image tiles was both far too long a scroll and flat as hierarchy: when every
 * item shouts, none of them stands out. The cut is by kind, one of each: the
 * flagship web certification, a skill-verified advanced tier, and a vendor
 * security credential. The other Cisco, Fortinet, HackerRank and TESDA
 * credentials drop to the secondary list rather than being lost.
 *
 * This is an ORDERED array, not a Set, and `featuredCertifications` is derived
 * by mapping over it. That matters: filtering `certifications` preserves SOURCE
 * order, and the freeCodeCamp credential sits 8th in that array, so a
 * filter-based derivation silently made the HackerRank SQL certificate the
 * flagship. Nothing in the component could have caught it, because both
 * orderings are valid lists. The order in this array is the order on the page.
 */
const FEATURED_CERT_IDS = [
  'fcc-responsive-web', // freeCodeCamp, the flagship web certification
  'hackerrank-sql-advanced', // skill-verified, advanced tier
  'cisco-technical-intro', // vendor credential, widest recognition
];

export const featuredCertifications: Certification[] = FEATURED_CERT_IDS.flatMap((id) => {
  const cert = certifications.find((entry) => entry.id === id);
  return cert ? [cert] : [];
});

export const otherCertifications = certifications.filter(
  (cert) => !FEATURED_CERT_IDS.includes(cert.id),
);

/** Certification issuers in the order they should appear as filters. */
export const certIssuers = Array.from(new Set(certifications.map((cert) => cert.issuer))).sort(
  (a, b) => {
    const countA = certifications.filter((cert) => cert.issuer === a).length;
    const countB = certifications.filter((cert) => cert.issuer === b).length;
    return countB - countA || a.localeCompare(b);
  },
);
