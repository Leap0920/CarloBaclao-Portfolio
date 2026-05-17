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
  summary: 'Curious and sociable individual with a passion for software development. I enjoy learning new technologies and applying them to solve real-world problems. My goal is to become a proficient software engineer and contribute to innovative projects that make a positive impact.',
  experience: [
    {
      id: '1',
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
      degree: 'Information Technology',
      field: 'Information Technology',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2023-06-01'),
    }
  ],
  skills: [
    {
      category: 'Languages & Core',
      skills: ['JavaScript', '.NET', 'Java', 'Python', 'SQL']
    },
    {
      category: 'Software & Tools',
      skills: ['Visual Studio', 'IntelliJ IDEA', 'XAMPP', 'SQLite', 'Git', 'GitHub']
    },
    {
      category: 'Concepts & Disciplines',
      skills: ['Responsive Web Design', 'Networking', 'Cybersecurity Fundamentals', 'Agile Product Management', 'Project Management']
    },
    {
      category: 'Personal Attributes',
      skills: ['Quick Learner', 'Adaptable', 'Strong Problem-Solving', 'Leadership', 'Meticulous', 'Curious', 'Sociable']
    }
  ],
  certifications: [
    {
      id: 'cs50-1',
      name: "CS50's Web Programming with Python and JavaScript",
      issuer: 'HarvardX / CS50',
      issueDate: new Date('2023-01-01'),
    },
    {
      id: 'udemy-1',
      name: 'Professional Diploma in Agile Product Management',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-2',
      name: 'Professional Certificate in Project Management',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-3',
      name: 'Introduction to Software Engineering',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-4',
      name: 'Git, GitHub, GitHub Fundamentals for Software Developers',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-5',
      name: 'AI Tools for UX/UI Designers and Web Designers',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-6',
      name: 'Social Media Graphics Design and Video Editing in Canva',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-7',
      name: 'Dart & Flutter | The Complete Flutter Development Course',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/Dart & Flutter The Complete Flutter Development Course.jpg',
    },
    {
      id: 'udemy-8',
      name: 'Build A Chat Application With Firebase, Flutter and Provider',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-9',
      name: 'Web3 / Blockchain Project Manager Certification Course',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-10',
      name: 'Mastering C++ Language - C++ Programming For Beginners',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-11',
      name: 'Build 13 Projects with PHP MySQL Bootstrap and PDO',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-12',
      name: 'Strong Problem-Solving',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'udemy-13',
      name: 'JavaScript Fundamentals to Advanced: Full Stack Development',
      issuer: 'Udemy',
      issueDate: new Date('2023-01-01'),
      imageUrl: '/images/Certification/udemy.png',
    },
    {
      id: 'cisco-1',
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco',
      issueDate: new Date('2023-01-01'),
    },
    {
      id: 'fcc-1',
      name: 'Responsive Web Design',
      issuer: 'FreeCodeCamp',
      issueDate: new Date('2023-01-01'),
    }
  ]
};
