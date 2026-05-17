'use client';

import { motion } from 'framer-motion';
import { SidebarProps } from '@/types/components';
import { UserProfile } from './UserProfile';
import { NavigationMenu } from './NavigationMenu';
import { DarkModeToggle } from './DarkModeToggle';

export function Sidebar({ currentSection, onSectionChange, onResumeOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex flex-col h-full border border-gray-100 dark:border-slate-700"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* User Profile Section */}
      <UserProfile
        name="Carlo C. Baclao"
        title="Software Engineer"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="p-4 border-t border-gray-100 dark:border-slate-700"
      >
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
          Designed & Built by Carlo C. Baclao<br />
          &copy; 2025, All rights reserved.
        </p>
      </motion.div>
    </motion.aside>
  );
}
