'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavigationProvider, useNavigation, ThemeProvider, TerminalProvider, useTerminal } from '@/contexts';
import { Sidebar, ContentArea, ResumeModal, RightSidebar, CertificationModal, TerminalButton, TerminalModal, TypingModal, TicTacToeModal, SnakeModal } from '@/components';
import { CursorGlow } from '@/components/CursorGlow';
import { SwipeHint } from '@/components/SwipeHint';
import { getSectionContent } from '@/data/content';
import { resumeData } from '@/data/resume';
import { NavigationSection } from '@/types';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
  loading: () => null,
});

function PortfolioContent() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { openTerminal } = useTerminal();
  const {
    currentSection, setCurrentSection,
    isResumeOpen, openResume, closeResume,
    selectedCertification, isCertModalOpen, openCertModal, closeCertModal,
  } = useNavigation();

  const sectionContent = getSectionContent(openCertModal, openResume, setCurrentSection);

  const handleNavChange = useCallback((section: NavigationSection) => {
    setCurrentSection(section);
    setLeftOpen(false);
  }, [setCurrentSection]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openTerminal();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openTerminal]);


  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const startX = touchStart.current.x;
    const screenWidth = window.innerWidth;
    touchStart.current = null;

    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;

    if (dx > 0 && startX < 30) {
      setRightOpen(false);
      setLeftOpen(true);
    } else if (dx < 0 && startX > screenWidth - 30) {
      setLeftOpen(false);
      setRightOpen(true);
    } else if (dx < 0 && leftOpen) {
      setLeftOpen(false);
    } else if (dx > 0 && rightOpen) {
      setRightOpen(false);
    }
  }, [leftOpen, rightOpen]);

  return (
    <>
      <SwipeHint />
      <ParticleBackground />
      <CursorGlow />
      <div className="grain-overlay" />

      {/* Edge Dot Grid Pattern */}
      <div className="edge-dot-grid" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen p-3 sm:p-4 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 flex gap-4 overflow-hidden max-w-7xl mx-auto w-full">
          {/* Left Sidebar - Desktop: static, Mobile: swipe-in drawer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden md:block shrink-0"
          >
            <Sidebar
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
              onResumeOpen={openResume}
            />
          </motion.div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {leftOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setLeftOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="md:hidden fixed inset-y-0 left-0 w-72 z-50 p-3"
                >
                  <Sidebar
                    currentSection={currentSection}
                    onSectionChange={handleNavChange}
                    onResumeOpen={() => { openResume(); setLeftOpen(false); }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 overflow-hidden flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/90 dark:border-slate-700/80 relative p-4 sm:p-6 transition-colors duration-300"
          >
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
          </motion.div>

          {/* Right Sidebar - Desktop: static, Mobile: swipe-in drawer */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block shrink-0"
          >
            <RightSidebar />
          </motion.div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {rightOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setRightOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="lg:hidden fixed inset-y-0 right-0 w-72 z-50 p-3 overflow-y-auto"
                >
                  <RightSidebar />
                </motion.div>
              </>
            )}
          </AnimatePresence>
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

        {/* Terminal & Game Modals */}
        <TerminalButton />
        <TerminalModal />
        <TypingModal />
        <TicTacToeModal />
        <SnakeModal />
      </motion.div>
    </>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <TerminalProvider>
          <PortfolioContent />
        </TerminalProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}
