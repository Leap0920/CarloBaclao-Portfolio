'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { NavigationProvider, useNavigation } from '@/contexts';
import { Sidebar, ContentArea, ResumeModal, RightSidebar, CertificationModal } from '@/components';
import { getSectionContent } from '@/data/content';
import { resumeData } from '@/data/resume';
import { NavigationSection } from '@/types';

function PortfolioContent() {
  const {
    currentSection, setCurrentSection,
    isResumeOpen, openResume, closeResume,
    selectedCertification, isCertModalOpen, openCertModal, closeCertModal,
  } = useNavigation();

  const sectionContent = getSectionContent(openCertModal);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-screen bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
    >
      <div className="flex-1 flex gap-4 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden md:block shrink-0"
        >
          <Sidebar
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            onResumeOpen={openResume}
          />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 overflow-hidden"
            >
              <ContentArea
                section={currentSection as NavigationSection}
                content={sectionContent[currentSection as NavigationSection]?.content || <div>Under Construction</div>}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:block shrink-0"
        >
          <RightSidebar />
        </motion.div>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={closeResume}
            resumeContent={resumeData}
          />
        )}
      </AnimatePresence>

      {/* Certification Modal */}
      <AnimatePresence>
        {isCertModalOpen && selectedCertification && (
          <CertificationModal
            isOpen={isCertModalOpen}
            onClose={closeCertModal}
            certification={selectedCertification}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  return (
    <NavigationProvider>
      <PortfolioContent />
    </NavigationProvider>
  );
}
