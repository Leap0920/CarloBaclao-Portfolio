import { ResumeData } from '@/types';

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Carlo C. Baclao',
    title: 'Software Engineer',
    email: 'baclao.carlo.cometa@gmail.com',
    phone: '09686890263',
    location: 'Quezon City, Philippines',
    linkedin: 'https://www.linkedin.com/in/baclao-carlo-22936435a/',
    github: 'https://github.com/Leap0920',
  },
  summary: 'A passionate software engineer with 5 years of programming experience. I enjoy building full-stack applications, exploring IoT solutions, and turning ideas into functional systems. Currently pursuing my BS in Information Technology at Quezon City University.',
  experience: [
    {
      id: 'ams-1',
      company: 'Quezon City University — Academic Project',
      position: 'Full-Stack Engineer & System Architect',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-05-01'),
      description: [
        'Architected and built an end-to-end Attendance Management System with a Java Spring Boot backend, React (Vite) frontend, and PostgreSQL database deployed on a Raspberry Pi.',
        'Implemented Flyway database migrations, custom security whitelisting, automated SMTP email notifications, and real-time user activity tracking.',
        'Packaged the entire distributed system into a standalone one-click Windows .exe installer using Launch4j and JPackage for seamless deployment.',
        'Deployed PostgreSQL on Raspberry Pi with Linux configuration, demonstrating IoT/hardware integration and edge computing.'
      ],
      technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Flyway', 'Raspberry Pi', 'Linux']
    },
    {
      id: 'data-1',
      company: 'State Lab Clinics and Diagnostic Center',
      position: 'Data Encoder',
      startDate: new Date('2022-04-01'),
      endDate: new Date('2022-07-31'),
      description: [
        'Accurately encoded and updated patient information, laboratory results, and other critical data into the clinic\'s management system.',
        'Managed and organized digital and physical files, maintaining strict confidentiality in compliance with data privacy standards.'
      ],
      technologies: ['Data Entry', 'Database Management', 'Information Security']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Quezon City University',
      degree: 'Bachelor of Science',
      field: 'Information Technology',
      startDate: new Date('2022-08-14'),
      endDate: new Date('2028-06-01'),
    },
    {
      id: '2',
      institution: 'Asian Institute of Computer Studies',
      degree: 'Senior High School',
      field: 'Information Technology',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2023-06-01'),
    }
  ],
  skills: [
    {
      category: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C++', 'SQL', 'Dart']
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['React', 'Next.js', 'Spring Boot', 'Flutter', 'Tailwind CSS', 'Framer Motion', '.NET']
    },
    {
      category: 'Tools & Databases',
      skills: ['PostgreSQL', 'Git', 'Docker', 'SQLite', 'Flyway', 'IntelliJ IDEA', 'VS Code']
    },
    {
      category: 'Platforms & Systems',
      skills: ['Raspberry Pi', 'Linux', 'Firebase', 'GitHub', 'Windows Deployment']
    }
  ],
  certifications: [
    {
      id: 'fortinet-1',
      name: 'NSE 1 Network Security Associate',
      issuer: 'Fortinet',
      imageUrl: '/images/Certification/NSE 1 Network Security Associate.png',
    },
    {
      id: 'fortinet-2',
      name: 'NSE 2 Network Security Associate',
      issuer: 'Fortinet',
      imageUrl: '/images/Certification/NSE 2 Network Security Associate.png',
    },
    {
      id: 'cisco-1',
      name: 'Technical Introduction to Cybersecurity 3.0 Self-Paced',
      issuer: 'Cisco',
      imageUrl: '/images/Certification/Technical Introduction to Cybersecurity 3.0 Self-Paced.png',
    },
    {
      id: 'cisco-2',
      name: 'Introduction to the Threat Landscape 3.0 Self-Paced',
      issuer: 'Cisco',
      imageUrl: '/images/Certification/Introduction to the Threat Landscape 3.0 Self-Paced.png',
    },
    {
      id: 'cisco-3',
      name: 'Getting Started in Cybersecurity 3.0 Self-Paced',
      issuer: 'Cisco',
      imageUrl: '/images/Certification/Getting Started in Cybersecurity 3.0 Self-Paced.png',
    },
    {
      id: 'udemy-mongodb',
      name: 'MongoDB - The Complete MongoDB Developers Course',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/MongoDB - The Complete MongoDB Developers Course.jpg',
    },
    {
      id: 'udemy-pyscript',
      name: 'PyScript Fundamentals 101 - Run Python in your Browser\'s HTML',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/PyScript Fundamentals 101- Run Python in your Browser\'s HTML.jpg',
    },
    {
      id: 'udemy-flutter',
      name: 'Dart & Flutter | The Complete Flutter Development Course',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Dart & Flutter  The Complete Flutter Development Course.jpg',
    },
    {
      id: 'udemy-python-success',
      name: 'Python Programming: The Complete Course for Success',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Python Programming The Complete Course for Success.jpg',
    },
    {
      id: 'udemy-java-beginners',
      name: 'Java Training Crash Course for Java Beginners',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Java Training Crash Course for Java Beginners.jpg',
    },
    {
      id: 'udemy-cpp-java',
      name: 'C++ And Java Training Crash Course for Beginners',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/C++ And Java Training Crash Course for Beginners.jpg',
    },
    {
      id: 'udemy-python-tasks',
      name: 'Python Complete Course: with 30+ Hands-on Tasks and Solution',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Python Complete Course with 30+ Hands on Tasks and Solution.jpg',
    },
    {
      id: 'udemy-js-fullstack',
      name: 'JavaScript Fundamentals to Advanced: Full Stack Development',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/JavaScript Fundamentals to Advanced- Full Stack Development.jpg',
    },
    {
      id: 'udemy-php',
      name: 'Build 13 Projects with PHP MySQL Bootstrap and PDO',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Build 13 Projects with PHP MySQL Bootstrap and PDO.jpg',
    },
    {
      id: 'udemy-git',
      name: 'GIT, GitLab, GitHub Fundamentals for Software Developers',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/GIT, GitLab, GitHub Fundamentals for Software Developers.jpg',
    },
    {
      id: 'udemy-project-mgmt',
      name: 'Professional Certificate in Project Management',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Professional Certificate in Project Management.jpg',
    },
    {
      id: 'udemy-software-eng',
      name: 'Introduction to Software Engineering',
      issuer: 'Udemy',
      imageUrl: '/images/Certification/Introduction to Software Engineering.jpg',
    },
    {
      id: 'fcc-responsive',
      name: 'Legacy Responsive Web Design V8 Certification',
      issuer: 'FreeCodeCamp',
      imageUrl: '/images/Certification/Legacy Responsive Web Design V8 Certification.png',
    },
    {
      id: 'microsoft-sci',
      name: 'Security, Compliance, and Identity Fundamentals',
      issuer: 'Microsoft',
      imageUrl: '/images/Certification/Microsoft Cybersecurity Course Security, Compliance, and Identity Fundamentals.jpeg',
    },
  ]
};
