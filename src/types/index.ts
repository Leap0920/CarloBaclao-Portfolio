// Core type definitions for Carlo Baclao Portfolio Website

export type NavigationSection = 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'github' | 'contact';

export interface NavigationContextType {
  currentSection: NavigationSection;
  setCurrentSection: (section: NavigationSection) => void;
  isResumeOpen: boolean;
  openResume: () => void;
  closeResume: () => void;
  selectedCertification: CertificationItem | null;
  isCertModalOpen: boolean;
  openCertModal: (cert: CertificationItem) => void;
  closeCertModal: () => void;
}

export interface NavigationState {
  currentSection: NavigationSection;
  isResumeOpen: boolean;
}

export interface SectionContent {
  title: string;
  content: React.ReactNode;
  metadata?: {
    lastUpdated: Date;
    tags: string[];
  };
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  featured: boolean;
}

export interface AchievementData {
  id: string;
  title: string;
  organization: string;
  date: Date;
  description: string;
  type: 'award' | 'certification' | 'recognition';
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  honors?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
}