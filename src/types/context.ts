// Context type definitions for state management

import { NavigationSection, SectionContent, ProjectData, AchievementData, ResumeData, CertificationItem } from './index';

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

export interface ContentContextType {
  getContent: (section: NavigationSection) => SectionContent;
  getProjects: () => ProjectData[];
  getAchievements: () => AchievementData[];
  getResume: () => ResumeData;
}

export interface AppState {
  navigation: {
    currentSection: NavigationSection;
    isResumeOpen: boolean;
  };
  ui: {
    isMobileMenuOpen: boolean;
    isLoading: boolean;
    theme: 'light' | 'dark';
  };
  content: {
    sections: Record<NavigationSection, SectionContent>;
    projects: ProjectData[];
    achievements: AchievementData[];
    resume: ResumeData;
  };
}