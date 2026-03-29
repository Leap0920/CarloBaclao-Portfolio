'use client';

import { NavigationProvider, useNavigation } from '@/contexts';
import { Sidebar, ContentArea, ResumeModal } from '@/components';
import { sectionContent } from '@/data/content';
import { resumeData } from '@/data/resume';

function PortfolioContent() {
  const { currentSection, setCurrentSection, isResumeOpen, openResume, closeResume } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onResumeOpen={openResume}
        />

        {/* Main Content Area */}
        <ContentArea
          section={currentSection}
          content={sectionContent[currentSection]}
        />
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={closeResume}
        resumeContent={resumeData}
      />
    </div>
  );
}

export default function Home() {
  return (
    <NavigationProvider>
      <PortfolioContent />
    </NavigationProvider>
  );
}
