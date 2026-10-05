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
    id: 'state-lab-clinics',
    company: 'State Lab Clinics and Diagnostic Center',
    position: 'Data Encoder',
    range: { start: '2022-04', end: '2022-07' },
    location: 'Philippines',
    description: [
      'Encoded and updated patient information, laboratory results, and other critical records into the clinic management system, keeping the data accurate enough to be relied on for diagnosis and billing.',
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
    range: { start: '2022-08', end: '2028-06' },
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

export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    summary: 'What I reach for when a problem needs solving.',
    skills: ['TypeScript', 'JavaScript', 'Java', 'Python', 'C++', 'SQL', 'Dart'],
  },
  {
    category: 'Frameworks & Libraries',
    summary: 'The layers I build on top of those languages.',
    skills: [
      'React',
      'Next.js',
      'Spring Boot',
      'Flutter',
      'Tailwind CSS',
      'Framer Motion',
      '.NET',
    ],
  },
  {
    category: 'Data & Tools',
    summary: 'How the data is stored, migrated, and shipped.',
    skills: [
      'PostgreSQL',
      'MongoDB',
      'SQLite',
      'Flyway',
      'Git',
      'Docker',
      'IntelliJ IDEA',
      'VS Code',
    ],
  },
  {
    category: 'Platforms & Systems',
    summary: 'Where it all runs, including the unglamorous parts.',
    skills: [
      'Raspberry Pi',
      'Linux',
      'Firebase',
      'GitHub',
      'Windows Deployment',
      'Android Studio',
    ],
  },
];

export const focusAreas: FocusArea[] = [
  {
    title: 'Full-stack web',
    detail:
      'React and Next.js on the front, Spring Boot or Next API routes behind it, PostgreSQL or MongoDB underneath.',
  },
  {
    title: 'Android & cross-platform',
    detail:
      'Native Android in Kotlin, and Flutter when a project needs one codebase for both platforms.',
  },
  {
    title: 'Deployment on real hardware',
    detail:
      'Getting a stack running and staying up on a Raspberry Pi — Linux, systemd services, and database migrations that survive a reboot.',
  },
];

export const values: ValueItem[] = [
  {
    label: 'Short term',
    detail: 'Finish my degree and earn real production experience through an internship.',
  },
  {
    label: 'Long term',
    detail: 'Own a system end to end — design it, build it, deploy it, keep it running.',
  },
];

export const traits = ['Curious', 'Meticulous', 'Rigorous', 'Empathetic', 'Sociable', 'Team lead'];

export const interests = [
  {
    label: 'Outside of code',
    detail:
      'Video games, films, walking around parts of the city I have not seen, and reading philosophy and psychology.',
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
    name: 'PyScript Fundamentals 101 — Run Python in your Browser',
    issuer: 'Udemy',
    image:
      "/images/Certification/PyScript Fundamentals 101- Run Python in your Browser's HTML.jpg",
  },
  {
    id: 'udemy-flutter',
    name: 'Dart & Flutter — The Complete Flutter Development Course',
    issuer: 'Udemy',
    image: '/images/Certification/Dart & Flutter  The Complete Flutter Development Course.jpg',
  },
  {
    id: 'udemy-python-success',
    name: 'Python Programming — The Complete Course for Success',
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
    name: 'JavaScript Fundamentals to Advanced — Full Stack Development',
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
    name: 'Mastering C++ Language — C++ Programming For Beginners',
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

/** Certification issuers in the order they should appear as filters. */
export const certIssuers = Array.from(new Set(certifications.map((cert) => cert.issuer))).sort(
  (a, b) => {
    const countA = certifications.filter((cert) => cert.issuer === a).length;
    const countB = certifications.filter((cert) => cert.issuer === b).length;
    return countB - countA || a.localeCompare(b);
  },
);
