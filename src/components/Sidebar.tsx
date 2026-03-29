'use client';

import { SidebarProps } from '@/types/components';
import { UserProfile } from './UserProfile';
import { NavigationMenu } from './NavigationMenu';
import { DarkModeToggle } from './DarkModeToggle';

export function Sidebar({ currentSection, onSectionChange, onResumeOpen }: SidebarProps) {
  return (
    <aside 
      className="w-80 bg-white rounded-2xl shadow-sm flex flex-col h-fit"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* User Profile Section */}
      <UserProfile
        name="Carlo Baclao"
        title="Full Stack Developer"
        photoUrl="/images/profile.jpg"
        onResumeClick={onResumeOpen}
      />

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <NavigationMenu
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        />
        
        {/* Dark Mode Toggle */}
        <div className="px-4 mt-4">
          <DarkModeToggle />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Designed & Built by Carlo Baclao<br />
          © 2025, All rights reserved.
        </p>
      </div>
    </aside>
  );
}