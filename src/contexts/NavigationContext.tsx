'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NavigationSection, NavigationContextType, CertificationItem } from '@/types';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('home');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationItem | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const handleSectionChange = useCallback((section: NavigationSection) => {
    setCurrentSection(section);
  }, []);

  const openResume = useCallback(() => {
    setIsResumeOpen(true);
  }, []);

  const closeResume = useCallback(() => {
    setIsResumeOpen(false);
  }, []);

  const openCertModal = useCallback((cert: CertificationItem) => {
    setSelectedCertification(cert);
    setIsCertModalOpen(true);
  }, []);

  const closeCertModal = useCallback(() => {
    setIsCertModalOpen(false);
    setSelectedCertification(null);
  }, []);

  const value: NavigationContextType = {
    currentSection,
    setCurrentSection: handleSectionChange,
    isResumeOpen,
    openResume,
    closeResume,
    selectedCertification,
    isCertModalOpen,
    openCertModal,
    closeCertModal,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}