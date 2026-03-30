'use client';

import { NavigationProvider, useNavigation } from '@/contexts';
import { Sidebar, ContentArea, ResumeModal, RightSidebar } from '@/components';
import { sectionContent, skillsData, expertiseData, socialLinks } from '@/data/content';
import { resumeData } from '@/data/resume';

function PortfolioContent() {
  const { currentSection, setCurrentSection, isResumeOpen, openResume, closeResume } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto flex gap-6">
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

        {/* Right Sidebar - Only show on home */}
        {currentSection === 'home' && (
          <RightSidebar
            skills={{
              topSkills: skillsData.top,
              bottomSkills: skillsData.bottom
            }}
            expertise={expertiseData}
            socialLinks={socialLinks}
          />
        )}
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
